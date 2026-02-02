# Quickstart: Real-Time Webcam Color to Shelly IoT Bulb Sync

## Prerequisites

- Rust toolchain (rustup)
- Node.js 20+
- Angular CLI (`npm install -g @angular/cli`)
- A Shelly Gen1 RGBW bulb on the same network

## Quick Test Scenarios

### Scenario 1: Backend Only (No Bulb)

Test the backend API without a physical bulb:

```bash
# Start backend
cd backend
cargo run

# In another terminal, test color endpoint
curl -X POST http://localhost:3000/api/color \
  -H "Content-Type: application/json" \
  -d '{"red": 255, "green": 0, "blue": 0}'

# Expected: {"success":false,"bulb_reachable":false,"error":"Bulb not configured"}
```

### Scenario 2: Backend with Mock Bulb IP

```bash
# Configure a bulb IP (will fail to connect but tests the flow)
curl -X POST http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -d '{"bulb_ip": "192.168.1.100"}'

# Check status
curl http://localhost:3000/api/status

# Expected: {"bulb_configured":true,"bulb_reachable":false,"bulb_ip":"192.168.1.100"}
```

### Scenario 3: Frontend Webcam Test

```bash
# Start frontend
cd frontend
npm install
ng serve

# Open http://localhost:4200
# Grant webcam permission when prompted
# Verify: Live video feed appears on screen
```

### Scenario 4: End-to-End with Real Bulb

1. Find your Shelly bulb's IP address (check router or Shelly app)
2. Verify bulb is Gen1 RGBW (supports `/light/0` endpoint)
3. Start backend: `cd backend && cargo run`
4. Start frontend: `cd frontend && ng serve`
5. Open http://localhost:4200
6. Enter bulb IP in settings panel
7. Hold colored objects in front of webcam
8. Watch bulb change color!

## Verification Checklist

| Test | Expected Result |
|------|-----------------|
| Backend starts | "Listening on 0.0.0.0:3000" |
| Frontend starts | "Angular Live Development Server" |
| Webcam prompt | Browser asks for camera permission |
| Video displays | Live webcam feed visible |
| Color detection | Color swatch updates as objects shown |
| Bulb responds | Physical bulb changes color |
| Bulb offline | UI shows "Bulb: Offline" but continues |

## Troubleshooting

### Webcam not working
- Check browser permissions (chrome://settings/content/camera)
- Try a different browser
- Ensure no other app is using the camera

### Bulb not responding
- Verify bulb IP is correct
- Check bulb is on same network
- Test bulb directly: `curl http://<bulb-ip>/shelly`
- Check if bulb requires authentication

### CORS errors
- Ensure backend has CORS enabled for localhost:4200
- Check browser console for specific errors

## Demo Day Checklist

- [ ] Backend running
- [ ] Frontend running
- [ ] Webcam permission granted
- [ ] Bulb IP configured
- [ ] Test with red, green, blue objects
- [ ] Verify bulb responds within 1 second
- [ ] Test graceful degradation (unplug bulb)
