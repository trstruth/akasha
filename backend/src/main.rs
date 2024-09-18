mod akasha {
    tonic::include_proto!("akasha");
}

use akasha::flag_service_server::{FlagService, FlagServiceServer};
use akasha::metrics_service_server::{MetricsService, MetricsServiceServer};
use akasha::query_service_server::{QueryService, QueryServiceServer};
use akasha::*;
use std::sync::Arc;
use tokio::sync::RwLock;
use tonic::{transport::Server, Request, Response, Status};

#[derive(Debug, Default)]
struct InMemoryStorage {
    flags: RwLock<Vec<Flag>>,
    metrics: RwLock<std::collections::HashMap<String, MetricsData>>,
}

#[derive(Debug, Default, Clone)]
struct MetricsData {
    total_queries: i64,
    true_count: i64,
    false_count: i64,
}

#[derive(Debug)]
struct AkashaFlagService {
    storage: Arc<InMemoryStorage>,
}

#[tonic::async_trait]
impl FlagService for AkashaFlagService {
    async fn create_flag(
        &self,
        request: Request<CreateFlagRequest>,
    ) -> Result<Response<CreateFlagResponse>, Status> {
        let new_flag = request
            .into_inner()
            .flag
            .ok_or_else(|| Status::invalid_argument("Flag data is missing in the request."))?;

        let mut flags = self.storage.flags.write().await;
        if flags.iter().any(|flag| flag.id == new_flag.id) {
            return Err(Status::already_exists("Flag with this ID already exists."));
        }

        flags.push(new_flag.clone());
        Ok(Response::new(CreateFlagResponse {
            flag: Some(new_flag),
        }))
    }

    async fn get_flag(
        &self,
        request: Request<GetFlagRequest>,
    ) -> Result<Response<GetFlagResponse>, Status> {
        let flag_id = request.into_inner().id;
        let flags = self.storage.flags.read().await;
        let flag = flags.iter().find(|f| f.id == flag_id).cloned();

        match flag {
            Some(flag) => {
                // Update metrics
                let mut metrics = self.storage.metrics.write().await;
                let entry = metrics.entry(flag_id.clone()).or_default();
                entry.total_queries += 1;

                if let Some(flag_type) = FlagType::from_i32(flag.r#type) {
                    if flag_type == FlagType::Bool {
                        if flag.bool_value {
                            entry.true_count += 1;
                        } else {
                            entry.false_count += 1;
                        }
                    }
                }

                Ok(Response::new(GetFlagResponse { flag: Some(flag) }))
            }
            None => Err(Status::not_found("Flag not found.")),
        }
    }

    async fn update_flag(
        &self,
        request: Request<UpdateFlagRequest>,
    ) -> Result<Response<UpdateFlagResponse>, Status> {
        let updated_flag = request
            .into_inner()
            .flag
            .ok_or_else(|| Status::invalid_argument("Flag data is missing in the request."))?;

        let mut flags = self.storage.flags.write().await;
        let index = flags.iter().position(|f| f.id == updated_flag.id);

        if let Some(idx) = index {
            flags[idx] = updated_flag.clone();
            Ok(Response::new(UpdateFlagResponse {
                flag: Some(updated_flag),
            }))
        } else {
            Err(Status::not_found("Flag not found."))
        }
    }

    async fn delete_flag(
        &self,
        request: Request<DeleteFlagRequest>,
    ) -> Result<Response<DeleteFlagResponse>, Status> {
        let flag_id = request.into_inner().id;
        let mut flags = self.storage.flags.write().await;
        let len_before = flags.len();
        flags.retain(|f| f.id != flag_id);

        if flags.len() < len_before {
            Ok(Response::new(DeleteFlagResponse { success: true }))
        } else {
            Err(Status::not_found("Flag not found."))
        }
    }

    async fn list_flags(
        &self,
        request: Request<ListFlagsRequest>,
    ) -> Result<Response<ListFlagsResponse>, Status> {
        let flags = self.storage.flags.read().await;
        let req = request.into_inner();

        let page_size = req.page_size.max(1) as usize;
        let page = req.page.max(1) as usize - 1;

        let start = page * page_size;
        let end = start + page_size;

        let flags_page = flags.iter().skip(start).take(page_size).cloned().collect();

        Ok(Response::new(ListFlagsResponse {
            flags: flags_page,
            total_count: flags.len() as i32,
        }))
    }
}

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
                true_count: metrics_data.true_count,
                false_count: metrics_data.false_count,
            })),
            None => Err(Status::not_found("Metrics not found for this flag.")),
        }
    }
}

#[derive(Debug)]
struct AkashaQueryService {
    storage: Arc<InMemoryStorage>,
}

#[tonic::async_trait]
impl QueryService for AkashaQueryService {
    async fn get_bool_flag(
        &self,
        request: Request<BoolFlagQueryRequest>,
    ) -> Result<Response<BoolFlagQueryResponse>, Status> {
        let inner_request = request.into_inner();
        let flag_name = inner_request.name.clone().to_string();
        let targets = inner_request.targets.clone();

        let flags = self.storage.flags.read().await;
        let flag = flags.iter().find(|f| f.name == flag_name).cloned();

        match flag {
            Some(flag) => {
                let value = true;
                Ok(Response::new(BoolFlagQueryResponse { value }))
            }
            None => Err(Status::not_found("Flag not found.")),
        }
    }

    async fn get_string_flag(
        &self,
        request: Request<StringFlagQueryRequest>,
    ) -> Result<Response<StringFlagQueryResponse>> {
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "0.0.0.0:50051".parse()?;
    let storage = Arc::new(InMemoryStorage::default());

    let flag_service = AkashaFlagService {
        storage: Arc::clone(&storage),
    };
    let flag_service = FlagServiceServer::new(flag_service);

    let metrics_service = AkashaMetricsService {
        storage: Arc::clone(&storage),
    };
    let metrics_service = MetricsServiceServer::new(metrics_service);

    let query_service = AkashaQueryService {
        storage: Arc::clone(&storage),
    };
    let query_service = QueryServiceServer::new(query_service);

    println!("Akasha server listening on {}", addr);

    Server::builder()
        .accept_http1(true)
        .add_service(tonic_web::enable(flag_service))
        .add_service(tonic_web::enable(metrics_service))
        .add_service(tonic_web::enable(query_service))
        .serve(addr)
        .await?;

    Ok(())
}
