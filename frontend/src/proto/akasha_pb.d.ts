import * as jspb from 'google-protobuf'



export class Flag extends jspb.Message {
  getId(): string;
  setId(value: string): Flag;

  getName(): string;
  setName(value: string): Flag;

  getType(): FlagType;
  setType(value: FlagType): Flag;

  getBoolValue(): boolean;
  setBoolValue(value: boolean): Flag;

  getStringValue(): string;
  setStringValue(value: string): Flag;

  getTargetingRulesList(): Array<TargetingRule>;
  setTargetingRulesList(value: Array<TargetingRule>): Flag;
  clearTargetingRulesList(): Flag;
  addTargetingRules(value?: TargetingRule, index?: number): TargetingRule;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Flag.AsObject;
  static toObject(includeInstance: boolean, msg: Flag): Flag.AsObject;
  static serializeBinaryToWriter(message: Flag, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Flag;
  static deserializeBinaryFromReader(message: Flag, reader: jspb.BinaryReader): Flag;
}

export namespace Flag {
  export type AsObject = {
    id: string,
    name: string,
    type: FlagType,
    boolValue: boolean,
    stringValue: string,
    targetingRulesList: Array<TargetingRule.AsObject>,
  }
}

export class TargetingRule extends jspb.Message {
  getAttribute(): string;
  setAttribute(value: string): TargetingRule;

  getOperator(): string;
  setOperator(value: string): TargetingRule;

  getValue(): string;
  setValue(value: string): TargetingRule;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TargetingRule.AsObject;
  static toObject(includeInstance: boolean, msg: TargetingRule): TargetingRule.AsObject;
  static serializeBinaryToWriter(message: TargetingRule, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TargetingRule;
  static deserializeBinaryFromReader(message: TargetingRule, reader: jspb.BinaryReader): TargetingRule;
}

export namespace TargetingRule {
  export type AsObject = {
    attribute: string,
    operator: string,
    value: string,
  }
}

export class CreateFlagRequest extends jspb.Message {
  getFlag(): Flag | undefined;
  setFlag(value?: Flag): CreateFlagRequest;
  hasFlag(): boolean;
  clearFlag(): CreateFlagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateFlagRequest): CreateFlagRequest.AsObject;
  static serializeBinaryToWriter(message: CreateFlagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateFlagRequest;
  static deserializeBinaryFromReader(message: CreateFlagRequest, reader: jspb.BinaryReader): CreateFlagRequest;
}

export namespace CreateFlagRequest {
  export type AsObject = {
    flag?: Flag.AsObject,
  }
}

export class CreateFlagResponse extends jspb.Message {
  getFlag(): Flag | undefined;
  setFlag(value?: Flag): CreateFlagResponse;
  hasFlag(): boolean;
  clearFlag(): CreateFlagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateFlagResponse): CreateFlagResponse.AsObject;
  static serializeBinaryToWriter(message: CreateFlagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateFlagResponse;
  static deserializeBinaryFromReader(message: CreateFlagResponse, reader: jspb.BinaryReader): CreateFlagResponse;
}

export namespace CreateFlagResponse {
  export type AsObject = {
    flag?: Flag.AsObject,
  }
}

export class GetFlagRequest extends jspb.Message {
  getId(): string;
  setId(value: string): GetFlagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFlagRequest): GetFlagRequest.AsObject;
  static serializeBinaryToWriter(message: GetFlagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFlagRequest;
  static deserializeBinaryFromReader(message: GetFlagRequest, reader: jspb.BinaryReader): GetFlagRequest;
}

export namespace GetFlagRequest {
  export type AsObject = {
    id: string,
  }
}

export class GetFlagResponse extends jspb.Message {
  getFlag(): Flag | undefined;
  setFlag(value?: Flag): GetFlagResponse;
  hasFlag(): boolean;
  clearFlag(): GetFlagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetFlagResponse): GetFlagResponse.AsObject;
  static serializeBinaryToWriter(message: GetFlagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFlagResponse;
  static deserializeBinaryFromReader(message: GetFlagResponse, reader: jspb.BinaryReader): GetFlagResponse;
}

export namespace GetFlagResponse {
  export type AsObject = {
    flag?: Flag.AsObject,
  }
}

export class UpdateFlagRequest extends jspb.Message {
  getFlag(): Flag | undefined;
  setFlag(value?: Flag): UpdateFlagRequest;
  hasFlag(): boolean;
  clearFlag(): UpdateFlagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateFlagRequest): UpdateFlagRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateFlagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateFlagRequest;
  static deserializeBinaryFromReader(message: UpdateFlagRequest, reader: jspb.BinaryReader): UpdateFlagRequest;
}

export namespace UpdateFlagRequest {
  export type AsObject = {
    flag?: Flag.AsObject,
  }
}

export class UpdateFlagResponse extends jspb.Message {
  getFlag(): Flag | undefined;
  setFlag(value?: Flag): UpdateFlagResponse;
  hasFlag(): boolean;
  clearFlag(): UpdateFlagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateFlagResponse): UpdateFlagResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateFlagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateFlagResponse;
  static deserializeBinaryFromReader(message: UpdateFlagResponse, reader: jspb.BinaryReader): UpdateFlagResponse;
}

export namespace UpdateFlagResponse {
  export type AsObject = {
    flag?: Flag.AsObject,
  }
}

export class DeleteFlagRequest extends jspb.Message {
  getId(): string;
  setId(value: string): DeleteFlagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteFlagRequest): DeleteFlagRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteFlagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteFlagRequest;
  static deserializeBinaryFromReader(message: DeleteFlagRequest, reader: jspb.BinaryReader): DeleteFlagRequest;
}

export namespace DeleteFlagRequest {
  export type AsObject = {
    id: string,
  }
}

export class DeleteFlagResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): DeleteFlagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteFlagResponse): DeleteFlagResponse.AsObject;
  static serializeBinaryToWriter(message: DeleteFlagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteFlagResponse;
  static deserializeBinaryFromReader(message: DeleteFlagResponse, reader: jspb.BinaryReader): DeleteFlagResponse;
}

export namespace DeleteFlagResponse {
  export type AsObject = {
    success: boolean,
  }
}

export class ListFlagsRequest extends jspb.Message {
  getPage(): number;
  setPage(value: number): ListFlagsRequest;

  getPageSize(): number;
  setPageSize(value: number): ListFlagsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListFlagsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListFlagsRequest): ListFlagsRequest.AsObject;
  static serializeBinaryToWriter(message: ListFlagsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListFlagsRequest;
  static deserializeBinaryFromReader(message: ListFlagsRequest, reader: jspb.BinaryReader): ListFlagsRequest;
}

export namespace ListFlagsRequest {
  export type AsObject = {
    page: number,
    pageSize: number,
  }
}

export class ListFlagsResponse extends jspb.Message {
  getFlagsList(): Array<Flag>;
  setFlagsList(value: Array<Flag>): ListFlagsResponse;
  clearFlagsList(): ListFlagsResponse;
  addFlags(value?: Flag, index?: number): Flag;

  getTotalCount(): number;
  setTotalCount(value: number): ListFlagsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListFlagsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListFlagsResponse): ListFlagsResponse.AsObject;
  static serializeBinaryToWriter(message: ListFlagsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListFlagsResponse;
  static deserializeBinaryFromReader(message: ListFlagsResponse, reader: jspb.BinaryReader): ListFlagsResponse;
}

export namespace ListFlagsResponse {
  export type AsObject = {
    flagsList: Array<Flag.AsObject>,
    totalCount: number,
  }
}

export class GetMetricsRequest extends jspb.Message {
  getFlagId(): string;
  setFlagId(value: string): GetMetricsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMetricsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetMetricsRequest): GetMetricsRequest.AsObject;
  static serializeBinaryToWriter(message: GetMetricsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMetricsRequest;
  static deserializeBinaryFromReader(message: GetMetricsRequest, reader: jspb.BinaryReader): GetMetricsRequest;
}

export namespace GetMetricsRequest {
  export type AsObject = {
    flagId: string,
  }
}

export class GetMetricsResponse extends jspb.Message {
  getTotalQueries(): number;
  setTotalQueries(value: number): GetMetricsResponse;

  getTrueCount(): number;
  setTrueCount(value: number): GetMetricsResponse;

  getFalseCount(): number;
  setFalseCount(value: number): GetMetricsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMetricsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMetricsResponse): GetMetricsResponse.AsObject;
  static serializeBinaryToWriter(message: GetMetricsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMetricsResponse;
  static deserializeBinaryFromReader(message: GetMetricsResponse, reader: jspb.BinaryReader): GetMetricsResponse;
}

export namespace GetMetricsResponse {
  export type AsObject = {
    totalQueries: number,
    trueCount: number,
    falseCount: number,
  }
}

export enum FlagType { 
  BOOL = 0,
  STRING = 1,
}
