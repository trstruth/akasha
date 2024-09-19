import * as jspb from 'google-protobuf'



export class Condition extends jspb.Message {
  getAttribute(): string;
  setAttribute(value: string): Condition;

  getOperator(): Operator;
  setOperator(value: Operator): Condition;

  getValue(): string;
  setValue(value: string): Condition;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Condition.AsObject;
  static toObject(includeInstance: boolean, msg: Condition): Condition.AsObject;
  static serializeBinaryToWriter(message: Condition, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Condition;
  static deserializeBinaryFromReader(message: Condition, reader: jspb.BinaryReader): Condition;
}

export namespace Condition {
  export type AsObject = {
    attribute: string,
    operator: Operator,
    value: string,
  }
}

export class BoolTargetingRule extends jspb.Message {
  getConditionsList(): Array<Condition>;
  setConditionsList(value: Array<Condition>): BoolTargetingRule;
  clearConditionsList(): BoolTargetingRule;
  addConditions(value?: Condition, index?: number): Condition;

  getVariant(): boolean;
  setVariant(value: boolean): BoolTargetingRule;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BoolTargetingRule.AsObject;
  static toObject(includeInstance: boolean, msg: BoolTargetingRule): BoolTargetingRule.AsObject;
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
  getConditionsList(): Array<Condition>;
  setConditionsList(value: Array<Condition>): StringTargetingRule;
  clearConditionsList(): StringTargetingRule;
  addConditions(value?: Condition, index?: number): Condition;

  getVariant(): string;
  setVariant(value: string): StringTargetingRule;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StringTargetingRule.AsObject;
  static toObject(includeInstance: boolean, msg: StringTargetingRule): StringTargetingRule.AsObject;
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
  clearAttributesMap(): Context;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Context.AsObject;
  static toObject(includeInstance: boolean, msg: Context): Context.AsObject;
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
  setId(value: string): BoolFlag;

  getName(): string;
  setName(value: string): BoolFlag;

  getEnabled(): boolean;
  setEnabled(value: boolean): BoolFlag;

  getDefaultValue(): boolean;
  setDefaultValue(value: boolean): BoolFlag;

  getTargetingRulesList(): Array<BoolTargetingRule>;
  setTargetingRulesList(value: Array<BoolTargetingRule>): BoolFlag;
  clearTargetingRulesList(): BoolFlag;
  addTargetingRules(value?: BoolTargetingRule, index?: number): BoolTargetingRule;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BoolFlag.AsObject;
  static toObject(includeInstance: boolean, msg: BoolFlag): BoolFlag.AsObject;
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
  setId(value: string): StringFlag;

  getName(): string;
  setName(value: string): StringFlag;

  getEnabled(): boolean;
  setEnabled(value: boolean): StringFlag;

  getDefaultValue(): string;
  setDefaultValue(value: string): StringFlag;

  getVariantsList(): Array<string>;
  setVariantsList(value: Array<string>): StringFlag;
  clearVariantsList(): StringFlag;
  addVariants(value: string, index?: number): StringFlag;

  getTargetingRulesList(): Array<StringTargetingRule>;
  setTargetingRulesList(value: Array<StringTargetingRule>): StringFlag;
  clearTargetingRulesList(): StringFlag;
  addTargetingRules(value?: StringTargetingRule, index?: number): StringTargetingRule;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StringFlag.AsObject;
  static toObject(includeInstance: boolean, msg: StringFlag): StringFlag.AsObject;
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
  getFlag(): BoolFlag | undefined;
  setFlag(value?: BoolFlag): CreateBoolFlagRequest;
  hasFlag(): boolean;
  clearFlag(): CreateBoolFlagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateBoolFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateBoolFlagRequest): CreateBoolFlagRequest.AsObject;
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
  getFlag(): BoolFlag | undefined;
  setFlag(value?: BoolFlag): CreateBoolFlagResponse;
  hasFlag(): boolean;
  clearFlag(): CreateBoolFlagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateBoolFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateBoolFlagResponse): CreateBoolFlagResponse.AsObject;
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
  setId(value: string): GetBoolFlagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBoolFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBoolFlagRequest): GetBoolFlagRequest.AsObject;
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
  getFlag(): BoolFlag | undefined;
  setFlag(value?: BoolFlag): GetBoolFlagResponse;
  hasFlag(): boolean;
  clearFlag(): GetBoolFlagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBoolFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetBoolFlagResponse): GetBoolFlagResponse.AsObject;
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
  getFlag(): BoolFlag | undefined;
  setFlag(value?: BoolFlag): UpdateBoolFlagRequest;
  hasFlag(): boolean;
  clearFlag(): UpdateBoolFlagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateBoolFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateBoolFlagRequest): UpdateBoolFlagRequest.AsObject;
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
  getFlag(): BoolFlag | undefined;
  setFlag(value?: BoolFlag): UpdateBoolFlagResponse;
  hasFlag(): boolean;
  clearFlag(): UpdateBoolFlagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateBoolFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateBoolFlagResponse): UpdateBoolFlagResponse.AsObject;
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
  getFlag(): StringFlag | undefined;
  setFlag(value?: StringFlag): CreateStringFlagRequest;
  hasFlag(): boolean;
  clearFlag(): CreateStringFlagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateStringFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateStringFlagRequest): CreateStringFlagRequest.AsObject;
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
  getFlag(): StringFlag | undefined;
  setFlag(value?: StringFlag): CreateStringFlagResponse;
  hasFlag(): boolean;
  clearFlag(): CreateStringFlagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateStringFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateStringFlagResponse): CreateStringFlagResponse.AsObject;
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
  setId(value: string): GetStringFlagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStringFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetStringFlagRequest): GetStringFlagRequest.AsObject;
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
  getFlag(): StringFlag | undefined;
  setFlag(value?: StringFlag): GetStringFlagResponse;
  hasFlag(): boolean;
  clearFlag(): GetStringFlagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStringFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetStringFlagResponse): GetStringFlagResponse.AsObject;
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
  getFlag(): StringFlag | undefined;
  setFlag(value?: StringFlag): UpdateStringFlagRequest;
  hasFlag(): boolean;
  clearFlag(): UpdateStringFlagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateStringFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateStringFlagRequest): UpdateStringFlagRequest.AsObject;
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
  getFlag(): StringFlag | undefined;
  setFlag(value?: StringFlag): UpdateStringFlagResponse;
  hasFlag(): boolean;
  clearFlag(): UpdateStringFlagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateStringFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateStringFlagResponse): UpdateStringFlagResponse.AsObject;
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

export class ListBoolFlagsRequest extends jspb.Message {
  getPage(): number;
  setPage(value: number): ListBoolFlagsRequest;

  getPageSize(): number;
  setPageSize(value: number): ListBoolFlagsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListBoolFlagsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListBoolFlagsRequest): ListBoolFlagsRequest.AsObject;
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
  getFlagsList(): Array<BoolFlag>;
  setFlagsList(value: Array<BoolFlag>): ListBoolFlagsResponse;
  clearFlagsList(): ListBoolFlagsResponse;
  addFlags(value?: BoolFlag, index?: number): BoolFlag;

  getTotalCount(): number;
  setTotalCount(value: number): ListBoolFlagsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListBoolFlagsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListBoolFlagsResponse): ListBoolFlagsResponse.AsObject;
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
  setPage(value: number): ListStringFlagsRequest;

  getPageSize(): number;
  setPageSize(value: number): ListStringFlagsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListStringFlagsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListStringFlagsRequest): ListStringFlagsRequest.AsObject;
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
  getFlagsList(): Array<StringFlag>;
  setFlagsList(value: Array<StringFlag>): ListStringFlagsResponse;
  clearFlagsList(): ListStringFlagsResponse;
  addFlags(value?: StringFlag, index?: number): StringFlag;

  getTotalCount(): number;
  setTotalCount(value: number): ListStringFlagsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListStringFlagsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListStringFlagsResponse): ListStringFlagsResponse.AsObject;
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

  getVariantCountsMap(): jspb.Map<string, number>;
  clearVariantCountsMap(): GetMetricsResponse;

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
    variantCountsMap: Array<[string, number]>,
  }
}

export class EvaluateBoolFlagRequest extends jspb.Message {
  getId(): string;
  setId(value: string): EvaluateBoolFlagRequest;

  getContext(): Context | undefined;
  setContext(value?: Context): EvaluateBoolFlagRequest;
  hasContext(): boolean;
  clearContext(): EvaluateBoolFlagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvaluateBoolFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EvaluateBoolFlagRequest): EvaluateBoolFlagRequest.AsObject;
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
  setValue(value: boolean): EvaluateBoolFlagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvaluateBoolFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: EvaluateBoolFlagResponse): EvaluateBoolFlagResponse.AsObject;
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
  setId(value: string): EvaluateStringFlagRequest;

  getContext(): Context | undefined;
  setContext(value?: Context): EvaluateStringFlagRequest;
  hasContext(): boolean;
  clearContext(): EvaluateStringFlagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvaluateStringFlagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EvaluateStringFlagRequest): EvaluateStringFlagRequest.AsObject;
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
  setValue(value: string): EvaluateStringFlagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvaluateStringFlagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: EvaluateStringFlagResponse): EvaluateStringFlagResponse.AsObject;
  static serializeBinaryToWriter(message: EvaluateStringFlagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EvaluateStringFlagResponse;
  static deserializeBinaryFromReader(message: EvaluateStringFlagResponse, reader: jspb.BinaryReader): EvaluateStringFlagResponse;
}

export namespace EvaluateStringFlagResponse {
  export type AsObject = {
    value: string,
  }
}

export enum Operator { 
  EQUALS = 0,
  NOT_EQUALS = 1,
  CONTAINS = 2,
  NOT_CONTAINS = 3,
  GREATER_THAN = 4,
  LESS_THAN = 5,
}
