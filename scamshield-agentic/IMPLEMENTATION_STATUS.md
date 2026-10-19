# Implementation status

| Capability | Status | Notes |
|---|---|---|
| Existing dashboard | Implemented / preserved | `web/public/index.html` copied from supplied HTML |
| Local rule-based triage | Implemented | Heuristic patterns only |
| URL structure checks | Implemented | URL is not opened; no live reputation lookup |
| Multi-stage orchestration | Implemented | Separate named stages and event timeline |
| LLM context agent | Optional / configuration-gated | Requires API key and explicit `ALLOW_MESSAGE_TO_LLM=true` |
| Evidence verifier | Implemented, heuristic | Deduplicates overlapping signals and caps model points; not a formal proof checker |
| Safety advice | Implemented | General harm-reduction recommendations |
| Android manual scan UI | Implemented starter | React Native / Expo app calls backend |
| Android automatic SMS monitoring | Not implemented | Requires separate native design, permissions, consent and policy review |
| Live URL reputation | Not implemented | Provider not configured |
| Production-ready accuracy | Not implemented | Needs evaluation data and calibration |
