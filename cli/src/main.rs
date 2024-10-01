use clap::{Parser, Subcommand};

use proto::gen::flag_service_client::FlagServiceClient;
use proto::gen::*;

#[derive(Parser)]
#[command(
    name = "Akasha CLI",
    version = "1.0",
    author = "Your Name",
    about = "CLI for Akasha Feature Flag Service"
)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Create a new flag
    CreateFlag {
        /// Flag type: BOOL or STRING
        #[arg(long)]
        flag_type: String,
        /// Default value of the flag
        #[arg(long)]
        value: String,
        /// ID of the flag
        id: String,
        /// Name of the flag
        name: String,
    },
    /// Get flag details
    GetFlag {
        /// ID of the flag
        id: String,
    },
    /// Update a flag
    UpdateFlag {
        /// ID of the flag
        id: String,
        /// New default value of the flag
        #[arg(long)]
        value: String,
    },
    /// Delete a flag
    DeleteFlag {
        /// ID of the flag
        id: String,
    },
    /// List all flags
    ListFlags,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::parse();

    let mut client = FlagServiceClient::connect("http://localhost:50051").await?;

    match cli.command {
        Commands::CreateFlag {
            flag_type,
            value,
            id,
            name,
        } => {
            if flag_type.to_uppercase() == "BOOL" {
                let flag = BoolFlag {
                    id: id.clone(),
                    name,
                    enabled: true,
                    default_value: value.parse::<bool>().unwrap_or(false),
                    targeting_rules: vec![],
                };
                let request = CreateBoolFlagRequest { flag: Some(flag) };
                let response = client.create_bool_flag(request).await?;
                println!("BoolFlag created: {:?}", response.into_inner().flag);
            } else if flag_type.to_uppercase() == "STRING" {
                let flag = StringFlag {
                    id: id.clone(),
                    name,
                    enabled: true,
                    default_value: value.clone(),
                    variants: vec![value.clone()],
                    targeting_rules: vec![],
                };
                let request = CreateStringFlagRequest { flag: Some(flag) };
                let response = client.create_string_flag(request).await?;
                println!("StringFlag created: {:?}", response.into_inner().flag);
            } else {
                eprintln!("Invalid flag type. Use 'BOOL' or 'STRING'.");
            }
        }
        Commands::GetFlag { id } => {
            // Try to get BoolFlag
            let request = GetBoolFlagRequest { id: id.clone() };
            match client.get_bool_flag(request).await {
                Ok(response) => {
                    println!("BoolFlag: {:?}", response.into_inner().flag);
                    return Ok(());
                }
                Err(_) => {
                    // If not found, try to get StringFlag
                }
            }

            let request = GetStringFlagRequest { id: id.clone() };
            match client.get_string_flag(request).await {
                Ok(response) => {
                    println!("StringFlag: {:?}", response.into_inner().flag);
                }
                Err(e) => {
                    eprintln!("Flag not found: {}", e.message());
                }
            }
        }
        Commands::UpdateFlag { id, value } => {
            // Try to update BoolFlag
            let get_request = GetBoolFlagRequest { id: id.clone() };
            match client.get_bool_flag(get_request).await {
                Ok(response) => {
                    let mut flag = response.into_inner().flag.unwrap();
                    flag.default_value = value.parse::<bool>().unwrap_or(flag.default_value);
                    let update_request = UpdateBoolFlagRequest { flag: Some(flag) };
                    let response = client.update_bool_flag(update_request).await?;
                    println!("BoolFlag updated: {:?}", response.into_inner().flag);
                    return Ok(());
                }
                Err(_) => {
                    // If not found, try to update StringFlag
                }
            }

            let get_request = GetStringFlagRequest { id: id.clone() };
            match client.get_string_flag(get_request).await {
                Ok(response) => {
                    let mut flag = response.into_inner().flag.unwrap();
                    flag.default_value = value.clone();
                    if !flag.variants.contains(&value) {
                        flag.variants.push(value.clone());
                    }
                    let update_request = UpdateStringFlagRequest { flag: Some(flag) };
                    let response = client.update_string_flag(update_request).await?;
                    println!("StringFlag updated: {:?}", response.into_inner().flag);
                }
                Err(e) => {
                    eprintln!("Flag not found: {}", e.message());
                }
            }
        }
        Commands::DeleteFlag { id } => {
            let request = DeleteFlagRequest { id };
            match client.delete_flag(request).await {
                Ok(response) => {
                    if response.into_inner().success {
                        println!("Flag deleted successfully.");
                    } else {
                        eprintln!("Failed to delete flag.");
                    }
                }
                Err(e) => {
                    eprintln!("Error deleting flag: {}", e.message());
                }
            }
        }
        Commands::ListFlags => {
            // List BoolFlags
            let request = ListBoolFlagsRequest {
                page: 1,
                page_size: 100,
            };
            let response = client.list_bool_flags(request).await?;
            let bool_flags = response.into_inner().flags;
            println!("BoolFlags:");
            for flag in bool_flags {
                println!("{:?}", flag);
            }

            // List StringFlags
            let request = ListStringFlagsRequest {
                page: 1,
                page_size: 100,
            };
            let response = client.list_string_flags(request).await?;
            let string_flags = response.into_inner().flags;
            println!("StringFlags:");
            for flag in string_flags {
                println!("{:?}", flag);
            }
        }
    }

    Ok(())
}
