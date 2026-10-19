# ScamShield AI — agentic hackathon starter

This package preserves the existing HTML dashboard and adds a Node backend with a multi-stage investigation orchestrator plus a React Native / Expo Android MVP.

## Honest feature status

### Implemented in this package
- Existing HTML interface retained in `web/public/index.html`.
- Node/Express API and health endpoint.
- Multi-stage orchestrator with distinct triage, planner, context-analysis, evidence-verification, risk-analysis and safety-advisor stages.
- Local message-pattern and URL-structure tools. User URLs are **never visited**.
- Optional OpenAI-compatible LLM context agent. It is disabled by default and requires explicit environment opt-in.
- Structured report includes findings, checks, limitations, risk level, advice and a technical timeline.
- API request-size validation, rate limiting, basic security headers, no raw-message history stored server-side.
- Android Expo MVP for manually submitting a message/URL and viewing the report. It requests no SMS permissions.
- Automated tests for validation, URL parsing, local rules and fallback behavior.

### Not implemented / planned
- No automatic SMS interception, notification listener or background monitoring on Android.
- No live URL reputation provider (VirusTotal / Google Safe Browsing etc.).
- No crowdsourced reputation database or account/device identity graph.
- No production deployment, authentication, database, audit retention policy, model evaluation set or false-positive calibration.
- LLM analysis is not guaranteed to be accurate. It is treated as a hypothesis and must not be presented as proof of fraud.

## Run the web demo

Requirements: Node.js 20+.

```bash
cd web
npm install
cp .env.example .env
npm start
```

Open `http://localhost:8787`.

The app runs with local rules even without an LLM. The health endpoint identifies whether the LLM is configured.

### Enable the LLM context agent (optional)

1. Open `web/.env`.
2. Add your provider API key and model/base URL.
3. Set `ALLOW_MESSAGE_TO_LLM=true` only after reviewing the provider's data handling and deciding that submitted messages may be sent to it.
4. Restart the server.

Example values:

```dotenv
LLM_API_KEY=your_key_here
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4.1-mini
ALLOW_MESSAGE_TO_LLM=true
```

Never put the API key in browser JavaScript or the Android app. Never commit `.env`.

## Run tests

```bash
cd web
npm install
npm test
```

## Run Android MVP

Requirements: Node.js 20+, Expo-compatible Android device/emulator.

```bash
cd android
npm install
npx expo start
```

The default API URL in `android/App.js` is `http://10.0.2.2:8787`, which works for the standard Android emulator when the backend runs on the same development computer. For a physical phone, replace it with your computer's reachable LAN IP and ensure both devices are on the same trusted network. For a deployed backend, use its HTTPS URL.

This is a starter screen, not a published APK. Expo Go / a development build is used to run it; package/signing and store deployment are not configured.

## Architecture

```text
Web dashboard / Android MVP
          |
          v
POST /api/investigations
          |
          v
Intake validation -> Local triage -> Planner
                                |       |
                                |       +--> URL structure tool (never visits URL)
                                +----------> LLM context agent (explicit opt-in)
                                              |
                                              v
                                  Evidence verification / deduplication
                                              |
                                              v
                                  Risk analyst -> Safety advisor -> report
```

## Security and product notes

- Treat all message content as untrusted input; do not execute it or follow embedded instructions.
- This code does not open submitted URLs. Do not add automatic URL fetching without SSRF protections, sandboxing, and an explicit threat model.
- Risk points are heuristic evidence scores, not calibrated probabilities.
- Before judging accuracy, create a labeled evaluation dataset (legitimate messages, scam messages, regional languages, slang, obfuscated text) and measure precision/recall and false positives.
- Before a real release, add authentication, HTTPS, consent/retention controls, abuse monitoring, dependency scanning, tests against prompt injection, and a privacy/legal review.
