// Copyright 2023 The LUCI Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package bugs

import (
	"time"

	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/timestamppb"

	"go.chromium.org/luci/analysis/internal/analysis/metrics"
	bugspb "go.chromium.org/luci/analysis/internal/bugs/proto"
	configpb "go.chromium.org/luci/analysis/proto/config"
)

// ActivationThresholds returns the set of thresholds that result
// in a policy activating. The returned thresholds should be treated as
// an 'OR', i.e. any of the given metric thresholds can result in a policy
// activating.
func ActivationThresholds(policy *configpb.BugManagementPolicy) []*configpb.ImpactMetricThreshold {
	var results []*configpb.ImpactMetricThreshold
	for _, metric := range policy.Metrics {
		results = append(results, &configpb.ImpactMetricThreshold{
			MetricId:  metric.MetricId,
			Threshold: metric.ActivationThreshold,
		})
	}
	return results
}

// UpdatePolicyActivations updates the active policies for a failure
// association rule, given its current state, configured policies
// and cluster metrics.
//
// If no reliable cluster metrics are available, nil should be passed
// as clusterMetrics and only pruning of old policies/creation of new
// state entries for new policies will occur.
//
// If any updates need to be made, changed will be true and a new
// *bugspb.BugManagementState is returned. Otherwise, the original
// state is returned.
func UpdatePolicyActivations(state *bugspb.BugManagementState, policies []*configpb.BugManagementPolicy, clusterMetrics ClusterMetrics, now time.Time) (updatedState *bugspb.BugManagementState, changed bool) {
	// Proto3 serializes nil and empty maps to exactly the same bytes.
	// For the implementation here, we prefer to deal with the empty
	// maps, so we coerce them, but it does not represent a semantic
	// change to the proto.
	policyState := state.PolicyState
	if policyState == nil {
		policyState = make(map[string]*bugspb.BugManagementState_PolicyState)
	}

	newPolicyState := make(map[string]*bugspb.BugManagementState_PolicyState)

	changed = false
	for _, policy := range policies {
		state, ok := policyState[string(policy.Id)]
		if !ok {
			// Create a policy state entry for the new policy.
			state = &bugspb.BugManagementState_PolicyState{}
			changed = true
		}
		// Only update policy activation if cluster metrics are reliable.
		// During re-clustering, this may not be the case and clusterMetrics will be nil.
		if clusterMetrics != nil {
			evaluation := evaluatePolicy(policy, clusterMetrics)
			if !state.IsActive && evaluation == policyEvaluationActivate {
				// Transition the policy to active.
				// Make updates to a copied proto so that the side-effects
				// do not propogate to the passed proto.
				state = proto.Clone(state).(*bugspb.BugManagementState_PolicyState)
				state.IsActive = true
				state.LastActivationTime = timestamppb.New(now)
				changed = true
			}
			if state.IsActive && evaluation == policyEvaluationDeactivate {
				// Transition the policy to inactive.
				// Make updates to a copied proto so that the side-effects
				// do not propogate to the passed proto.
				state = proto.Clone(state).(*bugspb.BugManagementState_PolicyState)
				state.IsActive = false
				state.LastDeactivationTime = timestamppb.New(now)
				changed = true
			}
		}
		newPolicyState[string(policy.Id)] = state
	}
	for policyID := range policyState {
		if _, ok := newPolicyState[policyID]; !ok {
			// We are removing a policy which is no longer configured.
			changed = true
		}
	}

	if changed {
		return &bugspb.BugManagementState{
			RuleAssociationNotified: state.RuleAssociationNotified,
			PolicyState:             newPolicyState,
		}, true
	}
	return state, false
}

// ActivePoliciesPendingNotification returns the set of policies which
// are active but for which activation has not been notified to the bug.
func ActivePoliciesPendingNotification(state *bugspb.BugManagementState) map[PolicyID]struct{} {
	policyIDsToNotify := make(map[PolicyID]struct{})
	for policyID, policyState := range state.PolicyState {
		if policyState.IsActive && !policyState.ActivationNotified {
			policyIDsToNotify[PolicyID(policyID)] = struct{}{}
		}
	}
	return policyIDsToNotify
}

type policyEvaluation int

const (
	// Neither the activation or deactivation criteria was met. The policy
	// activation should remain unchanged.
	policyEvaluationUnchanged policyEvaluation = iota
	// The policy deactivation criteria was met.
	policyEvaluationDeactivate
	// The policy activation criteria was met.
	policyEvaluationActivate
)

// evaluatePolicy determines whether the policy activation criteria, deactivation criteria or
// neither are met. To use this method, clusterMetrics must be non-nil.
func evaluatePolicy(policy *configpb.BugManagementPolicy, clusterMetrics ClusterMetrics) policyEvaluation {
	isDeactivationCriteriaMet := true
	for _, metric := range policy.Metrics {
		if clusterMetrics.MeetsThreshold(metrics.ID(metric.MetricId), metric.ActivationThreshold) {
			// The activation criteria is met on one of the metrics.
			// The policy should activate.
			return policyEvaluationActivate
		}
		if clusterMetrics.MeetsThreshold(metrics.ID(metric.MetricId), metric.DeactivationThreshold) {
			// If the deactivation threshold is met on any metric,
			// deactivation is inhibited. Deactivation only occurs
			// once all thresholds are unmet.
			isDeactivationCriteriaMet = false
		}
	}
	if isDeactivationCriteriaMet {
		return policyEvaluationDeactivate
	} else {
		// Apply hysteresis: keep active policies active, and inactive policies inactive.
		return policyEvaluationUnchanged
	}
}

// ActivePolicies returns the set of policy IDs active in the given
// bug management state.
func ActivePolicies(state *bugspb.BugManagementState) map[PolicyID]struct{} {
	result := make(map[PolicyID]struct{})
	for policyID, policyState := range state.PolicyState {
		if !policyState.IsActive {
			continue
		}
		result[PolicyID(policyID)] = struct{}{}
	}
	return result
}

func previouslyActivePolicies(state *bugspb.BugManagementState) map[PolicyID]struct{} {
	currentActive := ActivePolicies(state)
	changes := lastPolicyActivationChanges(state)

	result := make(map[PolicyID]struct{})
	for policy := range currentActive {
		result[policy] = struct{}{}
	}
	// De-activate the policies which are activated.
	for activatedPolicyID := range changes.activatedPolicyIDs {
		delete(result, activatedPolicyID)
	}
	// Re-activate the policies which were de-activated.
	for deactivatedPolicyID := range changes.deactivatedPolicyIDs {
		result[deactivatedPolicyID] = struct{}{}
	}
	return result
}

type activationChanges struct {
	activatedPolicyIDs   map[PolicyID]struct{}
	deactivatedPolicyIDs map[PolicyID]struct{}
}

func lastPolicyActivationChanges(state *bugspb.BugManagementState) activationChanges {
	var lastChangeTime time.Time
	var lastActivations map[PolicyID]struct{}
	var lastDeactivations map[PolicyID]struct{}

	for policyID, policyState := range state.PolicyState {
		if policyState.LastActivationTime != nil {
			time := policyState.LastActivationTime.AsTime()
			if time.After(lastChangeTime) {
				lastChangeTime = time
				lastActivations = make(map[PolicyID]struct{})
				lastDeactivations = make(map[PolicyID]struct{})
				lastActivations[PolicyID(policyID)] = struct{}{}
			} else if time.Equal(lastChangeTime) {
				lastActivations[PolicyID(policyID)] = struct{}{}
			}
		}
		if policyState.LastDeactivationTime != nil {
			time := policyState.LastDeactivationTime.AsTime()
			if time.After(lastChangeTime) {
				lastChangeTime = time
				lastActivations = make(map[PolicyID]struct{})
				lastDeactivations = make(map[PolicyID]struct{})
				lastDeactivations[PolicyID(policyID)] = struct{}{}
			} else if time.Equal(lastChangeTime) {
				lastDeactivations[PolicyID(policyID)] = struct{}{}
			}
		}
	}
	return activationChanges{
		activatedPolicyIDs:   lastActivations,
		deactivatedPolicyIDs: lastDeactivations,
	}
}
