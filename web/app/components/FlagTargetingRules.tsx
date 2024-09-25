// app/components/FlagTargetingRules.tsx

import React, { useState } from 'react';
import {
  Operator,
  Condition,
  TargetingRule,
  Flag,
} from '@/types/models';

interface FlagProps<TVariant> {
  flag: Flag<TVariant>;
  onFlagUpdate: (updatedFlag: Flag<TVariant>) => void;
}

function FlagTargetingRules<TVariant>({ flag, onFlagUpdate }: FlagProps<TVariant>) {
  const [targetingRules, setTargetingRules] = useState<TargetingRule<TVariant>[]>(flag.targetingRulesList);

  const addNewRule = (e: React.FormEvent) => {
    e.preventDefault();

    const newRule: TargetingRule<TVariant> = {
      conditionsList: [],
      variant: flag.type === 'bool' ? false as TVariant : '' as TVariant,
    };

    const newRules = [...targetingRules, newRule];
    setTargetingRules(newRules);
    onFlagUpdate({ ...flag, targetingRulesList: newRules });
  };

  const updateRule = (index: number, updatedRule: TargetingRule<TVariant>) => {
    const newRules = [...targetingRules];
    newRules[index] = updatedRule;
    setTargetingRules(newRules);
    onFlagUpdate({ ...flag, targetingRulesList: newRules });
  };

  const deleteRule = (index: number) => {
    const newRules = targetingRules.filter((_, i) => i !== index);
    setTargetingRules(newRules);
    onFlagUpdate({ ...flag, targetingRulesList: newRules });
  };

  return (
    <div>
      <h2>Targeting Rules for {flag.name}</h2>
      {targetingRules.map((rule, index) => (
        <TargetingRuleEditor
          key={index}
          rule={rule}
          flagType={flag.type}
          onUpdate={(updatedRule) => updateRule(index, updatedRule)}
          onDelete={(e) => {
            e.preventDefault();
            deleteRule(index);
          }}
        />
      ))}
      <button onClick={addNewRule}>Add New Rule</button>
    </div>
  );
}

interface TargetingRuleEditorProps<TVariant> {
  rule: TargetingRule<TVariant>;
  flagType: 'bool' | 'string';
  onUpdate: (updatedRule: TargetingRule<TVariant>) => void;
  onDelete: (e: React.FormEvent) => void;
}

function TargetingRuleEditor<TVariant>({
  rule,
  flagType,
  onUpdate,
  onDelete,
}: TargetingRuleEditorProps<TVariant>) {
  const [variant, setVariant] = useState<TVariant>(rule.variant);
  const [conditions, setConditions] = useState<Condition[]>(rule.conditionsList);

  const addCondition = (e: React.FormEvent) => {
    e.preventDefault();

    const newCondition: Condition = {
      attribute: '',
      operator: Operator.EQUALS,
      value: '',
    };
    const newConditions = [...conditions, newCondition];
    setConditions(newConditions);
    onUpdate({ ...rule, conditionsList: newConditions, variant });
  };

  const updateCondition = (index: number, updatedCondition: Condition) => {
    const newConditions = [...conditions];
    newConditions[index] = updatedCondition;
    setConditions(newConditions);
    onUpdate({ ...rule, conditionsList: newConditions, variant });
  };

  const deleteCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
    onUpdate({ ...rule, conditionsList: newConditions, variant });
  };

  const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVariant = flagType === 'bool'
      ? (e.target.checked as unknown as TVariant)
      : (e.target.value as unknown as TVariant);
    setVariant(newVariant);
    onUpdate({ ...rule, conditionsList: conditions, variant: newVariant });
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      <label>
        Variant to serve:
        {flagType === 'bool' ? (
          <input
            type="checkbox"
            checked={variant as unknown as boolean}
            onChange={handleVariantChange}
          />
        ) : (
          <input
            type="text"
            value={variant as unknown as string}
            onChange={handleVariantChange}
          />
        )}
      </label>
      <div>
        <h3>Conditions</h3>
        {conditions.map((condition, index) => (
          <ConditionEditor
            key={index}
            condition={condition}
            onUpdate={(updatedCondition) => updateCondition(index, updatedCondition)}
            onDelete={() => deleteCondition(index)}
          />
        ))}
        <button onClick={addCondition}>Add Condition</button>
      </div>
      <button onClick={onDelete} style={{ backgroundColor: 'red', color: 'white' }}>
        Delete Rule
      </button>
    </div>
  );
}

interface ConditionEditorProps {
  condition: Condition;
  onUpdate: (updatedCondition: Condition) => void;
  onDelete: () => void;
}

const ConditionEditor: React.FC<ConditionEditorProps> = ({
  condition,
  onUpdate,
  onDelete,
}) => {
  const [attribute, setAttribute] = useState(condition.attribute);
  const [operator, setOperator] = useState(condition.operator);
  const [value, setValue] = useState(condition.value);

  const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttribute(e.target.value);
    onUpdate({ attribute: e.target.value, operator, value });
  };

  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const op = parseInt(e.target.value, 10) as Operator;
    setOperator(op);
    onUpdate({ attribute, operator: op, value });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onUpdate({ attribute, operator, value: e.target.value });
  };

  return (
    <div style={{ marginBottom: '5px' }}>
      <input
        type="text"
        placeholder="Attribute"
        value={attribute}
        onChange={handleAttributeChange}
      />
      <select value={operator} onChange={handleOperatorChange}>
        <option value={Operator.EQUALS}>EQUALS</option>
        <option value={Operator.NOT_EQUALS}>NOT_EQUALS</option>
        <option value={Operator.CONTAINS}>CONTAINS</option>
        <option value={Operator.NOT_CONTAINS}>NOT_CONTAINS</option>
        <option value={Operator.GREATER_THAN}>GREATER_THAN</option>
        <option value={Operator.LESS_THAN}>LESS_THAN</option>
      </select>
      <input
        type="text"
        placeholder="Value"
        value={value}
        onChange={handleValueChange}
      />
      <button onClick={onDelete} style={{ marginLeft: '5px' }}>
        Delete
      </button>
    </div>
  );
};

export default FlagTargetingRules;
