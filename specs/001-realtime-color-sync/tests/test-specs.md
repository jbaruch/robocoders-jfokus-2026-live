# Test Specifications: Real-Time Webcam Color to Shelly IoT Bulb Sync

**Generated**: 2026-02-02
**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md)

## TDD Assessment

**Determination**: MANDATORY
**Confidence**: HIGH
**Evidence**: "Test-Driven Development (NON-NEGOTIABLE) - Tests are written before implementation code. No exceptions. Red-Green-Refactor cycle strictly enforced."
**Reasoning**: Constitution explicitly requires TDD with "NON-NEGOTIABLE" and "No exceptions" language. All tests in this document MUST be written and passing before corresponding implementation code.

---

<!--
DO NOT MODIFY TEST ASSERTIONS

These test specifications define the expected behavior derived from requirements.
During implementation:
- Fix code to pass tests, don't modify test assertions
- Structural changes (file organization, naming) are acceptable with justification
- Logic changes to assertions require explicit justification and re-review

If requirements change, re-run /speckit-05-testify to regenerate test specs.
-->

---

## From spec.md (Acceptance Tests)

### TS-001: Color capture triggers bulb update within 1 second

**Source**: spec.md:User Story 1:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: the application is running and webcam is active
**When**: the presenter holds up a red object in front of the camera
**Then**: the Shelly bulb changes to red within 1 second

**Traceability**: FR-001, FR-002, FR-003, FR-004, SC-001, US-001-scenario-1

**Test Implementation Notes**:
- Backend: Mock Shelly client, verify color command sent with correct RGB values
- Frontend: Mock webcam with red ImageData, verify color extraction returns red
- Integration: Measure time from frame capture to Shelly API call

---

### TS-002: Bulb color transitions smoothly between colors

**Source**: spec.md:User Story 1:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: the bulb is currently red
**When**: the presenter holds up a blue object
**Then**: the bulb transitions smoothly to blue

**Traceability**: FR-002, FR-003, US-001-scenario-2

**Test Implementation Notes**:
- Verify sequential color commands are sent (not batched/skipped)
- Verify blue RGB values sent after red RGB values

---

### TS-003: Dominant color extraction from multi-color frame

**Source**: spec.md:User Story 1:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: the webcam feed shows multiple colors
**When**: the system analyzes the frame
**Then**: it identifies and uses the single most dominant color

**Traceability**: FR-002, US-001-scenario-3

**Test Implementation Notes**:
- Frontend unit test: Create ImageData with 60% red, 40% blue pixels
- Verify ColorService returns red as dominant color

---

### TS-004: Detected color displayed prominently on screen

**Source**: spec.md:User Story 2:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: the application is displayed on a projector
**When**: a color is detected from the webcam
**Then**: the detected color is displayed prominently on screen (visible from back of room)

**Traceability**: FR-005, SC-002, US-002-scenario-1

**Test Implementation Notes**:
- Component test: Verify ColorDisplayComponent renders swatch >= 300x300px
- Verify background-color style matches detected color
- Verify hex and RGB text displayed

---

### TS-005: Color sent to bulb shown on screen

**Source**: spec.md:User Story 2:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: a color is being sent to the bulb
**When**: the transmission occurs
**Then**: the screen shows the exact color being sent to the device

**Traceability**: FR-006, US-002-scenario-2

**Test Implementation Notes**:
- Verify UI updates with color value sent to backend
- Verify color displayed matches POST /api/color payload

---

### TS-006: System status understandable within 2 seconds

**Source**: spec.md:User Story 2:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: the system is actively processing
**When**: the audience looks at the screen
**Then**: they can understand what the system is doing within 2 seconds

**Traceability**: FR-010, SC-005, US-002-scenario-3

**Test Implementation Notes**:
- Visual test: Verify status indicators are visible and clear
- Verify webcam feed is displayed (FR-011)
- Verify connection status badges present

---

### TS-007: Graceful degradation when bulb unreachable

**Source**: spec.md:User Story 3:scenario-1
**Type**: acceptance
**Priority**: P2

**Given**: the Shelly bulb is unreachable
**When**: the system attempts to send a color
**Then**: the on-screen feedback continues working and shows a clear "device offline" indicator

**Traceability**: FR-007, SC-004, US-003-scenario-1

**Test Implementation Notes**:
- Backend: Mock Shelly client to return timeout/error
- Verify API returns `{ success: false, bulb_reachable: false }`
- Frontend: Verify offline indicator displayed
- Verify color detection loop continues

---

### TS-008: Webcam reconnection recovery

**Source**: spec.md:User Story 3:scenario-2
**Type**: acceptance
**Priority**: P2

**Given**: the webcam fails or is disconnected
**When**: the application detects this
**Then**: it displays a clear message and recovers automatically when the camera is reconnected

**Traceability**: FR-008, US-003-scenario-2

**Test Implementation Notes**:
- Frontend: Mock MediaDevices to simulate disconnect
- Verify error message displayed
- Mock reconnection, verify detection resumes

---

### TS-009: Throttling skips intermediate colors

**Source**: spec.md:User Story 3:scenario-3
**Type**: acceptance
**Priority**: P2

**Given**: network latency causes delays
**When**: color commands queue up
**Then**: the system skips intermediate colors and sends only the latest detected color

**Traceability**: FR-009, US-003-scenario-3

**Test Implementation Notes**:
- Frontend: Verify throttle interval >= 300ms
- Simulate rapid color changes (10 in 500ms)
- Verify only 1-2 API calls made (not 10)

---

## From plan.md (Contract Tests)

### TS-010: POST /api/color accepts valid RGB values

**Source**: plan.md:API Contract:POST /api/color
**Type**: contract
**Priority**: P1

**Given**: API is available
**When**: POST /api/color with `{ "red": 255, "green": 128, "blue": 0 }`
**Then**: Response status is 200, body contains `{ "success": true, "bulb_reachable": true }`

**Traceability**: FR-003

---

### TS-011: POST /api/color rejects invalid RGB values

**Source**: plan.md:API Contract:POST /api/color
**Type**: contract
**Priority**: P1

**Given**: API is available
**When**: POST /api/color with `{ "red": 300, "green": -1, "blue": 0 }`
**Then**: Response status is 400, body contains error message

**Traceability**: FR-003

---

### TS-012: GET /api/status returns connection health

**Source**: plan.md:API Contract:GET /api/status
**Type**: contract
**Priority**: P1

**Given**: API is available and bulb is configured
**When**: GET /api/status
**Then**: Response contains `bulb_configured`, `bulb_reachable`, `bulb_ip` fields

**Traceability**: FR-010

---

### TS-013: POST /api/settings configures bulb IP

**Source**: plan.md:API Contract:POST /api/settings
**Type**: contract
**Priority**: P1

**Given**: API is available
**When**: POST /api/settings with `{ "bulb_ip": "192.168.1.100" }`
**Then**: Response status is 200, subsequent GET /api/status shows configured IP

**Traceability**: FR-012

---

### TS-014: Shelly client builds correct URL for color command

**Source**: plan.md:Shelly Gen1 API Integration
**Type**: contract
**Priority**: P1

**Given**: Shelly client is initialized with IP "192.168.1.100"
**When**: setColor(255, 128, 0) is called
**Then**: HTTP GET is made to `http://192.168.1.100/light/0?turn=on&red=255&green=128&blue=0&gain=100`

**Traceability**: FR-003

---

## From data-model.md (Validation Tests)

### TS-015: Color entity validates RGB range 0-255

**Source**: data-model.md:Color:Constraints
**Type**: validation
**Priority**: P1

**Given**: Color entity constructor
**When**: red=256 is provided
**Then**: Validation error is returned (value must be 0-255)

**Traceability**: FR-003

---

### TS-016: Color entity validates all channels required

**Source**: data-model.md:Color:Constraints
**Type**: validation
**Priority**: P1

**Given**: Color entity constructor
**When**: only red and green provided (blue missing)
**Then**: Validation error is returned (all channels required)

**Traceability**: FR-003

---

### TS-017: BulbConfiguration validates IP format

**Source**: data-model.md:BulbConfiguration:Constraints
**Type**: validation
**Priority**: P2

**Given**: BulbConfiguration entity
**When**: ip_address="not-an-ip" is provided
**Then**: Validation error is returned (invalid IP format)

**Traceability**: FR-012

---

## From spec.md (Edge Case Tests)

### TS-018: Neutral colors maintain last known color

**Source**: spec.md:Edge Cases:gray/white/black scene
**Type**: acceptance
**Priority**: P2

**Given**: system has previously detected and sent a red color
**When**: webcam shows a gray/neutral scene
**Then**: system maintains the last known color (red) rather than sending gray

**Traceability**: FR-002

**Test Implementation Notes**:
- Verify no new color command sent for neutral colors
- Or verify approximation algorithm produces reasonable result

---

### TS-019: Rapid color changes are debounced

**Source**: spec.md:Edge Cases:rapid color changes
**Type**: acceptance
**Priority**: P2

**Given**: system is actively detecting colors
**When**: colors change rapidly (multiple times per second)
**Then**: system throttles to max 2-3 updates per second

**Traceability**: FR-009

**Test Implementation Notes**:
- Same as TS-009, validates throttle behavior

---

### TS-020: Initial state shows "waiting for color"

**Source**: spec.md:Edge Cases:first launch
**Type**: acceptance
**Priority**: P2

**Given**: application just launched
**When**: no color has been detected yet
**Then**: UI shows a clear "waiting for color" state

**Traceability**: FR-010

**Test Implementation Notes**:
- Verify initial render shows placeholder/loading state
- Verify state clears when first color detected

---

### TS-021: Auto-start on application launch

**Source**: spec.md:Clarifications:auto-start
**Type**: acceptance
**Priority**: P1

**Given**: application launches
**When**: page loads
**Then**: color detection starts immediately without user interaction

**Traceability**: FR-013, SC-006

**Test Implementation Notes**:
- Verify webcam access requested on init
- Verify detection loop starts automatically

---

### TS-022: Live webcam feed displayed alongside color

**Source**: spec.md:Clarifications:webcam feed display
**Type**: acceptance
**Priority**: P1

**Given**: webcam is active
**When**: application is running
**Then**: live video feed is visible on screen alongside color display

**Traceability**: FR-011

**Test Implementation Notes**:
- Verify video element present in DOM
- Verify video srcObject is set to MediaStream

---

## Summary

| Source | Count | Types |
|--------|-------|-------|
| spec.md (User Stories) | 9 | acceptance |
| spec.md (Edge Cases) | 5 | acceptance |
| plan.md (API) | 5 | contract |
| data-model.md | 3 | validation |
| **Total** | **22** | |

### Priority Distribution

| Priority | Count |
|----------|-------|
| P1 | 15 |
| P2 | 7 |
