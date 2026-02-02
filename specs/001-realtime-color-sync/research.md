# Research: Real-Time Webcam Color to Shelly IoT Bulb Sync

**Created**: 2026-02-02
**Feature**: 001-realtime-color-sync

## Tessl Tiles

### Installed Tiles

| Technology | Tile | Type | Version |
|------------|------|------|---------|
| Shelly Gen1 | shelly-cloud/shelly-gen1-api | Documentation + Steering | 1.0.0 |
| Angular | tessl/npm-angular | Documentation | 20.2.0 |
| Tailwind CSS | tessl/npm-tailwindcss | Documentation | 4.1.1 |

### Technologies Without Tiles

- **Rust**: No tile found in registry (use official docs)
- **Axum**: No tile found in registry (use official docs)
- **reqwest**: No tile found in registry (use official docs)

### Available Skills

No skill tiles installed for this feature.

## Shelly Gen1 API Research

### Discovery-First Approach (from tile)

The Shelly tile emphasizes **never guessing endpoints**. Required discovery flow:

1. `GET /shelly` - Identify device, check `auth` field
2. `GET /status` - Look for `lights[]` array to confirm RGBW capability
3. `GET /settings` - Confirm configuration

### Light Endpoint for RGBW Bulbs

From tile documentation (`device-families.md`):

```
/light/{index}
```

**Common commands**:
- Turn on: `/light/0?turn=on`
- Set brightness: `/light/0?brightness=50`
- Set color: `/light/0?turn=on&red=255&green=128&blue=0&gain=100`

### Key Rules from Tile

- Always use explicit state commands (`turn=on|off`), avoid toggle
- Verify result via endpoint response or re-read `/status`
- Auth may be required if `auth: true` in `/shelly` response

**Decision**: Implement discovery on backend startup/settings change. Cache capabilities.

## Angular Research

### Standalone Components (from tile)

Modern Angular (20+) prefers standalone components:

```typescript
@Component({
  selector: 'app-color-display',
  standalone: true,
  imports: [CommonModule],
  template: `...`
})
```

### Signals for Reactivity (from tile)

Use signals for reactive state:

```typescript
import { signal, computed, effect } from '@angular/core';

// Writable signal
color = signal({ red: 0, green: 0, blue: 0 });

// Computed value
hexColor = computed(() => {
  const c = this.color();
  return `#${c.red.toString(16).padStart(2,'0')}...`;
});

// Effect for side effects
effect(() => {
  console.log('Color changed:', this.color());
});
```

**Decision**: Use signals for all reactive state (color, connection status).

## Tailwind CSS Research

### Key Considerations (from tile)

- Tailwind 4.x uses CSS-first configuration
- Utility-first approach fits demo requirement
- Custom colors defined via CSS variables

**Decision**: Use Tailwind utilities with custom color variables for detected colors.

## Color Detection Algorithm

### Approach: Center-Weighted Average

For demo simplicity:

1. Capture frame to canvas
2. Get ImageData from center region (50% of frame)
3. Sample every Nth pixel for performance
4. Compute weighted average RGB

**Pseudocode**:
```
function extractDominantColor(imageData):
    let r = 0, g = 0, b = 0, count = 0
    for pixel in imageData (sample every 10th):
        r += pixel.red
        g += pixel.green
        b += pixel.blue
        count++
    return { r: r/count, g: g/count, b: b/count }
```

**Decision**: Use simple averaging. More sophisticated clustering (k-means) is overkill for demo.

## Backend Framework Selection

### Axum vs Actix-web

| Aspect | Axum | Actix-web |
|--------|------|-----------|
| Complexity | Simpler | More features |
| Async | Tower-based | Actor model |
| Learning curve | Lower | Higher |
| Performance | Excellent | Excellent |

**Decision**: Axum for simplicity. Demo-first principle.

### Cargo Dependencies

```toml
[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
reqwest = { version = "0.11", features = ["json"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tower-http = { version = "0.5", features = ["cors"] }
```

## Decisions Summary

| Question | Decision | Rationale |
|----------|----------|-----------|
| Color detection location | Client-side (browser) | Lower latency, simpler backend |
| Color algorithm | Center-weighted average | Demo simplicity > accuracy |
| Shelly API version | Gen1 local HTTP | User requirement, simpler than Gen2 |
| Backend framework | Axum | Demo-first, low complexity |
| Frontend state | Angular Signals | Modern, reactive, clean |
| Styling | Tailwind utilities | Fast iteration, visual clarity |
| Throttling | 300ms client-side | Prevents bulb overload |
| Error strategy | Fire-and-forget + status | Demo continues despite errors |
