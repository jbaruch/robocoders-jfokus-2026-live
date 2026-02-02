<!--
╭─────────────────────────────────────────────────────────────────╮
│  SYNC IMPACT REPORT                                             │
├─────────────────────────────────────────────────────────────────┤
│  Version: 1.0.0 (initial)                                       │
│  Modified principles: N/A (new document)                        │
│  Added sections: All (initial creation)                         │
│  Removed sections: None                                         │
│  Templates requiring updates: None                              │
│  Follow-up TODOs: None                                          │
╰─────────────────────────────────────────────────────────────────╯
-->

# Shelly IoT Color Picker Constitution

## Core Principles

### I. Demo-First Development

Simplicity takes absolute priority over features. This is a live conference demo for
JFokus 2026 where audience engagement depends on immediate visual clarity.

- If a feature takes too long to implement, simplify or cut it
- Every decision must answer: "Will this make the demo better?"
- Prefer working software over perfect software
- The audience must understand what's happening within seconds

**Rationale**: Conference demos have hard time constraints. A simple working demo beats
a complex broken one. The goal is to wow the audience, not to build production software.

### II. Test-Driven Development (NON-NEGOTIABLE)

Tests are written before implementation code. No exceptions.

- Red-Green-Refactor cycle strictly enforced
- Tests must be written and reviewed before implementation begins
- Tests define the expected behavior; implementation fulfills the contract
- No feature is complete until tests pass

**Rationale**: TDD ensures we build what we intend to build. For a demo, this prevents
last-minute surprises and guarantees reliable behavior on stage.

### III. Visual Clarity for Audience

The UI must be readable and understandable from the back rows of a conference hall.

- Large, high-contrast visual elements
- Clear indication of what the system is doing at any moment
- Real-time feedback visible to the entire audience
- No cluttered interfaces or small text

**Rationale**: A demo UI is not a production UI. The audience experience is the product.

### IV. Intentional Design (No AI Slop)

The interface must be clean, modern, and deliberately designed.

- No generic or template aesthetics
- Every visual choice must be intentional
- Avoid default styles that look auto-generated
- The design should feel crafted, not generated

**Rationale**: Conference attendees are developers who can spot lazy design. A polished
demo reflects well on the technology being demonstrated.

## Demo Context

This project demonstrates real-time IoT integration at JFokus 2026:
- Capture dominant color from webcam
- Send color to Shelly IoT bulb in real-time
- Provide clear visual feedback to live audience

The demo must work reliably under conference conditions (variable lighting, network
constraints, time pressure).

## Quality Standards

- Working beats perfect
- Fast iteration over comprehensive planning
- Visual impact over feature completeness
- Reliability over flexibility

## Governance

This constitution governs all development decisions for the shelly-iot-color-picker
project.

- All code changes must comply with these principles
- Principle conflicts resolve in favor of Demo-First (Principle I)
- TDD requirement (Principle II) cannot be waived
- Amendments require explicit documentation and version increment

**Version**: 1.0.0 | **Ratified**: 2026-02-02 | **Last Amended**: 2026-02-02
