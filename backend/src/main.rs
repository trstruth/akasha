// src/main.rs

use anyhow::Result;
use proto::gen::evaluation_service_server::{EvaluationService, EvaluationServiceServer};
use proto::gen::flag_service_server::{FlagService, FlagServiceServer};
use proto::gen::metrics_service_server::{MetricsService, MetricsServiceServer};
use proto::gen::*;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use tonic::{transport::Server, Request, Response, Status};
use tower_http::cors::{Any, CorsLayer};

use backend::storage::InMemoryStorage;

// MetricsData structure
#[derive(Debug, Default, Clone)]
pub struct MetricsData {
    pub total_queries: i64,
    pub variant_counts: HashMap<String, i64>,
}

type MetricsProvider = RwLock<HashMap<String, MetricsData>>;

#[derive(Debug)]
struct AkashaFlagService {
    storage: Arc<InMemoryStorage>,
    metrics: Arc<MetricsProvider>,
}

#[tonic::async_trait]
impl FlagService for AkashaFlagService {
    // BoolFlag operations
    async fn create_bool_flag(
        &self,
        request: Request<CreateBoolFlagRequest>,
    ) -> Result<Response<CreateBoolFlagResponse>, Status> {
        let new_flag = request
            .into_inner()
            .flag
            .ok_or_else(|| Status::invalid_argument("BoolFlag data is missing in the request."))?;

        match self.storage.create_bool_flag(new_flag.clone()).await {
            Ok(_) => Ok(Response::new(CreateBoolFlagResponse {
                flag: Some(new_flag),
            })),
            Err(err) => Err(Status::already_exists(err)),
        }
    }

    async fn get_bool_flag(
        &self,
        request: Request<GetBoolFlagRequest>,
    ) -> Result<Response<GetBoolFlagResponse>, Status> {
        let flag_id = request.into_inner().id;
        match self.storage.get_bool_flag(&flag_id).await {
            Some(flag) => Ok(Response::new(GetBoolFlagResponse { flag: Some(flag) })),
            None => Err(Status::not_found("BoolFlag not found.")),
        }
    }

    async fn update_bool_flag(
        &self,
        request: Request<UpdateBoolFlagRequest>,
    ) -> Result<Response<UpdateBoolFlagResponse>, Status> {
        let updated_flag = request
            .into_inner()
            .flag
            .ok_or_else(|| Status::invalid_argument("BoolFlag data is missing in the request."))?;

        match self.storage.update_bool_flag(updated_flag.clone()).await {
            Ok(_) => Ok(Response::new(UpdateBoolFlagResponse {
                flag: Some(updated_flag),
            })),
            Err(_) => Err(Status::not_found("BoolFlag not found.")),
        }
    }

    // StringFlag operations
    async fn create_string_flag(
        &self,
        request: Request<CreateStringFlagRequest>,
    ) -> Result<Response<CreateStringFlagResponse>, Status> {
        let new_flag = request.into_inner().flag.ok_or_else(|| {
            Status::invalid_argument("StringFlag data is missing in the request.")
        })?;

        match self.storage.create_string_flag(new_flag.clone()).await {
            Ok(_) => Ok(Response::new(CreateStringFlagResponse {
                flag: Some(new_flag),
            })),
            Err(err) => Err(Status::already_exists(err)),
        }
    }

    async fn get_string_flag(
        &self,
        request: Request<GetStringFlagRequest>,
    ) -> Result<Response<GetStringFlagResponse>, Status> {
        let flag_id = request.into_inner().id;
        match self.storage.get_string_flag(&flag_id).await {
            Some(flag) => Ok(Response::new(GetStringFlagResponse { flag: Some(flag) })),
            None => Err(Status::not_found("StringFlag not found.")),
        }
    }

    async fn update_string_flag(
        &self,
        request: Request<UpdateStringFlagRequest>,
    ) -> Result<Response<UpdateStringFlagResponse>, Status> {
        let updated_flag = request.into_inner().flag.ok_or_else(|| {
            Status::invalid_argument("StringFlag data is missing in the request.")
        })?;

        match self.storage.update_string_flag(updated_flag.clone()).await {
            Ok(_) => Ok(Response::new(UpdateStringFlagResponse {
                flag: Some(updated_flag),
            })),
            Err(_) => Err(Status::not_found("StringFlag not found.")),
        }
    }

    // Common operations
    async fn delete_flag(
        &self,
        request: Request<DeleteFlagRequest>,
    ) -> Result<Response<DeleteFlagResponse>, Status> {
        let flag_id = request.into_inner().id;

        let bool_removed = self.storage.delete_bool_flag(&flag_id).await;
        let string_removed = self.storage.delete_string_flag(&flag_id).await;

        if bool_removed || string_removed {
            Ok(Response::new(DeleteFlagResponse { success: true }))
        } else {
            Err(Status::not_found("Flag not found."))
        }
    }

    async fn list_bool_flags(
        &self,
        request: Request<ListBoolFlagsRequest>,
    ) -> Result<Response<ListBoolFlagsResponse>, Status> {
        let req = request.into_inner();

        let page_size = req.page_size.max(1) as usize;
        let page = req.page.max(1) as usize - 1;

        let (flags_page, total_count) = self.storage.list_bool_flags(page, page_size).await;

        Ok(Response::new(ListBoolFlagsResponse {
            flags: flags_page,
            total_count,
        }))
    }

    async fn list_string_flags(
        &self,
        request: Request<ListStringFlagsRequest>,
    ) -> Result<Response<ListStringFlagsResponse>, Status> {
        let req = request.into_inner();

        let page_size = req.page_size.max(1) as usize;
        let page = req.page.max(1) as usize - 1;

        let (flags_page, total_count) = self.storage.list_string_flags(page, page_size).await;

        Ok(Response::new(ListStringFlagsResponse {
            flags: flags_page,
            total_count,
        }))
    }
}

// Implement EvaluationService
#[derive(Debug)]
struct AkashaEvaluationService {
    storage: Arc<InMemoryStorage>,
    metrics: Arc<MetricsProvider>,
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
            self.storage.get_bool_flag(&flag_id).await
        } else if !flag_name.is_empty() {
            self.storage.get_bool_flag_by_name(&flag_name).await
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
                        // TODO: Update metrics

                        return Ok(Response::new(EvaluateBoolFlagResponse {
                            value: rule.variant,
                        }));
                    }
                }

                // TODO: update metrics

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
            self.storage.get_string_flag(&flag_id).await
        } else if !flag_name.is_empty() {
            self.storage.get_string_flag_by_name(&flag_name).await
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
                        // TODO: Update metrics

                        return Ok(Response::new(EvaluateStringFlagResponse {
                            value: rule.variant.clone(),
                        }));
                    }
                }

                // TODO: Update Metrics

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

// Implement MetricsService
#[derive(Debug)]
struct AkashaMetricsService {
    storage: Arc<InMemoryStorage>,
    metrics: Arc<MetricsProvider>,
}

#[tonic::async_trait]
impl MetricsService for AkashaMetricsService {
    async fn get_metrics(
        &self,
        request: Request<GetMetricsRequest>,
    ) -> Result<Response<GetMetricsResponse>, Status> {
        let flag_id = request.into_inner().flag_id;
        match self.metrics.read().await.get(&flag_id) {
            Some(metrics_data) => Ok(Response::new(GetMetricsResponse {
                total_queries: metrics_data.total_queries,
                variant_counts: metrics_data.variant_counts.clone(),
                true_count: metrics_data
                    .variant_counts
                    .get("true")
                    .copied()
                    .unwrap_or(0),
                false_count: metrics_data
                    .variant_counts
                    .get("false")
                    .copied()
                    .unwrap_or(0),
            })),
            None => Err(Status::not_found("Metrics not found for this flag.")),
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "0.0.0.0:50051".parse()?;
    let storage = Arc::new(InMemoryStorage::default());
    let metrics = Arc::new(RwLock::new(HashMap::new()));

    let flag_service = FlagServiceServer::new(AkashaFlagService {
        storage: Arc::clone(&storage),
        metrics: metrics.clone(),
    });

    let evaluation_service = EvaluationServiceServer::new(AkashaEvaluationService {
        storage: Arc::clone(&storage),
        metrics: metrics.clone(),
    });

    let metrics_service = MetricsServiceServer::new(AkashaMetricsService {
        storage: Arc::clone(&storage),
        metrics: metrics.clone(),
    });

    println!("Akasha server listening on {}", addr);

    Server::builder()
        .accept_http1(true)
        .layer(CorsLayer::new().allow_origin(Any))
        .add_service(flag_service)
        .add_service(evaluation_service)
        .add_service(metrics_service)
        .serve(addr)
        .await?;

    Ok(())
}
