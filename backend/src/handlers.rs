use axum::{
    extract::State,
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use std::sync::Arc;

use crate::models::{
    ColorRequest, ColorResponse, SettingsRequest, SettingsResponse, StatusResponse,
};
use crate::shelly::ShellyClient;
use crate::AppState;

/// POST /api/color - Set the bulb color
/// TS-010: Accepts valid RGB values
/// TS-011: Rejects invalid RGB values (handled by serde u8 deserialization)
pub async fn set_color(
    State(state): State<Arc<AppState>>,
    Json(request): Json<ColorRequest>,
) -> impl IntoResponse {
    let color = request.to_color();
    tracing::info!("Received color request: {}", color.to_hex());

    let client = state.shelly_client.read().await;

    match &*client {
        Some(shelly) => {
            match shelly.set_color(&color).await {
                Ok(true) => Json(ColorResponse {
                    success: true,
                    bulb_reachable: true,
                    error: None,
                }),
                Ok(false) => Json(ColorResponse {
                    success: false,
                    bulb_reachable: true,
                    error: Some("Bulb rejected command".to_string()),
                }),
                Err(e) => Json(ColorResponse {
                    success: false,
                    bulb_reachable: false,
                    error: Some(e),
                }),
            }
        }
        None => Json(ColorResponse {
            success: false,
            bulb_reachable: false,
            error: Some("Bulb not configured".to_string()),
        }),
    }
}

/// GET /api/status - Get system health status
/// TS-012: Returns connection health
pub async fn get_status(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let client = state.shelly_client.read().await;

    match &*client {
        Some(shelly) => {
            let reachable = shelly.check_reachable().await;
            Json(StatusResponse {
                bulb_configured: true,
                bulb_reachable: reachable,
                bulb_ip: Some(shelly.ip().to_string()),
            })
        }
        None => Json(StatusResponse {
            bulb_configured: false,
            bulb_reachable: false,
            bulb_ip: None,
        }),
    }
}

/// POST /api/settings - Configure Shelly bulb connection
/// TS-013: Configures bulb IP
pub async fn set_settings(
    State(state): State<Arc<AppState>>,
    Json(request): Json<SettingsRequest>,
) -> impl IntoResponse {
    let ip = request.bulb_ip.trim().to_string();

    if ip.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json(SettingsResponse {
                success: false,
                bulb_ip: None,
                bulb_reachable: false,
                device_type: None,
                error: Some("IP address cannot be empty".to_string()),
            }),
        );
    }

    tracing::info!("Configuring Shelly bulb at IP: {}", ip);

    let new_client = ShellyClient::new(ip.clone());

    // Try to discover device
    let device_type = new_client.discover().await;
    let reachable = device_type.is_some();

    // Store the client regardless of reachability (user may configure before powering on bulb)
    {
        let mut client = state.shelly_client.write().await;
        *client = Some(new_client);
    }

    (
        StatusCode::OK,
        Json(SettingsResponse {
            success: true,
            bulb_ip: Some(ip),
            bulb_reachable: reachable,
            device_type,
            error: if reachable {
                None
            } else {
                Some("Bulb not reachable, but IP saved".to_string())
            },
        }),
    )
}

/// GET /api/settings - Get current settings
pub async fn get_settings(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let client = state.shelly_client.read().await;

    match &*client {
        Some(shelly) => {
            let reachable = shelly.check_reachable().await;
            Json(SettingsResponse {
                success: true,
                bulb_ip: Some(shelly.ip().to_string()),
                bulb_reachable: reachable,
                device_type: if reachable {
                    shelly.discover().await
                } else {
                    None
                },
                error: None,
            })
        }
        None => Json(SettingsResponse {
            success: false,
            bulb_ip: None,
            bulb_reachable: false,
            device_type: None,
            error: Some("No bulb configured".to_string()),
        }),
    }
}

// ============================================================================
// TESTS (TDD - Constitution II: Tests written before implementation)
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    // TS-010: POST /api/color accepts valid RGB values
    #[test]
    fn test_color_request_valid() {
        let json = r#"{"red": 255, "green": 128, "blue": 0}"#;
        let request: Result<ColorRequest, _> = serde_json::from_str(json);
        assert!(request.is_ok());

        let req = request.unwrap();
        assert_eq!(req.red, 255);
        assert_eq!(req.green, 128);
        assert_eq!(req.blue, 0);
    }

    // TS-011: POST /api/color rejects invalid RGB values
    // Note: Rust's u8 type automatically rejects values outside 0-255
    // This test verifies that values > 255 fail deserialization
    #[test]
    fn test_color_request_invalid_range() {
        // Value 300 is outside u8 range, should fail to deserialize
        let json = r#"{"red": 300, "green": 128, "blue": 0}"#;
        let result: Result<ColorRequest, _> = serde_json::from_str(json);
        assert!(result.is_err());

        // Negative value should also fail
        let json_negative = r#"{"red": -1, "green": 128, "blue": 0}"#;
        let result_negative: Result<ColorRequest, _> = serde_json::from_str(json_negative);
        assert!(result_negative.is_err());
    }

    // TS-012: GET /api/status returns connection health
    #[test]
    fn test_status_response_structure() {
        let response = StatusResponse {
            bulb_configured: true,
            bulb_reachable: true,
            bulb_ip: Some("192.168.1.100".to_string()),
        };

        let json = serde_json::to_string(&response).unwrap();
        assert!(json.contains("\"bulb_configured\":true"));
        assert!(json.contains("\"bulb_reachable\":true"));
        assert!(json.contains("\"bulb_ip\":\"192.168.1.100\""));
    }

    // TS-013: POST /api/settings configures bulb IP
    #[test]
    fn test_settings_request_valid() {
        let json = r#"{"bulb_ip": "192.168.1.100"}"#;
        let request: SettingsRequest = serde_json::from_str(json).unwrap();
        assert_eq!(request.bulb_ip, "192.168.1.100");
    }
}
