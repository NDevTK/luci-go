// Copyright 2015 The LUCI Authors.
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

// Package storetest is imported exclusively by tests for Store implementations.
package storetest

import (
	"context"
	"fmt"
	"sort"
	"sync"
	"testing"
	"time"

	pb "go.chromium.org/luci/common/tsmon/ts_mon_proto"

	"go.chromium.org/luci/common/clock/testclock"
	"go.chromium.org/luci/common/tsmon/distribution"
	"go.chromium.org/luci/common/tsmon/field"
	"go.chromium.org/luci/common/tsmon/monitor"
	"go.chromium.org/luci/common/tsmon/target"
	"go.chromium.org/luci/common/tsmon/types"
	"google.golang.org/protobuf/proto"

	. "github.com/smartystreets/goconvey/convey"
	. "go.chromium.org/luci/common/testing/assertions"
)

// Store is a store under test.
//
// It is a copy of store.Store interface to break module dependency cycle.
type Store interface {
	DefaultTarget() types.Target
	SetDefaultTarget(t types.Target)

	Get(ctx context.Context, m types.Metric, resetTime time.Time, fieldVals []any) any
	Set(ctx context.Context, m types.Metric, resetTime time.Time, fieldVals []any, value any)
	Del(ctx context.Context, m types.Metric, fieldVals []any)
	Incr(ctx context.Context, m types.Metric, resetTime time.Time, fieldVals []any, delta any)

	GetAll(ctx context.Context) []types.Cell

	Reset(ctx context.Context, m types.Metric)
}

// TestOptions contains options for RunStoreImplementationTests.
type TestOptions struct {
	// Factory creates and returns a new Store implementation.
	Factory func() Store

	// RegistrationFinished is called after all metrics have been registered.
	// Store implementations that need to do expensive initialization (that would
	// otherwise be done in iface.go) can do that here.
	RegistrationFinished func(Store)

	// GetNumRegisteredMetrics returns the number of metrics registered in the
	// store.
	GetNumRegisteredMetrics func(Store) int
}

// RunStoreImplementationTests runs all the standard tests that all store
// implementations are expected to pass.  When you write a new Store
// implementation you should ensure you run these tests against it.
func RunStoreImplementationTests(t *testing.T, ctx context.Context, opts TestOptions) {

	distOne := distribution.New(distribution.DefaultBucketer)
	distOne.Add(4.2)

	distTwo := distribution.New(distribution.DefaultBucketer)
	distTwo.Add(5.6)
	distTwo.Add(1.0)

	tests := []struct {
		typ      types.ValueType
		bucketer *distribution.Bucketer

		values           []any
		wantSetValidator func(any, any)

		deltas            []any
		wantIncrPanic     bool
		wantIncrValue     any
		wantIncrValidator func(any)

		wantStartTimestamp bool
	}{
		{
			typ:                types.CumulativeIntType,
			values:             makeInterfaceSlice(int64(3), int64(4)),
			deltas:             makeInterfaceSlice(int64(3), int64(4)),
			wantIncrValue:      int64(7),
			wantStartTimestamp: true,
		},
		{
			typ:                types.CumulativeFloatType,
			values:             makeInterfaceSlice(float64(3.2), float64(4.3)),
			deltas:             makeInterfaceSlice(float64(3.2), float64(4.3)),
			wantIncrValue:      float64(7.5),
			wantStartTimestamp: true,
		},
		{
			typ:      types.CumulativeDistributionType,
			bucketer: distribution.DefaultBucketer,
			values:   makeInterfaceSlice(distOne, distTwo),
			deltas:   makeInterfaceSlice(float64(3.2), float64(5.3)),
			wantIncrValidator: func(v any) {
				d := v.(*distribution.Distribution)
				So(d.Buckets(), ShouldResemble, []int64{0, 0, 0, 1, 1})
			},
			wantStartTimestamp: true,
		},
		{
			typ:           types.NonCumulativeIntType,
			values:        makeInterfaceSlice(int64(3), int64(4)),
			deltas:        makeInterfaceSlice(int64(3), int64(4)),
			wantIncrPanic: true,
		},
		{
			typ:           types.NonCumulativeFloatType,
			values:        makeInterfaceSlice(float64(3.2), float64(4.3)),
			deltas:        makeInterfaceSlice(float64(3.2), float64(4.3)),
			wantIncrPanic: true,
		},
		{
			typ:           types.NonCumulativeDistributionType,
			bucketer:      distribution.DefaultBucketer,
			values:        makeInterfaceSlice(distOne, distTwo),
			deltas:        makeInterfaceSlice(float64(3.2), float64(5.3)),
			wantIncrPanic: true,
			wantSetValidator: func(got, want any) {
				// The distribution might be serialized/deserialized and lose sums and
				// counts.
				So(got.(*distribution.Distribution).Buckets(), ShouldResemble,
					want.(*distribution.Distribution).Buckets())
			},
		},
		{
			typ:           types.StringType,
			values:        makeInterfaceSlice("hello", "world"),
			deltas:        makeInterfaceSlice("hello", "world"),
			wantIncrPanic: true,
		},
		{
			typ:           types.BoolType,
			values:        makeInterfaceSlice(true, false),
			deltas:        makeInterfaceSlice(true, false),
			wantIncrPanic: true,
		},
	}

	Convey("Set and get", t, func() {
		Convey("With no fields", func() {
			for i, test := range tests {
				Convey(fmt.Sprintf("%d. %s", i, test.typ), func() {
					var m types.Metric
					if test.bucketer != nil {
						m = &fakeDistributionMetric{FakeMetric{
							types.MetricInfo{"m", "", []field.Field{}, test.typ, target.NilType},
							types.MetricMetadata{}}, test.bucketer}
					} else {
						m = &FakeMetric{
							types.MetricInfo{"m", "", []field.Field{}, test.typ, target.NilType},
							types.MetricMetadata{},
						}
					}

					s := opts.Factory()

					// Value should be nil initially.
					v := s.Get(ctx, m, time.Time{}, []any{})
					So(v, ShouldBeNil)

					// Set and get the value.
					s.Set(ctx, m, time.Time{}, []any{}, test.values[0])
					v = s.Get(ctx, m, time.Time{}, []any{})
					if test.wantSetValidator != nil {
						test.wantSetValidator(v, test.values[0])
					} else {
						So(v, ShouldEqual, test.values[0])
					}
				})
			}
		})

		Convey("With fields", func() {
			for i, test := range tests {
				Convey(fmt.Sprintf("%d. %s", i, test.typ), func() {
					var m types.Metric
					if test.bucketer != nil {
						m = &fakeDistributionMetric{FakeMetric{
							types.MetricInfo{"m", "", []field.Field{field.String("f")}, test.typ, target.NilType},
							types.MetricMetadata{}}, test.bucketer}
					} else {
						m = &FakeMetric{
							types.MetricInfo{"m", "", []field.Field{field.String("f")}, test.typ, target.NilType},
							types.MetricMetadata{}}
					}

					s := opts.Factory()

					// Values should be nil initially.
					v := s.Get(ctx, m, time.Time{}, makeInterfaceSlice("one"))
					So(v, ShouldBeNil)
					v = s.Get(ctx, m, time.Time{}, makeInterfaceSlice("two"))
					So(v, ShouldBeNil)

					// Set and get the values.
					s.Set(ctx, m, time.Time{}, makeInterfaceSlice("one"), test.values[0])
					s.Set(ctx, m, time.Time{}, makeInterfaceSlice("two"), test.values[1])

					v = s.Get(ctx, m, time.Time{}, makeInterfaceSlice("one"))
					if test.wantSetValidator != nil {
						test.wantSetValidator(v, test.values[0])
					} else {
						So(v, ShouldEqual, test.values[0])
					}

					v = s.Get(ctx, m, time.Time{}, makeInterfaceSlice("two"))
					if test.wantSetValidator != nil {
						test.wantSetValidator(v, test.values[1])
					} else {
						So(v, ShouldEqual, test.values[1])
					}
				})
			}
		})

		Convey("With a fixed reset time", func() {
			for i, test := range tests {
				Convey(fmt.Sprintf("%d. %s", i, test.typ), func() {
					var m types.Metric
					if test.bucketer != nil {
						m = &fakeDistributionMetric{FakeMetric{
							types.MetricInfo{"m", "", []field.Field{}, test.typ, target.NilType},
							types.MetricMetadata{}}, test.bucketer}
					} else {
						m = &FakeMetric{
							types.MetricInfo{"m", "", []field.Field{}, test.typ, target.NilType},
							types.MetricMetadata{}}
					}

					s := opts.Factory()
					opts.RegistrationFinished(s)

					// Do the set with a fixed time.
					t := time.Date(1972, 5, 6, 7, 8, 9, 0, time.UTC)
					s.Set(ctx, m, t, []any{}, test.values[0])

					v := s.Get(ctx, m, time.Time{}, []any{})
					if test.wantSetValidator != nil {
						test.wantSetValidator(v, test.values[0])
					} else {
						So(v, ShouldEqual, test.values[0])
					}

					// Check the time in the Cell is the same.
					all := s.GetAll(ctx)
					So(len(all), ShouldEqual, 1)

					msg := monitor.SerializeValue(all[0], testclock.TestRecentTimeUTC)
					ts := msg.GetStartTimestamp()
					if test.wantStartTimestamp {
						So(time.Unix(ts.GetSeconds(), int64(ts.GetNanos())).UTC().String(), ShouldEqual, t.String())
					} else {
						So(time.Unix(ts.GetSeconds(), int64(ts.GetNanos())).UTC().String(), ShouldEqual, testclock.TestRecentTimeUTC.String())
					}
				})
			}
		})

		Convey("With a target set in the context", func() {
			for i, test := range tests {
				Convey(fmt.Sprintf("%d. %s", i, test.typ), func() {
					var m types.Metric
					if test.bucketer != nil {
						m = &fakeDistributionMetric{FakeMetric{
							types.MetricInfo{"m", "", []field.Field{}, test.typ, target.NilType},
							types.MetricMetadata{}}, test.bucketer}
					} else {
						m = &FakeMetric{
							types.MetricInfo{"m", "", []field.Field{}, test.typ, target.NilType},
							types.MetricMetadata{}}
					}

					s := opts.Factory()
					opts.RegistrationFinished(s)

					// Create a context with a different target.
					foo := target.Task{ServiceName: "foo"}
					ctxWithTarget := target.Set(ctx, &foo)

					// Set the first value on the default target, second value on the
					// different target.
					s.Set(ctx, m, time.Time{}, []any{}, test.values[0])
					s.Set(ctxWithTarget, m, time.Time{}, []any{}, test.values[1])

					// Get should return different values for different contexts.
					v := s.Get(ctx, m, time.Time{}, []any{})
					if test.wantSetValidator != nil {
						test.wantSetValidator(v, test.values[0])
					} else {
						So(v, ShouldEqual, test.values[0])
					}

					v = s.Get(ctxWithTarget, m, time.Time{}, []any{})
					if test.wantSetValidator != nil {
						test.wantSetValidator(v, test.values[1])
					} else {
						So(v, ShouldEqual, test.values[1])
					}

					// The targets should be set in the Cells.
					all := s.GetAll(ctx)
					So(len(all), ShouldEqual, 2)

					coll := monitor.SerializeCells(all, testclock.TestRecentTimeUTC)

					s0 := coll[0].RootLabels[3]
					s1 := coll[1].RootLabels[3]

					serviceName := &pb.MetricsCollection_RootLabels{
						Key: proto.String("service_name"),
						Value: &pb.MetricsCollection_RootLabels_StringValue{
							StringValue: foo.ServiceName,
						},
					}
					defaultServiceName := &pb.MetricsCollection_RootLabels{
						Key: proto.String("service_name"),
						Value: &pb.MetricsCollection_RootLabels_StringValue{
							StringValue: s.DefaultTarget().(*target.Task).ServiceName,
						},
					}

					if proto.Equal(s0, serviceName) {
						So(s1, ShouldResembleProto, defaultServiceName)
					} else if proto.Equal(s1, serviceName) {
						So(s0, ShouldResembleProto, defaultServiceName)
					} else {
						t.Fail()
					}
				})
			}
		})

		Convey("With a decreasing value", func() {
			for i, test := range tests {
				if !test.typ.IsCumulative() || test.bucketer != nil {
					continue
				}
				Convey(fmt.Sprintf("%d. %s", i, test.typ), func() {
					m := &FakeMetric{
						types.MetricInfo{"m", "", []field.Field{}, test.typ, target.NilType},
						types.MetricMetadata{}}
					s := opts.Factory()

					// Set the bigger value.
					s.Set(ctx, m, time.Time{}, []any{}, test.values[1])
					So(s.Get(ctx, m, time.Time{}, []any{}), ShouldResemble, test.values[1])

					// Setting the smaller value should be ignored.
					s.Set(ctx, m, time.Time{}, []any{}, test.values[0])
					So(s.Get(ctx, m, time.Time{}, []any{}), ShouldResemble, test.values[1])
				})
			}
		})
	})

	Convey("Increment and get", t, func() {
		Convey("With no fields", func() {
			for i, test := range tests {
				Convey(fmt.Sprintf("%d. %s", i, test.typ), func() {
					var m types.Metric
					if test.bucketer != nil {
						m = &fakeDistributionMetric{FakeMetric{
							types.MetricInfo{"m", "", []field.Field{}, test.typ, target.NilType},
							types.MetricMetadata{}}, test.bucketer}

					} else {
						m = &FakeMetric{
							types.MetricInfo{"m", "", []field.Field{}, test.typ, target.NilType},
							types.MetricMetadata{}}
					}

					s := opts.Factory()

					// Value should be nil initially.
					v := s.Get(ctx, m, time.Time{}, []any{})
					So(v, ShouldBeNil)

					// Increment the metric.
					for _, delta := range test.deltas {
						call := func() { s.Incr(ctx, m, time.Time{}, []any{}, delta) }
						if test.wantIncrPanic {
							So(call, ShouldPanic)
						} else {
							call()
						}
					}

					// Get the final value.
					v = s.Get(ctx, m, time.Time{}, []any{})
					if test.wantIncrValue != nil {
						So(v, ShouldEqual, test.wantIncrValue)
					} else if test.wantIncrValidator != nil {
						test.wantIncrValidator(v)
					}
				})
			}
		})

		Convey("With fields", func() {
			for i, test := range tests {
				Convey(fmt.Sprintf("%d. %s", i, test.typ), func() {
					var m types.Metric
					if test.bucketer != nil {
						m = &fakeDistributionMetric{FakeMetric{
							types.MetricInfo{"m", "", []field.Field{field.String("f")}, test.typ, target.NilType},
							types.MetricMetadata{}}, test.bucketer}
					} else {
						m = &FakeMetric{
							types.MetricInfo{"m", "", []field.Field{field.String("f")}, test.typ, target.NilType},
							types.MetricMetadata{}}
					}

					s := opts.Factory()

					// Values should be nil initially.
					v := s.Get(ctx, m, time.Time{}, makeInterfaceSlice("one"))
					So(v, ShouldBeNil)
					v = s.Get(ctx, m, time.Time{}, makeInterfaceSlice("two"))
					So(v, ShouldBeNil)

					// Increment one cell.
					for _, delta := range test.deltas {
						call := func() { s.Incr(ctx, m, time.Time{}, makeInterfaceSlice("one"), delta) }
						if test.wantIncrPanic {
							So(call, ShouldPanic)
						} else {
							call()
						}
					}

					// Get the final value.
					v = s.Get(ctx, m, time.Time{}, makeInterfaceSlice("one"))
					if test.wantIncrValue != nil {
						So(v, ShouldEqual, test.wantIncrValue)
					} else if test.wantIncrValidator != nil {
						test.wantIncrValidator(v)
					}

					// Another cell should still be nil.
					v = s.Get(ctx, m, time.Time{}, makeInterfaceSlice("two"))
					So(v, ShouldBeNil)
				})
			}
		})

		Convey("With a fixed reset time", func() {
			for i, test := range tests {
				if test.wantIncrPanic {
					continue
				}

				Convey(fmt.Sprintf("%d. %s", i, test.typ), func() {
					var m types.Metric
					if test.bucketer != nil {
						m = &fakeDistributionMetric{FakeMetric{
							types.MetricInfo{"m", "", []field.Field{}, test.typ, target.NilType},
							types.MetricMetadata{}}, test.bucketer}
					} else {
						m = &FakeMetric{
							types.MetricInfo{"m", "", []field.Field{}, test.typ, target.NilType},
							types.MetricMetadata{}}
					}

					s := opts.Factory()
					opts.RegistrationFinished(s)

					// Do the incr with a fixed time.
					t := time.Date(1972, 5, 6, 7, 8, 9, 0, time.UTC)
					s.Incr(ctx, m, t, []any{}, test.deltas[0])

					// Check the time in the Cell is the same.
					all := s.GetAll(ctx)
					So(len(all), ShouldEqual, 1)

					msg := monitor.SerializeValue(all[0], testclock.TestRecentTimeUTC)
					if test.wantStartTimestamp {
						ts := msg.GetStartTimestamp()
						So(time.Unix(ts.GetSeconds(), int64(ts.GetNanos())).UTC().String(), ShouldEqual, t.String())
					} else {
						So(msg.StartTimestamp, ShouldBeNil)
					}
				})
			}
		})

		Convey("With a target set in the context", func() {
			for i, test := range tests {
				if test.wantIncrPanic {
					continue
				}

				Convey(fmt.Sprintf("%d. %s", i, test.typ), func() {
					var m types.Metric
					if test.bucketer != nil {
						m = &fakeDistributionMetric{
							FakeMetric{types.MetricInfo{"m", "", []field.Field{}, test.typ, target.NilType},
								types.MetricMetadata{}},
							test.bucketer}
					} else {
						m = &FakeMetric{
							types.MetricInfo{"m", "", []field.Field{}, test.typ, target.NilType},
							types.MetricMetadata{}}
					}

					s := opts.Factory()
					opts.RegistrationFinished(s)

					// Create a context with a different target.
					foo := target.Task{ServiceName: "foo"}
					ctxWithTarget := target.Set(ctx, &foo)

					// Incr the first delta on the default target, second delta on the
					// different target.
					s.Incr(ctx, m, time.Time{}, []any{}, test.deltas[0])
					s.Incr(ctxWithTarget, m, time.Time{}, []any{}, test.deltas[1])

					// Get should return different values for different contexts.
					v1 := s.Get(ctx, m, time.Time{}, []any{})
					v2 := s.Get(ctxWithTarget, m, time.Time{}, []any{})
					So(v1, ShouldNotEqual, v2)

					// The targets should be set in the Cells.
					all := s.GetAll(ctx)
					So(len(all), ShouldEqual, 2)

					coll := monitor.SerializeCells(all, testclock.TestRecentTimeUTC)

					s0 := coll[0].RootLabels[3]
					s1 := coll[1].RootLabels[3]

					serviceName := &pb.MetricsCollection_RootLabels{
						Key: proto.String("service_name"),
						Value: &pb.MetricsCollection_RootLabels_StringValue{
							StringValue: foo.ServiceName,
						},
					}
					defaultServiceName := &pb.MetricsCollection_RootLabels{
						Key: proto.String("service_name"),
						Value: &pb.MetricsCollection_RootLabels_StringValue{
							StringValue: s.DefaultTarget().(*target.Task).ServiceName,
						},
					}

					if proto.Equal(s0, serviceName) {
						So(s1, ShouldResembleProto, defaultServiceName)
					} else if proto.Equal(s1, serviceName) {
						So(s0, ShouldResembleProto, defaultServiceName)
					} else {
						t.Fail()
					}
				})
			}
		})
	})

	Convey("GetAll", t, func() {
		ctx, tc := testclock.UseTime(ctx, testclock.TestRecentTimeUTC)

		s := opts.Factory()
		foo := &FakeMetric{
			types.MetricInfo{Name: "foo", Description: "", Fields: []field.Field{},
				ValueType: types.NonCumulativeIntType, TargetType: target.NilType},
			types.MetricMetadata{Units: types.Seconds}}
		bar := &FakeMetric{
			types.MetricInfo{Name: "bar", Description: "", Fields: []field.Field{field.String("f")},
				ValueType: types.StringType, TargetType: target.NilType},
			types.MetricMetadata{Units: types.Bytes}}
		baz := &FakeMetric{
			types.MetricInfo{Name: "baz", Description: "", Fields: []field.Field{field.String("f")},
				ValueType: types.NonCumulativeFloatType, TargetType: target.NilType},
			types.MetricMetadata{}}
		qux := &FakeMetric{
			types.MetricInfo{Name: "qux", Description: "", Fields: []field.Field{field.String("f")},
				ValueType: types.CumulativeDistributionType, TargetType: target.NilType},
			types.MetricMetadata{}}
		opts.RegistrationFinished(s)

		// Add test records. We increment the test clock each time so that the added
		// records sort deterministically using sortableCellSlice.
		for _, m := range []struct {
			metric    types.Metric
			fieldvals []any
			value     any
		}{
			{foo, []any{}, int64(42)},
			{bar, makeInterfaceSlice("one"), "hello"},
			{bar, makeInterfaceSlice("two"), "world"},
			{baz, makeInterfaceSlice("three"), 1.23},
			{baz, makeInterfaceSlice("four"), 4.56},
			{qux, makeInterfaceSlice("five"), distribution.New(nil)},
		} {
			s.Set(ctx, m.metric, time.Time{}, m.fieldvals, m.value)
			tc.Add(time.Second)
		}

		got := s.GetAll(ctx)

		// Store operations made after GetAll should not be visible in the snapshot.
		s.Set(ctx, baz, time.Time{}, makeInterfaceSlice("four"), 3.14)
		s.Incr(ctx, qux, time.Time{}, makeInterfaceSlice("five"), float64(10.0))

		sort.Sort(sortableCellSlice(got))
		want := []types.Cell{
			{
				types.MetricInfo{
					Name:       "foo",
					Fields:     []field.Field{},
					ValueType:  types.NonCumulativeIntType,
					TargetType: target.NilType,
				},
				types.MetricMetadata{Units: types.Seconds},
				types.CellData{
					FieldVals: []any{},
					Value:     int64(42),
				},
			},
			{
				types.MetricInfo{
					Name:       "bar",
					Fields:     []field.Field{field.String("f")},
					ValueType:  types.StringType,
					TargetType: target.NilType,
				},
				types.MetricMetadata{Units: types.Bytes},
				types.CellData{
					FieldVals: makeInterfaceSlice("one"),
					Value:     "hello",
				},
			},
			{
				types.MetricInfo{
					Name:       "bar",
					Fields:     []field.Field{field.String("f")},
					ValueType:  types.StringType,
					TargetType: target.NilType,
				},
				types.MetricMetadata{Units: types.Bytes},
				types.CellData{
					FieldVals: makeInterfaceSlice("two"),
					Value:     "world",
				},
			},
			{
				types.MetricInfo{
					Name:       "baz",
					Fields:     []field.Field{field.String("f")},
					ValueType:  types.NonCumulativeFloatType,
					TargetType: target.NilType,
				},
				types.MetricMetadata{},
				types.CellData{
					FieldVals: makeInterfaceSlice("three"),
					Value:     1.23,
				},
			},
			{
				types.MetricInfo{
					Name:       "baz",
					Fields:     []field.Field{field.String("f")},
					ValueType:  types.NonCumulativeFloatType,
					TargetType: target.NilType,
				},
				types.MetricMetadata{},
				types.CellData{
					FieldVals: makeInterfaceSlice("four"),
					Value:     4.56,
				},
			},
			{
				types.MetricInfo{
					Name:       "qux",
					Fields:     []field.Field{field.String("f")},
					ValueType:  types.CumulativeDistributionType,
					TargetType: target.NilType,
				},
				types.MetricMetadata{},
				types.CellData{
					FieldVals: makeInterfaceSlice("five"),
					Value:     distribution.New(nil),
				},
			},
		}
		So(len(got), ShouldEqual, len(want))

		for i, g := range got {
			w := want[i]

			Convey(fmt.Sprintf("%d", i), func() {
				So(g.Name, ShouldEqual, w.Name)
				So(len(g.Fields), ShouldEqual, len(w.Fields))
				So(g.ValueType, ShouldEqual, w.ValueType)
				So(g.FieldVals, ShouldResemble, w.FieldVals)
				So(g.Value, ShouldResemble, w.Value)
				So(g.Units, ShouldEqual, w.Units)
			})
		}
	})

	Convey("Set and del", t, func() {
		Convey("With no fields", func() {
			for i, test := range tests {
				Convey(fmt.Sprintf("%d. %s", i, test.typ), func() {
					var m types.Metric
					if test.bucketer != nil {
						m = &fakeDistributionMetric{FakeMetric{
							types.MetricInfo{"m", "", []field.Field{}, test.typ, target.NilType},
							types.MetricMetadata{}}, test.bucketer}

					} else {
						m = &FakeMetric{
							types.MetricInfo{"m", "", []field.Field{}, test.typ, target.NilType},
							types.MetricMetadata{}}
					}

					s := opts.Factory()

					// Value should be nil initially.
					So(s.Get(ctx, m, time.Time{}, []any{}), ShouldBeNil)

					// Set and get the value.
					s.Set(ctx, m, time.Time{}, []any{}, test.values[0])
					v := s.Get(ctx, m, time.Time{}, []any{})
					if test.wantSetValidator != nil {
						test.wantSetValidator(v, test.values[0])
					} else {
						So(v, ShouldEqual, test.values[0])
					}

					// Delete the cell. Then, get should return nil.
					s.Del(ctx, m, []any{})
					So(s.Get(ctx, m, time.Time{}, []any{}), ShouldBeNil)
				})
			}
		})

		Convey("With fields", func() {
			for i, test := range tests {
				Convey(fmt.Sprintf("%d. %s", i, test.typ), func() {
					var m types.Metric
					if test.bucketer != nil {
						m = &fakeDistributionMetric{FakeMetric{
							types.MetricInfo{"m", "", []field.Field{field.String("f")}, test.typ, target.NilType},
							types.MetricMetadata{}}, test.bucketer}
					} else {
						m = &FakeMetric{
							types.MetricInfo{"m", "", []field.Field{field.String("f")}, test.typ, target.NilType},
							types.MetricMetadata{}}
					}

					s := opts.Factory()

					// Values should be nil initially.
					So(s.Get(ctx, m, time.Time{}, makeInterfaceSlice("one")), ShouldBeNil)
					So(s.Get(ctx, m, time.Time{}, makeInterfaceSlice("two")), ShouldBeNil)

					// Set both and then delete "one".
					s.Set(ctx, m, time.Time{}, makeInterfaceSlice("one"), test.values[0])
					s.Set(ctx, m, time.Time{}, makeInterfaceSlice("two"), test.values[1])
					s.Del(ctx, m, makeInterfaceSlice("one"))

					// Get should return nil for "one", but the value for "two".
					So(s.Get(ctx, m, time.Time{}, makeInterfaceSlice("one")), ShouldBeNil)
					v := s.Get(ctx, m, time.Time{}, makeInterfaceSlice("two"))
					if test.wantSetValidator != nil {
						test.wantSetValidator(v, test.values[1])
					} else {
						So(v, ShouldEqual, test.values[1])
					}
				})
			}
		})

		Convey("With a target set in the context", func() {
			for i, test := range tests {
				if test.wantIncrPanic {
					continue
				}

				Convey(fmt.Sprintf("%d. %s", i, test.typ), func() {
					var m types.Metric
					if test.bucketer != nil {
						m = &fakeDistributionMetric{FakeMetric{
							types.MetricInfo{"m", "", []field.Field{field.String("f")}, test.typ, target.NilType},
							types.MetricMetadata{}}, test.bucketer}
					} else {
						m = &FakeMetric{
							types.MetricInfo{"m", "", []field.Field{field.String("f")}, test.typ, target.NilType},
							types.MetricMetadata{}}
					}

					s := opts.Factory()
					opts.RegistrationFinished(s)

					// Create a context with a different target.
					foo := target.Task{ServiceName: "foo"}
					ctxWithTarget := target.Set(ctx, &foo)

					// Set the first value on the default target, second value on the
					// different target. Note that both are set with the same field value,
					// "one".
					fvs := func() []any { return makeInterfaceSlice("one") }
					s.Set(ctx, m, time.Time{}, fvs(), test.values[0])
					s.Set(ctxWithTarget, m, time.Time{}, fvs(), test.values[1])

					// Get should return different values for different contexts.
					v1 := s.Get(ctx, m, time.Time{}, fvs())
					v2 := s.Get(ctxWithTarget, m, time.Time{}, fvs())
					So(v1, ShouldNotEqual, v2)

					// Delete the cell with the custom target. Then, get should return
					// the value for the default target, and nil for the custom target.
					s.Del(ctxWithTarget, m, fvs())
					So(s.Get(ctx, m, time.Time{}, fvs()), ShouldEqual, test.values[0])
					So(s.Get(ctxWithTarget, m, time.Time{}, fvs()), ShouldBeNil)
				})
			}
		})
	})

	Convey("Concurrency", t, func() {
		const numIterations = 100
		const numGoroutines = 32

		Convey("Incr", func(c C) {
			s := opts.Factory()
			m := &FakeMetric{
				types.MetricInfo{"m", "", []field.Field{}, types.CumulativeIntType, target.NilType},
				types.MetricMetadata{}}

			wg := sync.WaitGroup{}
			f := func(n int) {
				defer wg.Done()
				for i := 0; i < numIterations; i++ {
					s.Incr(ctx, m, time.Time{}, []any{}, int64(1))
				}
			}

			for n := 0; n < numGoroutines; n++ {
				wg.Add(1)
				go f(n)
			}
			wg.Wait()

			val := s.Get(ctx, m, time.Time{}, []any{})
			So(val, ShouldEqual, numIterations*numGoroutines)
		})
	})

	Convey("Multiple targets with the same TargetType", t, func() {
		Convey("Gets from context", func() {
			s := opts.Factory()
			m := &FakeMetric{
				types.MetricInfo{"m", "", []field.Field{}, types.NonCumulativeIntType, target.NilType},
				types.MetricMetadata{}}
			opts.RegistrationFinished(s)

			t := target.Task{ServiceName: "foo"}
			ctxWithTarget := target.Set(ctx, &t)

			s.Set(ctx, m, time.Time{}, []any{}, int64(42))
			s.Set(ctxWithTarget, m, time.Time{}, []any{}, int64(43))

			val := s.Get(ctx, m, time.Time{}, []any{})
			So(val, ShouldEqual, 42)

			val = s.Get(ctxWithTarget, m, time.Time{}, []any{})
			So(val, ShouldEqual, 43)

			all := s.GetAll(ctx)
			So(len(all), ShouldEqual, 2)

			// The order is undefined.
			if all[0].Value.(int64) == 42 {
				So(all[0].Target, ShouldResemble, s.DefaultTarget())
				So(all[1].Target, ShouldResemble, &t)
			} else {
				So(all[0].Target, ShouldResemble, &t)
				So(all[1].Target, ShouldResemble, s.DefaultTarget())
			}
		})
	})

	Convey("Multiple targets with multiple TargetTypes", t, func() {
		Convey("Gets from context", func() {
			s := opts.Factory()
			// Two metrics with the same metric name, but different types.
			mTask := &FakeMetric{
				types.MetricInfo{"m", "", []field.Field{}, types.NonCumulativeIntType, target.TaskType},
				types.MetricMetadata{}}
			mDevice := &FakeMetric{
				types.MetricInfo{"m", "", []field.Field{}, types.NonCumulativeIntType, target.DeviceType},
				types.MetricMetadata{}}
			opts.RegistrationFinished(s)

			taskTarget := target.Task{ServiceName: "foo"}
			deviceTarget := target.NetworkDevice{Hostname: "bar"}
			ctxWithTarget := target.Set(target.Set(ctx, &taskTarget), &deviceTarget)

			s.Set(ctxWithTarget, mTask, time.Time{}, []any{}, int64(42))
			s.Set(ctxWithTarget, mDevice, time.Time{}, []any{}, int64(43))

			val := s.Get(ctxWithTarget, mTask, time.Time{}, []any{})
			So(val, ShouldEqual, 42)

			val = s.Get(ctxWithTarget, mDevice, time.Time{}, []any{})
			So(val, ShouldEqual, 43)

			all := s.GetAll(ctx)
			So(len(all), ShouldEqual, 2)

			// The order is undefined.
			if all[0].Value.(int64) == 42 {
				So(all[0].Target, ShouldResemble, &taskTarget)
				So(all[1].Target, ShouldResemble, &deviceTarget)
			} else {
				So(all[0].Target, ShouldResemble, &deviceTarget)
				So(all[1].Target, ShouldResemble, &taskTarget)
			}
		})
	})
}

func makeInterfaceSlice(v ...any) []any {
	return v
}

// FakeMetric is a fake Metric implementation.
type FakeMetric struct {
	types.MetricInfo
	types.MetricMetadata
}

// Info implements Metric.Info
func (m *FakeMetric) Info() types.MetricInfo { return m.MetricInfo }

// Metadata implements Metric.Metadata
func (m *FakeMetric) Metadata() types.MetricMetadata { return m.MetricMetadata }

// SetFixedResetTime implements Metric.SetFixedResetTime.
func (m *FakeMetric) SetFixedResetTime(t time.Time) {}

type fakeDistributionMetric struct {
	FakeMetric

	bucketer *distribution.Bucketer
}

func (m *fakeDistributionMetric) Bucketer() *distribution.Bucketer { return m.bucketer }

type sortableCellSlice []types.Cell

func (s sortableCellSlice) Len() int { return len(s) }
func (s sortableCellSlice) Less(i, j int) bool {
	return s[i].ResetTime.UnixNano() < s[j].ResetTime.UnixNano()
}
func (s sortableCellSlice) Swap(i, j int) { s[i], s[j] = s[j], s[i] }
