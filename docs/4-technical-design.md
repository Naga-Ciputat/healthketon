# 4 — Technical Design

**Tema Hackathon:** Detect Smarter, Protect JKN  
**Kategori:** Efisiensi Risiko Fasilitas Kesehatan (Kategori 3.1)  
**Dokumen Rujukan:** [`docs/3-lean-prd.md`](file:///d:/Projects/Web%20Shi/healthkaton/docs/3-lean-prd.md), [`docs/3a-features.md`](file:///d:/Projects/Web%20Shi/healthkaton/docs/3a-features.md), [`docs/3b-end-to-end-flows.md`](file:///d:/Projects/Web%20Shi/healthkaton/docs/3b-end-to-end-flows.md)  
**Gate:** Implementasi antarmuka dan backend dapat dimulai tanpa developer menebak kontrak data dan arsitektur antar-modul.

---

## 1. Arsitektur Sistem & Tanggung Jawab Modul

Sistem dibangun dengan arsitektur monolitik terdistribusi modern (*Modern Decoupled Architecture*):
- **Frontend Layer:** Next.js (App Router, TypeScript) sebagai antarmuka reaktif verifikator dan penampil dokumen cerdas.
- **Backend API & Orchestration Layer:** FastAPI (Python 3.11+) sebagai orkestrator pipeline investigasi, engine aturan, dan eksekutor tool calling.
- **Database & Vector Store:** Neon Database (Serverless PostgreSQL 16 dengan ekstensi `pgvector`).
- **AI Specialized Cloud Providers:** Tri-Engine LLM (Google Gemini, Groq LPU, dan NVIDIA NIM).

```mermaid
graph TB
    subgraph Frontend [Next.js 15 App Router - Port 3000]
        TriagePage["/claims/triage (Queue & Metrics)"]
        DossierPage["/claims/[id]/dossier (Dual-Pane Workspace)"]
        AuditPage["/claims/audit-trail (Append-Only Log)"]
        BenchmarkPage["/benchmark/evaluation-suite (Juri Suite)"]
    end

    subgraph Backend [FastAPI Application - Port 8000]
        API_GW[FastAPI Router /api/v1]
        
        subgraph Pipeline Modules
            IntakeMod[Privacy & Intake Guard]
            RuleMod[Deterministic Filter Engine]
            AgentOrch[Agentic Orchestrator & Tool Loop]
            GroundMod[Verbatim Grounding Verifier]
            AuditMod[Audit & Letter Generator]
        end
    end

    subgraph Database [Neon Serverless PostgreSQL + pgvector]
        T_Claims[(claims & claim_items)]
        T_Docs[(clinical_documents)]
        T_Findings[(evidence_findings)]
        T_Corpus[(hospital_corpus + vector)]
        T_Audit[(audit_trail_logs)]
    end

    subgraph AI_Engines [Tri-Engine AI Specialization]
        Gemini[Google Gemini Flash: Gemini 3.8 Flash / 2.0 Flash Free Tier]
        Groq[Groq LPU Llama-3.3-70B: Ultra-Fast Tool Loop & Drafter]
        NVIDIA[NVIDIA NIM Nemotron-70B & nv-embedqa: Vector Cloning & Scorer]
    end

    Frontend -->|HTTP / JSON REST| API_GW
    API_GW --> IntakeMod & RuleMod & AgentOrch & GroundMod & AuditMod
    
    IntakeMod & RuleMod & AuditMod --> Database
    AgentOrch -->|Doc Embeddings| NVIDIA
    AgentOrch -->|Fast Tool Calling| Groq
    AgentOrch -->|Deep Clinical Context| Gemini
    GroundMod --> Database
```

---

## 2. Pemetaan Model AI per Fitur (Tri-Engine AI Strategy)

Berdasarkan karakteristik teknis masing-masing provider:
1. **Google Gemini (Google AI Studio - Free Tier):**
   - **Model Terpilih:** **Gemini Flash (Generasi Terbaru: `gemini-2.0-flash` atau `gemini-3.8-flash`)**. *Catatan: Gemini Pro sengaja tidak digunakan karena Flash generasi terbaru sudah memiliki penalaran klinis yang sangat memadai, latensi jauh lebih cepat, dan didukung penuh oleh **API Key Free Tier Google AI Studio** (15 RPM / 1M TPM / 1.500 RPD tanpa biaya).*
   - **Peran:** Pemahaman dokumen klinis panjang (*long-context* tanpa *chunking loss*), membaca kombinasi PDF resume medis, laporan operasi, lab, dan PNPK Kemenkes.
2. **Groq (LPU Inference):**
   - **Model Terpilih:** `llama-3.3-70b-versatile` & `llama-3.1-8b-instant`.
   - **Peran:** Ekstraksi alkes kilat ($< 1$ detik), pemanggilan fungsi (*function calling*), dan *generation* instan draf surat klarifikasi resmi.
3. **NVIDIA NIM (build.nvidia.com):**
   - **Model Terpilih:** `nvidia/nv-embedqa-e5-v5` (NeMo Retriever Embedding 1024-dimensi).
   - **Peran:** Menghasilkan dense vector untuk perbandingan kesamaan semantik catatan medis (*Note Cloning*) melawan korpus RS.

| Modul Fitur | AI Provider | Model ID Resmi | Rationale & Alasan Pemilihan |
|---|---|---|---|
| **F4: Upcoding & Clinical Cross-Examiner** | **Google Gemini** | `gemini-2.0-flash` / `gemini-3.8-flash` *(Free Tier)* | Mampu menampung seluruh teks rekam medis, CPPT perawat, tabel lab, dan PNPK Kemenkes dalam satu konteks besar tanpa *chunking loss* dengan kuota gratis Google AI Studio. |
| **F5: Alkes Cross-Checker & Tariff Calc** | **Groq** | `llama-3.3-70b-versatile` | Ekstraksi entitas alkes dari laporan operasi berlangsung instan ($< 1$ detik) dan pemanggilan fungsi kalkulasi tarif berjalan deterministik. |
| **F6: Semantic Note-Cloning Detector** | **NVIDIA NIM** | `nvidia/nv-embedqa-e5-v5` | Mengubah teks resume medis menjadi dense vector berdimensi 1024 untuk pencarian cosine similarity di Neon `pgvector` melawan korpus RS. |
| **F7: Anti-Hallucination Grounding** | **FastAPI Core + Groq** | Algoritma String Exact/Fuzzy + `llama-3.1-8b-instant` (Fallback) | Validasi verbatim dilakukan secara deterministik di level kode Python; jika ada pemisahan tanda baca, model Groq 8B memvalidasi dalam 200 ms. |
| **F9: Dispute Letter Drafter** | **Groq** | `llama-3.3-70b-versatile` | Mengubah temuan tervalidasi menjadi draf surat klarifikasi formal standar BPJS Kesehatan dalam hitungan 1,2 detik saat verifikator menekan tombol. |
| **F10: Benchmark Runner Evaluasi** | **Groq + Gemini** | `llama-3.3-70b-versatile` + `gemini-2.0-flash` | Memungkinkan eksekusi pengujian 30–50 kasus sintetis selesai dalam $< 2$ menit di hadapan dewan juri tanpa terkena batas antrean. |

---

## 3. Database Schema & Relasi (Neon PostgreSQL DDL)

### 3.1 Arsitektur Wadah Tunggal (Unified Single-Container Storage)
Seluruh data aplikasi—baik **tabel relasional SQL standar** (`claims`, `clinical_documents`, `evidence_findings`, `audit_trail_logs`) maupun **vektor semantik** (`hospital_corpus.embedding`)—disimpan dalam **SATU wadah database yang sama di Neon Serverless PostgreSQL**.

**Keuntungan Teknis:**
1. **Cukup 1 Connection String Tunggal:**
   ```env
   DATABASE_URL="postgresql://user:password@ep-cool-fog-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
   ```
2. **Tanpa Vector DB Terpisah:** Tidak perlu mengelola atau membayar layanan terpisah seperti Pinecone, Qdrant, atau Chroma.
3. **Mendukung Relasional SQL JOIN Asli:** Query pencarian kemiripan vektor dapat langsung di-`JOIN` dengan metadata rumah sakit (`hospitals`) dan dokter penanggung jawab (`dpjp_name`) dalam 1 query SQL:
   ```sql
   SELECT c.source_claim_id, c.dpjp_name, 1 - (c.embedding <=> :query_vector) AS similarity
   FROM hospital_corpus c
   WHERE c.hospital_id = :hospital_id
   ORDER BY similarity DESC
   LIMIT 1;
   ```
4. **100% Free Tier:** Neon menyediakan kapasitas gratis 0.5 GB storage dan autoscaling compute yang lebih dari cukup untuk ribuan berkas klaim sintetis.

---

### 3.2 Diagram Entitas Relasi (ERD)
    HOSPITALS ||--o{ CLAIMS : files
    CLAIMS ||--o{ CLINICAL_DOCUMENTS : contains
    CLAIMS ||--o{ EVIDENCE_FINDINGS : generates
    CLAIMS ||--o{ AUDIT_TRAIL_LOGS : records
    HOSPITALS ||--o{ HOSPITAL_CORPUS : owns

    HOSPITALS {
        string id PK
        string name
        string hospital_class
        string region
    }

    CLAIMS {
        string id PK
        string hospital_id FK
        string patient_synthetic_id
        string primary_icd10
        jsonb secondary_icd10
        string inagroup_code
        decimal claimed_tariff
        decimal estimated_fair_tariff
        decimal potential_saving
        string risk_level
        string verification_status
        float priority_score
        timestamp created_at
    }

    CLINICAL_DOCUMENTS {
        string id PK
        string claim_id FK
        string document_type
        text raw_text
        jsonb metadata_json
    }

    EVIDENCE_FINDINGS {
        string id PK
        string claim_id FK
        string finding_type
        string severity
        text description
        text verbatim_quote
        string source_document_type
        int source_page
        int char_start
        int char_end
        decimal delta_rupiah
        float confidence_score
        string regulation_reference
        text alternative_hypothesis
        boolean is_verbatim_verified
    }

    HOSPITAL_CORPUS {
        string id PK
        string hospital_id FK
        string source_claim_id
        string dpjp_name
        text soap_narrative
        vector embedding
        timestamp admission_date
    }

    AUDIT_TRAIL_LOGS {
        string id PK
        string claim_id FK
        string verifier_id
        string action_taken
        text verifier_notes
        text official_letter_draft
        jsonb snapshot_findings
        timestamp created_at
    }
```

### Script DDL PostgreSQL (Neon Database):

```sql
-- Aktifkan ekstensi pgvector di Neon
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Tabel Rumah Sakit Mitra
CREATE TABLE hospitals (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    hospital_class VARCHAR(10) NOT NULL, -- 'A', 'B', 'C', 'D'
    region VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Induk Klaim
CREATE TABLE claims (
    id VARCHAR(50) PRIMARY KEY, -- 'CLM-2026-089'
    hospital_id VARCHAR(50) REFERENCES hospitals(id),
    patient_synthetic_id VARCHAR(50) NOT NULL,
    primary_icd10 VARCHAR(20) NOT NULL,
    primary_diagnosis_name VARCHAR(255) NOT NULL,
    secondary_icd10 JSONB DEFAULT '[]'::jsonb,
    inagroup_code VARCHAR(50) NOT NULL,
    claimed_tariff NUMERIC(15, 2) NOT NULL,
    estimated_fair_tariff NUMERIC(15, 2) NOT NULL,
    potential_saving NUMERIC(15, 2) GENERATED ALWAYS AS (claimed_tariff - estimated_fair_tariff) STORED,
    risk_level VARCHAR(20) NOT NULL, -- 'HIGH', 'MEDIUM', 'CLEAN'
    verification_status VARCHAR(50) NOT NULL DEFAULT 'PERLU_TINJAUAN', 
    -- Status: 'PERLU_TINJAUAN', 'PENDING_KLARIFIKASI_RS', 'DOWNCODE_DIUSULKAN', 'DISETUJUI', 'ESKALASI_PKJKN'
    priority_score FLOAT NOT NULL DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Dokumen Klinis Mentah
CREATE TABLE clinical_documents (
    id VARCHAR(50) PRIMARY KEY,
    claim_id VARCHAR(50) REFERENCES claims(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'RESUME_MEDIS', 'LAPORAN_OPERASI', 'LAB_RESULT', 'BILLING_ALKES'
    raw_text TEXT NOT NULL,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Dossier Temuan Bukti (Evidence Findings)
CREATE TABLE evidence_findings (
    id VARCHAR(50) PRIMARY KEY,
    claim_id VARCHAR(50) REFERENCES claims(id) ON DELETE CASCADE,
    finding_type VARCHAR(50) NOT NULL, -- 'UPCODING', 'UNBUNDLING', 'INFLATED_ALKES', 'NOTE_CLONING', 'RULE_VIOLATION'
    severity VARCHAR(20) NOT NULL, -- 'CRITICAL', 'WARNING', 'INFO'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    verbatim_quote TEXT NOT NULL,
    source_document_type VARCHAR(50) NOT NULL,
    source_page INT NOT NULL DEFAULT 1,
    char_start INT NOT NULL DEFAULT 0,
    char_end INT NOT NULL DEFAULT 0,
    delta_rupiah NUMERIC(15, 2) DEFAULT 0.00,
    confidence_score FLOAT NOT NULL,
    regulation_reference VARCHAR(255), -- misal: 'Permenkes 3/2023 Bab IV Pasal 12'
    alternative_hypothesis TEXT,
    is_verbatim_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Korpus Rumah Sakit untuk Deteksi Note Cloning (F6)
CREATE TABLE hospital_corpus (
    id VARCHAR(50) PRIMARY KEY,
    hospital_id VARCHAR(50) REFERENCES hospitals(id),
    source_claim_id VARCHAR(50) NOT NULL,
    dpjp_name VARCHAR(100) NOT NULL,
    soap_narrative TEXT NOT NULL,
    embedding vector(1024), -- Dimensi vektor NVIDIA NeMo Embeddings
    admission_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ON hospital_corpus USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);

-- 6. Tabel Log Audit Permanen (Append-Only)
CREATE TABLE audit_trail_logs (
    id VARCHAR(50) PRIMARY KEY,
    claim_id VARCHAR(50) REFERENCES claims(id),
    verifier_id VARCHAR(100) NOT NULL, -- 'dr. Maya (NIP: 199104...)'
    action_taken VARCHAR(50) NOT NULL, -- 'APPROVE', 'PENDING_DOC', 'DOWNCODE', 'ESCALATE'
    verifier_notes TEXT,
    official_letter_draft TEXT,
    snapshot_findings JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Catatan Integritas: Tidak ada GRANT UPDATE atau DELETE pada tabel audit_trail_logs.
```

---

## 4. Kontrak Antarmuka API (FastAPI REST Contracts)

Semua endpoint beroperasi di bawah *prefix* `/api/v1` dan merespon dengan format JSON standar.

### 4.1 `GET /api/v1/claims/triage`
Mengambil daftar antrean klaim terurut prioritas untuk Layar 1 (`/claims/triage`).

#### Query Parameters:
- `status`: optional string (`ALL`, `PERLU_TINJAUAN`, `PENDING_KLARIFIKASI_RS`, `DISETUJUI`)
- `risk_level`: optional string (`ALL`, `HIGH`, `MEDIUM`, `CLEAN`)
- `limit`: int (default 50)

#### Response Format (`200 OK`):
```json
{
  "summary": {
    "total_claims": 24,
    "pending_review_count": 12,
    "total_potential_savings": 142500000.00,
    "fast_tracked_count": 8
  },
  "items": [
    {
      "claim_id": "CLM-2026-089",
      "hospital_id": "RS-SEJAHTERA-01",
      "hospital_name": "RS Umum Sejahtera",
      "primary_diagnosis": "I21.0 - Infark Miokard Akut Anterior",
      "claimed_tariff": 45000000.00,
      "potential_saving": 18500000.00,
      "risk_level": "HIGH",
      "verification_status": "PERLU_TINJAUAN",
      "priority_score": 94.5,
      "flagged_modes": ["INFLATED_ALKES", "UPCODING", "NOTE_CLONING"]
    }
  ]
}
```

---

### 4.2 `GET /api/v1/claims/{id}/dossier`
Mengambil detail dossier lengkap untuk Layar Dual-Pane (`/claims/:id/dossier`).

#### Response Format (`200 OK`):
```json
{
  "claim_id": "CLM-2026-089",
  "patient_synthetic_id": "SYN-PT-9921",
  "hospital_name": "RS Umum Sejahtera",
  "financials": {
    "claimed_tariff": 45000000.00,
    "estimated_fair_tariff": 26500000.00,
    "potential_saving": 18500000.00
  },
  "recommendation": {
    "action": "PENDING_KLARIFIKASI_RS",
    "confidence_score": 0.92,
    "rationale": "Ditemukan ketidaksesuaian jumlah stent jantung pada laporan operasi vs kuitansi alkes, serta komplikasi Syok Kardiogenik tanpa dukungan bukti TTV."
  },
  "findings": [
    {
      "id": "FND-001",
      "finding_type": "INFLATED_ALKES",
      "severity": "CRITICAL",
      "title": "Selisih Tagihan Stent Jantung Koroner (DES)",
      "description": "Tagihan mengklaim 2 unit stent (Rp20.000.000), namun laporan operasi secara eksplisit menyatakan pemasangan pada cabang LCx batal dan hanya 1 unit stent yang terpasang.",
      "delta_rupiah": 10000000.00,
      "regulation_reference": "Permenkes 3/2023 Lampiran IV Pedoman Klaim Alkes Khusus",
      "alternative_hypothesis": "Petugas administrasi farmasi salah menginput form penyerahan alkes dari depo steril.",
      "evidence": {
        "source_document_type": "LAPORAN_OPERASI",
        "source_page": 3,
        "char_start": 1420,
        "char_end": 1542,
        "verbatim_quote": "Dilakukan pemasangan 1 unit DES pada cabang LAD; cabang LCx batal dipasang karena kalsifikasi minimal.",
        "is_verbatim_verified": true
      }
    },
    {
      "id": "FND-002",
      "finding_type": "UPCODING",
      "severity": "WARNING",
      "title": "Diagnosis Komplikasi Syok Kardiogenik Tidak Didukung TTV",
      "description": "Kode komplikasi R57.0 diklaim untuk menaikkan severity level ke Level III, namun grafik observasi TTV perawat mencatat tekanan darah stabil (120/80 mmHg) tanpa penggunaan inotropik.",
      "delta_rupiah": 8500000.00,
      "regulation_reference": "PNPK Tata Laksana Sindrom Koroner Akut 2020",
      "alternative_hypothesis": "Pasien mengalami hipotensi transien sebelum masuk bangsal yang belum terunggah laporannya.",
      "evidence": {
        "source_document_type": "RESUME_MEDIS",
        "source_page": 1,
        "char_start": 412,
        "char_end": 508,
        "verbatim_quote": "Kondisi hemodinamik stabil selama perawatan intensif, tensi 120/80 mmHg, pulsasi reguler.",
        "is_verbatim_verified": true
      }
    },
    {
      "id": "FND-003",
      "finding_type": "NOTE_CLONING",
      "severity": "WARNING",
      "title": "Indikasi Duplikasi Teks Resume Medis (94% Kemiripan)",
      "description": "Bagian riwayat penyakit dan catatan SOAP identik dengan berkas klaim pasien lain (CLM-2026-077) yang dirawat oleh DPJP yang sama 2 hari sebelumnya.",
      "delta_rupiah": 0.00,
      "regulation_reference": "Permenkes 16/2019 Pasal 5 ayat (1) huruf b",
      "cloning_metadata": {
        "donor_claim_id": "CLM-2026-077",
        "similarity_score": 0.94
      },
      "evidence": {
        "source_document_type": "RESUME_MEDIS",
        "source_page": 1,
        "char_start": 120,
        "char_end": 350,
        "verbatim_quote": "Pasien mengeluh nyeri dada substernal menjalar ke lengan kiri sejak 3 jam SMRS disertai keringat dingin...",
        "is_verbatim_verified": true
      }
    }
  ],
  "documents": [
    {
      "document_type": "LAPORAN_OPERASI",
      "title": "Laporan Tindakan Kateterisasi & PCI",
      "raw_text": "LAPORAN OPERASI...\n...Dilakukan pemasangan 1 unit DES pada cabang LAD; cabang LCx batal dipasang karena kalsifikasi minimal...\n..."
    },
    {
      "document_type": "RESUME_MEDIS",
      "title": "Resume Medis Rawat Inap",
      "raw_text": "RESUME MEDIS PASIEN...\n...Kondisi hemodinamik stabil selama perawatan intensif, tensi 120/80 mmHg, pulsasi reguler...\n..."
    }
  ]
}
```

---

### 4.3 `POST /api/v1/claims/{id}/decide`
Mengeksekusi keputusan tindakan dari verifikator (F9) dan menyimpan log audit secara permanen.

#### Request Payload:
```json
{
  "verifier_id": "dr. Maya (NIP: 199104122019022001)",
  "action": "PENDING_KLARIFIKASI_RS", 
  "verifier_notes": "Mohon konfirmasi lembar pemakaian alkes dari depo operasi karena laporan operasi hanya mencatat pemasangan 1 stent.",
  "official_letter_draft": "SURAT KONFIRMASI KLAIM BPJS KESEHATAN\nNomor: B/1209/BPJS-KCU/2026\nPerihal: Permintaan Klarifikasi Berkas Klaim CLM-2026-089\nKepada: Direktur RS Umum Sejahtera\n..."
}
```

#### Response Format (`200 OK`):
```json
{
  "success": true,
  "claim_id": "CLM-2026-089",
  "updated_status": "PENDING_KLARIFIKASI_RS",
  "audit_log_id": "AUD-LOG-90812",
  "timestamp": "2026-10-10T16:35:00Z"
}
```

---

### 4.4 `POST /api/v1/claims/upload`
Menerima paket klaim sintetis baru (F1), melakukan sanitasi regex data pribadi (UU PDP), dan menyimpan ke antrean intake.

#### Request Format:
`multipart/form-data` dengan file `.json` atau payload JSON langsung:
```json
{
  "hospital_id": "RS-SEJAHTERA-01",
  "patient_synthetic_id": "SYN-PT-8831",
  "primary_icd10": "J18.9",
  "primary_diagnosis_name": "Pneumonia, Unspecified",
  "claimed_tariff": 12500000.00,
  "documents": [
    {
      "document_type": "RESUME_MEDIS",
      "raw_text": "Pasien demam batuk 2 hari..."
    }
  ]
}
```

#### Response Format:
- **Jika Sukses (`201 Created`):**
  ```json
  {
    "success": true,
    "claim_id": "CLM-2026-095",
    "status": "INGESTED",
    "message": "Berkas lolos verifikasi kepatuhan UU PDP dan siap dianalisis."
  }
  ```
- **Jika Melanggar UU PDP (`422 Unprocessable Entity`):**
  ```json
  {
    "error_code": "ERR_PRIVACY_VIOLATION",
    "message": "Ditemukan pola NIK/data identitas riil. Harap gunakan data sintetis/tersamar sesuai UU PDP."
  }
  ```

---

### 4.5 `POST /api/v1/benchmark/run`
Menjalankan pengujian batch pada 30–50 dataset sintetis terstandar untuk Layar Juri (`/benchmark/evaluation-suite`).

#### Response Format (`200 OK`):
```json
{
  "total_evaluated_cases": 30,
  "metrics": {
    "anomaly_recall": 0.885,
    "false_positive_rate": 0.100,
    "verbatim_grounding_reliability": 1.000,
    "avg_latency_seconds_per_claim": 2.4
  },
  "confusion_matrix": {
    "true_positives": 18,
    "false_positives": 1,
    "true_negatives": 9,
    "false_negatives": 2
  },
  "baseline_comparison": {
    "rule_engine_recall": 0.450,
    "agentic_ai_recall": 0.885
  }
}
```

---

## 5. Spesifikasi AI Tool Calling (Schemas & Contracts)

Berikut adalah kontrak skema fungsi (*Function Tools*) yang dipanggil mandiri oleh Agent Orchestrator:

### Tool 1: `tool_lookup_pnpk_icd`
```json
{
  "name": "tool_lookup_pnpk_icd",
  "description": "Mencari kriteria klinis objektif dan syarat keparahan resmi Kemenkes untuk kode diagnosis/tindakan tertentu.",
  "parameters": {
    "type": "object",
    "properties": {
      "icd_code": {
        "type": "string",
        "description": "Kode ICD-10 atau ICD-9-CM (contoh: 'A41.9', 'I21.0', 'R57.0')"
      },
      "clinical_condition": {
        "type": "string",
        "description": "Nama kondisi klinis yang dicari kriterianya (contoh: 'Syok Kardiogenik', 'Sepsis Berat')"
      }
    },
    "required": ["icd_code"]
  }
}
```

### Tool 2: `tool_query_clinical_doc`
```json
{
  "name": "tool_query_clinical_doc",
  "description": "Mengekstrak dan menelusuri bagian teks spesifik dari dokumen rekam medis yang diunggah.",
  "parameters": {
    "type": "object",
    "properties": {
      "document_type": {
        "type": "string",
        "enum": ["RESUME_MEDIS", "LAPORAN_OPERASI", "LAB_RESULT", "BILLING_ALKES"]
      },
      "target_section": {
        "type": "string",
        "description": "Bagian dokumen yang ingin dicari (contoh: 'DESKRIPSI_TINDAKAN', 'TANDA_VITAL', 'HASIL_KULTUR')"
      }
    },
    "required": ["document_type", "target_section"]
  }
}
```

### Tool 3: `tool_calc_tariff_delta`
```json
{
  "name": "tool_calc_tariff_delta",
  "description": "Menghitung selisih rupiah resmi Permenkes 3/2023 antara klaim yang diajukan vs temuan bukti riil.",
  "parameters": {
    "type": "object",
    "properties": {
      "item_type": {
        "type": "string",
        "enum": ["ALKES_QUANTITY", "INACBG_DOWNCODE"]
      },
      "claimed_value": {
        "type": "number",
        "description": "Jumlah unit alkes yang ditagih atau tarif klaim awal"
      },
      "justified_value": {
        "type": "number",
        "description": "Jumlah unit alkes terpasang riil atau tarif revisi yang berbukti"
      },
      "unit_rate_id": {
        "type": "string",
        "description": "Identifier kode tarif alkes atau kode INA-CBG"
      }
    },
    "required": ["item_type", "claimed_value", "justified_value"]
  }
}
```

### Tool 4: `tool_scan_corpus_cloning`
```json
{
  "name": "tool_scan_corpus_cloning",
  "description": "Memindai basis data korpus rekam medis RS untuk menghitung skor kemiripan teks SOAP antar-pasien.",
  "parameters": {
    "type": "object",
    "properties": {
      "hospital_id": { "type": "string" },
      "soap_text_snippet": { "type": "string" },
      "window_days": { "type": "integer", "default": 30 }
    },
    "required": ["hospital_id", "soap_text_snippet"]
  }
}
```

---

## 6. Keputusan Teknologi & Rasionalitas Arsitektur

| Pilihan Teknologi | Komponen | Rasionalitas & Keunggulan bagi Tim |
|---|---|---|
| **Next.js 15 (App Router)** | Frontend Framework | Routing semantik (`/claims/triage`, `/claims/[id]/dossier`) sangat bersih; mendukung React Server Components untuk fetch data cepat dan Client Components untuk interaktivitas Dual-Pane highlight. |
| **FastAPI (Python 3.11)** | Backend Engine | Ekosistem AI Python terbaik; native async/await; validasi skema otomatis via Pydantic v2; integrasi mulus dengan client library Google GenAI, Groq, dan OpenAI/NVIDIA. |
| **Neon Serverless PostgreSQL (Unified Storage)** | Database & Vector | Database PostgreSQL cloud instan tanpa instalasi lokal yang rumit; native branch database; dan ekstensi `pgvector` bawaan di wadah database yang sama, sehingga cukup 1 connection string tunggal tanpa vector DB terpisah. |
| **Tri-Engine AI Strategy** | AI Orchestration | **Gemini Flash (Free Tier)** untuk dokumen tebal/panjang tanpa biaya API, **Groq LPU** untuk inferensi sub-detik yang membuat antarmuka terasa sangat responsif, dan **NVIDIA NIM** untuk embedding berkualitas tinggi dalam mendeteksi plagiarisme catatan medis. |

---

### 6.1 Catatan Praktis Implementasi & Panduan Developer (Engineering Directives)

Untuk mempercepat kecepatan pengembangan (*development velocity*) dan mencegah potensi kendala tak terduga (*hidden bugs*):

#### 1. Komponen Antarmuka: `shadcn/ui` + `lucide-react`
- Developer Frontend disarankan langsung memasang komponen siap pakai `shadcn/ui`:
  * `Table` $\rightarrow$ Untuk tabel antrean klaim terurut risiko di `/claims/triage`.
  * `Badge` $\rightarrow$ Untuk indikator tingkat risiko (`HIGH`/`MEDIUM`/`CLEAN`) dan status klaim.
  * `Card` $\rightarrow$ Untuk wadah kartu temuan bukti (*Evidence Cards*).
  * `Tabs` $\rightarrow$ Untuk navigasi antar-dokumen rekam medis di pane kanan.
  * `Dialog` / `Modal` $\rightarrow$ Untuk konfirmasi tindakan verifikator dan preview draf surat klarifikasi.
- Ikon grafis menggunakan `lucide-react` (misal: `AlertTriangle`, `FileText`, `CheckCircle2`, `Zap`, `ShieldAlert`).

#### 2. Penampil Dokumen & Highlight 1-Klik: *Structured Rich Text* (Bukan PDF.js Canvas)
- **Hindari me-render berkas menggunakan canvas `pdf.js`** yang berat dan sulit disinkronisasikan koordinat teksnya.
- **Implementasi yang Direkomendasikan:**
  * Dokumen rekam medis disimpan dan disajikan sebagai teks terstruktur (*Rich Text / Markdown*) dengan penanda paragraf atau offset karakter.
  * Saat kutipan pada kartu bukti diklik, komponen cukup membungkus substring yang dituju dengan elemen `<mark className="bg-yellow-200 text-yellow-900 rounded px-1 animate-pulse">` dan memicu pemanggilan JavaScript standar:
    ```javascript
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    ```
  * Hasil: Waktu muat 0 milidetik, scroll presisi 100%, dan bebas kegagalan rendering canvas browser.

#### 3. Pola Desain Agent: *Native Python Function Calling* (Hindari Framework Berat)
- **Instruksi Tegas:** **Jangan gunakan framework berat seperti LangChain, CrewAI, atau AutoGen.**
- Framework tersebut memiliki lapisan abstraksi berlebih, sering mengubah format prompt secara tak terduga, dan sulit di-debug saat terjadi kesalahan format JSON.
- **Gunakan Native Loop di FastAPI** langsung dengan client resmi Groq/OpenAI:
  ```python
  # Pola Native Function Calling Loop yang Bersih & Mudah Di-debug
  messages = [system_prompt, user_prompt]
  while True:
      response = await groq_client.chat.completions.create(
          model="llama-3.3-70b-versatile",
          messages=messages,
          tools=AVAILABLE_TOOLS,
          tool_choice="auto"
      )
      tool_calls = response.choices[0].message.tool_calls
      if not tool_calls:
          break  # Selesai, ambil kesimpulan akhir
      for tool_call in tool_calls:
          result = await execute_tool(tool_call.function.name, tool_call.function.arguments)
          messages.append({"role": "tool", "tool_call_id": tool_call.id, "content": json.dumps(result)})
  ```

#### 4. Opsi Penyederhanaan Vector Embedding (Plan B)
- **Rencana Utama (Primary):** Menggunakan `nvidia/nv-embedqa-e5-v5` (vektor 1024-dimensi) via endpoint `https://integrate.api.nvidia.com/v1`.
- **Rencana Alternatif (Fallback Praktis):** Jika tim ingin menyederhanakan konfigurasi menjadi **2 provider saja (Gemini + Groq)** tanpa perlu mendaftar akun NVIDIA tambahan:
  * Gunakan model `text-embedding-004` (vektor 768-dimensi) dari Google AI Studio dengan API Key Gemini yang sama (100% gratis).
  * Di skema DDL Neon, ubah tipe kolom dari `vector(1024)` menjadi `vector(768)`.

#### 5. Driver Database & ORM Stack
- Driver Database: `asyncpg` untuk koneksi asinkron berkinerja tinggi ke Neon PostgreSQL.
- ORM: `SQLAlchemy 2.0 (asyncio)` dipadukan dengan pustaka `pgvector-python`:
  ```python
  from pgvector.sqlalchemy import Vector
  from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

  class HospitalCorpus(Base):
      __tablename__ = "hospital_corpus"
      id: Mapped[str] = mapped_column(primary_key=True)
      embedding: Mapped[list[float]] = mapped_column(Vector(1024))
  ```

---

## Status Gate Dokumen 4
Dengan tersusunnya dokumen ini:
- Developer Frontend dapat langsung membuat rute Next.js dan komponen Dual-Pane menggunakan kontrak response JSON di Bagian 4 dan panduan komponen `shadcn/ui`.
- Developer Backend dapat langsung mengeksekusi migrasi DDL SQL di Neon Database dan menulis controller FastAPI dengan skema Pydantic yang terdefinisi.
- Seluruh kontrak antarmodul telah terkunci tanpa asumsi tersembunyi.
