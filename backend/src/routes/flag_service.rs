// src/main.rs

use anyhow::Result;
use proto::gen::flag_service_server::FlagService;
use proto::gen::*;
use std::sync::Arc;
use tonic::{Request, Response, Status};

use crate::storage::prelude::*;

#[derive(Debug)]
pub struct AkashaFlagService {
    storage: Arc<dyn StorageProvider>,
}

impl AkashaFlagService {
    pub fn new(storage: Arc<dyn StorageProvider>) -> Self {
        Self { storage }
    }
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
            Err(err) => Err(err.into()),
        }
    }

    async fn get_bool_flag(
        &self,
        request: Request<GetBoolFlagRequest>,
    ) -> Result<Response<GetBoolFlagResponse>, Status> {
        let flag_id = request.into_inner().id;
        match self.storage.get_bool_flag(&flag_id).await? {
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
            Err(err) => Err(err.into()),
        }
    }

    async fn get_string_flag(
        &self,
        request: Request<GetStringFlagRequest>,
    ) -> Result<Response<GetStringFlagResponse>, Status> {
        let flag_id = request.into_inner().id;
        match self.storage.get_string_flag(&flag_id).await? {
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

        let bool_removed = self.storage.delete_bool_flag(&flag_id).await?;
        let string_removed = self.storage.delete_string_flag(&flag_id).await?;

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

        let (flags_page, total_count) = self.storage.list_bool_flags(page, page_size).await?;

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

        let (flags_page, total_count) = self.storage.list_string_flags(page, page_size).await?;

        Ok(Response::new(ListStringFlagsResponse {
            flags: flags_page,
            total_count,
        }))
    }
}
