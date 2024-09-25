// app/types/models.ts

export enum Operator {
    EQUALS = 0,
    NOT_EQUALS = 1,
    CONTAINS = 2,
    NOT_CONTAINS = 3,
    GREATER_THAN = 4,
    LESS_THAN = 5,
}

// Define the Condition interface
export interface Condition {
    attribute: string;
    operator: Operator;
    value: string;
}

// Define the generic TargetingRule interface
export interface TargetingRule<TVariant> {
    conditionsList: Condition[];
    variant: TVariant;
}

// Define the Flag interface
export interface Flag<TVariant> {
    id: string;
    name: string;
    enabled: boolean;
    defaultValue: TVariant;
    variants?: TVariant extends string ? string[] : never;
    type: TVariant extends boolean ? 'bool' : 'string';
    targetingRulesList: TargetingRule<TVariant>[];
}

// Type aliases for BoolFlag and StringFlag
export type BoolFlag = Flag<boolean>;
export type StringFlag = Flag<string>;
