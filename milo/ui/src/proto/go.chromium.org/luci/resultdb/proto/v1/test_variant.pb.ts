/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Variant } from "./common.pb";
import { TestMetadata } from "./test_metadata.pb";
import { TestExoneration, TestResult } from "./test_result.pb";

export const protobufPackage = "luci.resultdb.v1";

/** Status of a test variant. */
export enum TestVariantStatus {
  /**
   * UNSPECIFIED - a test variant must not have this status.
   * This is only used when filtering variants.
   */
  UNSPECIFIED = 0,
  /** UNEXPECTED - The test variant has no exonerations, and all results are unexpected. */
  UNEXPECTED = 10,
  /** UNEXPECTEDLY_SKIPPED - The test variant has no exonerations, and all results are unexpectedly skipped. */
  UNEXPECTEDLY_SKIPPED = 20,
  /**
   * FLAKY - The test variant has no exonerations, and has both expected and unexpected
   * results.
   */
  FLAKY = 30,
  /** EXONERATED - The test variant has one or more test exonerations. */
  EXONERATED = 40,
  /**
   * UNEXPECTED_MASK - A special value that matches any test variant which doesn't have the status
   * EXPECTED. This includes all the above statuses. It will never be present on
   * returned results, it's only for use in predicates.
   */
  UNEXPECTED_MASK = 45,
  /** EXPECTED - The test variant has no exonerations, and all results are expected. */
  EXPECTED = 50,
}

export function testVariantStatusFromJSON(object: any): TestVariantStatus {
  switch (object) {
    case 0:
    case "TEST_VARIANT_STATUS_UNSPECIFIED":
      return TestVariantStatus.UNSPECIFIED;
    case 10:
    case "UNEXPECTED":
      return TestVariantStatus.UNEXPECTED;
    case 20:
    case "UNEXPECTEDLY_SKIPPED":
      return TestVariantStatus.UNEXPECTEDLY_SKIPPED;
    case 30:
    case "FLAKY":
      return TestVariantStatus.FLAKY;
    case 40:
    case "EXONERATED":
      return TestVariantStatus.EXONERATED;
    case 45:
    case "UNEXPECTED_MASK":
      return TestVariantStatus.UNEXPECTED_MASK;
    case 50:
    case "EXPECTED":
      return TestVariantStatus.EXPECTED;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum TestVariantStatus");
  }
}

export function testVariantStatusToJSON(object: TestVariantStatus): string {
  switch (object) {
    case TestVariantStatus.UNSPECIFIED:
      return "TEST_VARIANT_STATUS_UNSPECIFIED";
    case TestVariantStatus.UNEXPECTED:
      return "UNEXPECTED";
    case TestVariantStatus.UNEXPECTEDLY_SKIPPED:
      return "UNEXPECTEDLY_SKIPPED";
    case TestVariantStatus.FLAKY:
      return "FLAKY";
    case TestVariantStatus.EXONERATED:
      return "EXONERATED";
    case TestVariantStatus.UNEXPECTED_MASK:
      return "UNEXPECTED_MASK";
    case TestVariantStatus.EXPECTED:
      return "EXPECTED";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum TestVariantStatus");
  }
}

/** Represents a matching test variant with its outcomes. */
export interface TestVariant {
  /**
   * A unique identifier of the test in a LUCI project.
   * Regex: ^[[::print::]]{1,256}$
   *
   * Refer to TestResult.test_id for details.
   */
  readonly testId: string;
  /**
   * Description of one specific way of running the test,
   * e.g. a specific bucket, builder and a test suite.
   */
  readonly variant:
    | Variant
    | undefined;
  /**
   * Hash of the variant.
   * hex(sha256(sorted(''.join('%s:%s\n' for k, v in variant.items())))).
   */
  readonly variantHash: string;
  /** Status of the test variant. */
  readonly status: TestVariantStatus;
  /** Outcomes of the test variant. */
  readonly results: readonly TestResultBundle[];
  /** Test exonerations if any test variant is exonerated. */
  readonly exonerations: readonly TestExoneration[];
  /**
   * Information about the test at the time of its execution.
   *
   * All test results of the same test variant should report the same test
   * metadata. This RPC relies on this rule and returns test metadata from
   * *arbitrary* result of the test variant.
   */
  readonly testMetadata:
    | TestMetadata
    | undefined;
  /**
   * Whether the
   *    - test metadata; or
   *    - the variant definition; or
   *    - both the test metadata and variant definition
   * have been masked from the test variant.
   *
   * Output only.
   */
  readonly isMasked: boolean;
  /**
   * The identity of the code sources tested. This ID can be used
   * to lookup of the actual sources in QueryTestVariantsResponse.sources.
   *
   * All test results of the same test variant should be attached to the same
   * sources (via their respective invocation(s)). This RPC relies upon this
   * and returns sources from an *arbitrary* result of the test variant.
   *
   * If the code sources tested are not available, this field is blank.
   */
  readonly sourcesId: string;
}

/** Outcomes of an execution of the test variant. */
export interface TestResultBundle {
  /** Result of the test variant execution. */
  readonly result: TestResult | undefined;
}

/**
 * Represents a function TestVariant -> bool.
 * Empty message matches all test variants.
 */
export interface TestVariantPredicate {
  /** A test variant must have this status. */
  readonly status: TestVariantStatus;
}

function createBaseTestVariant(): TestVariant {
  return {
    testId: "",
    variant: undefined,
    variantHash: "",
    status: 0,
    results: [],
    exonerations: [],
    testMetadata: undefined,
    isMasked: false,
    sourcesId: "",
  };
}

export const TestVariant = {
  encode(message: TestVariant, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.testId !== "") {
      writer.uint32(10).string(message.testId);
    }
    if (message.variant !== undefined) {
      Variant.encode(message.variant, writer.uint32(18).fork()).ldelim();
    }
    if (message.variantHash !== "") {
      writer.uint32(26).string(message.variantHash);
    }
    if (message.status !== 0) {
      writer.uint32(32).int32(message.status);
    }
    for (const v of message.results) {
      TestResultBundle.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.exonerations) {
      TestExoneration.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    if (message.testMetadata !== undefined) {
      TestMetadata.encode(message.testMetadata, writer.uint32(58).fork()).ldelim();
    }
    if (message.isMasked === true) {
      writer.uint32(64).bool(message.isMasked);
    }
    if (message.sourcesId !== "") {
      writer.uint32(74).string(message.sourcesId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TestVariant {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTestVariant() as any;
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

          message.variant = Variant.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.variantHash = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.results.push(TestResultBundle.decode(reader, reader.uint32()));
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.exonerations.push(TestExoneration.decode(reader, reader.uint32()));
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.testMetadata = TestMetadata.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.isMasked = reader.bool();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.sourcesId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TestVariant {
    return {
      testId: isSet(object.testId) ? globalThis.String(object.testId) : "",
      variant: isSet(object.variant) ? Variant.fromJSON(object.variant) : undefined,
      variantHash: isSet(object.variantHash) ? globalThis.String(object.variantHash) : "",
      status: isSet(object.status) ? testVariantStatusFromJSON(object.status) : 0,
      results: globalThis.Array.isArray(object?.results)
        ? object.results.map((e: any) => TestResultBundle.fromJSON(e))
        : [],
      exonerations: globalThis.Array.isArray(object?.exonerations)
        ? object.exonerations.map((e: any) => TestExoneration.fromJSON(e))
        : [],
      testMetadata: isSet(object.testMetadata) ? TestMetadata.fromJSON(object.testMetadata) : undefined,
      isMasked: isSet(object.isMasked) ? globalThis.Boolean(object.isMasked) : false,
      sourcesId: isSet(object.sourcesId) ? globalThis.String(object.sourcesId) : "",
    };
  },

  toJSON(message: TestVariant): unknown {
    const obj: any = {};
    if (message.testId !== "") {
      obj.testId = message.testId;
    }
    if (message.variant !== undefined) {
      obj.variant = Variant.toJSON(message.variant);
    }
    if (message.variantHash !== "") {
      obj.variantHash = message.variantHash;
    }
    if (message.status !== 0) {
      obj.status = testVariantStatusToJSON(message.status);
    }
    if (message.results?.length) {
      obj.results = message.results.map((e) => TestResultBundle.toJSON(e));
    }
    if (message.exonerations?.length) {
      obj.exonerations = message.exonerations.map((e) => TestExoneration.toJSON(e));
    }
    if (message.testMetadata !== undefined) {
      obj.testMetadata = TestMetadata.toJSON(message.testMetadata);
    }
    if (message.isMasked === true) {
      obj.isMasked = message.isMasked;
    }
    if (message.sourcesId !== "") {
      obj.sourcesId = message.sourcesId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TestVariant>, I>>(base?: I): TestVariant {
    return TestVariant.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TestVariant>, I>>(object: I): TestVariant {
    const message = createBaseTestVariant() as any;
    message.testId = object.testId ?? "";
    message.variant = (object.variant !== undefined && object.variant !== null)
      ? Variant.fromPartial(object.variant)
      : undefined;
    message.variantHash = object.variantHash ?? "";
    message.status = object.status ?? 0;
    message.results = object.results?.map((e) => TestResultBundle.fromPartial(e)) || [];
    message.exonerations = object.exonerations?.map((e) => TestExoneration.fromPartial(e)) || [];
    message.testMetadata = (object.testMetadata !== undefined && object.testMetadata !== null)
      ? TestMetadata.fromPartial(object.testMetadata)
      : undefined;
    message.isMasked = object.isMasked ?? false;
    message.sourcesId = object.sourcesId ?? "";
    return message;
  },
};

function createBaseTestResultBundle(): TestResultBundle {
  return { result: undefined };
}

export const TestResultBundle = {
  encode(message: TestResultBundle, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== undefined) {
      TestResult.encode(message.result, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TestResultBundle {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTestResultBundle() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.result = TestResult.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TestResultBundle {
    return { result: isSet(object.result) ? TestResult.fromJSON(object.result) : undefined };
  },

  toJSON(message: TestResultBundle): unknown {
    const obj: any = {};
    if (message.result !== undefined) {
      obj.result = TestResult.toJSON(message.result);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TestResultBundle>, I>>(base?: I): TestResultBundle {
    return TestResultBundle.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TestResultBundle>, I>>(object: I): TestResultBundle {
    const message = createBaseTestResultBundle() as any;
    message.result = (object.result !== undefined && object.result !== null)
      ? TestResult.fromPartial(object.result)
      : undefined;
    return message;
  },
};

function createBaseTestVariantPredicate(): TestVariantPredicate {
  return { status: 0 };
}

export const TestVariantPredicate = {
  encode(message: TestVariantPredicate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status !== 0) {
      writer.uint32(8).int32(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TestVariantPredicate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTestVariantPredicate() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TestVariantPredicate {
    return { status: isSet(object.status) ? testVariantStatusFromJSON(object.status) : 0 };
  },

  toJSON(message: TestVariantPredicate): unknown {
    const obj: any = {};
    if (message.status !== 0) {
      obj.status = testVariantStatusToJSON(message.status);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TestVariantPredicate>, I>>(base?: I): TestVariantPredicate {
    return TestVariantPredicate.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TestVariantPredicate>, I>>(object: I): TestVariantPredicate {
    const message = createBaseTestVariantPredicate() as any;
    message.status = object.status ?? 0;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}