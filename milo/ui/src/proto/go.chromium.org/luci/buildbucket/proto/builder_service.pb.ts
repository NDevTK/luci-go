/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Empty } from "../../../../google/protobuf/empty.pb";
import { Status } from "../../../../google/rpc/status.pb";
import { BuilderID, BuilderItem } from "./builder_common.pb";
import { HealthStatus } from "./common.pb";

export const protobufPackage = "buildbucket.v2";

/** A request message for GetBuilder rpc. */
export interface GetBuilderRequest {
  /** ID of the builder to return. */
  readonly id:
    | BuilderID
    | undefined;
  /**
   * Mask for which fields to include in the response.
   *
   * If not set, the default mask is CONFIG_ONLY.
   */
  readonly mask: BuilderMask | undefined;
}

/** A request message for ListBuilders. */
export interface ListBuildersRequest {
  /**
   * LUCI project, e.g. "chromium". Omit to list all builders.
   *
   * Required when bucket is specified.
   */
  readonly project: string;
  /**
   * A bucket in the project, e.g. "try".
   *
   * Omit to list all builders or all builders in a project.
   */
  readonly bucket: string;
  /**
   * The maximum number of builders to return.
   *
   * The service may return fewer than this value.
   * If unspecified, at most 100 builders will be returned.
   * The maximum value is 1000; values above 1000 will be coerced to 1000.
   */
  readonly pageSize: number;
  /**
   * A page token, received from a previous `ListBuilders` call.
   * Provide this to retrieve the subsequent page.
   *
   * When paginating, all other parameters provided to `ListBuilders` MUST
   * match the call that provided the page token.
   */
  readonly pageToken: string;
}

/** A response message for ListBuilders. */
export interface ListBuildersResponse {
  /** Matched builders. */
  readonly builders: readonly BuilderItem[];
  /**
   * A token, which can be sent as `page_token` to retrieve the next page.
   * If this field is omitted, there were no subsequent pages at the time of
   * request.
   * If the invocation is not finalized, more results may appear later.
   */
  readonly nextPageToken: string;
}

/** A request message for SetBuilderHealth RPC. */
export interface SetBuilderHealthRequest {
  readonly health: readonly SetBuilderHealthRequest_BuilderHealth[];
}

/**
 * BuilderHealth needs BuilderID so that SetBuilderHealth RPC can properly update
 * the Builder datastore entity with the updated HealthStatus.
 */
export interface SetBuilderHealthRequest_BuilderHealth {
  /**
   * Required. Builder to set the health score for.
   * You must have the 'buildbucket.builders.set_health' permission for
   * each of them.
   */
  readonly id:
    | BuilderID
    | undefined;
  /** Required. Health status of the builder. */
  readonly health: HealthStatus | undefined;
}

/** A response message for SetBuilderHealth RPC. */
export interface SetBuilderHealthResponse {
  /**
   * Responses should be empty protos or errors. They will map
   * directly with the repeated health fields from SetBuilderHealthRequest.
   */
  readonly responses: readonly SetBuilderHealthResponse_Response[];
}

export interface SetBuilderHealthResponse_Response {
  readonly result?: Empty | undefined;
  readonly error?: Status | undefined;
}

export interface BuilderMask {
  /** Type of mask to use to filter BuilderItem. */
  readonly type: BuilderMask_BuilderMaskType;
}

export enum BuilderMask_BuilderMaskType {
  UNSPECIFIED = 0,
  /** CONFIG_ONLY - Default. Returns ID + Config fields in BuilderItem. */
  CONFIG_ONLY = 1,
  /** ALL - Returns all fields in BuilderItem. */
  ALL = 2,
  /** METADATA_ONLY - Returns ID + METADATA fields in BuilderItem. */
  METADATA_ONLY = 3,
}

export function builderMask_BuilderMaskTypeFromJSON(object: any): BuilderMask_BuilderMaskType {
  switch (object) {
    case 0:
    case "BUILDER_MASK_TYPE_UNSPECIFIED":
      return BuilderMask_BuilderMaskType.UNSPECIFIED;
    case 1:
    case "CONFIG_ONLY":
      return BuilderMask_BuilderMaskType.CONFIG_ONLY;
    case 2:
    case "ALL":
      return BuilderMask_BuilderMaskType.ALL;
    case 3:
    case "METADATA_ONLY":
      return BuilderMask_BuilderMaskType.METADATA_ONLY;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum BuilderMask_BuilderMaskType");
  }
}

export function builderMask_BuilderMaskTypeToJSON(object: BuilderMask_BuilderMaskType): string {
  switch (object) {
    case BuilderMask_BuilderMaskType.UNSPECIFIED:
      return "BUILDER_MASK_TYPE_UNSPECIFIED";
    case BuilderMask_BuilderMaskType.CONFIG_ONLY:
      return "CONFIG_ONLY";
    case BuilderMask_BuilderMaskType.ALL:
      return "ALL";
    case BuilderMask_BuilderMaskType.METADATA_ONLY:
      return "METADATA_ONLY";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum BuilderMask_BuilderMaskType");
  }
}

function createBaseGetBuilderRequest(): GetBuilderRequest {
  return { id: undefined, mask: undefined };
}

export const GetBuilderRequest = {
  encode(message: GetBuilderRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== undefined) {
      BuilderID.encode(message.id, writer.uint32(10).fork()).ldelim();
    }
    if (message.mask !== undefined) {
      BuilderMask.encode(message.mask, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetBuilderRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetBuilderRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = BuilderID.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.mask = BuilderMask.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetBuilderRequest {
    return {
      id: isSet(object.id) ? BuilderID.fromJSON(object.id) : undefined,
      mask: isSet(object.mask) ? BuilderMask.fromJSON(object.mask) : undefined,
    };
  },

  toJSON(message: GetBuilderRequest): unknown {
    const obj: any = {};
    if (message.id !== undefined) {
      obj.id = BuilderID.toJSON(message.id);
    }
    if (message.mask !== undefined) {
      obj.mask = BuilderMask.toJSON(message.mask);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetBuilderRequest>, I>>(base?: I): GetBuilderRequest {
    return GetBuilderRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetBuilderRequest>, I>>(object: I): GetBuilderRequest {
    const message = createBaseGetBuilderRequest() as any;
    message.id = (object.id !== undefined && object.id !== null) ? BuilderID.fromPartial(object.id) : undefined;
    message.mask = (object.mask !== undefined && object.mask !== null)
      ? BuilderMask.fromPartial(object.mask)
      : undefined;
    return message;
  },
};

function createBaseListBuildersRequest(): ListBuildersRequest {
  return { project: "", bucket: "", pageSize: 0, pageToken: "" };
}

export const ListBuildersRequest = {
  encode(message: ListBuildersRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.project !== "") {
      writer.uint32(10).string(message.project);
    }
    if (message.bucket !== "") {
      writer.uint32(18).string(message.bucket);
    }
    if (message.pageSize !== 0) {
      writer.uint32(24).int32(message.pageSize);
    }
    if (message.pageToken !== "") {
      writer.uint32(34).string(message.pageToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListBuildersRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListBuildersRequest() as any;
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

          message.bucket = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.pageSize = reader.int32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.pageToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListBuildersRequest {
    return {
      project: isSet(object.project) ? globalThis.String(object.project) : "",
      bucket: isSet(object.bucket) ? globalThis.String(object.bucket) : "",
      pageSize: isSet(object.pageSize) ? globalThis.Number(object.pageSize) : 0,
      pageToken: isSet(object.pageToken) ? globalThis.String(object.pageToken) : "",
    };
  },

  toJSON(message: ListBuildersRequest): unknown {
    const obj: any = {};
    if (message.project !== "") {
      obj.project = message.project;
    }
    if (message.bucket !== "") {
      obj.bucket = message.bucket;
    }
    if (message.pageSize !== 0) {
      obj.pageSize = Math.round(message.pageSize);
    }
    if (message.pageToken !== "") {
      obj.pageToken = message.pageToken;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ListBuildersRequest>, I>>(base?: I): ListBuildersRequest {
    return ListBuildersRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ListBuildersRequest>, I>>(object: I): ListBuildersRequest {
    const message = createBaseListBuildersRequest() as any;
    message.project = object.project ?? "";
    message.bucket = object.bucket ?? "";
    message.pageSize = object.pageSize ?? 0;
    message.pageToken = object.pageToken ?? "";
    return message;
  },
};

function createBaseListBuildersResponse(): ListBuildersResponse {
  return { builders: [], nextPageToken: "" };
}

export const ListBuildersResponse = {
  encode(message: ListBuildersResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.builders) {
      BuilderItem.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.nextPageToken !== "") {
      writer.uint32(18).string(message.nextPageToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListBuildersResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListBuildersResponse() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.builders.push(BuilderItem.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.nextPageToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListBuildersResponse {
    return {
      builders: globalThis.Array.isArray(object?.builders)
        ? object.builders.map((e: any) => BuilderItem.fromJSON(e))
        : [],
      nextPageToken: isSet(object.nextPageToken) ? globalThis.String(object.nextPageToken) : "",
    };
  },

  toJSON(message: ListBuildersResponse): unknown {
    const obj: any = {};
    if (message.builders?.length) {
      obj.builders = message.builders.map((e) => BuilderItem.toJSON(e));
    }
    if (message.nextPageToken !== "") {
      obj.nextPageToken = message.nextPageToken;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ListBuildersResponse>, I>>(base?: I): ListBuildersResponse {
    return ListBuildersResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ListBuildersResponse>, I>>(object: I): ListBuildersResponse {
    const message = createBaseListBuildersResponse() as any;
    message.builders = object.builders?.map((e) => BuilderItem.fromPartial(e)) || [];
    message.nextPageToken = object.nextPageToken ?? "";
    return message;
  },
};

function createBaseSetBuilderHealthRequest(): SetBuilderHealthRequest {
  return { health: [] };
}

export const SetBuilderHealthRequest = {
  encode(message: SetBuilderHealthRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.health) {
      SetBuilderHealthRequest_BuilderHealth.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetBuilderHealthRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetBuilderHealthRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.health.push(SetBuilderHealthRequest_BuilderHealth.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SetBuilderHealthRequest {
    return {
      health: globalThis.Array.isArray(object?.health)
        ? object.health.map((e: any) => SetBuilderHealthRequest_BuilderHealth.fromJSON(e))
        : [],
    };
  },

  toJSON(message: SetBuilderHealthRequest): unknown {
    const obj: any = {};
    if (message.health?.length) {
      obj.health = message.health.map((e) => SetBuilderHealthRequest_BuilderHealth.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SetBuilderHealthRequest>, I>>(base?: I): SetBuilderHealthRequest {
    return SetBuilderHealthRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SetBuilderHealthRequest>, I>>(object: I): SetBuilderHealthRequest {
    const message = createBaseSetBuilderHealthRequest() as any;
    message.health = object.health?.map((e) => SetBuilderHealthRequest_BuilderHealth.fromPartial(e)) || [];
    return message;
  },
};

function createBaseSetBuilderHealthRequest_BuilderHealth(): SetBuilderHealthRequest_BuilderHealth {
  return { id: undefined, health: undefined };
}

export const SetBuilderHealthRequest_BuilderHealth = {
  encode(message: SetBuilderHealthRequest_BuilderHealth, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== undefined) {
      BuilderID.encode(message.id, writer.uint32(10).fork()).ldelim();
    }
    if (message.health !== undefined) {
      HealthStatus.encode(message.health, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetBuilderHealthRequest_BuilderHealth {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetBuilderHealthRequest_BuilderHealth() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = BuilderID.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.health = HealthStatus.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SetBuilderHealthRequest_BuilderHealth {
    return {
      id: isSet(object.id) ? BuilderID.fromJSON(object.id) : undefined,
      health: isSet(object.health) ? HealthStatus.fromJSON(object.health) : undefined,
    };
  },

  toJSON(message: SetBuilderHealthRequest_BuilderHealth): unknown {
    const obj: any = {};
    if (message.id !== undefined) {
      obj.id = BuilderID.toJSON(message.id);
    }
    if (message.health !== undefined) {
      obj.health = HealthStatus.toJSON(message.health);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SetBuilderHealthRequest_BuilderHealth>, I>>(
    base?: I,
  ): SetBuilderHealthRequest_BuilderHealth {
    return SetBuilderHealthRequest_BuilderHealth.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SetBuilderHealthRequest_BuilderHealth>, I>>(
    object: I,
  ): SetBuilderHealthRequest_BuilderHealth {
    const message = createBaseSetBuilderHealthRequest_BuilderHealth() as any;
    message.id = (object.id !== undefined && object.id !== null) ? BuilderID.fromPartial(object.id) : undefined;
    message.health = (object.health !== undefined && object.health !== null)
      ? HealthStatus.fromPartial(object.health)
      : undefined;
    return message;
  },
};

function createBaseSetBuilderHealthResponse(): SetBuilderHealthResponse {
  return { responses: [] };
}

export const SetBuilderHealthResponse = {
  encode(message: SetBuilderHealthResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.responses) {
      SetBuilderHealthResponse_Response.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetBuilderHealthResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetBuilderHealthResponse() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.responses.push(SetBuilderHealthResponse_Response.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SetBuilderHealthResponse {
    return {
      responses: globalThis.Array.isArray(object?.responses)
        ? object.responses.map((e: any) => SetBuilderHealthResponse_Response.fromJSON(e))
        : [],
    };
  },

  toJSON(message: SetBuilderHealthResponse): unknown {
    const obj: any = {};
    if (message.responses?.length) {
      obj.responses = message.responses.map((e) => SetBuilderHealthResponse_Response.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SetBuilderHealthResponse>, I>>(base?: I): SetBuilderHealthResponse {
    return SetBuilderHealthResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SetBuilderHealthResponse>, I>>(object: I): SetBuilderHealthResponse {
    const message = createBaseSetBuilderHealthResponse() as any;
    message.responses = object.responses?.map((e) => SetBuilderHealthResponse_Response.fromPartial(e)) || [];
    return message;
  },
};

function createBaseSetBuilderHealthResponse_Response(): SetBuilderHealthResponse_Response {
  return { result: undefined, error: undefined };
}

export const SetBuilderHealthResponse_Response = {
  encode(message: SetBuilderHealthResponse_Response, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== undefined) {
      Empty.encode(message.result, writer.uint32(10).fork()).ldelim();
    }
    if (message.error !== undefined) {
      Status.encode(message.error, writer.uint32(802).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetBuilderHealthResponse_Response {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetBuilderHealthResponse_Response() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.result = Empty.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 802) {
            break;
          }

          message.error = Status.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SetBuilderHealthResponse_Response {
    return {
      result: isSet(object.result) ? Empty.fromJSON(object.result) : undefined,
      error: isSet(object.error) ? Status.fromJSON(object.error) : undefined,
    };
  },

  toJSON(message: SetBuilderHealthResponse_Response): unknown {
    const obj: any = {};
    if (message.result !== undefined) {
      obj.result = Empty.toJSON(message.result);
    }
    if (message.error !== undefined) {
      obj.error = Status.toJSON(message.error);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SetBuilderHealthResponse_Response>, I>>(
    base?: I,
  ): SetBuilderHealthResponse_Response {
    return SetBuilderHealthResponse_Response.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SetBuilderHealthResponse_Response>, I>>(
    object: I,
  ): SetBuilderHealthResponse_Response {
    const message = createBaseSetBuilderHealthResponse_Response() as any;
    message.result = (object.result !== undefined && object.result !== null)
      ? Empty.fromPartial(object.result)
      : undefined;
    message.error = (object.error !== undefined && object.error !== null)
      ? Status.fromPartial(object.error)
      : undefined;
    return message;
  },
};

function createBaseBuilderMask(): BuilderMask {
  return { type: 0 };
}

export const BuilderMask = {
  encode(message: BuilderMask, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BuilderMask {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBuilderMask() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BuilderMask {
    return { type: isSet(object.type) ? builderMask_BuilderMaskTypeFromJSON(object.type) : 0 };
  },

  toJSON(message: BuilderMask): unknown {
    const obj: any = {};
    if (message.type !== 0) {
      obj.type = builderMask_BuilderMaskTypeToJSON(message.type);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BuilderMask>, I>>(base?: I): BuilderMask {
    return BuilderMask.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BuilderMask>, I>>(object: I): BuilderMask {
    const message = createBaseBuilderMask() as any;
    message.type = object.type ?? 0;
    return message;
  },
};

/** Provides preconfigured builders. */
export interface Builders {
  /** Looks up one builder. */
  GetBuilder(request: GetBuilderRequest): Promise<BuilderItem>;
  /** Lists all builders of a project or a bucket. */
  ListBuilders(request: ListBuildersRequest): Promise<ListBuildersResponse>;
  /** SetBuilderHealth allows a Builder's health to be set. */
  SetBuilderHealth(request: SetBuilderHealthRequest): Promise<SetBuilderHealthResponse>;
}

export const BuildersServiceName = "buildbucket.v2.Builders";
export class BuildersClientImpl implements Builders {
  static readonly DEFAULT_SERVICE = BuildersServiceName;
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || BuildersServiceName;
    this.rpc = rpc;
    this.GetBuilder = this.GetBuilder.bind(this);
    this.ListBuilders = this.ListBuilders.bind(this);
    this.SetBuilderHealth = this.SetBuilderHealth.bind(this);
  }
  GetBuilder(request: GetBuilderRequest): Promise<BuilderItem> {
    const data = GetBuilderRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetBuilder", data);
    return promise.then((data) => BuilderItem.decode(_m0.Reader.create(data)));
  }

  ListBuilders(request: ListBuildersRequest): Promise<ListBuildersResponse> {
    const data = ListBuildersRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ListBuilders", data);
    return promise.then((data) => ListBuildersResponse.decode(_m0.Reader.create(data)));
  }

  SetBuilderHealth(request: SetBuilderHealthRequest): Promise<SetBuilderHealthResponse> {
    const data = SetBuilderHealthRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "SetBuilderHealth", data);
    return promise.then((data) => SetBuilderHealthResponse.decode(_m0.Reader.create(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}