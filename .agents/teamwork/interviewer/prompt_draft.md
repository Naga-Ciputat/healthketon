Implement Proposal 1: "Modul Mediasi & Arbitrase Sengketa Klaim (Dispute & BAK Resolver)" as a capability showcase alongside the existing 4 modules in the sidebar of the TELISIK platform (Powered by Clarix AI) for hospital clinical audit and dispute mediation workflows.

Integrity mode: development

## Verification Resources
- `docs/0-grounding.md`: Grounding on JKN pending/dispute claim rate (10%-25%), dispute causes (49% medical indication, 37.4% coding/BAK Kemenkes), and regulatory dispute timeline context.
- `docs/1-research-brief.md`: Detailed research brief on dispute arbitration and BAK matching rationale.
- `frontend/components/widgets/ClarixSidebar.tsx`: Existing navigation structure and sidebar item patterns.

## Requirements

### R1. Mediasi & Arbitrase Sengketa Klaim Workspace
Add a dedicated dispute resolution module accessible from the primary sidebar navigation in `frontend/components/widgets/ClarixSidebar.tsx` (routing to `/claims/disputes`). The module must provide a workspace for claims with status PENDING_KLARIFIKASI_RS or DISPUTE, enabling side-by-side review of hospital appeals/rebuttals versus BPJS audit findings, matching against BAK Kemenkes (2020-2024) and PNPK standards, and generating structured dispute arbitration agreements.

### R2. Backend Dispute API & AI Mediation Engine
Implement backend API endpoints under `backend/app/api/v1/` for dispute data retrieval and AI-powered mediation analysis. The dispute analysis engine must use an appropriate fast AI model (such as Groq LPU LLaMA 3.3 70B or Gemini Flash) and must strictly NOT use Gemini Pro.

### R3. Information Security & Zero Secret Leakage
Ensure that no internal API keys, server credentials, raw backend system prompts, or unnecessary sensitive debug internals are exposed in the client-side UI or frontend bundles.

### R4. Restrained UI & Anti-Slop Design
Follow restrained UI and anti-slop guidelines: avoid redundant status banners, notification toasts, glowing borders, pulsing animations, or decorative tags. Maintain clean typography using Plus Jakarta Sans, tabular numerals for monetary and code values, and consistent styling with the existing TELISIK platform.

## Acceptance Criteria

### Navigation & Layout Verification
- [ ] Navigation sidebar in `frontend/components/widgets/ClarixSidebar.tsx` contains the dispute module entry ("Mediasi & Sengketa Klaim"), routing to `/claims/disputes`.
- [ ] The dispute workspace presents a clean, readable side-by-side view comparing hospital appeal documentation with BPJS audit findings.
- [ ] The UI does not display redundant notification banners, glowing accent borders, pulsing dots, or decorative tags.

### Functional & AI Integration
- [ ] Backend FastAPI dispute endpoint successfully processes claim dispute queries and generates structured arbitration recommendations against BAK Kemenkes without using Gemini Pro.
- [ ] Frontend dispute module communicates with the backend API with graceful local fallback if the backend service is offline.
- [ ] No API keys, secret credentials, or raw system prompts are rendered or leaked in the client UI.

### Visual & Automated Testing (Playwright)
- [ ] A dedicated Playwright test script is created strictly within `.playwright-scratch/` in the workspace, and `.playwright-scratch/` is ignored in `.gitignore`.
- [ ] Running the Playwright test executes successfully and confirms that the dispute module renders without layout breakage, overflow issues, or AI-slop visual anomalies.
