// web/app/types/flag.ts

export interface BoolFlagData {
    type: 'bool';
    id: string;
    name: string;
    enabled: boolean;
    defaultValue: boolean;
    targetingRules?: BoolTargetingRuleData[];
}

export interface StringFlagData {
    type: 'string';
    id: string;
    name: string;
    enabled: boolean;
    defaultValue: string;
    variants: string[];
    targetingRules?: StringTargetingRuleData[];
}

export interface ConditionData {
    attribute: string;
    operator: number; // Should match the Operator enum value
    value: string;
}

export interface BoolTargetingRuleData {
    variant: boolean;
    conditions: ConditionData[];
}

export interface StringTargetingRuleData {
    variant: string;
    conditions: ConditionData[];
}
