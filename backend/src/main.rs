// src/main.rs

mod akasha {
    tonic::include_proto!("akasha");
}

use akasha::evaluation_service_server::{EvaluationService, EvaluationServiceServer};
use akasha::flag_service_server::{FlagService, FlagServiceServer};
use akasha::metrics_service_server::{MetricsService, MetricsServiceServer};
use akasha::*;
use anyhow::Result;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use tonic::{transport::Server, Request, Response, Status};
use tower_http::cors::{Any, CorsLayer};

// Define InMemoryStorage
#[derive(Debug, Default)]
struct InMemoryStorage {
    bool_flags: RwLock<HashMap<String, BoolFlag>>,
    string_flags: RwLock<HashMap<String, StringFlag>>,
    metrics: RwLock<HashMap<String, MetricsData>>,
}

#[derive(Debug, Default, Clone)]
struct MetricsData {
    total_queries: i64,
    variant_counts: HashMap<String, i64>,
}

// Implement FlagService
#[derive(Debug)]
struct AkashaFlagService {
    storage: Arc<InMemoryStorage>,
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

        let mut flags = self.storage.bool_flags.write().await;
        if flags.contains_key(&new_flag.id) {
            return Err(Status::already_exists(
                "BoolFlag with this ID already exists.",
            ));
        }

        flags.insert(new_flag.id.clone(), new_flag.clone());
        Ok(Response::new(CreateBoolFlagResponse {
            flag: Some(new_flag),
        }))
    }

    async fn get_bool_flag(
        &self,
        request: Request<GetBoolFlagRequest>,
    ) -> Result<Response<GetBoolFlagResponse>, Status> {
        let flag_id = request.into_inner().id;
        let flags = self.storage.bool_flags.read().await;
        let flag = flags.get(&flag_id).cloned();

        match flag {
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

        let mut flags = self.storage.bool_flags.write().await;
        if flags.contains_key(&updated_flag.id) {
            flags.insert(updated_flag.id.clone(), updated_flag.clone());
            Ok(Response::new(UpdateBoolFlagResponse {
                flag: Some(updated_flag),
            }))
        } else {
            Err(Status::not_found("BoolFlag not found."))
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

        let mut flags = self.storage.string_flags.write().await;
        if flags.contains_key(&new_flag.id) {
            return Err(Status::already_exists(
                "StringFlag with this ID already exists.",
            ));
        }

        flags.insert(new_flag.id.clone(), new_flag.clone());
        Ok(Response::new(CreateStringFlagResponse {
            flag: Some(new_flag),
        }))
    }

    async fn get_string_flag(
        &self,
        request: Request<GetStringFlagRequest>,
    ) -> Result<Response<GetStringFlagResponse>, Status> {
        let flag_id = request.into_inner().id;
        let flags = self.storage.string_flags.read().await;
        let flag = flags.get(&flag_id).cloned();

        match flag {
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

        let mut flags = self.storage.string_flags.write().await;
        if flags.contains_key(&updated_flag.id) {
            flags.insert(updated_flag.id.clone(), updated_flag.clone());
            Ok(Response::new(UpdateStringFlagResponse {
                flag: Some(updated_flag),
            }))
        } else {
            Err(Status::not_found("StringFlag not found."))
        }
    }

    // Common operations
    async fn delete_flag(
        &self,
        request: Request<DeleteFlagRequest>,
    ) -> Result<Response<DeleteFlagResponse>, Status> {
        let flag_id = request.into_inner().id;

        let mut bool_flags = self.storage.bool_flags.write().await;
        let mut string_flags = self.storage.string_flags.write().await;

        let bool_removed = bool_flags.remove(&flag_id).is_some();
        let string_removed = string_flags.remove(&flag_id).is_some();

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
        let flags = self.storage.bool_flags.read().await;
        let req = request.into_inner();

        let page_size = req.page_size.max(1) as usize;
        let page = req.page.max(1) as usize - 1;

        let start = page * page_size;

        let flags_vec: Vec<BoolFlag> = flags.values().cloned().collect();
        let total_count = flags_vec.len() as i32;

        let flags_page = flags_vec.into_iter().skip(start).take(page_size).collect();

        Ok(Response::new(ListBoolFlagsResponse {
            flags: flags_page,
            total_count,
        }))
    }

    async fn list_string_flags(
        &self,
        request: Request<ListStringFlagsRequest>,
    ) -> Result<Response<ListStringFlagsResponse>, Status> {
        let flags = self.storage.string_flags.read().await;
        let req = request.into_inner();

        let page_size = req.page_size.max(1) as usize;
        let page = req.page.max(1) as usize - 1;

        let start = page * page_size;

        let flags_vec: Vec<StringFlag> = flags.values().cloned().collect();
        let total_count = flags_vec.len() as i32;

        let flags_page = flags_vec.into_iter().skip(start).take(page_size).collect();

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

        let flags = self.storage.bool_flags.read().await;
        let flag = flags.values().find(|flag| flag.name == flag_name).cloned();

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
                        // Update metrics
                        let mut metrics = self.storage.metrics.write().await;
                        let entry = metrics.entry(flag_id.clone()).or_default();
                        entry.total_queries += 1;
                        *entry
                            .variant_counts
                            .entry(rule.variant.to_string())
                            .or_default() += 1;

                        return Ok(Response::new(EvaluateBoolFlagResponse {
                            value: rule.variant,
                        }));
                    }
                }

                // Return default value
                let mut metrics = self.storage.metrics.write().await;
                let entry = metrics.entry(flag_id.clone()).or_default();
                entry.total_queries += 1;
                *entry
                    .variant_counts
                    .entry(flag.default_value.to_string())
                    .or_default() += 1;

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

        let flags = self.storage.string_flags.read().await;
        let flag = flags.values().find(|flag| flag.name == flag_name).cloned();

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
                        // Update metrics
                        let mut metrics = self.storage.metrics.write().await;
                        let entry = metrics.entry(flag_id.clone()).or_default();
                        entry.total_queries += 1;
                        *entry
                            .variant_counts
                            .entry(rule.variant.clone())
                            .or_default() += 1;

                        return Ok(Response::new(EvaluateStringFlagResponse {
                            value: rule.variant.clone(),
                        }));
                    }
                }

                // Return default value
                let mut metrics = self.storage.metrics.write().await;
                let entry = metrics.entry(flag_id.clone()).or_default();
                entry.total_queries += 1;
                *entry
                    .variant_counts
                    .entry(flag.default_value.clone())
                    .or_default() += 1;

                Ok(Response::new(EvaluateStringFlagResponse {
                    value: flag.default_value.clone(),
                }))
            }
            None => Err(Status::not_found("StringFlag not found.")),
        }
    }
}

// Helper functions for evaluating rules
fn evaluate_conditions(conditions: &[Condition], context: &Context) -> Result<bool> {
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

fn evaluate_bool_rule(rule: &BoolTargetingRule, context: &Context) -> Result<bool> {
    evaluate_conditions(&rule.conditions, context)
}

fn evaluate_string_rule(rule: &StringTargetingRule, context: &Context) -> Result<bool> {
    evaluate_conditions(&rule.conditions, context)
}

// Implement MetricsService
#[derive(Debug)]
struct AkashaMetricsService {
    storage: Arc<InMemoryStorage>,
}

#[tonic::async_trait]
impl MetricsService for AkashaMetricsService {
    async fn get_metrics(
        &self,
        request: Request<GetMetricsRequest>,
    ) -> Result<Response<GetMetricsResponse>, Status> {
        let flag_id = request.into_inner().flag_id;
        let metrics = self.storage.metrics.read().await;
        let data = metrics.get(&flag_id);

        match data {
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

    let flag_service = FlagServiceServer::new(AkashaFlagService {
        storage: Arc::clone(&storage),
    });

    let evaluation_service = EvaluationServiceServer::new(AkashaEvaluationService {
        storage: Arc::clone(&storage),
    });

    let metrics_service = MetricsServiceServer::new(AkashaMetricsService {
        storage: Arc::clone(&storage),
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
