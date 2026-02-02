# Feature Specification: Real-Time Webcam Color to Shelly IoT Bulb Sync

**Feature Branch**: `001-realtime-color-sync`
**Created**: 2026-02-02
**Status**: Draft
**Input**: User description: "Capture dominant color from webcam, send to Shelly IoT bulb, provide real-time visual feedback - combined as a single demo feature"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Live Color Capture Demo (Priority: P1)

As a presenter at JFokus 2026, I want to hold up colored objects to my webcam and have the Shelly bulb instantly change to match that color, so that the audience can see a real-time IoT integration in action.

**Why this priority**: This is the core demo moment - the "wow factor" that demonstrates real-time IoT capability. Without this working, there is no demo.

**Independent Test**: Can be fully tested by pointing a webcam at a red object and observing the bulb turn red within 1 second. Delivers immediate visual proof of the system working.

**Acceptance Scenarios**:

1. **Given** the application is running and webcam is active, **When** the presenter holds up a red object in front of the camera, **Then** the Shelly bulb changes to red within 1 second
2. **Given** the bulb is currently red, **When** the presenter holds up a blue object, **Then** the bulb transitions smoothly to blue
3. **Given** the webcam feed shows multiple colors, **When** the system analyzes the frame, **Then** it identifies and uses the single most dominant color

---

### User Story 2 - Audience-Visible Feedback (Priority: P1)

As a conference audience member, I want to see on the presenter's screen what color the system detected and what color was sent to the bulb, so I can understand what's happening even if I can't see the physical bulb clearly.

**Why this priority**: Conference halls are large. The back rows may not see the physical bulb. On-screen feedback makes the demo work for everyone in the room.

**Independent Test**: Can be tested by observing the screen display while colors change - even without a physical bulb connected, the visual feedback demonstrates the detection is working.

**Acceptance Scenarios**:

1. **Given** the application is displayed on a projector, **When** a color is detected from the webcam, **Then** the detected color is displayed prominently on screen (visible from back of room)
2. **Given** a color is being sent to the bulb, **When** the transmission occurs, **Then** the screen shows the exact color being sent to the device
3. **Given** the system is actively processing, **When** the audience looks at the screen, **Then** they can understand what the system is doing within 2 seconds

---

### User Story 3 - Graceful Error Handling (Priority: P2)

As a presenter, I want the demo to handle errors gracefully without crashing or showing confusing error messages, so the demo continues smoothly even if the bulb connection drops.

**Why this priority**: Live demos have unpredictable conditions. The system should degrade gracefully rather than fail catastrophically.

**Independent Test**: Can be tested by disconnecting the bulb mid-demo and observing the application continues to show color detection without crashing.

**Acceptance Scenarios**:

1. **Given** the Shelly bulb is unreachable, **When** the system attempts to send a color, **Then** the on-screen feedback continues working and shows a clear "device offline" indicator
2. **Given** the webcam fails or is disconnected, **When** the application detects this, **Then** it displays a clear message and recovers automatically when the camera is reconnected
3. **Given** network latency causes delays, **When** color commands queue up, **Then** the system skips intermediate colors and sends only the latest detected color

---

### Edge Cases

- What happens when no dominant color can be determined (gray/white/black scene)?
  - System should either send the closest approximation or maintain the last known color
- How does the system handle rapid color changes (waving multiple colored objects quickly)?
  - System should debounce/throttle to prevent overwhelming the bulb with commands
- What happens if the webcam feed is very dark or very bright?
  - System should indicate the lighting condition is suboptimal but continue attempting detection
- What happens on first launch before any color is detected?
  - System should show a clear "waiting for color" state rather than showing nothing

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST capture video frames from the device's webcam in real-time
- **FR-002**: System MUST extract the dominant color from each captured video frame
- **FR-003**: System MUST send color commands to a Shelly IoT bulb
- **FR-004**: System MUST update the bulb color within 1 second of detecting a color change
- **FR-005**: System MUST display the currently detected color on screen in a format visible from 20+ meters away
- **FR-006**: System MUST display the color currently being sent to the bulb
- **FR-007**: System MUST continue functioning if the bulb becomes unreachable (graceful degradation)
- **FR-008**: System MUST recover automatically when a disconnected camera is reconnected
- **FR-009**: System MUST throttle color updates to prevent overwhelming the bulb (no more than 2-3 updates per second)
- **FR-010**: System MUST provide clear visual indication of connection status (webcam connected, bulb reachable)
- **FR-011**: System MUST display the live webcam feed on screen alongside the detected color display
- **FR-012**: System MUST provide an on-screen settings panel to configure the Shelly bulb connection (IP address/hostname)
- **FR-013**: System MUST auto-start color detection immediately when the application launches (no manual start required)

### Key Entities

- **Detected Color**: The dominant color extracted from the current webcam frame (represented as a color value)
- **Bulb State**: The current color of the Shelly bulb and its connection status
- **Connection Status**: Whether the webcam and bulb are currently reachable and functioning

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Color changes are reflected on the bulb within 1 second of presenting a new colored object to the webcam
- **SC-002**: Audience members at the back of a conference hall (20+ meters) can clearly see the detected color on the projected screen
- **SC-003**: The demo runs continuously for 5+ minutes without crashes or freezes under normal conference conditions
- **SC-004**: When the bulb is disconnected, the on-screen visualization continues working without interruption
- **SC-005**: 95% of audience members understand what the demo is doing within 10 seconds of watching (clear visual communication)
- **SC-006**: The presenter can complete the demo without touching any controls after initial start (fully automatic operation)

## Clarifications

### Session 2026-02-02

- Q: Should the live webcam feed be displayed on screen alongside the color display? -> A: Yes, show live webcam feed on screen alongside color display
- Q: How should the Shelly bulb connection be configured? -> A: On-screen settings panel (configure during demo if needed)
- Q: Should color detection start automatically or require manual start? -> A: Auto-start immediately when app launches
