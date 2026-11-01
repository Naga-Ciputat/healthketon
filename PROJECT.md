# Project: Modul Mediasi & Arbitrase Sengketa Klaim (Dispute & BAK Resolver) — TELISIK Platform

## Architecture
- **System Overview**: TELISIK (Powered by Clarix AI) clinical audit platform extended with a 5th core module: "Mediasi & Sengketa Klaim" (`/claims/disputes`).
- **Frontend Layer**: Next.js 15 App Router (`frontend/app/claims/disputes/page.tsx`), navigation via `frontend/components/widgets/ClarixSidebar.tsx`, modular side-by-side appeal vs audit comparator, AI consensus console, and modal generator for official Berita Acara Kesepakatan Bersama Arbitrase Sengketa Klaim.
- **Backend Layer**: FastAPI service under `backend/app/api/v1/disputes.py`, registered in `backend/app/api/v1/__init__.py`. Exposes RESTful endpoints for dispute triage listing, dispute dossier retrieval, AI mediation analysis against BAK Kemenkes (2020–2024) and PNPK standards, agreement generation, and immutable resolution logging into PostgreSQL `audit_trail_logs`.
- **AI Mediation Engine**: Fast model inference using Groq LPU LLaMA 3.3 70B (`llama-3.3-70b-versatile`) or Gemini Flash (`gemini-2.5-flash`), with strict code-level guardrails prohibiting Gemini Pro (`"pro"` in model name raises error per R2). Fully paired with deterministic BAK rule matching and offline fallback.
- **Security & Privacy Layer**: Strict zero secret leakage (R3). No API keys, credentials, or raw prompts in responses or frontend bundles. Patient identifiers sanitized.
- **Design System & Zero Design Waste**: Compliant with `.agents/rules/no-design-waste.md` and antislop guidelines. Plus Jakarta Sans typography, tabular numerals, neutral borders, no superfluous notification banners, no glowing rings, no pulsing ping dots, and no decorative tags.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---|---|---|---|
| F-01 | Sidebar Navigation Entry | Add 5th navigation item "Mediasi & Sengketa Klaim" routing to `/claims/disputes` with icon `Scale` and pending badge in `ClarixSidebar.tsx`. | M2 | R1, Frontend Survey |
| F-02 | Dispute Queue & Filter | Workspace list filtering claims with status `PENDING_KLARIFIKASI_RS` and `DISPUTE`, with 14–30 day SLA countdown and search. | M2 | R1, Spec Miner |
| F-03 | Side-by-Side Appeal vs Audit Comparator | Dual-pane split view: Left pane shows Hospital Appeal & Rebuttal (Surat Sanggahan, DPJP clinical notes, evidence documents); Right pane shows BPJS Audit Objection findings. | M2 | R1, Frontend Survey |
| F-04 | BAK Kemenkes (2020–2024) Clause Matcher | Corpus of 8 BAK Kemenkes consensus topics and PNPK standards matched against disputed clinical arguments. | M1, M2 | R1, Spec Miner |
| F-05 | Fast AI Mediation Engine (No Gemini Pro) | Backend AI analysis engine using Groq LPU LLaMA 3.3 70B or Gemini Flash (strictly NO Gemini Pro) providing neutral mediation recommendations. | M1 | R2, Backend Survey |
| F-06 | Structured Dispute Arbitration Agreement Generator | Interactive generator and preview modal for formal Berita Acara Kesepakatan Bersama with 3 resolution options (`LAYAK`, `TIDAK_LAYAK`, `LAYAK_DENGAN_KOREKSI`), agreed codes/tariffs, and dual signatures. | M2 | R1, Spec Miner |
| F-07 | Backend Dispute REST API | FastAPI endpoints (`GET /disputes`, `GET /disputes/{id}`, `POST /disputes/{id}/analyze`, `POST /disputes/{id}/generate-agreement`, `POST /disputes/{id}/resolve`). | M1 | R2, Backend Survey |
| F-08 | Graceful Offline Fallback & Standalone Store | Client-side store (`disputeData.ts`, `disputeStore.ts`) providing full offline demo functionality if backend service is unreachable. | M2 | R2, Frontend Survey |
| F-09 | Zero Secret Leakage & Privacy Shield | Sanitized payloads, zero API keys or backend system prompts in client bundles or API responses. | M1, M2 | R3, All Surveys |
| F-10 | Restrained UI & Anti-Slop Enforcement | Strict adherence to clean institutional aesthetics, zero design waste (no ping dots, no glowing rings, no redundant status toasts). | M2 | R4, All Surveys |
| F-11 | Resolution Audit Trail Logging | Permanent append-only logging of arbitration decisions to PostgreSQL `audit_trail_logs` with WIB timestamps. | M1 | Backend Survey |
| F-12 | E2E Playwright Automated Test Suite | Comprehensive Playwright test suite in `.playwright-scratch/` verifying routing, layout, AI mediation, agreement generation, zero leakage, and zero visual anomalies. | M3 | R1-R4, All Surveys |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Backend Dispute API & Fast AI Mediation Engine | Create `backend/app/api/v1/disputes.py`, data models, BAK matcher, Groq LLaMA 3.3 / Gemini Flash engine (strictly no Pro), resolve endpoint with `audit_trail_logs` integration, zero-leakage security, and `test_dispute_api.py`. | none | DONE (commit a4dabfa) |
| M2 | Frontend Navigation, Dispute Workspace & Arbitration Modal | Update `ClarixSidebar.tsx`, create `frontend/lib/disputeData.ts`, `frontend/lib/disputeStore.ts`, API integration in `lib/api.ts`, create `/claims/disputes/page.tsx` with side-by-side comparator, AI consensus panel, and Berita Acara modal following restrained UI rules. | M1 (contracts) | DONE (commit 95f38c3) |
| M3 | E2E Testing Track, Playwright Verification & Forensic Audit | Dual track test suite: `TEST_INFRA.md`, `TEST_READY.md`, Playwright automated test script in `.playwright-scratch/test_dispute_module.mjs`, integration verification, Challenger verification, and Forensic Audit. | M1, M2 | DONE (`TEST_READY.md` ALL_PASS, commit 90b6021, gate PASS) |

## Interface Contracts

### Backend Dispute API ↔ Frontend Client
- Base Route: `/api/v1/disputes`
- Models:
  - `DisputeItem`:
    ```ts
    interface DisputeItem {
      claimId: string;
      hospitalName: string;
      hospitalClass: string;
      patientAge: number;
      patientGender: "L" | "P";
      dpjpName: string;
      dpjpSpecialty: string;
      admissionDate: string;
      dischargeDate: string;
      primaryDiagnosis: { code: string; name: string };
      claimedTariff: number;
      bpjsProposedTariff: number;
      deltaTariff: number;
      disputeReason: string;
      disputeStatus: "PENDING_KLARIFIKASI_RS" | "DISPUTE" | "SEPAKAT_MEDIASI" | "ESKALASI_TAPK";
      slaDaysRemaining: number;
      hospitalRebuttal: {
        statement: string;
        submittedAt: string;
        dpjpName: string;
        dpjpNotes: string;
        supportingEvidence: string[];
      };
      bpjsFinding: {
        findingType: string;
        title: string;
        description: string;
        verbatimQuote: string;
        sourceDocument: string;
        regulationReference: string;
        claimedDeltaTariff: number;
      };
      matchedBak: {
        regulationCode: string;
        year: number;
        title: string;
        relevantClause: string;
        rulingInterpretation: string;
      };
    }
    ```
  - `POST /api/v1/disputes/{claim_id}/analyze`:
    - Request: `{ focus?: string, additionalNotes?: string }`
    - Response:
      ```ts
      interface MediationAnalysisResponse {
        recommendationType: "SEPAKAT_DOWNCODE" | "SETUJUI_KLAIM_RS" | "TOLAK_SENGKETA_RS" | "ESKALASI_TAPK";
        recommendedTariff: number;
        tariffAdjustmentDelta: number;
        bakMatchedArticle: string;
        clinicalRationale: string;
        reasoningSteps: string[];
        compromiseTerms: string[];
        confidenceScore: number;
        inferenceModelUsed: string; // e.g. "Groq LPU LLaMA 3.3 70B" or "Gemini 2.5 Flash"
      }
      ```
  - `POST /api/v1/disputes/{claim_id}/generate-agreement`:
    - Request: `{ resolutionType: string, agreedTariff: number, agreedIcd10: string, agreedInacbg: string, notes: string, mediatorRs?: string, mediatorBpjs?: string }`
    - Response: `{ letterNumber: string, agreementTitle: string, legalClauses: string[], fullDraftHtml: string, generatedAt: string }`
  - `POST /api/v1/disputes/{claim_id}/resolve`:
    - Request: `{ resolutionType: string, finalTariff: number, officialLetterNumber: string, agreementText: string, notes: string }`
    - Response: `{ success: boolean, claimId: string, updatedStatus: string, auditLogId: string, timestamp: string }`

## Code Layout
- `backend/app/api/v1/disputes.py` (New): Dispute REST API router and fast AI mediation logic.
- `backend/app/api/v1/__init__.py` (Edit): Register `disputes_router`.
- `backend/test_dispute_api.py` (New): Comprehensive backend tests for disputes API, fast model verification, and zero leakage.
- `frontend/components/widgets/ClarixSidebar.tsx` (Edit): Add 5th navigation item for Mediasi & Sengketa Klaim.
- `frontend/lib/disputeData.ts` (New): Structured dispute claim scenarios, BAK Kemenkes corpus, and types.
- `frontend/lib/disputeStore.ts` (New): Client-side reactive dispute state management with offline persistence.
- `frontend/lib/api.ts` (Edit): Add dispute API fetchers with graceful local fallback.
- `frontend/app/claims/disputes/page.tsx` (New): Dispute workspace page with side-by-side comparison, AI consensus panel, and Berita Acara agreement modal.
- `.playwright-scratch/test_dispute_module.mjs` (New): Playwright automated test script testing complete user journey.
