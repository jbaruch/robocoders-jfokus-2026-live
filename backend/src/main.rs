mod handlers;
mod models;
mod shelly;

use axum::{routing::{get, post}, Router};
use std::sync::Arc;
use tokio::sync::RwLock;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::shelly::ShellyClient;

/// Application state shared across handlers
pub struct AppState {
    pub shelly_client: RwLock<Option<ShellyClient>>,
}

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // CORS configuration for frontend (localhost:4200)
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Shared application state
    let state = Arc::new(AppState {
        shelly_client: RwLock::new(None),
    });

    // Build router with routes
    let app = Router::new()
        .route("/api/color", post(handlers::set_color))
        .route("/api/status", get(handlers::get_status))
        .route("/api/settings", post(handlers::set_settings))
        .route("/api/settings", get(handlers::get_settings))
        .layer(cors)
        .with_state(state);

    // Start server
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    tracing::info!("Shelly Color Sync backend listening on http://0.0.0.0:3000");
    axum::serve(listener, app).await.unwrap();
}
