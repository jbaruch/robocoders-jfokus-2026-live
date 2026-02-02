use serde::{Deserialize, Serialize};

/// RGB Color with validation (0-255 per channel)
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct Color {
    pub red: u8,
    pub green: u8,
    pub blue: u8,
}

impl Color {
    /// Create a new Color with validated RGB values
    pub fn new(red: u8, green: u8, blue: u8) -> Self {
        Self { red, green, blue }
    }

    /// Convert to hex string (e.g., "#FF8800")
    pub fn to_hex(&self) -> String {
        format!("#{:02X}{:02X}{:02X}", self.red, self.green, self.blue)
    }
}

/// Request body for POST /api/color
#[derive(Debug, Deserialize)]
pub struct ColorRequest {
    pub red: u8,
    pub green: u8,
    pub blue: u8,
}

impl ColorRequest {
    /// Convert to Color
    pub fn to_color(&self) -> Color {
        Color::new(self.red, self.green, self.blue)
    }
}

/// Response body for POST /api/color
#[derive(Debug, Serialize)]
pub struct ColorResponse {
    pub success: bool,
    pub bulb_reachable: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

/// Response body for GET /api/status
#[derive(Debug, Serialize)]
pub struct StatusResponse {
    pub bulb_configured: bool,
    pub bulb_reachable: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bulb_ip: Option<String>,
}

/// Request body for POST /api/settings
#[derive(Debug, Deserialize)]
pub struct SettingsRequest {
    pub bulb_ip: String,
}

/// Response body for POST /api/settings and GET /api/settings
#[derive(Debug, Serialize)]
pub struct SettingsResponse {
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bulb_ip: Option<String>,
    pub bulb_reachable: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub device_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

// ============================================================================
// TESTS (TDD - Constitution II: Tests written before implementation)
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    // TS-015: Color entity validates RGB range 0-255
    // Note: Rust's u8 type inherently enforces 0-255 range at compile time
    #[test]
    fn test_color_rgb_values_are_valid() {
        let color = Color::new(255, 128, 0);
        assert_eq!(color.red, 255);
        assert_eq!(color.green, 128);
        assert_eq!(color.blue, 0);
    }

    // TS-016: Color entity validates all channels required
    #[test]
    fn test_color_request_requires_all_channels() {
        // Valid JSON with all channels
        let json = r#"{"red": 255, "green": 128, "blue": 0}"#;
        let result: Result<ColorRequest, _> = serde_json::from_str(json);
        assert!(result.is_ok());

        // Missing blue channel should fail
        let json_missing = r#"{"red": 255, "green": 128}"#;
        let result_missing: Result<ColorRequest, _> = serde_json::from_str(json_missing);
        assert!(result_missing.is_err());
    }

    #[test]
    fn test_color_to_hex() {
        let color = Color::new(255, 136, 0);
        assert_eq!(color.to_hex(), "#FF8800");

        let black = Color::new(0, 0, 0);
        assert_eq!(black.to_hex(), "#000000");

        let white = Color::new(255, 255, 255);
        assert_eq!(white.to_hex(), "#FFFFFF");
    }

    #[test]
    fn test_color_request_to_color() {
        let request = ColorRequest {
            red: 100,
            green: 150,
            blue: 200,
        };
        let color = request.to_color();
        assert_eq!(color.red, 100);
        assert_eq!(color.green, 150);
        assert_eq!(color.blue, 200);
    }

    #[test]
    fn test_color_response_serialization() {
        let response = ColorResponse {
            success: true,
            bulb_reachable: true,
            error: None,
        };
        let json = serde_json::to_string(&response).unwrap();
        assert!(json.contains("\"success\":true"));
        assert!(json.contains("\"bulb_reachable\":true"));
        // error field should be skipped when None
        assert!(!json.contains("error"));
    }

    #[test]
    fn test_color_response_with_error() {
        let response = ColorResponse {
            success: false,
            bulb_reachable: false,
            error: Some("Bulb unreachable".to_string()),
        };
        let json = serde_json::to_string(&response).unwrap();
        assert!(json.contains("\"success\":false"));
        assert!(json.contains("\"error\":\"Bulb unreachable\""));
    }

    #[test]
    fn test_status_response_serialization() {
        let response = StatusResponse {
            bulb_configured: true,
            bulb_reachable: true,
            bulb_ip: Some("192.168.1.100".to_string()),
        };
        let json = serde_json::to_string(&response).unwrap();
        assert!(json.contains("\"bulb_configured\":true"));
        assert!(json.contains("\"bulb_ip\":\"192.168.1.100\""));
    }

    #[test]
    fn test_settings_request_deserialization() {
        let json = r#"{"bulb_ip": "192.168.1.100"}"#;
        let request: SettingsRequest = serde_json::from_str(json).unwrap();
        assert_eq!(request.bulb_ip, "192.168.1.100");
    }
}
