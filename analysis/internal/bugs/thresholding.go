// Copyright 2022 The LUCI Authors.
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
	"go.chromium.org/luci/analysis/internal/analysis/metrics"
	configpb "go.chromium.org/luci/analysis/proto/config"
)

// InflateThreshold inflates or deflates impact thresholds by the given factor.
// This method is provided to help implement hysteresis. inflationPercent can
// be positive or negative (or zero), and is interpreted as follows:
// - If inflationPercent is positive, the new threshold is (threshold * (1 + (inflationPercent/100)))
// - If inflationPercent is negative, the new threshold used is (threshold / (1 + (-inflationPercent/100))
// i.e. inflationPercent of +100 would result in a threshold that is 200% the
// original threshold being used, inflationPercent of -100 would result in a
// threshold that is 50% of the original.
// To avoid unintended effects such as 1 being inflated down to 0, inflation
// can never make a zero number non-zero or a non-zero number zero.
func InflateThreshold(t []*configpb.ImpactMetricThreshold, inflationPercent int64) []*configpb.ImpactMetricThreshold {
	inflated := make([]*configpb.ImpactMetricThreshold, 0, len(t))
	for _, m := range t {
		inflated = append(inflated, &configpb.ImpactMetricThreshold{
			MetricId:  m.MetricId,
			Threshold: inflateMetricThreshold(m.Threshold, inflationPercent),
		})
	}
	return inflated
}

func inflateMetricThreshold(t *configpb.MetricThreshold, inflationPercent int64) *configpb.MetricThreshold {
	if t == nil {
		// No thresholds specified for metric.
		return nil
	}
	return &configpb.MetricThreshold{
		OneDay:   inflateSingleThreshold(t.OneDay, inflationPercent),
		ThreeDay: inflateSingleThreshold(t.ThreeDay, inflationPercent),
		SevenDay: inflateSingleThreshold(t.SevenDay, inflationPercent),
	}
}

func inflateSingleThreshold(threshold *int64, inflationPercent int64) *int64 {
	if threshold == nil {
		// No threshold was specified.
		return nil
	}
	thresholdValue := *threshold
	if thresholdValue == 0 {
		// Explicitly never change a zero value.
		return &thresholdValue
	}
	if inflationPercent >= 0 {
		// I.E. +100% doubles the threshold.
		thresholdValue = (thresholdValue * (100 + inflationPercent)) / 100
	} else {
		// I.E. -100% halves the threshold.
		thresholdValue = (thresholdValue * 100) / (100 + -inflationPercent)
	}
	// If the result is zero, set it to 1 instead to avoid things like
	// bug closing thresholds being rounded down to zero failures, and thus
	// bugs never being closed.
	if thresholdValue == 0 {
		thresholdValue = 1
	}
	return &thresholdValue
}

// MeetsAnyOfThresholds returns whether the cluster metrics meet or exceed
// any of the specified thresholds.
func (c *ClusterMetrics) MeetsAnyOfThresholds(ts []*configpb.ImpactMetricThreshold) bool {
	for _, t := range ts {
		if c.MeetsThreshold(metrics.ID(t.MetricId), t.Threshold) {
			return true
		}
	}
	return false
}

// MeetsThreshold returns whether the cluster metrics meet or exceed
// the specified threshold.
func (c *ClusterMetrics) MeetsThreshold(metricID metrics.ID, t *configpb.MetricThreshold) bool {
	impact, ok := (*c)[metricID]
	if ok && impact.meetsThreshold(t) {
		return true
	}
	return false
}

func (m MetricValues) meetsThreshold(t *configpb.MetricThreshold) bool {
	if t == nil {
		t = &configpb.MetricThreshold{}
	}
	if meetsThreshold(m.OneDay, t.OneDay) {
		return true
	}
	if meetsThreshold(m.ThreeDay, t.ThreeDay) {
		return true
	}
	if meetsThreshold(m.SevenDay, t.SevenDay) {
		return true
	}
	return false
}

// meetsThreshold tests whether value exceeds the given threshold.
// If threshold is nil, the threshold is considered "not set"
// and the method always returns false.
func meetsThreshold(value int64, threshold *int64) bool {
	if threshold == nil {
		return false
	}
	thresholdValue := *threshold
	return value >= thresholdValue
}
