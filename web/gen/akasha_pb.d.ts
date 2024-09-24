// package: akasha
// file: akasha.proto

import * as jspb from "google-protobuf";

export class Condition extends jspb.Message {
  getAttribute(): string;
  setAttribute(value: string): void;

  getOperator(): OperatorMap[keyof OperatorMap];
  setOperator(value: OperatorMap[keyof OperatorMap]): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Condition.AsObject;
  static toObject(includeInstance: boolean, msg: Condition): Condition.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Condition, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Condition;
  static deserializeBinaryFromReader(message: Condition, reader: jspb.BinaryReader): Condition;
}

export namespace Condition {
  export type AsObject = {
    attribute: string,
    operator: OperatorMap[keyof OperatorMap],
    value: string,
  }
}

export class BoolTargetingRule extends jspb.Message {
  clearConditionsList(): void;
  getConditionsList(): Array<Condition>;
  setConditionsList(value: Array<Condition>): void;
  addConditions(value?: Condition, index?: number): Condition;

  getVariant(): boolean;
  setVariant(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BoolTargetingRule.AsObject;
  static toObject(includeInstance: boolean, msg: BoolTargetingRule): BoolTargetingRule.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BoolTargetingRule, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BoolTargetingRule;
  static deserializeBinaryFromReader(message: BoolTargetingRule, reader: jspb.BinaryReader): BoolTargetingRule;
}

export namespace BoolTargetingRule {
  export type AsObject = {
    conditionsList: Array<Condition.AsObject>,
    variant: boolean,
  }
}

export class StringTargetingRule extends jspb.Message {
  clearConditionsList(): void;
  getConditionsList(): Array<Condition>;
  setConditionsList(value: Array<Condition>): void;
  addConditions(value?: Condition, index?: number): Condition;

  getVariant(): string;
  setVariant(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StringTargetingRule.AsObject;
  static toObject(includeInstance: boolean, msg: StringTargetingRule): StringTargetingRule.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StringTargetingRule, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StringTargetingRule;
  static deserializeBinaryFromReader(message: StringTargetingRule, reader: jspb.BinaryReader): StringTargetingRule;
}

export namespace StringTargetingRule {
  export type AsObject = {
    conditionsList: Array<Condition.AsObject>,
    variant: string,
  }
}

export class Context extends jspb.Message {
  getAttributesMap(): jspb.Map<string, string>;
  clearAttributesMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Context.AsObject;
  static toObject(includeInstance: boolean, msg: Context): Context.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Context, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Context;
  static deserializeBinaryFromReader(message: Context, reader: jspb.BinaryReader): Context;
}

export namespace Context {
  export type AsObject = {
    attributesMap: Array<[string, string]>,
  }
}

export class BoolFlag extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getEnabled(): boolean;
  setEnabled(value: boolean): void;

  getDefaultValue(): boolean;
  setDefaultValue(value: boolean): void;

  clearTargetingRulesList(): void;
  getTargetingRulesList(): Array<BoolTargetingRule>;
  setTargetingRulesList(value: Array<BoolTargetingRule>): void;
  addTargetingRules(value?: BoolTargetingRule, index?: number): BoolTargetingRule;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BoolFlag.AsObject;
  static toObject(includeInstance: boolean, msg: BoolFlag): BoolFlag.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BoolFlag, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BoolFlag;
  static deserializeBinaryFromReader(message: BoolFlag, reader: jspb.BinaryReader): BoolFlag;
}

export namespace BoolFlag {
  export type AsObject = {
    id: string,
    name: string,
    enabled: boolean,
    defaultValue: boolean,
    targetingRulesList: Array<BoolTargetingRule.AsObject>,
  }
}

export class StringFlag extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getEnabled(): boolean;
  setEnabled(value: boolean): void;

  getDefaultValue(): string;
  setDefaultValue(value: string): void;

  clearVariantsList(): void;
  getVariantsList(): Array<string>;
  setVariantsList(value: Array<string>): void;
  addVariants(value: string, index?: number): string;

  clearTargetingRulesList(): void;
  getTargetingRulesList(): Array<StringTargetingRule>;
  setTargetingRulesList(value: Array<StringTargetingRule>): void;
  addTargetingRules(value?: StringTargetingRule, index?: number): StringTargetingRule;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StringFlag.AsObject;
  static toObject(includeInstance: boolean, msg: StringFlag): StringFlag.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StringFlag, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StringFlag;
  static deserializeBinaryFromReader(message: StringFlag, reader: jspb.BinaryReader): StringFlag;
}

export namespace StringFlag {
  export type AsObject = {
    id: string,
    name: string,
    enabled: boolean,
    defaultValue: string,
    variantsList: Array<string>,
    targetingRulesList: Array<StringTargetingRule.AsObject>,
  }
}

export class CreateBoolFlagRequest extends jspb.Message {
  hasFlag(): boolean;
  clearFlag(): void;
  getFlag(): BoolFlag | undefined;
  setFlag(value?: BoolFlag): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateBoolFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateBoolFlagRequest): CreateBoolFlagRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateBoolFlagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateBoolFlagRequest;
  static deserializeBinaryFromReader(message: CreateBoolFlagRequest, reader: jspb.BinaryReader): CreateBoolFlagRequest;
}

export namespace CreateBoolFlagRequest {
  export type AsObject = {
    flag?: BoolFlag.AsObject,
  }
}

export class CreateBoolFlagResponse extends jspb.Message {
  hasFlag(): boolean;
  clearFlag(): void;
  getFlag(): BoolFlag | undefined;
  setFlag(value?: BoolFlag): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateBoolFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateBoolFlagResponse): CreateBoolFlagResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateBoolFlagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateBoolFlagResponse;
  static deserializeBinaryFromReader(message: CreateBoolFlagResponse, reader: jspb.BinaryReader): CreateBoolFlagResponse;
}

export namespace CreateBoolFlagResponse {
  export type AsObject = {
    flag?: BoolFlag.AsObject,
  }
}

export class GetBoolFlagRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBoolFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBoolFlagRequest): GetBoolFlagRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBoolFlagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBoolFlagRequest;
  static deserializeBinaryFromReader(message: GetBoolFlagRequest, reader: jspb.BinaryReader): GetBoolFlagRequest;
}

export namespace GetBoolFlagRequest {
  export type AsObject = {
    id: string,
  }
}

export class GetBoolFlagResponse extends jspb.Message {
  hasFlag(): boolean;
  clearFlag(): void;
  getFlag(): BoolFlag | undefined;
  setFlag(value?: BoolFlag): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBoolFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetBoolFlagResponse): GetBoolFlagResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBoolFlagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBoolFlagResponse;
  static deserializeBinaryFromReader(message: GetBoolFlagResponse, reader: jspb.BinaryReader): GetBoolFlagResponse;
}

export namespace GetBoolFlagResponse {
  export type AsObject = {
    flag?: BoolFlag.AsObject,
  }
}

export class UpdateBoolFlagRequest extends jspb.Message {
  hasFlag(): boolean;
  clearFlag(): void;
  getFlag(): BoolFlag | undefined;
  setFlag(value?: BoolFlag): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateBoolFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateBoolFlagRequest): UpdateBoolFlagRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateBoolFlagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateBoolFlagRequest;
  static deserializeBinaryFromReader(message: UpdateBoolFlagRequest, reader: jspb.BinaryReader): UpdateBoolFlagRequest;
}

export namespace UpdateBoolFlagRequest {
  export type AsObject = {
    flag?: BoolFlag.AsObject,
  }
}

export class UpdateBoolFlagResponse extends jspb.Message {
  hasFlag(): boolean;
  clearFlag(): void;
  getFlag(): BoolFlag | undefined;
  setFlag(value?: BoolFlag): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateBoolFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateBoolFlagResponse): UpdateBoolFlagResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateBoolFlagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateBoolFlagResponse;
  static deserializeBinaryFromReader(message: UpdateBoolFlagResponse, reader: jspb.BinaryReader): UpdateBoolFlagResponse;
}

export namespace UpdateBoolFlagResponse {
  export type AsObject = {
    flag?: BoolFlag.AsObject,
  }
}

export class CreateStringFlagRequest extends jspb.Message {
  hasFlag(): boolean;
  clearFlag(): void;
  getFlag(): StringFlag | undefined;
  setFlag(value?: StringFlag): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateStringFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateStringFlagRequest): CreateStringFlagRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateStringFlagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateStringFlagRequest;
  static deserializeBinaryFromReader(message: CreateStringFlagRequest, reader: jspb.BinaryReader): CreateStringFlagRequest;
}

export namespace CreateStringFlagRequest {
  export type AsObject = {
    flag?: StringFlag.AsObject,
  }
}

export class CreateStringFlagResponse extends jspb.Message {
  hasFlag(): boolean;
  clearFlag(): void;
  getFlag(): StringFlag | undefined;
  setFlag(value?: StringFlag): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateStringFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateStringFlagResponse): CreateStringFlagResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateStringFlagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateStringFlagResponse;
  static deserializeBinaryFromReader(message: CreateStringFlagResponse, reader: jspb.BinaryReader): CreateStringFlagResponse;
}

export namespace CreateStringFlagResponse {
  export type AsObject = {
    flag?: StringFlag.AsObject,
  }
}

export class GetStringFlagRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStringFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetStringFlagRequest): GetStringFlagRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetStringFlagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetStringFlagRequest;
  static deserializeBinaryFromReader(message: GetStringFlagRequest, reader: jspb.BinaryReader): GetStringFlagRequest;
}

export namespace GetStringFlagRequest {
  export type AsObject = {
    id: string,
  }
}

export class GetStringFlagResponse extends jspb.Message {
  hasFlag(): boolean;
  clearFlag(): void;
  getFlag(): StringFlag | undefined;
  setFlag(value?: StringFlag): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStringFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetStringFlagResponse): GetStringFlagResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetStringFlagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetStringFlagResponse;
  static deserializeBinaryFromReader(message: GetStringFlagResponse, reader: jspb.BinaryReader): GetStringFlagResponse;
}

export namespace GetStringFlagResponse {
  export type AsObject = {
    flag?: StringFlag.AsObject,
  }
}

export class UpdateStringFlagRequest extends jspb.Message {
  hasFlag(): boolean;
  clearFlag(): void;
  getFlag(): StringFlag | undefined;
  setFlag(value?: StringFlag): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateStringFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateStringFlagRequest): UpdateStringFlagRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateStringFlagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateStringFlagRequest;
  static deserializeBinaryFromReader(message: UpdateStringFlagRequest, reader: jspb.BinaryReader): UpdateStringFlagRequest;
}

export namespace UpdateStringFlagRequest {
  export type AsObject = {
    flag?: StringFlag.AsObject,
  }
}

export class UpdateStringFlagResponse extends jspb.Message {
  hasFlag(): boolean;
  clearFlag(): void;
  getFlag(): StringFlag | undefined;
  setFlag(value?: StringFlag): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateStringFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateStringFlagResponse): UpdateStringFlagResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateStringFlagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateStringFlagResponse;
  static deserializeBinaryFromReader(message: UpdateStringFlagResponse, reader: jspb.BinaryReader): UpdateStringFlagResponse;
}

export namespace UpdateStringFlagResponse {
  export type AsObject = {
    flag?: StringFlag.AsObject,
  }
}

export class DeleteFlagRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteFlagRequest): DeleteFlagRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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
  setSuccess(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteFlagResponse): DeleteFlagResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteFlagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteFlagResponse;
  static deserializeBinaryFromReader(message: DeleteFlagResponse, reader: jspb.BinaryReader): DeleteFlagResponse;
}

export namespace DeleteFlagResponse {
  export type AsObject = {
    success: boolean,
  }
}

export class ListBoolFlagsRequest extends jspb.Message {
  getPage(): number;
  setPage(value: number): void;

  getPageSize(): number;
  setPageSize(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListBoolFlagsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListBoolFlagsRequest): ListBoolFlagsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListBoolFlagsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListBoolFlagsRequest;
  static deserializeBinaryFromReader(message: ListBoolFlagsRequest, reader: jspb.BinaryReader): ListBoolFlagsRequest;
}

export namespace ListBoolFlagsRequest {
  export type AsObject = {
    page: number,
    pageSize: number,
  }
}

export class ListBoolFlagsResponse extends jspb.Message {
  clearFlagsList(): void;
  getFlagsList(): Array<BoolFlag>;
  setFlagsList(value: Array<BoolFlag>): void;
  addFlags(value?: BoolFlag, index?: number): BoolFlag;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListBoolFlagsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListBoolFlagsResponse): ListBoolFlagsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListBoolFlagsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListBoolFlagsResponse;
  static deserializeBinaryFromReader(message: ListBoolFlagsResponse, reader: jspb.BinaryReader): ListBoolFlagsResponse;
}

export namespace ListBoolFlagsResponse {
  export type AsObject = {
    flagsList: Array<BoolFlag.AsObject>,
    totalCount: number,
  }
}

export class ListStringFlagsRequest extends jspb.Message {
  getPage(): number;
  setPage(value: number): void;

  getPageSize(): number;
  setPageSize(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListStringFlagsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListStringFlagsRequest): ListStringFlagsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListStringFlagsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListStringFlagsRequest;
  static deserializeBinaryFromReader(message: ListStringFlagsRequest, reader: jspb.BinaryReader): ListStringFlagsRequest;
}

export namespace ListStringFlagsRequest {
  export type AsObject = {
    page: number,
    pageSize: number,
  }
}

export class ListStringFlagsResponse extends jspb.Message {
  clearFlagsList(): void;
  getFlagsList(): Array<StringFlag>;
  setFlagsList(value: Array<StringFlag>): void;
  addFlags(value?: StringFlag, index?: number): StringFlag;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListStringFlagsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListStringFlagsResponse): ListStringFlagsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListStringFlagsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListStringFlagsResponse;
  static deserializeBinaryFromReader(message: ListStringFlagsResponse, reader: jspb.BinaryReader): ListStringFlagsResponse;
}

export namespace ListStringFlagsResponse {
  export type AsObject = {
    flagsList: Array<StringFlag.AsObject>,
    totalCount: number,
  }
}

export class GetMetricsRequest extends jspb.Message {
  getFlagId(): string;
  setFlagId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMetricsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetMetricsRequest): GetMetricsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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
  setTotalQueries(value: number): void;

  getTrueCount(): number;
  setTrueCount(value: number): void;

  getFalseCount(): number;
  setFalseCount(value: number): void;

  getVariantCountsMap(): jspb.Map<string, number>;
  clearVariantCountsMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMetricsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMetricsResponse): GetMetricsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetMetricsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMetricsResponse;
  static deserializeBinaryFromReader(message: GetMetricsResponse, reader: jspb.BinaryReader): GetMetricsResponse;
}

export namespace GetMetricsResponse {
  export type AsObject = {
    totalQueries: number,
    trueCount: number,
    falseCount: number,
    variantCountsMap: Array<[string, number]>,
  }
}

export class EvaluateBoolFlagRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  hasContext(): boolean;
  clearContext(): void;
  getContext(): Context | undefined;
  setContext(value?: Context): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvaluateBoolFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EvaluateBoolFlagRequest): EvaluateBoolFlagRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EvaluateBoolFlagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EvaluateBoolFlagRequest;
  static deserializeBinaryFromReader(message: EvaluateBoolFlagRequest, reader: jspb.BinaryReader): EvaluateBoolFlagRequest;
}

export namespace EvaluateBoolFlagRequest {
  export type AsObject = {
    id: string,
    context?: Context.AsObject,
  }
}

export class EvaluateBoolFlagResponse extends jspb.Message {
  getValue(): boolean;
  setValue(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvaluateBoolFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: EvaluateBoolFlagResponse): EvaluateBoolFlagResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EvaluateBoolFlagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EvaluateBoolFlagResponse;
  static deserializeBinaryFromReader(message: EvaluateBoolFlagResponse, reader: jspb.BinaryReader): EvaluateBoolFlagResponse;
}

export namespace EvaluateBoolFlagResponse {
  export type AsObject = {
    value: boolean,
  }
}

export class EvaluateStringFlagRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  hasContext(): boolean;
  clearContext(): void;
  getContext(): Context | undefined;
  setContext(value?: Context): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvaluateStringFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EvaluateStringFlagRequest): EvaluateStringFlagRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EvaluateStringFlagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EvaluateStringFlagRequest;
  static deserializeBinaryFromReader(message: EvaluateStringFlagRequest, reader: jspb.BinaryReader): EvaluateStringFlagRequest;
}

export namespace EvaluateStringFlagRequest {
  export type AsObject = {
    id: string,
    context?: Context.AsObject,
  }
}

export class EvaluateStringFlagResponse extends jspb.Message {
  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvaluateStringFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: EvaluateStringFlagResponse): EvaluateStringFlagResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EvaluateStringFlagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EvaluateStringFlagResponse;
  static deserializeBinaryFromReader(message: EvaluateStringFlagResponse, reader: jspb.BinaryReader): EvaluateStringFlagResponse;
}

export namespace EvaluateStringFlagResponse {
  export type AsObject = {
    value: string,
  }
}

export interface OperatorMap {
  EQUALS: 0;
  NOT_EQUALS: 1;
  CONTAINS: 2;
  NOT_CONTAINS: 3;
  GREATER_THAN: 4;
  LESS_THAN: 5;
}

export const Operator: OperatorMap;

