use anyhow::Result;
use proto::gen::evaluation_service_server::EvaluationService;
use proto::gen::*;
use std::sync::Arc;
use tokio::sync::Mutex;
use tonic::{Request, Response, Status};

use crate::metrics::prelude::InMemoryMetricsProvider;
use crate::storage::prelude::*;

#[derive(Debug)]
pub struct AkashaEvaluationService {
    storage: Arc<dyn StorageProvider>,
    metrics: Arc<Mutex<InMemoryMetricsProvider>>,
}

impl AkashaEvaluationService {
    pub fn new(
        storage: Arc<dyn StorageProvider>,
        metrics: Arc<Mutex<InMemoryMetricsProvider>>,
    ) -> Self {
        Self { storage, metrics }
    }
}

#[tonic::async_trait]
impl EvaluationService for AkashaEvaluationService {
    async fn evaluate_bool_flag(
        &self,
        request: Request<EvaluateBoolFlagRequest>,
    ) -> Result<Response<EvaluateBoolFlagResponse>, Status> {
        let req = request.into_inner();
        let flag_id = req.id;
        let flag_name = req.name;
        let context = req.context.unwrap_or_default();

        let flag = if !flag_id.is_empty() {
            self.storage.get_bool_flag(&flag_id).await?
        } else if !flag_name.is_empty() {
            self.storage.get_bool_flag_by_name(&flag_name).await?
        } else {
            return Err(Status::invalid_argument(
                "Either id or name must be provided.",
            ));
        };

        match flag {
            Some(flag) => {
                if !flag.enabled {
                    return Ok(Response::new(EvaluateBoolFlagResponse {
                        value: flag.default_value,
                    }));
                }

                // Evaluate targeting rules
                for rule in &flag.targeting_rules {
                    if evaluate_bool_rule(rule, &context)
                        .map_err(|e| Status::invalid_argument(e.to_string()))?
                    {
                        self.metrics
                            .lock()
                            .await
                            .increment_variant(&flag_id, rule.variant.into())
                            .await;

                        return Ok(Response::new(EvaluateBoolFlagResponse {
                            value: rule.variant,
                        }));
                    }
                }

                self.metrics
                    .lock()
                    .await
                    .increment_variant(&flag_id, flag.default_value.into())
                    .await;

                // Return default value
                Ok(Response::new(EvaluateBoolFlagResponse {
                    value: flag.default_value,
                }))
            }
            None => Err(Status::not_found("BoolFlag not found.")),
        }
    }

    async fn evaluate_string_flag(
        &self,
        request: Request<EvaluateStringFlagRequest>,
    ) -> Result<Response<EvaluateStringFlagResponse>, Status> {
        let req = request.into_inner();
        let flag_id = req.id;
        let flag_name = req.name;
        let context = req.context.unwrap_or_default();

        let flag = if !flag_id.is_empty() {
            self.storage.get_string_flag(&flag_id).await?
        } else if !flag_name.is_empty() {
            self.storage.get_string_flag_by_name(&flag_name).await?
        } else {
            return Err(Status::invalid_argument(
                "Either id or name must be provided.",
            ));
        };

        match flag {
            Some(flag) => {
                if !flag.enabled {
                    return Ok(Response::new(EvaluateStringFlagResponse {
                        value: flag.default_value,
                    }));
                }

                // Evaluate targeting rules
                for rule in &flag.targeting_rules {
                    if evaluate_string_rule(rule, &context)
                        .map_err(|e| Status::invalid_argument(e.to_string()))?
                    {
                        self.metrics
                            .lock()
                            .await
                            .increment_variant(&flag_id, rule.variant.as_str().into())
                            .await;
                        return Ok(Response::new(EvaluateStringFlagResponse {
                            value: rule.variant.clone(),
                        }));
                    }
                }

                self.metrics
                    .lock()
                    .await
                    .increment_variant(&flag_id, flag.default_value.as_str().into())
                    .await;
                Ok(Response::new(EvaluateStringFlagResponse {
                    value: flag.default_value.clone(),
                }))
            }
            None => Err(Status::not_found("StringFlag not found.")),
        }
    }
}

// Helper functions for evaluating rules
fn evaluate_conditions(conditions: &[Condition], context: &Context) -> Result<bool, anyhow::Error> {
    for condition in conditions {
        let attribute_value = match context.attributes.get(&condition.attribute) {
            Some(value) => value,
            None => return Ok(false),
        };

        let comparison_result = match Operator::try_from(condition.operator)? {
            Operator::Equals => attribute_value == &condition.value,
            Operator::NotEquals => attribute_value != &condition.value,
            Operator::Contains => attribute_value.contains(&condition.value),
            Operator::NotContains => !attribute_value.contains(&condition.value),
            Operator::GreaterThan => attribute_value > &condition.value,
            Operator::LessThan => attribute_value < &condition.value,
        };

        if !comparison_result {
            return Ok(false);
        }
    }
    Ok(true)
}

fn evaluate_bool_rule(rule: &BoolTargetingRule, context: &Context) -> Result<bool, anyhow::Error> {
    evaluate_conditions(&rule.conditions, context)
}

fn evaluate_string_rule(
    rule: &StringTargetingRule,
    context: &Context,
) -> Result<bool, anyhow::Error> {
    evaluate_conditions(&rule.conditions, context)
}
