use std::collections::HashMap;

use anyhow::Result;

mod akasha_proto {
    tonic::include_proto!("akasha");
}

pub enum Operator {
    Equals,
    NotEquals,
    Contains,
    NotContains,
    Unknown,
}

impl From<akasha_proto::targeting_rule::Operator> for Operator {
    fn from(proto_operator: akasha_proto::targeting_rule::Operator) -> Self {
        match proto_operator {
            akasha_proto::targeting_rule::Operator::Equals => Operator::Equals,
            akasha_proto::targeting_rule::Operator::NotEquals => Operator::NotEquals,
            akasha_proto::targeting_rule::Operator::Contains => Operator::Contains,
            akasha_proto::targeting_rule::Operator::NotContains => Operator::NotContains,
            akasha_proto::targeting_rule::Operator::Undefined => Operator::Unknown,
        }
    }
}

pub struct TargetingRule {
    name: String,
    operator: Operator,
    value: String,
}

impl TargetingRule {
    fn apply(&self, targets: &HashMap<String, String>) -> Result<bool> {
        let result_val = match targets.get(&self.name) {
            Some(target_value) => match self.operator {
                Operator::Equals => target_value == &self.value,
                Operator::NotEquals => target_value != &self.value,
                Operator::Contains => target_value.contains(&self.value),
                Operator::NotContains => !target_value.contains(&self.value),
                Operator::Unknown => return Err(anyhow::anyhow!("Unknown operator")),
            },
            None => false,
        };

        Ok(result_val)
    }
}

impl From<akasha_proto::TargetingRule> for TargetingRule {
    fn from(proto_rule: akasha_proto::TargetingRule) -> Self {
        TargetingRule {
            name: proto_rule.attribute.clone(),
            operator: proto_rule.operator().into(),
            value: proto_rule.value,
        }
    }
}

pub struct Flag<T> {
    id: String,
    name: String,
    value: T,
    targeting_rules: Vec<TargetingRule>,
}

impl<T> From<akasha_proto::Flag> for Flag<T> {
    fn from(proto_flag: akasha_proto::Flag) -> Self {
        Flag {
            id: proto_flag.id,
            name: proto_flag.name,
            value: match proto_flag.r#type {
                akasha_proto::flag::Type::BoolValue(value) => value,
                akasha_proto::flag::Type::StringValue(value) => value,
            },
            targeting_rules: proto_flag
                .targeting_rules
                .into_iter()
                .map(|proto_rule| proto_rule.into())
                .collect(),
        }
    }
}
