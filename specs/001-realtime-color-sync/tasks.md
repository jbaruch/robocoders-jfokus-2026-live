# Tasks: Real-Time Webcam Color to Shelly IoT Bulb Sync

**Generated**: 2026-02-02
**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Tests**: [test-specs.md](./tests/test-specs.md)
**Constitution**: v1.0.0 (TDD NON-NEGOTIABLE)

---

## Phase 1: Setup

Project initialization and scaffolding.

- [ ] T001 Initialize Rust backend project in `backend/` with Cargo.toml
- [ ] T002 [P] Add backend dependencies: axum, tokio, reqwest, serde, serde_json, tower-http
- [ ] T003 [P] Initialize Angular frontend project in `frontend/` with Angular CLI
- [ ] T004 [P] Add frontend dependencies: Tailwind CSS 4.x, jest-preset-angular
- [ ] T005 Configure Tailwind CSS in `frontend/tailwind.config.js`
- [ ] T006 [P] Configure Jest for Angular in `frontend/jest.config.js`
- [ ] T007 [P] Configure CORS in backend for frontend origin (localhost:4200)

**Phase 1 Complete When**: Both `cargo build` and `ng serve` succeed.

---

## Phase 2: Foundational (Blocking)

Shared models and infrastructure that ALL user stories depend on.

### Backend Models (Tests First - Constitution II)

- [ ] T008 Write test for Color model validation (TS-015, TS-016) in `backend/src/models.rs`
- [ ] T009 Implement Color struct with RGB validation (0-255) in `backend/src/models.rs`
- [ ] T010 Write test for ColorRequest/ColorResponse serde in `backend/src/models.rs`
- [ ] T011 Implement ColorRequest and ColorResponse structs in `backend/src/models.rs`

### Backend Shelly Client (Tests First)

- [ ] T012 Write test for Shelly URL construction (TS-014) in `backend/src/shelly.rs`
- [ ] T013 Implement ShellyClient with set_color method in `backend/src/shelly.rs`
- [ ] T014 Write test for Shelly client error handling in `backend/src/shelly.rs`
- [ ] T015 Implement timeout and error handling in ShellyClient

### Frontend Services (Tests First)

- [ ] T016 Write test for ColorService.extractDominantColor (TS-003) in `frontend/src/app/services/color.service.spec.ts`
- [ ] T017 Implement ColorService with extractDominantColor in `frontend/src/app/services/color.service.ts`
- [ ] T018 Write test for ShellyService.sendColor (TS-010) in `frontend/src/app/services/shelly.service.spec.ts`
- [ ] T019 Implement ShellyService with sendColor, getStatus in `frontend/src/app/services/shelly.service.ts`

**Phase 2 Complete When**: All foundational tests pass (`cargo test`, `npm test`).

---

## Phase 3: User Story 1 - Live Color Capture Demo (P1)

Core demo functionality: webcam → color extraction → Shelly bulb.

### Backend API (Tests First)

- [ ] T020 [US1] Write test for POST /api/color endpoint (TS-010, TS-011) in `backend/src/handlers.rs`
- [ ] T021 [US1] Implement POST /api/color handler in `backend/src/handlers.rs`
- [ ] T022 [US1] Wire /api/color route in `backend/src/main.rs`

### Frontend Webcam Component (Tests First)

- [ ] T023 [US1] Write test for WebcamComponent frame capture in `frontend/src/app/components/webcam/webcam.component.spec.ts`
- [ ] T024 [US1] Implement WebcamComponent with MediaDevices access in `frontend/src/app/components/webcam/webcam.component.ts`
- [ ] T025 [US1] Write test for auto-start on init (TS-021) in `frontend/src/app/components/webcam/webcam.component.spec.ts`
- [ ] T026 [US1] Implement auto-start detection loop in WebcamComponent

### Frontend Color Extraction (Tests First)

- [ ] T027 [US1] Write test for dominant color from ImageData (TS-003) in `frontend/src/app/services/color.service.spec.ts`
- [ ] T028 [US1] Implement center-weighted average algorithm in ColorService

### Integration (Tests First)

- [ ] T029 [US1] Write integration test for color capture → API call (TS-001)
- [ ] T030 [US1] Wire WebcamComponent to ColorService to ShellyService
- [ ] T031 [US1] Write test for throttling (TS-009, TS-019) in ColorService
- [ ] T032 [US1] Implement 300ms throttle in color send loop

**Phase 3 Complete When**: Webcam captures color and sends to backend (bulb optional).

---

## Phase 4: User Story 2 - Audience-Visible Feedback (P1)

On-screen display for audience visibility.

### Frontend ColorDisplay Component (Tests First)

- [ ] T033 [US2] Write test for ColorDisplayComponent renders 300x300px swatch (TS-004) in `frontend/src/app/components/color-display/color-display.component.spec.ts`
- [ ] T034 [US2] Implement ColorDisplayComponent with large swatch in `frontend/src/app/components/color-display/color-display.component.ts`
- [ ] T035 [US2] Style ColorDisplayComponent with Tailwind (min 300x300, high contrast)

### Frontend Webcam Feed Display (Tests First)

- [ ] T036 [US2] Write test for live video feed display (TS-022) in `frontend/src/app/components/webcam/webcam.component.spec.ts`
- [ ] T037 [US2] Add video element to WebcamComponent template
- [ ] T038 [US2] Style webcam feed with Tailwind (large, visible)

### Frontend Status Indicators (Tests First)

- [ ] T039 [US2] Write test for StatusIndicatorComponent displays connection status (TS-006) in `frontend/src/app/components/status-indicator/status-indicator.component.spec.ts`
- [ ] T040 [US2] Implement StatusIndicatorComponent with webcam/bulb status in `frontend/src/app/components/status-indicator/status-indicator.component.ts`
- [ ] T041 [US2] Style status indicators (large icons, high contrast per constitution III)

### App Layout

- [ ] T042 [US2] Write test for AppComponent layout structure
- [ ] T043 [US2] Implement AppComponent with two-column layout in `frontend/src/app/app.component.ts`
- [ ] T044 [US2] Style app layout with dark background, large elements

**Phase 4 Complete When**: Color displayed prominently, webcam visible, status clear.

---

## Phase 5: User Story 3 - Graceful Error Handling (P2)

Error states and recovery for live demo resilience.

### Backend Status API (Tests First)

- [ ] T045 [US3] Write test for GET /api/status endpoint (TS-012) in `backend/src/handlers.rs`
- [ ] T046 [US3] Implement GET /api/status handler in `backend/src/handlers.rs`
- [ ] T047 [US3] Wire /api/status route in `backend/src/main.rs`

### Backend Settings API (Tests First)

- [ ] T048 [US3] Write test for POST /api/settings endpoint (TS-013, TS-017) in `backend/src/handlers.rs`
- [ ] T049 [US3] Implement POST /api/settings handler with IP validation in `backend/src/handlers.rs`
- [ ] T050 [US3] Wire /api/settings route in `backend/src/main.rs`

### Frontend Settings Panel (Tests First)

- [ ] T051 [US3] Write test for SettingsPanelComponent IP input in `frontend/src/app/components/settings-panel/settings-panel.component.spec.ts`
- [ ] T052 [US3] Implement SettingsPanelComponent with IP input in `frontend/src/app/components/settings-panel/settings-panel.component.ts`
- [ ] T053 [US3] Style settings panel (accessible during demo)

### Frontend Error Handling (Tests First)

- [ ] T054 [US3] Write test for bulb offline indicator (TS-007) in `frontend/src/app/components/status-indicator/status-indicator.component.spec.ts`
- [ ] T055 [US3] Implement offline indicator in StatusIndicatorComponent
- [ ] T056 [US3] Write test for webcam disconnect handling (TS-008) in `frontend/src/app/components/webcam/webcam.component.spec.ts`
- [ ] T057 [US3] Implement webcam reconnection logic in WebcamComponent
- [ ] T058 [US3] Write test for initial "waiting for color" state (TS-020)
- [ ] T059 [US3] Implement initial placeholder state in ColorDisplayComponent

**Phase 5 Complete When**: App handles bulb/webcam failures gracefully.

---

## Phase 6: Polish & Cross-Cutting

Final refinements for demo quality.

- [ ] T060 Add neutral color handling (TS-018) - maintain last color for gray scenes
- [ ] T061 Review all component styles for constitution III compliance (large, high-contrast)
- [ ] T062 Test full demo flow: launch → webcam → color → bulb → status
- [ ] T063 Write quickstart verification checklist
- [ ] T064 Final visual polish for intentional design (constitution IV)

**Phase 6 Complete When**: Demo runs smoothly for 5+ minutes.

---

## Dependencies

```
T001 ─┬─> T002 ─┬─> T008 ─> T009 ─> T010 ─> T011
      │        │
      │        └─> T012 ─> T013 ─> T014 ─> T015
      │
      └─> T003 ─> T004 ─> T005 ─> T006 ─> T016 ─> T017 ─> T018 ─> T019

Phase 2 (Foundational) ─> Phase 3 (US1) ─> Phase 4 (US2) ─> Phase 5 (US3) ─> Phase 6 (Polish)

Within each phase:
  Tests (T0XX) ─> Implementation (T0XX+1)
```

### Critical Path

T001 → T003 → T016 → T017 → T023 → T024 → T030 → T033 → T034 → T043

(Setup → ColorService → WebcamComponent → Integration → ColorDisplay → AppLayout)

---

## Parallel Execution Examples

### Phase 1 Parallelization

```
Agent A: T001 → T002 → T007 (Backend setup)
Agent B: T003 → T004 → T005 → T006 (Frontend setup)
```

### Phase 2 Parallelization

```
Agent A: T008 → T009 → T010 → T011 → T012 → T013 (Backend models + Shelly)
Agent B: T016 → T017 → T018 → T019 (Frontend services)
```

### Phase 3-5 Parallelization (Backend/Frontend)

```
Agent A: Backend tasks (T020-T022, T045-T050)
Agent B: Frontend tasks (T023-T044, T051-T059)
```

---

## Implementation Strategy

### MVP Scope (Demo-Ready Minimum)

Complete through **Phase 4** for a working demo:
- Webcam captures color ✓
- Color sent to Shelly bulb ✓
- Large color display visible to audience ✓
- Basic status indicators ✓

Phase 5 (error handling) and Phase 6 (polish) can be deferred if time-constrained (per constitution I: Demo-First).

### TDD Enforcement (Constitution II)

Every implementation task is preceded by a test task:
- T008 (test) → T009 (implement)
- T016 (test) → T017 (implement)
- etc.

**No implementation without failing test first.**

### Independent Testability

Each phase can be tested independently:
- Phase 3: Point webcam at color, verify backend receives RGB
- Phase 4: Verify UI displays color swatch at correct size
- Phase 5: Disconnect bulb, verify offline indicator appears

---

## Summary

| Phase | Tasks | Story | Description |
|-------|-------|-------|-------------|
| 1 | 7 | - | Setup |
| 2 | 12 | - | Foundational |
| 3 | 13 | US1 | Live Color Capture |
| 4 | 12 | US2 | Audience Feedback |
| 5 | 15 | US3 | Error Handling |
| 6 | 5 | - | Polish |
| **Total** | **64** | | |

### Test Coverage

- 22 test specifications from test-specs.md
- ~30 test tasks (T008, T010, T012, T016, T018, T020, T023, T025, T027, T029, T031, T033, T036, T039, T042, T045, T048, T051, T054, T056, T058)
- TDD ratio: ~47% test tasks, 53% implementation tasks
