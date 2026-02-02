# Data Model: Real-Time Webcam Color to Shelly IoT Bulb Sync

**Created**: 2026-02-02
**Feature**: 001-realtime-color-sync

## Entities

### Color

Represents an RGB color value.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| red | integer | 0-255 | Red channel |
| green | integer | 0-255 | Green channel |
| blue | integer | 0-255 | Blue channel |

**Derived values**:
- `hex`: String representation (#RRGGBB)
- `rgb_string`: "RGB(r, g, b)" format

### BulbConfiguration

Shelly bulb connection settings.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| ip_address | string | Valid IPv4 or hostname | Shelly bulb network address |
| auth_enabled | boolean | - | Whether bulb requires authentication |
| username | string? | Optional | Basic auth username (if auth enabled) |
| password | string? | Optional | Basic auth password (if auth enabled) |

**Validation rules**:
- IP address must be reachable on local network
- If auth_enabled, username and password required

### ConnectionStatus

System health state.

| Field | Type | Values | Description |
|-------|------|--------|-------------|
| webcam_connected | boolean | true/false | Camera access granted |
| bulb_configured | boolean | true/false | Bulb IP has been set |
| bulb_reachable | boolean | true/false | Last ping to bulb succeeded |
| last_color_sent | Color? | - | Most recent color sent to bulb |
| last_update_time | timestamp? | - | When last color was sent |

### BulbCapabilities

Discovered from Shelly `/status` endpoint.

| Field | Type | Description |
|-------|------|-------------|
| device_type | string | From `/shelly` response |
| has_lights | boolean | `lights[]` exists in status |
| light_count | integer | Number of light channels |
| supports_color | boolean | RGB control available |

## State Transitions

### Application Startup

```
[Initial] → [Webcam Requesting] → [Webcam Active] or [Webcam Denied]
                                         ↓
                              [Detecting Colors]
                                         ↓
                              [Sending to Bulb] (if configured)
```

### Bulb Configuration

```
[Unconfigured] → [IP Entered] → [Discovering] → [Connected] or [Unreachable]
                                                      ↓
                                              [Ready for Color]
```

### Color Sync Loop

```
[Frame Captured] → [Color Extracted] → [Throttle Check]
                                              ↓
                        [Skip] ← [Too Soon] ← ┘
                           ↓
                        [Send Color] → [Update UI]
                           ↓
                   [Bulb Response] → [Update Status]
```

## No Persistence Required

This is a demo application. All state is:
- In-memory on backend (bulb IP configuration)
- In-memory on frontend (current color, status)

No database or file storage needed.
