Implement Proposal 1: "Modul Mediasi & Arbitrase Sengketa Klaim (Dispute & BAK Resolver)" alongside the 4 existing modules in the sidebar of the TELISIK platform (Powered by Clarix AI) to resolve pending and disputed JKN claims against Berita Acara Kesepakatan (BAK) Kemenkes and clinical guidelines. [OPEN: What is the primary purpose and target environment?]

Integrity mode: [OPEN: Which of these should the team NOT be allowed to do?]

Reference material: docs/0-grounding.md, docs/1-research-brief.md

## Requirements

### R1. Dispute & BAK Resolver Module
Implement the dispute mediation and arbitration workspace accessible via sidebar navigation (e.g. `/claims/disputes`) for claims with status PENDING_KLARIFIKASI_RS or DISPUTE, providing side-by-side comparison of hospital rebuttal/appeals against BPJS audit findings and generating structured arbitration decisions aligned with BAK Kemenkes (2020-2024) and PNPK.

### R2. Backend API & AI Integration
Integrate with the backend FastAPI service for dispute data retrieval and AI-powered dispute mediation analysis. The AI mediation engine must use an appropriate model and strictly NOT use Gemini Pro. [OPEN: Which AI provider/model should be prioritized?]

### R3. Information Security & Zero Leakage
Do not expose internal secrets, credentials, API keys, or raw internal system prompts to the frontend UI application.

### R4. Restrained UI & Anti-Slop Design
Adhere strictly to zero design waste and anti-slop guidelines: no redundant confirmation banners, no pulsing pings or decorative tags, consistent row styling, clean Plus Jakarta Sans typography, and tabular figures.

## Acceptance Criteria

### Visual & Layout Verification (Playwright)
- [ ] Playwright test scripts are located strictly in `.playwright-scratch/` within the local workspace, and `.playwright-scratch/` is listed in `.gitignore`.
- [ ] Playwright tests verify that the dispute module layout is aesthetically clean, responsive, and free of AI-slop artifacts.

### Backend & Functional Verification
- [ ] Dispute mediation endpoint successfully executes arbitration analysis using an approved AI model (excluding Gemini Pro).
- [ ] Frontend dispute workspace displays claim rebuttals, BAK matching rationale, and arbitration results seamlessly without exposing sensitive credentials or raw prompts.
- [ ] [OPEN: Are there existing test suites or evaluation references to verify against, or should mock dispute cases be generated?]
