/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Timestamp } from "../../../../../google/protobuf/timestamp.pb";
import { NumericRange } from "./common.pb";
import { SourceRef } from "./sources.pb";

export const protobufPackage = "luci.analysis.v1";

export interface QueryChangepointGroupSummariesRequest {
  /** The LUCI project. Mandatory field. */
  readonly project: string;
  /**
   * A filter to be applied to each changepoint in the groups.
   * If all changepoints in a group are filtered out, this group will not be returned.
   */
  readonly predicate: ChangepointPredicate | undefined;
}

/** Represent a function Changepoint -> bool */
export interface ChangepointPredicate {
  /** The test id of this changepoint matches this prefix. */
  readonly testIdPrefix: string;
  /**
   * Specify a range. The unexpected verdict rate change on this changepoint needs to fall into this range.
   * Unexpected verdict rate change is calculated by (unexpected verdict rate after changepoint - unexpected verdict rate before changepoint). Negative number means unexpected verdict rate decreases, positive number means increases.
   * eg. {lower_bound:0.1, upper_bound:0.9} means keep changepoint which has a unexpected verdict rate increase >= 10% and <= 90%.
   */
  readonly unexpectedVerdictRateChangeRange: NumericRange | undefined;
}

export interface QueryChangepointGroupSummariesResponse {
  /** A list of changepoint group summaries. */
  readonly groupSummaries: readonly ChangepointGroupSummary[];
}

/** Represent the summary of a changepoint group. */
export interface ChangepointGroupSummary {
  /** The canonical changepoint in the group. This is the changepoint with minimum (test_id, variant_hash, ref_hash, nominal_start_position) combination. */
  readonly canonicalChangepoint:
    | Changepoint
    | undefined;
  /** Statistics of this group. */
  readonly statistics: ChangepointGroupStatistics | undefined;
}

export interface ChangepointGroupStatistics {
  /** The number of test variant branches in this group. */
  readonly count: number;
  /**
   * Unexpected verdict rate before the changepoint.
   * The per test variant branch, unexpected verdict rate is calculated as (count of unexpected verdict/count of all verdicts).
   */
  readonly unexpectedVerdictRateBefore:
    | ChangepointGroupStatistics_RateDistribution
    | undefined;
  /** Unexpected verdict rate after the changepoint. */
  readonly unexpectedVerdictRateAfter:
    | ChangepointGroupStatistics_RateDistribution
    | undefined;
  /** The current unexpected verdict rate. */
  readonly unexpectedVerdictRateCurrent:
    | ChangepointGroupStatistics_RateDistribution
    | undefined;
  /** The amount of change in unexpected verdict rate before and after the changepoint. */
  readonly unexpectedVerdictRateChange: ChangepointGroupStatistics_RateChangeBuckets | undefined;
}

export interface ChangepointGroupStatistics_RateDistribution {
  /**
   * Average unexpected verdict rate of all test variant branches in the group. This is a value between 0.0 and 1.0.
   * Consequently, this is an ‘average of averages’.
   */
  readonly average: number;
  /** Count the number of changepoint that fall into each rate bucket. */
  readonly buckets: ChangepointGroupStatistics_RateDistribution_RateBuckets | undefined;
}

export interface ChangepointGroupStatistics_RateDistribution_RateBuckets {
  /** Counts the number of test variant branches with a unexpected verdict rate less than 5% (exclusive). */
  readonly countLess5Percent: number;
  /** Counts the number of test variant branches with a unexpected verdict rate greater than or equal to 5%, but less than 95%. */
  readonly countAbove5LessThan95Percent: number;
  /** Counts the number of test variant branches with a unexpected verdict rate equal to or greater than 95%. */
  readonly countAbove95Percent: number;
}

/**
 * Unexpected verdict rate change is calculated by (unexpected verdict rate after changepoint - unexpected verdict rate before changepoint).
 * TODO: we need to add buckets for unexpected verdict rate decrease when we support grouping fixes. Unexpected verdict rate decrease will be represented as negative number.
 */
export interface ChangepointGroupStatistics_RateChangeBuckets {
  /** Counts the number of test variant branches which saw their unexpected verdict rate increase by between 0% (inclusive) and 20% (exclusive). */
  readonly countIncreased0To20Percent: number;
  /** Counts the number of test variant branches which saw their unexpected verdict rate increase by between 20% (inclusive) and 50% (exclusive). */
  readonly countIncreased20To50Percent: number;
  /** Counts the number of test variant branches which saw their unexpected verdict rate increase by between 50% (inclusive) or more. */
  readonly countIncreased50To100Percent: number;
}

export interface QueryChangepointsInGroupRequest {
  /** The LUCI project. Mandatory field. */
  readonly project: string;
  /** Identify a group with this changepoint. Mandatory field. */
  readonly groupKey:
    | QueryChangepointsInGroupRequest_ChangepointIdentifier
    | undefined;
  /** A filter to be applied to each changepoint. */
  readonly predicate: ChangepointPredicate | undefined;
}

/**
 * We consider two changepoints matches if
 *   * their test_id, variant_hash, ref_hash are exactly the same,
 *           AND
 *   *  nominal_start_position is within the other changepoint's 99% confidence interval (inclusive).
 * Most of the time there should be only one matching changepoint.
 * However, in rare cases adjacent segments can have an overlapping 99% confidence interval.
 * It makes it possible that more than one changepoint matches. In this case, we select the one with the closest nominal start position.
 */
export interface QueryChangepointsInGroupRequest_ChangepointIdentifier {
  readonly testId: string;
  readonly variantHash: string;
  readonly refHash: string;
  readonly nominalStartPosition: string;
  /**
   * The nominal start hour of this changepoint in UTC.
   * This is used to locate a week in UTC (Saturday to Sunday) to generate changepoint groups.
   */
  readonly startHour: string | undefined;
}

/** TODO: Implement pagination, currently just return at most 1000 changepoints. */
export interface QueryChangepointsInGroupResponse {
  /** A list of changepoints in a group. */
  readonly changepoints: readonly Changepoint[];
}

/** Represent a changepoint of a test variant branch. */
export interface Changepoint {
  /** The LUCI Project. E.g. "chromium". */
  readonly project: string;
  /** The identity of the test. */
  readonly testId: string;
  /**
   * Hash of the variant, as 16 lowercase hexadecimal characters.
   * E.g. "96c68dc946ab4068".
   */
  readonly variantHash: string;
  /** Hash of the source branch, as 16 lowercase hexadecimal characters. */
  readonly refHash: string;
  /** The branch in source control. */
  readonly ref:
    | SourceRef
    | undefined;
  /** The nominal start hour of this changepoint. */
  readonly startHour:
    | string
    | undefined;
  /**
   * The lower bound of the starting changepoint position in a 99% two-tailed
   * confidence interval. Inclusive.
   */
  readonly startPositionLowerBound99th: string;
  /**
   * The upper bound of the starting changepoint position in a 99% two-tailed
   * confidence interval. Inclusive.
   */
  readonly startPositionUpperBound99th: string;
  /** The nominal commit position at which the segment starts (inclusive). */
  readonly nominalStartPosition: string;
  /** The nominal commit position at which the previous segment ends (inclusive). */
  readonly previousSegmentNominalEndPosition: string;
}

function createBaseQueryChangepointGroupSummariesRequest(): QueryChangepointGroupSummariesRequest {
  return { project: "", predicate: undefined };
}

export const QueryChangepointGroupSummariesRequest = {
  encode(message: QueryChangepointGroupSummariesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.project !== "") {
      writer.uint32(10).string(message.project);
    }
    if (message.predicate !== undefined) {
      ChangepointPredicate.encode(message.predicate, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryChangepointGroupSummariesRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryChangepointGroupSummariesRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.project = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.predicate = ChangepointPredicate.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryChangepointGroupSummariesRequest {
    return {
      project: isSet(object.project) ? globalThis.String(object.project) : "",
      predicate: isSet(object.predicate) ? ChangepointPredicate.fromJSON(object.predicate) : undefined,
    };
  },

  toJSON(message: QueryChangepointGroupSummariesRequest): unknown {
    const obj: any = {};
    if (message.project !== "") {
      obj.project = message.project;
    }
    if (message.predicate !== undefined) {
      obj.predicate = ChangepointPredicate.toJSON(message.predicate);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryChangepointGroupSummariesRequest>, I>>(
    base?: I,
  ): QueryChangepointGroupSummariesRequest {
    return QueryChangepointGroupSummariesRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryChangepointGroupSummariesRequest>, I>>(
    object: I,
  ): QueryChangepointGroupSummariesRequest {
    const message = createBaseQueryChangepointGroupSummariesRequest() as any;
    message.project = object.project ?? "";
    message.predicate = (object.predicate !== undefined && object.predicate !== null)
      ? ChangepointPredicate.fromPartial(object.predicate)
      : undefined;
    return message;
  },
};

function createBaseChangepointPredicate(): ChangepointPredicate {
  return { testIdPrefix: "", unexpectedVerdictRateChangeRange: undefined };
}

export const ChangepointPredicate = {
  encode(message: ChangepointPredicate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.testIdPrefix !== "") {
      writer.uint32(10).string(message.testIdPrefix);
    }
    if (message.unexpectedVerdictRateChangeRange !== undefined) {
      NumericRange.encode(message.unexpectedVerdictRateChangeRange, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChangepointPredicate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChangepointPredicate() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.testIdPrefix = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.unexpectedVerdictRateChangeRange = NumericRange.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChangepointPredicate {
    return {
      testIdPrefix: isSet(object.testIdPrefix) ? globalThis.String(object.testIdPrefix) : "",
      unexpectedVerdictRateChangeRange: isSet(object.unexpectedVerdictRateChangeRange)
        ? NumericRange.fromJSON(object.unexpectedVerdictRateChangeRange)
        : undefined,
    };
  },

  toJSON(message: ChangepointPredicate): unknown {
    const obj: any = {};
    if (message.testIdPrefix !== "") {
      obj.testIdPrefix = message.testIdPrefix;
    }
    if (message.unexpectedVerdictRateChangeRange !== undefined) {
      obj.unexpectedVerdictRateChangeRange = NumericRange.toJSON(message.unexpectedVerdictRateChangeRange);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChangepointPredicate>, I>>(base?: I): ChangepointPredicate {
    return ChangepointPredicate.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChangepointPredicate>, I>>(object: I): ChangepointPredicate {
    const message = createBaseChangepointPredicate() as any;
    message.testIdPrefix = object.testIdPrefix ?? "";
    message.unexpectedVerdictRateChangeRange =
      (object.unexpectedVerdictRateChangeRange !== undefined && object.unexpectedVerdictRateChangeRange !== null)
        ? NumericRange.fromPartial(object.unexpectedVerdictRateChangeRange)
        : undefined;
    return message;
  },
};

function createBaseQueryChangepointGroupSummariesResponse(): QueryChangepointGroupSummariesResponse {
  return { groupSummaries: [] };
}

export const QueryChangepointGroupSummariesResponse = {
  encode(message: QueryChangepointGroupSummariesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.groupSummaries) {
      ChangepointGroupSummary.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryChangepointGroupSummariesResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryChangepointGroupSummariesResponse() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.groupSummaries.push(ChangepointGroupSummary.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryChangepointGroupSummariesResponse {
    return {
      groupSummaries: globalThis.Array.isArray(object?.groupSummaries)
        ? object.groupSummaries.map((e: any) => ChangepointGroupSummary.fromJSON(e))
        : [],
    };
  },

  toJSON(message: QueryChangepointGroupSummariesResponse): unknown {
    const obj: any = {};
    if (message.groupSummaries?.length) {
      obj.groupSummaries = message.groupSummaries.map((e) => ChangepointGroupSummary.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryChangepointGroupSummariesResponse>, I>>(
    base?: I,
  ): QueryChangepointGroupSummariesResponse {
    return QueryChangepointGroupSummariesResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryChangepointGroupSummariesResponse>, I>>(
    object: I,
  ): QueryChangepointGroupSummariesResponse {
    const message = createBaseQueryChangepointGroupSummariesResponse() as any;
    message.groupSummaries = object.groupSummaries?.map((e) => ChangepointGroupSummary.fromPartial(e)) || [];
    return message;
  },
};

function createBaseChangepointGroupSummary(): ChangepointGroupSummary {
  return { canonicalChangepoint: undefined, statistics: undefined };
}

export const ChangepointGroupSummary = {
  encode(message: ChangepointGroupSummary, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.canonicalChangepoint !== undefined) {
      Changepoint.encode(message.canonicalChangepoint, writer.uint32(10).fork()).ldelim();
    }
    if (message.statistics !== undefined) {
      ChangepointGroupStatistics.encode(message.statistics, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChangepointGroupSummary {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChangepointGroupSummary() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.canonicalChangepoint = Changepoint.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.statistics = ChangepointGroupStatistics.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChangepointGroupSummary {
    return {
      canonicalChangepoint: isSet(object.canonicalChangepoint)
        ? Changepoint.fromJSON(object.canonicalChangepoint)
        : undefined,
      statistics: isSet(object.statistics) ? ChangepointGroupStatistics.fromJSON(object.statistics) : undefined,
    };
  },

  toJSON(message: ChangepointGroupSummary): unknown {
    const obj: any = {};
    if (message.canonicalChangepoint !== undefined) {
      obj.canonicalChangepoint = Changepoint.toJSON(message.canonicalChangepoint);
    }
    if (message.statistics !== undefined) {
      obj.statistics = ChangepointGroupStatistics.toJSON(message.statistics);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChangepointGroupSummary>, I>>(base?: I): ChangepointGroupSummary {
    return ChangepointGroupSummary.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChangepointGroupSummary>, I>>(object: I): ChangepointGroupSummary {
    const message = createBaseChangepointGroupSummary() as any;
    message.canonicalChangepoint = (object.canonicalChangepoint !== undefined && object.canonicalChangepoint !== null)
      ? Changepoint.fromPartial(object.canonicalChangepoint)
      : undefined;
    message.statistics = (object.statistics !== undefined && object.statistics !== null)
      ? ChangepointGroupStatistics.fromPartial(object.statistics)
      : undefined;
    return message;
  },
};

function createBaseChangepointGroupStatistics(): ChangepointGroupStatistics {
  return {
    count: 0,
    unexpectedVerdictRateBefore: undefined,
    unexpectedVerdictRateAfter: undefined,
    unexpectedVerdictRateCurrent: undefined,
    unexpectedVerdictRateChange: undefined,
  };
}

export const ChangepointGroupStatistics = {
  encode(message: ChangepointGroupStatistics, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.count !== 0) {
      writer.uint32(8).int32(message.count);
    }
    if (message.unexpectedVerdictRateBefore !== undefined) {
      ChangepointGroupStatistics_RateDistribution.encode(message.unexpectedVerdictRateBefore, writer.uint32(18).fork())
        .ldelim();
    }
    if (message.unexpectedVerdictRateAfter !== undefined) {
      ChangepointGroupStatistics_RateDistribution.encode(message.unexpectedVerdictRateAfter, writer.uint32(26).fork())
        .ldelim();
    }
    if (message.unexpectedVerdictRateCurrent !== undefined) {
      ChangepointGroupStatistics_RateDistribution.encode(message.unexpectedVerdictRateCurrent, writer.uint32(34).fork())
        .ldelim();
    }
    if (message.unexpectedVerdictRateChange !== undefined) {
      ChangepointGroupStatistics_RateChangeBuckets.encode(message.unexpectedVerdictRateChange, writer.uint32(42).fork())
        .ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChangepointGroupStatistics {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChangepointGroupStatistics() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.count = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.unexpectedVerdictRateBefore = ChangepointGroupStatistics_RateDistribution.decode(
            reader,
            reader.uint32(),
          );
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.unexpectedVerdictRateAfter = ChangepointGroupStatistics_RateDistribution.decode(
            reader,
            reader.uint32(),
          );
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.unexpectedVerdictRateCurrent = ChangepointGroupStatistics_RateDistribution.decode(
            reader,
            reader.uint32(),
          );
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.unexpectedVerdictRateChange = ChangepointGroupStatistics_RateChangeBuckets.decode(
            reader,
            reader.uint32(),
          );
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChangepointGroupStatistics {
    return {
      count: isSet(object.count) ? globalThis.Number(object.count) : 0,
      unexpectedVerdictRateBefore: isSet(object.unexpectedVerdictRateBefore)
        ? ChangepointGroupStatistics_RateDistribution.fromJSON(object.unexpectedVerdictRateBefore)
        : undefined,
      unexpectedVerdictRateAfter: isSet(object.unexpectedVerdictRateAfter)
        ? ChangepointGroupStatistics_RateDistribution.fromJSON(object.unexpectedVerdictRateAfter)
        : undefined,
      unexpectedVerdictRateCurrent: isSet(object.unexpectedVerdictRateCurrent)
        ? ChangepointGroupStatistics_RateDistribution.fromJSON(object.unexpectedVerdictRateCurrent)
        : undefined,
      unexpectedVerdictRateChange: isSet(object.unexpectedVerdictRateChange)
        ? ChangepointGroupStatistics_RateChangeBuckets.fromJSON(object.unexpectedVerdictRateChange)
        : undefined,
    };
  },

  toJSON(message: ChangepointGroupStatistics): unknown {
    const obj: any = {};
    if (message.count !== 0) {
      obj.count = Math.round(message.count);
    }
    if (message.unexpectedVerdictRateBefore !== undefined) {
      obj.unexpectedVerdictRateBefore = ChangepointGroupStatistics_RateDistribution.toJSON(
        message.unexpectedVerdictRateBefore,
      );
    }
    if (message.unexpectedVerdictRateAfter !== undefined) {
      obj.unexpectedVerdictRateAfter = ChangepointGroupStatistics_RateDistribution.toJSON(
        message.unexpectedVerdictRateAfter,
      );
    }
    if (message.unexpectedVerdictRateCurrent !== undefined) {
      obj.unexpectedVerdictRateCurrent = ChangepointGroupStatistics_RateDistribution.toJSON(
        message.unexpectedVerdictRateCurrent,
      );
    }
    if (message.unexpectedVerdictRateChange !== undefined) {
      obj.unexpectedVerdictRateChange = ChangepointGroupStatistics_RateChangeBuckets.toJSON(
        message.unexpectedVerdictRateChange,
      );
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChangepointGroupStatistics>, I>>(base?: I): ChangepointGroupStatistics {
    return ChangepointGroupStatistics.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChangepointGroupStatistics>, I>>(object: I): ChangepointGroupStatistics {
    const message = createBaseChangepointGroupStatistics() as any;
    message.count = object.count ?? 0;
    message.unexpectedVerdictRateBefore =
      (object.unexpectedVerdictRateBefore !== undefined && object.unexpectedVerdictRateBefore !== null)
        ? ChangepointGroupStatistics_RateDistribution.fromPartial(object.unexpectedVerdictRateBefore)
        : undefined;
    message.unexpectedVerdictRateAfter =
      (object.unexpectedVerdictRateAfter !== undefined && object.unexpectedVerdictRateAfter !== null)
        ? ChangepointGroupStatistics_RateDistribution.fromPartial(object.unexpectedVerdictRateAfter)
        : undefined;
    message.unexpectedVerdictRateCurrent =
      (object.unexpectedVerdictRateCurrent !== undefined && object.unexpectedVerdictRateCurrent !== null)
        ? ChangepointGroupStatistics_RateDistribution.fromPartial(object.unexpectedVerdictRateCurrent)
        : undefined;
    message.unexpectedVerdictRateChange =
      (object.unexpectedVerdictRateChange !== undefined && object.unexpectedVerdictRateChange !== null)
        ? ChangepointGroupStatistics_RateChangeBuckets.fromPartial(object.unexpectedVerdictRateChange)
        : undefined;
    return message;
  },
};

function createBaseChangepointGroupStatistics_RateDistribution(): ChangepointGroupStatistics_RateDistribution {
  return { average: 0, buckets: undefined };
}

export const ChangepointGroupStatistics_RateDistribution = {
  encode(message: ChangepointGroupStatistics_RateDistribution, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.average !== 0) {
      writer.uint32(13).float(message.average);
    }
    if (message.buckets !== undefined) {
      ChangepointGroupStatistics_RateDistribution_RateBuckets.encode(message.buckets, writer.uint32(18).fork())
        .ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChangepointGroupStatistics_RateDistribution {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChangepointGroupStatistics_RateDistribution() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }

          message.average = reader.float();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.buckets = ChangepointGroupStatistics_RateDistribution_RateBuckets.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChangepointGroupStatistics_RateDistribution {
    return {
      average: isSet(object.average) ? globalThis.Number(object.average) : 0,
      buckets: isSet(object.buckets)
        ? ChangepointGroupStatistics_RateDistribution_RateBuckets.fromJSON(object.buckets)
        : undefined,
    };
  },

  toJSON(message: ChangepointGroupStatistics_RateDistribution): unknown {
    const obj: any = {};
    if (message.average !== 0) {
      obj.average = message.average;
    }
    if (message.buckets !== undefined) {
      obj.buckets = ChangepointGroupStatistics_RateDistribution_RateBuckets.toJSON(message.buckets);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChangepointGroupStatistics_RateDistribution>, I>>(
    base?: I,
  ): ChangepointGroupStatistics_RateDistribution {
    return ChangepointGroupStatistics_RateDistribution.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChangepointGroupStatistics_RateDistribution>, I>>(
    object: I,
  ): ChangepointGroupStatistics_RateDistribution {
    const message = createBaseChangepointGroupStatistics_RateDistribution() as any;
    message.average = object.average ?? 0;
    message.buckets = (object.buckets !== undefined && object.buckets !== null)
      ? ChangepointGroupStatistics_RateDistribution_RateBuckets.fromPartial(object.buckets)
      : undefined;
    return message;
  },
};

function createBaseChangepointGroupStatistics_RateDistribution_RateBuckets(): ChangepointGroupStatistics_RateDistribution_RateBuckets {
  return { countLess5Percent: 0, countAbove5LessThan95Percent: 0, countAbove95Percent: 0 };
}

export const ChangepointGroupStatistics_RateDistribution_RateBuckets = {
  encode(
    message: ChangepointGroupStatistics_RateDistribution_RateBuckets,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.countLess5Percent !== 0) {
      writer.uint32(8).int32(message.countLess5Percent);
    }
    if (message.countAbove5LessThan95Percent !== 0) {
      writer.uint32(16).int32(message.countAbove5LessThan95Percent);
    }
    if (message.countAbove95Percent !== 0) {
      writer.uint32(24).int32(message.countAbove95Percent);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChangepointGroupStatistics_RateDistribution_RateBuckets {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChangepointGroupStatistics_RateDistribution_RateBuckets() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.countLess5Percent = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.countAbove5LessThan95Percent = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.countAbove95Percent = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChangepointGroupStatistics_RateDistribution_RateBuckets {
    return {
      countLess5Percent: isSet(object.countLess5Percent) ? globalThis.Number(object.countLess5Percent) : 0,
      countAbove5LessThan95Percent: isSet(object.countAbove5LessThan95Percent)
        ? globalThis.Number(object.countAbove5LessThan95Percent)
        : 0,
      countAbove95Percent: isSet(object.countAbove95Percent) ? globalThis.Number(object.countAbove95Percent) : 0,
    };
  },

  toJSON(message: ChangepointGroupStatistics_RateDistribution_RateBuckets): unknown {
    const obj: any = {};
    if (message.countLess5Percent !== 0) {
      obj.countLess5Percent = Math.round(message.countLess5Percent);
    }
    if (message.countAbove5LessThan95Percent !== 0) {
      obj.countAbove5LessThan95Percent = Math.round(message.countAbove5LessThan95Percent);
    }
    if (message.countAbove95Percent !== 0) {
      obj.countAbove95Percent = Math.round(message.countAbove95Percent);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChangepointGroupStatistics_RateDistribution_RateBuckets>, I>>(
    base?: I,
  ): ChangepointGroupStatistics_RateDistribution_RateBuckets {
    return ChangepointGroupStatistics_RateDistribution_RateBuckets.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChangepointGroupStatistics_RateDistribution_RateBuckets>, I>>(
    object: I,
  ): ChangepointGroupStatistics_RateDistribution_RateBuckets {
    const message = createBaseChangepointGroupStatistics_RateDistribution_RateBuckets() as any;
    message.countLess5Percent = object.countLess5Percent ?? 0;
    message.countAbove5LessThan95Percent = object.countAbove5LessThan95Percent ?? 0;
    message.countAbove95Percent = object.countAbove95Percent ?? 0;
    return message;
  },
};

function createBaseChangepointGroupStatistics_RateChangeBuckets(): ChangepointGroupStatistics_RateChangeBuckets {
  return { countIncreased0To20Percent: 0, countIncreased20To50Percent: 0, countIncreased50To100Percent: 0 };
}

export const ChangepointGroupStatistics_RateChangeBuckets = {
  encode(message: ChangepointGroupStatistics_RateChangeBuckets, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.countIncreased0To20Percent !== 0) {
      writer.uint32(8).int32(message.countIncreased0To20Percent);
    }
    if (message.countIncreased20To50Percent !== 0) {
      writer.uint32(16).int32(message.countIncreased20To50Percent);
    }
    if (message.countIncreased50To100Percent !== 0) {
      writer.uint32(24).int32(message.countIncreased50To100Percent);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChangepointGroupStatistics_RateChangeBuckets {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChangepointGroupStatistics_RateChangeBuckets() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.countIncreased0To20Percent = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.countIncreased20To50Percent = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.countIncreased50To100Percent = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChangepointGroupStatistics_RateChangeBuckets {
    return {
      countIncreased0To20Percent: isSet(object.countIncreased0To20Percent)
        ? globalThis.Number(object.countIncreased0To20Percent)
        : 0,
      countIncreased20To50Percent: isSet(object.countIncreased20To50Percent)
        ? globalThis.Number(object.countIncreased20To50Percent)
        : 0,
      countIncreased50To100Percent: isSet(object.countIncreased50To100Percent)
        ? globalThis.Number(object.countIncreased50To100Percent)
        : 0,
    };
  },

  toJSON(message: ChangepointGroupStatistics_RateChangeBuckets): unknown {
    const obj: any = {};
    if (message.countIncreased0To20Percent !== 0) {
      obj.countIncreased0To20Percent = Math.round(message.countIncreased0To20Percent);
    }
    if (message.countIncreased20To50Percent !== 0) {
      obj.countIncreased20To50Percent = Math.round(message.countIncreased20To50Percent);
    }
    if (message.countIncreased50To100Percent !== 0) {
      obj.countIncreased50To100Percent = Math.round(message.countIncreased50To100Percent);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChangepointGroupStatistics_RateChangeBuckets>, I>>(
    base?: I,
  ): ChangepointGroupStatistics_RateChangeBuckets {
    return ChangepointGroupStatistics_RateChangeBuckets.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChangepointGroupStatistics_RateChangeBuckets>, I>>(
    object: I,
  ): ChangepointGroupStatistics_RateChangeBuckets {
    const message = createBaseChangepointGroupStatistics_RateChangeBuckets() as any;
    message.countIncreased0To20Percent = object.countIncreased0To20Percent ?? 0;
    message.countIncreased20To50Percent = object.countIncreased20To50Percent ?? 0;
    message.countIncreased50To100Percent = object.countIncreased50To100Percent ?? 0;
    return message;
  },
};

function createBaseQueryChangepointsInGroupRequest(): QueryChangepointsInGroupRequest {
  return { project: "", groupKey: undefined, predicate: undefined };
}

export const QueryChangepointsInGroupRequest = {
  encode(message: QueryChangepointsInGroupRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.project !== "") {
      writer.uint32(10).string(message.project);
    }
    if (message.groupKey !== undefined) {
      QueryChangepointsInGroupRequest_ChangepointIdentifier.encode(message.groupKey, writer.uint32(18).fork()).ldelim();
    }
    if (message.predicate !== undefined) {
      ChangepointPredicate.encode(message.predicate, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryChangepointsInGroupRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryChangepointsInGroupRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.project = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.groupKey = QueryChangepointsInGroupRequest_ChangepointIdentifier.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.predicate = ChangepointPredicate.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryChangepointsInGroupRequest {
    return {
      project: isSet(object.project) ? globalThis.String(object.project) : "",
      groupKey: isSet(object.groupKey)
        ? QueryChangepointsInGroupRequest_ChangepointIdentifier.fromJSON(object.groupKey)
        : undefined,
      predicate: isSet(object.predicate) ? ChangepointPredicate.fromJSON(object.predicate) : undefined,
    };
  },

  toJSON(message: QueryChangepointsInGroupRequest): unknown {
    const obj: any = {};
    if (message.project !== "") {
      obj.project = message.project;
    }
    if (message.groupKey !== undefined) {
      obj.groupKey = QueryChangepointsInGroupRequest_ChangepointIdentifier.toJSON(message.groupKey);
    }
    if (message.predicate !== undefined) {
      obj.predicate = ChangepointPredicate.toJSON(message.predicate);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryChangepointsInGroupRequest>, I>>(base?: I): QueryChangepointsInGroupRequest {
    return QueryChangepointsInGroupRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryChangepointsInGroupRequest>, I>>(
    object: I,
  ): QueryChangepointsInGroupRequest {
    const message = createBaseQueryChangepointsInGroupRequest() as any;
    message.project = object.project ?? "";
    message.groupKey = (object.groupKey !== undefined && object.groupKey !== null)
      ? QueryChangepointsInGroupRequest_ChangepointIdentifier.fromPartial(object.groupKey)
      : undefined;
    message.predicate = (object.predicate !== undefined && object.predicate !== null)
      ? ChangepointPredicate.fromPartial(object.predicate)
      : undefined;
    return message;
  },
};

function createBaseQueryChangepointsInGroupRequest_ChangepointIdentifier(): QueryChangepointsInGroupRequest_ChangepointIdentifier {
  return { testId: "", variantHash: "", refHash: "", nominalStartPosition: "0", startHour: undefined };
}

export const QueryChangepointsInGroupRequest_ChangepointIdentifier = {
  encode(
    message: QueryChangepointsInGroupRequest_ChangepointIdentifier,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.testId !== "") {
      writer.uint32(10).string(message.testId);
    }
    if (message.variantHash !== "") {
      writer.uint32(18).string(message.variantHash);
    }
    if (message.refHash !== "") {
      writer.uint32(26).string(message.refHash);
    }
    if (message.nominalStartPosition !== "0") {
      writer.uint32(32).int64(message.nominalStartPosition);
    }
    if (message.startHour !== undefined) {
      Timestamp.encode(toTimestamp(message.startHour), writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryChangepointsInGroupRequest_ChangepointIdentifier {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryChangepointsInGroupRequest_ChangepointIdentifier() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.testId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.variantHash = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.refHash = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.nominalStartPosition = longToString(reader.int64() as Long);
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.startHour = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryChangepointsInGroupRequest_ChangepointIdentifier {
    return {
      testId: isSet(object.testId) ? globalThis.String(object.testId) : "",
      variantHash: isSet(object.variantHash) ? globalThis.String(object.variantHash) : "",
      refHash: isSet(object.refHash) ? globalThis.String(object.refHash) : "",
      nominalStartPosition: isSet(object.nominalStartPosition) ? globalThis.String(object.nominalStartPosition) : "0",
      startHour: isSet(object.startHour) ? globalThis.String(object.startHour) : undefined,
    };
  },

  toJSON(message: QueryChangepointsInGroupRequest_ChangepointIdentifier): unknown {
    const obj: any = {};
    if (message.testId !== "") {
      obj.testId = message.testId;
    }
    if (message.variantHash !== "") {
      obj.variantHash = message.variantHash;
    }
    if (message.refHash !== "") {
      obj.refHash = message.refHash;
    }
    if (message.nominalStartPosition !== "0") {
      obj.nominalStartPosition = message.nominalStartPosition;
    }
    if (message.startHour !== undefined) {
      obj.startHour = message.startHour;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryChangepointsInGroupRequest_ChangepointIdentifier>, I>>(
    base?: I,
  ): QueryChangepointsInGroupRequest_ChangepointIdentifier {
    return QueryChangepointsInGroupRequest_ChangepointIdentifier.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryChangepointsInGroupRequest_ChangepointIdentifier>, I>>(
    object: I,
  ): QueryChangepointsInGroupRequest_ChangepointIdentifier {
    const message = createBaseQueryChangepointsInGroupRequest_ChangepointIdentifier() as any;
    message.testId = object.testId ?? "";
    message.variantHash = object.variantHash ?? "";
    message.refHash = object.refHash ?? "";
    message.nominalStartPosition = object.nominalStartPosition ?? "0";
    message.startHour = object.startHour ?? undefined;
    return message;
  },
};

function createBaseQueryChangepointsInGroupResponse(): QueryChangepointsInGroupResponse {
  return { changepoints: [] };
}

export const QueryChangepointsInGroupResponse = {
  encode(message: QueryChangepointsInGroupResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.changepoints) {
      Changepoint.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryChangepointsInGroupResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryChangepointsInGroupResponse() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.changepoints.push(Changepoint.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryChangepointsInGroupResponse {
    return {
      changepoints: globalThis.Array.isArray(object?.changepoints)
        ? object.changepoints.map((e: any) => Changepoint.fromJSON(e))
        : [],
    };
  },

  toJSON(message: QueryChangepointsInGroupResponse): unknown {
    const obj: any = {};
    if (message.changepoints?.length) {
      obj.changepoints = message.changepoints.map((e) => Changepoint.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryChangepointsInGroupResponse>, I>>(
    base?: I,
  ): QueryChangepointsInGroupResponse {
    return QueryChangepointsInGroupResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryChangepointsInGroupResponse>, I>>(
    object: I,
  ): QueryChangepointsInGroupResponse {
    const message = createBaseQueryChangepointsInGroupResponse() as any;
    message.changepoints = object.changepoints?.map((e) => Changepoint.fromPartial(e)) || [];
    return message;
  },
};

function createBaseChangepoint(): Changepoint {
  return {
    project: "",
    testId: "",
    variantHash: "",
    refHash: "",
    ref: undefined,
    startHour: undefined,
    startPositionLowerBound99th: "0",
    startPositionUpperBound99th: "0",
    nominalStartPosition: "0",
    previousSegmentNominalEndPosition: "0",
  };
}

export const Changepoint = {
  encode(message: Changepoint, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.project !== "") {
      writer.uint32(10).string(message.project);
    }
    if (message.testId !== "") {
      writer.uint32(18).string(message.testId);
    }
    if (message.variantHash !== "") {
      writer.uint32(26).string(message.variantHash);
    }
    if (message.refHash !== "") {
      writer.uint32(34).string(message.refHash);
    }
    if (message.ref !== undefined) {
      SourceRef.encode(message.ref, writer.uint32(42).fork()).ldelim();
    }
    if (message.startHour !== undefined) {
      Timestamp.encode(toTimestamp(message.startHour), writer.uint32(74).fork()).ldelim();
    }
    if (message.startPositionLowerBound99th !== "0") {
      writer.uint32(80).int64(message.startPositionLowerBound99th);
    }
    if (message.startPositionUpperBound99th !== "0") {
      writer.uint32(88).int64(message.startPositionUpperBound99th);
    }
    if (message.nominalStartPosition !== "0") {
      writer.uint32(96).int64(message.nominalStartPosition);
    }
    if (message.previousSegmentNominalEndPosition !== "0") {
      writer.uint32(104).int64(message.previousSegmentNominalEndPosition);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Changepoint {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChangepoint() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.project = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.testId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.variantHash = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.refHash = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.ref = SourceRef.decode(reader, reader.uint32());
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.startHour = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.startPositionLowerBound99th = longToString(reader.int64() as Long);
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.startPositionUpperBound99th = longToString(reader.int64() as Long);
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.nominalStartPosition = longToString(reader.int64() as Long);
          continue;
        case 13:
          if (tag !== 104) {
            break;
          }

          message.previousSegmentNominalEndPosition = longToString(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Changepoint {
    return {
      project: isSet(object.project) ? globalThis.String(object.project) : "",
      testId: isSet(object.testId) ? globalThis.String(object.testId) : "",
      variantHash: isSet(object.variantHash) ? globalThis.String(object.variantHash) : "",
      refHash: isSet(object.refHash) ? globalThis.String(object.refHash) : "",
      ref: isSet(object.ref) ? SourceRef.fromJSON(object.ref) : undefined,
      startHour: isSet(object.startHour) ? globalThis.String(object.startHour) : undefined,
      startPositionLowerBound99th: isSet(object.startPositionLowerBound99th)
        ? globalThis.String(object.startPositionLowerBound99th)
        : "0",
      startPositionUpperBound99th: isSet(object.startPositionUpperBound99th)
        ? globalThis.String(object.startPositionUpperBound99th)
        : "0",
      nominalStartPosition: isSet(object.nominalStartPosition) ? globalThis.String(object.nominalStartPosition) : "0",
      previousSegmentNominalEndPosition: isSet(object.previousSegmentNominalEndPosition)
        ? globalThis.String(object.previousSegmentNominalEndPosition)
        : "0",
    };
  },

  toJSON(message: Changepoint): unknown {
    const obj: any = {};
    if (message.project !== "") {
      obj.project = message.project;
    }
    if (message.testId !== "") {
      obj.testId = message.testId;
    }
    if (message.variantHash !== "") {
      obj.variantHash = message.variantHash;
    }
    if (message.refHash !== "") {
      obj.refHash = message.refHash;
    }
    if (message.ref !== undefined) {
      obj.ref = SourceRef.toJSON(message.ref);
    }
    if (message.startHour !== undefined) {
      obj.startHour = message.startHour;
    }
    if (message.startPositionLowerBound99th !== "0") {
      obj.startPositionLowerBound99th = message.startPositionLowerBound99th;
    }
    if (message.startPositionUpperBound99th !== "0") {
      obj.startPositionUpperBound99th = message.startPositionUpperBound99th;
    }
    if (message.nominalStartPosition !== "0") {
      obj.nominalStartPosition = message.nominalStartPosition;
    }
    if (message.previousSegmentNominalEndPosition !== "0") {
      obj.previousSegmentNominalEndPosition = message.previousSegmentNominalEndPosition;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Changepoint>, I>>(base?: I): Changepoint {
    return Changepoint.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Changepoint>, I>>(object: I): Changepoint {
    const message = createBaseChangepoint() as any;
    message.project = object.project ?? "";
    message.testId = object.testId ?? "";
    message.variantHash = object.variantHash ?? "";
    message.refHash = object.refHash ?? "";
    message.ref = (object.ref !== undefined && object.ref !== null) ? SourceRef.fromPartial(object.ref) : undefined;
    message.startHour = object.startHour ?? undefined;
    message.startPositionLowerBound99th = object.startPositionLowerBound99th ?? "0";
    message.startPositionUpperBound99th = object.startPositionUpperBound99th ?? "0";
    message.nominalStartPosition = object.nominalStartPosition ?? "0";
    message.previousSegmentNominalEndPosition = object.previousSegmentNominalEndPosition ?? "0";
    return message;
  },
};

/**
 * This service currently only return changepoints which have an increase in unexpected verdict rate, aka. Regression.
 * In the future, it may be extended for obtaining groups which have a decreased unexpected verdict rate aka. fixes.
 */
export interface Changepoints {
  /**
   * Query the changepoint group summaries.
   * Currently this RPC only returns at most 1000 changepoint groups starting at the current week.
   * TODO: Add pagination to this RPC so that more changepoint history can be seen.
   */
  QueryChangepointGroupSummaries(
    request: QueryChangepointGroupSummariesRequest,
  ): Promise<QueryChangepointGroupSummariesResponse>;
  /**
   * Query the changepoints in a particular group.
   * TODO: Implement pagination, currently just return at most 1000 changepoints.
   */
  QueryChangepointsInGroup(request: QueryChangepointsInGroupRequest): Promise<QueryChangepointsInGroupResponse>;
}

export const ChangepointsServiceName = "luci.analysis.v1.Changepoints";
export class ChangepointsClientImpl implements Changepoints {
  static readonly DEFAULT_SERVICE = ChangepointsServiceName;
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || ChangepointsServiceName;
    this.rpc = rpc;
    this.QueryChangepointGroupSummaries = this.QueryChangepointGroupSummaries.bind(this);
    this.QueryChangepointsInGroup = this.QueryChangepointsInGroup.bind(this);
  }
  QueryChangepointGroupSummaries(
    request: QueryChangepointGroupSummariesRequest,
  ): Promise<QueryChangepointGroupSummariesResponse> {
    const data = QueryChangepointGroupSummariesRequest.toJSON(request);
    const promise = this.rpc.request(this.service, "QueryChangepointGroupSummaries", data);
    return promise.then((data) => QueryChangepointGroupSummariesResponse.fromJSON(data));
  }

  QueryChangepointsInGroup(request: QueryChangepointsInGroupRequest): Promise<QueryChangepointsInGroupResponse> {
    const data = QueryChangepointsInGroupRequest.toJSON(request);
    const promise = this.rpc.request(this.service, "QueryChangepointsInGroup", data);
    return promise.then((data) => QueryChangepointsInGroupResponse.fromJSON(data));
  }
}

interface Rpc {
  request(service: string, method: string, data: unknown): Promise<unknown>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(dateStr: string): Timestamp {
  const date = new globalThis.Date(dateStr);
  const seconds = Math.trunc(date.getTime() / 1_000).toString();
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): string {
  let millis = (globalThis.Number(t.seconds) || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new globalThis.Date(millis).toISOString();
}

function longToString(long: Long) {
  return long.toString();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}