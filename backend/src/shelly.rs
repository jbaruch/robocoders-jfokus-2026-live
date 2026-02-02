use crate::models::Color;
use reqwest::Client;
use std::time::Duration;

/// Client for communicating with Shelly Gen1 devices
#[derive(Debug, Clone)]
pub struct ShellyClient {
    ip: String,
    client: Client,
}

impl ShellyClient {
    /// Create a new Shelly client for the given IP address
    pub fn new(ip: String) -> Self {
        let client = Client::builder()
            .timeout(Duration::from_secs(2))
            .build()
            .unwrap();

        Self { ip, client }
    }

    /// Get the configured IP address
    pub fn ip(&self) -> &str {
        &self.ip
    }

    /// Build the URL for setting color on Shelly Gen1 RGBW bulb
    /// Per Shelly tile: GET /light/0?turn=on&red=R&green=G&blue=B&gain=100
    pub fn build_color_url(&self, color: &Color) -> String {
        format!(
            "http://{}/light/0?turn=on&red={}&green={}&blue={}&gain=100",
            self.ip, color.red, color.green, color.blue
        )
    }

    /// Set the bulb color
    /// Returns Ok(true) if successful, Ok(false) if bulb responded but failed,
    /// Err if network/timeout error
    pub async fn set_color(&self, color: &Color) -> Result<bool, String> {
        let url = self.build_color_url(color);

        match self.client.get(&url).send().await {
            Ok(response) => {
                if response.status().is_success() {
                    tracing::info!("Color set to {} on bulb {}", color.to_hex(), self.ip);
                    Ok(true)
                } else {
                    tracing::warn!(
                        "Bulb {} responded with status {}",
                        self.ip,
                        response.status()
                    );
                    Ok(false)
                }
            }
            Err(e) => {
                tracing::error!("Failed to reach bulb {}: {}", self.ip, e);
                Err(format!("Failed to reach bulb: {}", e))
            }
        }
    }

    /// Check if the bulb is reachable by calling GET /shelly
    pub async fn check_reachable(&self) -> bool {
        let url = format!("http://{}/shelly", self.ip);

        match self.client.get(&url).send().await {
            Ok(response) => response.status().is_success(),
            Err(_) => false,
        }
    }

    /// Discover device type by calling GET /shelly
    pub async fn discover(&self) -> Option<String> {
        let url = format!("http://{}/shelly", self.ip);

        match self.client.get(&url).send().await {
            Ok(response) if response.status().is_success() => {
                if let Ok(json) = response.json::<serde_json::Value>().await {
                    json.get("type")
                        .and_then(|t| t.as_str())
                        .map(|s| s.to_string())
                }
                else {
                    None
                }
            }
            _ => None,
        }
    }
}

// ============================================================================
// TESTS (TDD - Constitution II: Tests written before implementation)
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    // TS-014: Shelly client builds correct URL for color command
    #[test]
    fn test_shelly_client_builds_correct_url() {
        let client = ShellyClient::new("192.168.1.100".to_string());
        let color = Color::new(255, 128, 0);

        let url = client.build_color_url(&color);

        assert_eq!(
            url,
            "http://192.168.1.100/light/0?turn=on&red=255&green=128&blue=0&gain=100"
        );
    }

    #[test]
    fn test_shelly_client_url_with_different_colors() {
        let client = ShellyClient::new("10.0.0.50".to_string());

        // Black
        let black = Color::new(0, 0, 0);
        assert_eq!(
            client.build_color_url(&black),
            "http://10.0.0.50/light/0?turn=on&red=0&green=0&blue=0&gain=100"
        );

        // White
        let white = Color::new(255, 255, 255);
        assert_eq!(
            client.build_color_url(&white),
            "http://10.0.0.50/light/0?turn=on&red=255&green=255&blue=255&gain=100"
        );

        // Pure red
        let red = Color::new(255, 0, 0);
        assert_eq!(
            client.build_color_url(&red),
            "http://10.0.0.50/light/0?turn=on&red=255&green=0&blue=0&gain=100"
        );
    }

    #[test]
    fn test_shelly_client_stores_ip() {
        let client = ShellyClient::new("192.168.1.100".to_string());
        assert_eq!(client.ip(), "192.168.1.100");
    }

    // Note: Async tests for actual network calls would require mocking
    // or integration testing with a real/mock Shelly device
}
