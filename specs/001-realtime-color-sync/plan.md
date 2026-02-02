# Implementation Plan: Real-Time Webcam Color to Shelly IoT Bulb Sync

**Feature Branch**: `001-realtime-color-sync`
**Created**: 2026-02-02
**Spec**: [spec.md](./spec.md)
**Constitution**: v1.0.0

## Technical Context

| Aspect | Decision |
|--------|----------|
| **Backend Language** | Rust (stable) |
| **Backend Framework** | Axum (lightweight, async-first) |
| **Frontend Framework** | Angular 20+ with standalone components |
| **Frontend Styling** | Tailwind CSS 4.x |
| **Shelly API** | Gen1 Local HTTP API v1 (per user request) |
| **Testing (Backend)** | Rust built-in tests + cargo test |
| **Testing (Frontend)** | Jest with jest-preset-angular |
| **Project Type** | Conference demo (JFokus 2026) |
| **Target Platform** | Web browser (presenter's laptop) |

## Constitution Check

Per constitution v1.0.0:

| Principle | Compliance |
|-----------|------------|
| **I. Demo-First** | ✓ Minimal viable architecture, no over-engineering |
| **II. TDD (NON-NEGOTIABLE)** | ✓ Tests written before implementation |
| **III. Visual Clarity** | ✓ Large color displays, high contrast UI |
| **IV. Intentional Design** | ✓ Custom styling, no generic templates |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Angular Frontend                          │
│  ┌──────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │ Webcam   │  │ Color        │  │ Settings Panel      │   │
│  │ Feed     │  │ Display      │  │ (Shelly IP config)  │   │
│  └────┬─────┘  └──────────────┘  └─────────────────────┘   │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Color Detection (Client-side)               │   │
│  │           Canvas sampling → Dominant color            │   │
│  └────────────────────────┬─────────────────────────────┘   │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │ HTTP POST /api/color
                            ▼
┌───────────────────────────────────────────────────────────────┐
│                     Rust Backend (Axum)                       │
│  ┌─────────────────┐    ┌────────────────────────────────┐   │
│  │ POST /api/color │───▶│ Shelly Client                  │   │
│  │ (receive RGB)   │    │ GET /light/0?turn=on&red=...   │   │
│  └─────────────────┘    └────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────┐    ┌────────────────────────────────┐   │
│  │ GET /api/status │───▶│ Connection health check        │   │
│  └─────────────────┘    └────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP to Shelly bulb
                            ▼
                    ┌───────────────┐
                    │  Shelly Bulb  │
                    │  (Gen1 API)   │
                    └───────────────┘
```

## Key Design Decisions

### 1. Client-Side Color Detection

**Decision**: Perform dominant color extraction in the browser using Canvas API.

**Rationale**:
- No video streaming to backend (simpler, lower latency)
- Browser has direct webcam access via MediaDevices API
- Canvas ImageData provides pixel-level access
- Reduces backend complexity to simple HTTP relay

**Algorithm**: Sample center region of frame, compute average RGB with basic clustering for dominant color.

### 2. Shelly Gen1 API Integration

**Decision**: Use Gen1 local HTTP API with discovery-first approach.

**Per Shelly tile documentation**:
1. `GET /shelly` - Identify device, check auth requirement
2. `GET /status` - Discover capabilities (expect `lights[]` array)
3. `GET /light/0?turn=on&red=R&green=G&blue=B&gain=100` - Set color

**Key endpoint** (for RGBW bulbs):
```
GET /light/0?turn=on&red={0-255}&green={0-255}&blue={0-255}&gain=100
```

### 3. Throttling Strategy

**Decision**: Client-side throttle at 300ms minimum interval between color sends.

**Rationale**:
- Prevents overwhelming Shelly bulb (spec: 2-3 updates/sec max)
- Allows smooth visual transitions
- Simple implementation with timestamp comparison

### 4. Error Handling

**Decision**: Fire-and-forget with status polling.

**Rationale**:
- Demo continues even if bulb offline
- Separate `/api/status` endpoint for connection health
- UI shows bulb status independently of color sync

## Component Breakdown

### Backend (Rust/Axum)

| Component | Purpose | Key Dependencies |
|-----------|---------|------------------|
| `main.rs` | Server bootstrap, routes | axum, tokio |
| `shelly.rs` | Shelly HTTP client | reqwest |
| `handlers.rs` | API request handlers | axum, serde |
| `models.rs` | Request/response types | serde |

### Frontend (Angular)

| Component | Purpose |
|-----------|---------|
| `AppComponent` | Root, layout orchestration |
| `WebcamComponent` | Camera access, frame capture |
| `ColorDisplayComponent` | Large color swatch display |
| `SettingsPanelComponent` | Shelly IP configuration |
| `StatusIndicatorComponent` | Connection status badges |
| `ColorService` | Color extraction logic |
| `ShellyService` | Backend API communication |

## API Contract

### POST /api/color

Set the bulb color.

**Request**:
```json
{
  "red": 255,
  "green": 128,
  "blue": 0
}
```

**Response (200)**:
```json
{
  "success": true,
  "bulb_reachable": true
}
```

**Response (200, bulb offline)**:
```json
{
  "success": false,
  "bulb_reachable": false,
  "error": "Bulb unreachable"
}
```

### GET /api/status

Check system health.

**Response**:
```json
{
  "bulb_configured": true,
  "bulb_reachable": true,
  "bulb_ip": "192.168.1.100"
}
```

### POST /api/settings

Configure Shelly bulb connection.

**Request**:
```json
{
  "bulb_ip": "192.168.1.100"
}
```

**Response**:
```json
{
  "success": true,
  "bulb_reachable": true
}
```

## UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │                         │  │                         │  │
│  │      WEBCAM FEED        │  │    DETECTED COLOR       │  │
│  │      (live video)       │  │    (large swatch)       │  │
│  │                         │  │                         │  │
│  │                         │  │    #FF8800              │  │
│  │                         │  │    RGB(255, 136, 0)     │  │
│  └─────────────────────────┘  └─────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ● Webcam: Connected   ● Bulb: 192.168.1.100 ✓     │   │
│  │                                           [Settings]│   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Visual requirements** (per constitution III):
- Color swatch: minimum 300x300px
- Status indicators: large icons, high contrast
- Font sizes: minimum 24px for projected display
- Dark background for color accuracy

## File Structure

```
/
├── backend/
│   ├── Cargo.toml
│   └── src/
│       ├── main.rs
│       ├── handlers.rs
│       ├── shelly.rs
│       └── models.rs
├── frontend/
│   ├── angular.json
│   ├── package.json
│   ├── tailwind.config.js
│   └── src/
│       ├── app/
│       │   ├── app.component.ts
│       │   ├── components/
│       │   │   ├── webcam/
│       │   │   ├── color-display/
│       │   │   ├── settings-panel/
│       │   │   └── status-indicator/
│       │   └── services/
│       │       ├── color.service.ts
│       │       └── shelly.service.ts
│       └── styles.css
└── specs/
    └── 001-realtime-color-sync/
        ├── spec.md
        ├── plan.md
        └── ...
```

## Testing Strategy

Per constitution II (TDD - NON-NEGOTIABLE):

### Backend Tests

| Test | What it validates |
|------|-------------------|
| `test_color_endpoint_valid_rgb` | Accepts valid RGB values |
| `test_color_endpoint_invalid_range` | Rejects out-of-range values |
| `test_shelly_client_builds_correct_url` | URL construction for Shelly API |
| `test_status_endpoint` | Returns health status |

### Frontend Tests

| Test | What it validates |
|------|-------------------|
| `ColorService.extractDominantColor` | Correct color from ImageData |
| `WebcamComponent.captureFrame` | Returns canvas data |
| `ShellyService.sendColor` | HTTP call with correct payload |
| `ColorDisplayComponent.render` | Displays color swatch correctly |

## Implementation Order

1. **Backend core** - Axum server with `/api/color` endpoint
2. **Shelly client** - HTTP client for Gen1 API
3. **Frontend core** - Angular app with webcam access
4. **Color extraction** - Canvas-based dominant color detection
5. **Integration** - Wire frontend to backend
6. **Settings panel** - Shelly IP configuration
7. **Status indicators** - Connection health display
8. **Polish** - Visual refinement for demo clarity

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Shelly bulb unresponsive | Demo fails | Graceful degradation, show color on screen |
| Webcam permission denied | No color capture | Clear error message, demo color picker fallback |
| Network latency | Delayed color updates | Client-side throttling, fire-and-forget |
| Conference lighting | Poor color detection | Manual color picker as backup |

## Validated Against Constitution v1.0.0

- ✓ Demo-First: Minimal architecture, no unnecessary features
- ✓ TDD: Test strategy defined before implementation
- ✓ Visual Clarity: Large displays, high contrast, readable from back row
- ✓ Intentional Design: Custom Tailwind styling, no generic templates
