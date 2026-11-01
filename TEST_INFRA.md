# TEST INFRASTRUCTURE SPECIFICATION: DISPUTE & BAK RESOLVER
**Platform:** TELISIK (Powered by Clarix AI)  
**Module:** Modul Mediasi & Arbitrase Sengketa Klaim (Dispute & BAK Resolver)  
**Track:** End-to-End Automated Browser Testing & API Verification Track  
**Document Status:** Production Test Specification  
**Version:** 1.0.0 (Milestone M3)

---

## 1. System Architecture Overview

The **Modul Mediasi & Arbitrase Sengketa Klaim (Dispute & BAK Resolver)** is the 5th core clinical audit capability of the TELISIK platform. It addresses the 10%–25% pending and disputed claim volume in Indonesian JKN hospital operations, bridging hospital appeal documentation (`Surat Sanggahan`, DPJP clinical notes, laboratory cultures) with BPJS Kesehatan audit objections through Berita Acara Kesepakatan (BAK) Kemenkes (2020–2024) and Panduan Praktik Klinis / PNPK standards.

### Architectural Tiers Under Test
1. **Frontend Presentation & Workspace (`frontend/app/claims/disputes/page.tsx`):**
   - Navigation entry in `frontend/components/widgets/ClarixSidebar.tsx` routing to `/claims/disputes`.
   - Institutional triage filter bar (`PENDING_KLARIFIKASI_RS`, `DISPUTE`, `SEPAKAT_MEDIASI`).
   - Dual-pane side-by-side comparator:
     - **Left Pane:** Hospital Appeal Documentation & Clinical Rebuttal.
     - **Right Pane:** BPJS Audit Finding & BAK Kemenkes Standard Comparator.
   - AI Consensus & Fast Mediation Console.
   - Formal Berita Acara Kesepakatan Bersama Arbitrase Sengketa Klaim (BAMK) preview modal with digital signature stamps.
2. **Client State & Offline Fallback (`frontend/lib/disputeData.ts`, `frontend/lib/disputeStore.ts`):**
   - Autonomous client-side store providing 100% demo continuity if backend server is unreachable.
   - Grounded BAK Kemenkes regulatory corpus (2020–2024) across sepsis criteria, surgical implant unbundling, and medical necessity.
3. **Backend REST API (`backend/app/api/v1/disputes.py`):**
   - FastAPI endpoints (`GET /disputes`, `GET /disputes/{id}`, `POST /disputes/{id}/analyze`, `POST /disputes/{id}/generate-agreement`, `POST /disputes/{id}/resolve`).
   - Fast AI Mediation Engine using Groq LPU LLaMA 3.3 70B or Gemini 2.5 Flash.
   - Code-level guardrails strictly prohibiting Gemini Pro (`"pro"` in model name raises immediate HTTP 400/500 error per R2).
   - Immutable audit logging to PostgreSQL `audit_trail_logs`.

---

## 2. 4-Tier Testing Methodology

Our E2E verification follows an exhaustive 4-tier testing methodology designed for mission-critical healthcare audit platforms:

```
+-----------------------------------------------------------------------+
|  Tier 4: Real-World Dispute Arbitration Scenarios (Grounding Cases)   |
|  - Sepsis Upcoding vs BAK 2023 Art. 4                                 |
|  - Ortopedi Implant Unbundling vs BAK 2021 Art. 7                     |
|  - Surgical Drain in Appendectomy vs BAK 2022 Art. 2                  |
+-----------------------------------------------------------------------+
                                  ▲
+-----------------------------------------------------------------------+
|  Tier 3: Cross-Feature Combinations                                   |
|  - Filter Switch -> Dossier Load -> AI Inference -> BAMK Sign-off     |
|  - Role Context Switching (dr. Siti Aminah <-> dr. Hendrawan Sp.PK)   |
|  - LocalStorage & Audit Stream Synchronization                        |
+-----------------------------------------------------------------------+
                                  ▲
+-----------------------------------------------------------------------+
|  Tier 2: Boundary & Corner Cases                                      |
|  - Offline Network Graceful Degradation                               |
|  - Empty Filter Matches & Re-selection                                |
|  - Modal Backdrop Click, Esc Dismiss, and DOM Scroll Lock Recovery    |
|  - SLA Countdown Criticality Thresholds                               |
+-----------------------------------------------------------------------+
                                  ▲
+-----------------------------------------------------------------------+
|  Tier 1: Feature Coverage                                             |
|  - F-01: Sidebar Navigation Entry (/claims/disputes)                   |
|  - F-02: Dispute Queue & Triage Filter Bar                            |
|  - F-03: Side-by-Side Appeal vs Audit Comparator                      |
|  - F-04: BAK Kemenkes Clause Matcher                                  |
|  - F-05: Fast AI Mediation Engine (Groq LLaMA 3.3 / Gemini Flash)     |
|  - F-06: Berita Acara Kesepakatan Bersama Modal                       |
+-----------------------------------------------------------------------+
```

### 2.1 Tier 1: Feature Coverage
- **TC-T1-01: Sidebar Navigation Integration:**
  - Verify `ClarixSidebar` renders "Mediasi & Sengketa Klaim" with `href="/claims/disputes"`.
  - Verify clicking navigates to `/claims/disputes` without full page refresh or broken state.
  - Verify active nav item visual styling (`bg-blue-50/80 text-blue-800 font-semibold`).
- **TC-T1-02: Dispute Workspace Rendering:**
  - Verify dual-pane layout renders within viewport without horizontal layout breakage or unhandled overflow.
  - Verify left pane displays Hospital Appeal details: DPJP statement, evidence attachments, claimed tariff with `tabular-nums`.
  - Verify right pane displays BPJS Audit Finding: verbatim quotation, regulatory article, delta tariff with `tabular-nums`.
- **TC-T1-03: Triage Queue Status Filter:**
  - Verify status filter chips (`Semua`, `Pending Klarifikasi RS`, `Dalam Sengketa`, `Selesai Mediasi`).
  - Verify toggling between status filters dynamically updates the dispute list.
- **TC-T1-04: Fast AI Mediation Engine:**
  - Verify trigger button "Jalankan Mediasi AI" initiates structured consensus generation.
  - Verify rendered result contains: `rekomendasiKonsensus`, `dasarRegulasiBAK`, `alasanKlinis`, `langkahKompromi`, and `tarifRekomendasi`.
  - Verify model identifier indicates Groq LPU LLaMA 3.3 70B or Gemini Flash (and never Gemini Pro).
- **TC-T1-05: Berita Acara Kesepakatan Bersama Modal:**
  - Verify "Terbitkan Berita Acara Kesepakatan" opens the official arbitration agreement modal.
  - Verify 3 settlement radio options are selectable:
    1. `LAYAK` (Setujui Klaim RS Penuh)
    2. `TIDAK_LAYAK` (Tolak Sengketa RS / Ikuti Temuan BPJS)
    3. `LAYAK_DENGAN_KOREKSI` (Rekonsiliasi Tarif Sepakat Bersama)
  - Verify legal clauses, agreed tariff, and digital signature boxes are visible.
  - Verify finalizing the agreement closes the modal and updates claim status.

### 2.2 Tier 2: Boundary & Corner Cases
- **TC-T2-01: Offline Fallback Resilience:**
  - Simulate backend unavailability (API returning 500 or unreachable).
  - Verify workspace falls back to client mock store without crashing or showing blank screen.
  - Verify AI mediation engine yields deterministic grounded BAK rationale.
- **TC-T2-02: Zero Results State:**
  - Apply search query matching no claim records.
  - Verify clean empty state indicator ("Tidak ada berkas sengketa") without layout collapse.
- **TC-T2-03: Modal Dismiss & Scroll Recovery:**
  - Open Berita Acara modal and press `Escape` or click close button.
  - Verify modal closes cleanly, backdrop removes, and body scroll lock is restored.
- **TC-T2-04: Extreme Delta & Long Narrative Text:**
  - Verify claims with multi-paragraph hospital rebuttals wrap correctly within container with custom scrollbar.
  - Verify large tariff figures (e.g. > Rp 50.000.000) display proper Indonesian currency formatting (`Rp XX.XXX.XXX`).

### 2.3 Tier 3: Cross-Feature Combinations
- **TC-T3-01: End-to-End Arbitration Lifecycle:**
  - Select claim `CLM-2026-089` (status `PENDING_KLARIFIKASI_RS`).
  - Trigger AI Mediation analysis.
  - Click "Terbitkan Berita Acara Kesepakatan".
  - Choose `LAYAK_DENGAN_KOREKSI` (Downcode Sepsis -> Pneumonia Bakterial Berat).
  - Sign and finalize agreement.
  - Verify claim status updates to `SEPAKAT_MEDIASI`.
  - Verify dispute badge decrements.
- **TC-T3-02: User Identity Continuity:**
  - Switch user in sidebar from `dr. Siti Aminah` to `dr. Hendrawan Sp.PK`.
  - Open Berita Acara modal and confirm signature block reflects the currently active verifier.

### 2.4 Tier 4: Real-World Dispute Arbitration Scenarios
- **Scenario A (Sepsis Upcoding vs BAK 2023 Art. 4):**
  - **Clinical Context:** RS Sejahtera Medika appeals primary diagnosis A41.9 (Sepsis) with procalcitonin 0.4 ng/mL and normal lactate.
  - **BPJS Finding:** Does not meet Sepsis-3 / BAK Kemenkes 2023 Article 4 criteria (procalcitonin must be > 0.5 ng/mL or qSOFA >= 2 with organ dysfunction).
  - **Mediation Outcome:** Agreed downcode to J18.9 (Pneumonia Bakterial Berat), adjusting tariff from Rp 28.450.000 to Rp 13.650.000 (Saved delta: Rp 14.800.000).
- **Scenario B (Ortopedi Implant Unbundling vs BAK 2021 Art. 7):**
  - **Clinical Context:** RS Kartika Medika billed implant screws separately from ORIF Plate package.
  - **BPJS Finding:** BAK Kemenkes 2021 Article 7 stipulates fixation screws are inclusive within INA-CBG procedure package.
  - **Mediation Outcome:** Agreed inclusive tariff adjustment.
- **Scenario C (Surgical Drain in Appendectomy vs BAK 2022 Art. 2):**
  - **Clinical Context:** RS Bethesda Mandiri billed complicated laparotomy for standard appendicitis drain.
  - **BPJS Finding:** Unbundling minor drainage from standard appendectomy package.
  - **Mediation Outcome:** Rebuttal partially accepted upon review of operative notes confirming perforation.

---

## 3. Security & Anti-Slop Audit Assertions

The automated test runner executes strict programmatic audits against institutional styling and security rules:

### 3.1 Restrained UI & Zero Design Waste Audit (`RULE[no-design-waste]`)
The Playwright test scans the live DOM for prohibited visual slop:
- **No Glowing Borders:** Must NOT contain `ring-2 ring-blue-500`, `ring-4`, `shadow-blue-500`, or fluorescent glow classes.
- **No Pulsing Dots:** Must NOT contain `animate-ping` or `animate-pulse` on decorative badges.
- **No Redundant Toasts:** Must NOT display superfluous notification banners (*"Berhasil Tersinkronisasi"*, *"Data Telah Dicatat"*, *"Operasi Sukses"*).
- **No AI-Slop Buzzwords:** Tone must remain strictly clinical and institutional (no "AI Superpower", "Magic Resolution", or purple gradients).

### 3.2 Zero Secret Leakage Audit (`RULE[ORIGINAL_REQUEST.md R3]`)
The Playwright test intercepts all console logs, network requests, and scans the full HTML document for:
- API Keys: Pattern matching `gsk_[a-zA-Z0-9]{40,}`, `AIza[0-9A-Za-z-_]{35}`, `sk-[a-zA-Z0-9]{20,}`.
- Credentials: Hardcoded passwords, database connection strings (`postgres://`, `neon.tech`), or internal tokens.
- Raw Prompts: Exposure of internal system instructions or raw backend prompts in user-visible DOM.

---

## 4. Test Runner & Execution Architecture

### 4.1 Runner Environment
- **Runtime:** Node.js v18+ / v20+ with ES Modules (`.mjs`).
- **Engine:** `playwright-core` loaded from global skill directory:
  ```js
  import { chromium } from "file:///C:/Users/User/.gemini/config/skills/playwright-browser-tester/node_modules/playwright-core/index.mjs";
  ```
- **Workspace Location:** Test script is strictly isolated in `.playwright-scratch/test_dispute_module.mjs`.
- **Target URL:** `http://localhost:3000/claims/disputes`.

### 4.2 Step-by-Step Execution Command
To run the automated E2E test suite:
```powershell
# Ensure frontend dev server is running on http://localhost:3000
node .playwright-scratch/test_dispute_module.mjs
```

### 4.3 Automated Verification Steps in Script
1. **Verification 1:** Sidebar navigation item renders and routes to `/claims/disputes`.
2. **Verification 2:** Dispute workspace renders side-by-side comparator (Hospital Rebuttal vs BPJS Audit Finding & BAK Kemenkes standards).
3. **Verification 3:** Triage queue filter switches between claims (`PENDING_KLARIFIKASI_RS`, `DISPUTE`) and updates active dossier.
4. **Verification 4:** Fast AI Mediation Engine triggers and displays structured consensus rationale.
5. **Verification 5:** Berita Acara Kesepakatan Bersama modal opens, allows selecting resolution (`LAYAK`, `TIDAK_LAYAK`, `LAYAK_DENGAN_KOREKSI`), displays final agreed tariff and legal clauses.
6. **Verification 6:** Restrained UI audit confirms zero glowing borders, zero pulsing dots, and zero redundant banners.
7. **Verification 7:** Zero Secret Leakage audit confirms zero API keys, secrets, or raw system prompts in DOM or console.

---

## 5. Artifacts and Reporting
All test runs produce:
- Console test execution logs with structured step-by-step verdicts (`[PASS]` / `[FAIL]`).
- Visual proof screenshots stored in `.playwright-scratch/` (`dispute_01_workspace.png`, `dispute_02_ai_mediation.png`, `dispute_03_berita_acara_modal.png`, `dispute_04_resolution_final.png`).
- Summary publication in `TEST_READY.md`.
