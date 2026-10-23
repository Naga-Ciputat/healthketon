import asyncio
import os
import sys
import json
from datetime import datetime, date
from decimal import Decimal
from dotenv import load_dotenv

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
load_dotenv(".env")

from app.core.config import settings
from app.core.key_rotator import gemini_key_pool
import google.generativeai as genai

# Setup Gemini for embedding generation
gemini_key = gemini_key_pool.get_next_key()
if gemini_key:
    genai.configure(api_key=gemini_key)


async def generate_embedding(text: str) -> list[float]:
    """Menghasilkan vector embedding menggunakan Gemini embedding API."""
    try:
        res = genai.embed_content(
            model="models/gemini-embedding-001",
            content=text,
        )
        return res["embedding"]
    except Exception as e:
        print(f"[WARN] Failed to generate dynamic embedding, using fallback vector: {e}")
        # Fallback dummy 3072-dim vector for testing if offline
        return [0.01 * (i % 10) for i in range(3072)]


DDL_STATEMENTS = """
-- Aktifkan ekstensi pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Tabel Rumah Sakit Mitra
CREATE TABLE IF NOT EXISTS hospitals (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    hospital_class VARCHAR(10) NOT NULL,
    region VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Induk Klaim
CREATE TABLE IF NOT EXISTS claims (
    id VARCHAR(50) PRIMARY KEY,
    hospital_id VARCHAR(50) REFERENCES hospitals(id) ON DELETE CASCADE,
    patient_synthetic_id VARCHAR(50) NOT NULL,
    patient_age INT DEFAULT 45,
    patient_gender VARCHAR(5) DEFAULT 'L',
    dpjp_name VARCHAR(100) NOT NULL,
    primary_icd10 VARCHAR(20) NOT NULL,
    primary_diagnosis_name VARCHAR(255) NOT NULL,
    secondary_icd10 JSONB DEFAULT '[]'::jsonb,
    inagroup_code VARCHAR(50) NOT NULL,
    inagroup_description VARCHAR(255) DEFAULT '',
    claimed_tariff NUMERIC(15, 2) NOT NULL,
    estimated_fair_tariff NUMERIC(15, 2) NOT NULL,
    potential_saving NUMERIC(15, 2) GENERATED ALWAYS AS (claimed_tariff - estimated_fair_tariff) STORED,
    risk_level VARCHAR(20) NOT NULL,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'PERLU_TINJAUAN',
    priority_score FLOAT NOT NULL DEFAULT 0.0,
    modus_tags JSONB DEFAULT '[]'::jsonb,
    admission_date DATE DEFAULT CURRENT_DATE,
    discharge_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Dokumen Klinis Mentah
CREATE TABLE IF NOT EXISTS clinical_documents (
    id VARCHAR(50) PRIMARY KEY,
    claim_id VARCHAR(50) REFERENCES claims(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    raw_text TEXT NOT NULL,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Dossier Temuan Bukti (Evidence Findings)
CREATE TABLE IF NOT EXISTS evidence_findings (
    id VARCHAR(50) PRIMARY KEY,
    claim_id VARCHAR(50) REFERENCES claims(id) ON DELETE CASCADE,
    finding_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    badge_label VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    verbatim_quote TEXT NOT NULL,
    source_document_id VARCHAR(50) NOT NULL,
    source_document_title VARCHAR(255) NOT NULL,
    source_page INT NOT NULL DEFAULT 1,
    paragraph_index INT NOT NULL DEFAULT 0,
    char_start INT NOT NULL DEFAULT 0,
    char_end INT NOT NULL DEFAULT 0,
    delta_rupiah NUMERIC(15, 2) DEFAULT 0.00,
    confidence_score FLOAT NOT NULL,
    regulation_reference VARCHAR(255),
    alternative_hypothesis TEXT,
    comparison_details JSONB,
    is_verbatim_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Korpus Rumah Sakit untuk Deteksi Note Cloning (F6)
CREATE TABLE IF NOT EXISTS hospital_corpus (
    id VARCHAR(50) PRIMARY KEY,
    hospital_id VARCHAR(50) REFERENCES hospitals(id) ON DELETE CASCADE,
    source_claim_id VARCHAR(50) NOT NULL,
    dpjp_name VARCHAR(100) NOT NULL,
    soap_narrative TEXT NOT NULL,
    embedding vector(3072),
    admission_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabel Log Audit Permanen (Append-Only)
CREATE TABLE IF NOT EXISTS audit_trail_logs (
    id VARCHAR(50) PRIMARY KEY,
    claim_id VARCHAR(50) REFERENCES claims(id) ON DELETE SET NULL,
    hospital_name VARCHAR(255) NOT NULL,
    verifier_id VARCHAR(100) NOT NULL,
    verifier_role VARCHAR(100) DEFAULT 'Verifikator Utama BPJS',
    action_taken VARCHAR(50) NOT NULL,
    final_tariff NUMERIC(15, 2) DEFAULT 0.00,
    saved_delta_rupiah NUMERIC(15, 2) DEFAULT 0.00,
    official_letter_number VARCHAR(100),
    verifier_notes TEXT,
    official_letter_draft TEXT,
    snapshot_findings JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
"""


async def init_and_seed():
    import asyncpg

    print("==================================================")
    print("  INITIALIZING NEON POSTGRESQL & SEEDING DATA     ")
    print("==================================================")

    url = settings.sync_database_url
    if not url:
        raise ValueError("DATABASE_URL is missing in environment!")

    print(f"Connecting to Neon Serverless Database...")
    conn = await asyncpg.connect(url, timeout=15)

    # 1. Execute DDL
    print("\n--- Step 1: Executing DDL Schema ---")
    await conn.execute(DDL_STATEMENTS)
    print("[SUCCESS] All 6 tables created or verified successfully!")

    # Check existing data to prevent duplicate seed
    existing_claims_count = await conn.fetchval("SELECT COUNT(*) FROM claims;")
    if existing_claims_count > 0:
        print(f"[INFO] Database already contains {existing_claims_count} claims. Resetting tables for fresh seeding...")
        await conn.execute("TRUNCATE audit_trail_logs, evidence_findings, clinical_documents, claims, hospital_corpus, hospitals CASCADE;")

    # 2. Seed Hospitals
    print("\n--- Step 2: Seeding Hospitals ---")
    hospitals = [
        ("HOSP-01", "RS Sejahtera Medika", "A", "DKI Jakarta"),
        ("HOSP-02", "RS Mitra Sehat", "B", "Jawa Timur"),
        ("HOSP-03", "RSUD Kota Madya", "B", "Jawa Tengah"),
        ("HOSP-04", "RS Sentosa Kasih", "C", "Sumatera Utara"),
        ("HOSP-05", "RS Bethesda Mandiri", "B", "DI Yogyakarta"),
        ("HOSP-06", "RS Hermina Medika", "B", "Jawa Barat"),
    ]
    for h in hospitals:
        await conn.execute(
            "INSERT INTO hospitals (id, name, hospital_class, region) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING;",
            h[0], h[1], h[2], h[3]
        )
    print(f"[SUCCESS] Seeded {len(hospitals)} partner hospitals.")

    # 3. Seed Claims
    print("\n--- Step 3: Seeding Claims ---")
    claims_data = [
        (
            "CLM-2026-089",
            "HOSP-01",
            "SYN-PAT-0089",
            58,
            "L",
            "dr. Hendra Sp.JP",
            "I21.0",
            "Acute Transmural Myocardial Infarction of Anterior Wall (STEMI)",
            json.dumps([{"code": "A41.9", "name": "Sepsis, Unspecified"}, {"code": "I10", "name": "Essential Hypertension"}]),
            "I-4-10-III",
            "Penyakit Jantung Akut dengan Komplikasi Berat (Severity Level III)",
            Decimal("45000000.00"),
            Decimal("20100000.00"),
            "TINGGI",
            "PERLU_TINJAUAN",
            94.5,
            json.dumps(["UPCODING_SEPSIS", "INFLATED_ALKES_STENT", "NOTE_CLONING"]),
            date(2026, 10, 9),
            date(2026, 10, 11),
        ),
        (
            "CLM-2026-012",
            "HOSP-02",
            "SYN-PAT-0012",
            63,
            "P",
            "dr. Budi Sp.S",
            "I63.9",
            "Cerebral Infarction, Unspecified (Stroke Iskemik Akut)",
            json.dumps([{"code": "R40.2", "name": "Coma, Unspecified"}]),
            "G-4-14-II",
            "Stroke dengan Komplikasi Sedang",
            Decimal("16000000.00"),
            Decimal("8200000.00"),
            "TINGGI",
            "DOWNCODE_DIUSULKAN",
            88.0,
            json.dumps(["UPCODING_SEVERITY"]),
            date(2026, 10, 8),
            date(2026, 10, 12),
        ),
        (
            "CLM-2026-077",
            "HOSP-03",
            "SYN-PAT-0077",
            42,
            "L",
            "dr. Hendra Sp.JP",
            "K40.9",
            "Unilateral Inguinal Hernia without Obstruction or Gangrene",
            json.dumps([]),
            "K-2-12-I",
            "Operasi Hernia Tanpa Komplikasi (Severity I)",
            Decimal("6400000.00"),
            Decimal("6400000.00"),
            "RENDAH",
            "DISETUJUI",
            12.0,
            json.dumps(["VALID_CLAIM"]),
            date(2026, 10, 7),
            date(2026, 10, 8),
        ),
        (
            "CLM-2026-034",
            "HOSP-04",
            "SYN-PAT-0034",
            55,
            "L",
            "dr. Anwar Sp.B",
            "C18.9",
            "Malignant Neoplasm of Colon, Unspecified",
            json.dumps([{"code": "D64.9", "name": "Anemia, Unspecified"}]),
            "C-4-10-III",
            "Prosedur Usus Besar dengan Komplikasi Berat",
            Decimal("30900000.00"),
            Decimal("18500000.00"),
            "TINGGI",
            "ESKALASI_PK_JKN",
            96.0,
            json.dumps(["NOTE_CLONING", "PHANTOM_PROCEDURE"]),
            date(2026, 10, 5),
            date(2026, 10, 10),
        ),
        (
            "CLM-2026-055",
            "HOSP-05",
            "SYN-PAT-0055",
            34,
            "P",
            "dr. Ratna Sp.B",
            "K35.8",
            "Acute Appendicitis, Other and Unspecified",
            json.dumps([]),
            "K-2-11-II",
            "Apendektomi dengan Komplikasi Sedang",
            Decimal("11200000.00"),
            Decimal("7500000.00"),
            "SEDANG",
            "PENDING_KLARIFIKASI_RS",
            72.5,
            json.dumps(["UNBUNDLING_DRAIN"]),
            date(2026, 10, 10),
            date(2026, 10, 12),
        ),
    ]

    for c in claims_data:
        await conn.execute(
            """
            INSERT INTO claims (
                id, hospital_id, patient_synthetic_id, patient_age, patient_gender, dpjp_name,
                primary_icd10, primary_diagnosis_name, secondary_icd10, inagroup_code, inagroup_description,
                claimed_tariff, estimated_fair_tariff, risk_level, verification_status, priority_score,
                modus_tags, admission_date, discharge_date
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
            ) ON CONFLICT (id) DO NOTHING;
            """,
            *c
        )
    print(f"[SUCCESS] Seeded {len(claims_data)} claims with INA-CBG tariffs.")

    # 4. Seed Clinical Documents (for CLM-2026-089)
    print("\n--- Step 4: Seeding Clinical Documents ---")
    docs = [
        (
            "DOC-089-1",
            "CLM-2026-089",
            "RESUME_MEDIS",
            "Resume_Medis_CLM089.pdf",
            "RUMAH SAKIT SEJAHTERA MEDIKA — RESUME MEDIS RAWAT INAP ELEKTRONIK. No RM: 00-48-29. Nama: Pasien Anonim (Tn. R). Usia: 58 Tahun. Jenis Kelamin: Laki-laki. Tanggal Masuk: 09/10/2026. Tanggal Keluar: 11/10/2026. DPJP: dr. Hendra Sp.JP.\n\nPasien mengeluh nyeri dada substernal menjalar ke lengan kiri sejak 3 jam SMRS disertai keringat dingin, mual, dan rasa tertekan beban berat pada dada sebelah kiri saat beristirahat.\n\nPemeriksaan Fisik Awal: Keadaan umum sedang, Compos Mentis. Tekanan Darah: 130/80 mmHg, Nadi: 88 x/menit teratur, Suhu: 36.8 C, Pernapasan: 20 x/menit, SpO2: 98% room air. Suara jantung S1/S2 reguler murni, murmur (-), gallop (-). Ronkhi basah halus basal (-).\n\nDiagnosis Kerja Utama: STEMI Anterior Akut (I21.0). Diagnosis Sekunder: Sepsis Berat (A41.9), Hipertensi Grade 1 (I10). Rencana Tindakan: Primary Percutaneous Coronary Intervention (PCI).",
            json.dumps({"page_count": 2, "verified": True}),
        ),
        (
            "DOC-089-2",
            "CLM-2026-089",
            "LAPORAN_OPERASI",
            "Laporan_Operasi_PCI.pdf",
            "LAPORAN TINDAKAN INTERVENSI KORONER PERKUTAN (PCI). Operator: dr. Hendra Sp.JP. Tindakan: Primary PCI ke Left Anterior Descending (LAD). Dilakukan pungsi arteri radialis dekstra sheath 6F. Kanulasi ostium LCA dengan guiding catheter EBU 3.5 6F.\n\nHasil Angiografi: Total occlusion pada mid LAD, LCx normal tanpa lesi stenosis bermakna, RCA normal. Dilakukan predilatasi dengan balon semicompliant 2.0 x 15 mm up to 10 atm.\n\nPemasangan Implan: Dilakukan pemasangan 1 (satu) unit Drug-Eluting Stent (DES) Resolute Onyx ukuran 2.75 x 26 mm pada mid LAD dengan inflasi 14 atm selama 20 detik. Post-dilatasi dengan balon noncompliant 3.0 x 12 mm up to 18 atm. Hasil akhir: TIMI Flow 3, residual stenosis 0%, diseksi (-), perforasi (-). Selongsong sheath dilepas, hemostasis dengan compressive bandage.",
            json.dumps({"page_count": 1, "verified": True}),
        ),
        (
            "DOC-089-3",
            "CLM-2026-089",
            "LAB_RESULT",
            "Hasil_Lab_Biomarker.pdf",
            "HASIL PEMERIKSAAN LABORATORIUM PATOLOGI KLINIK. Tanggal Spesimen: 09/10/2026 14:15 WIB. Troponin I Kuantitatif: 14.80 ng/mL (Nilai rujukan < 0.04) -> Tinggi (Kardiak Iskemia). CK-MB: 88 U/L (Rujukan < 24) -> Meningkat.\n\nProfil Darah Lengkap: Hemoglobin: 14.2 g/dL, Leukosit: 8.600 /uL (Nilai rujukan 4.500 - 11.000) -> Batas Normal. Trombosit: 245.000 /uL, Hematokrit: 42%.\n\nBiomarker Inflamasi & Infeksi: Prokalsitonin (PCT): 0.12 ng/mL (Nilai rujukan Sepsis > 0.50 ng/mL, Sepsis Berat > 2.0 ng/mL) -> Dalam Batas Normal / Negatif Sepsis. Laktat Darah: 1.1 mmol/L (Rujukan 0.5 - 2.0) -> Normal. Kultur Darah 2 botol: Tidak ada pertumbuhan mikroorganisme dalam 5 hari inkubasi.",
            json.dumps({"page_count": 1, "verified": True}),
        ),
        (
            "DOC-089-4",
            "CLM-2026-089",
            "BILLING_ALKES",
            "Kuitansi_Rincian_Billing.pdf",
            "RINCIAN BIAYA PEMAKAIAN ALAT KESEHATAN IMPLAN & FARMASI RAWAT INAP. No Kuitansi: KW-2026-0988. Pasien: Tn. R (RM: 00-48-29).\n\n1. Drug-Eluting Stent (DES) Resolute Onyx 2.75x26mm — Qty: 2 Unit — Satuan: Rp 12.450.000 — Total: Rp 24.900.000.\n2. Balon Kateter Angioplasti PTCA 2.0x15mm — Qty: 1 Unit — Total: Rp 3.800.000.\n3. Balon Noncompliant NC 3.0x12mm — Qty: 1 Unit — Total: Rp 4.200.000.\n4. Sheath Introducer Radialis 6F — Qty: 1 Unit — Total: Rp 650.000.\n5. Paket Prosedur PTCA Balon + Diagnostik Koroner Angiografi Tambahan Rp 4.500.000.",
            json.dumps({"page_count": 1, "verified": True}),
        ),
    ]

    for d in docs:
        await conn.execute(
            """
            INSERT INTO clinical_documents (id, claim_id, document_type, file_name, raw_text, metadata_json)
            VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING;
            """,
            *d
        )
    print(f"[SUCCESS] Seeded {len(docs)} clinical documents for CLM-2026-089.")

    # 5. Seed Evidence Findings
    print("\n--- Step 5: Seeding Evidence Findings ---")
    findings = [
        (
            "FND-089-1",
            "CLM-2026-089",
            "UPCODING",
            "CRITICAL",
            "Diagnosis Komplikasi Berat Sepsis (A41.9) Tidak Didukung Bukti Klinis",
            "Upcoding Diagnosis Sepsis",
            "Klaim diajukan dengan diagnosis sekunder Sepsis (A41.9) yang menaikkan tingkat keparahan severity level dari I-4-10-I ke I-4-10-III (+Rp 24,9 Jt). Namun pada lembar hasil lab tanggal 09/10/2026, nilai biomarker Prokalsitonin (PCT) hanya 0.12 ng/mL (kriteria sepsis mensyaratkan > 0.50 ng/mL) dan leukosit normal (8.600/uL).",
            "Prokalsitonin (PCT): 0.12 ng/mL (Nilai rujukan Sepsis > 0.50 ng/mL, Sepsis Berat > 2.0 ng/mL) -> Dalam Batas Normal / Negatif Sepsis.",
            "DOC-089-3",
            "Hasil Laboratorium Biomarker",
            1,
            2,
            0,
            120,
            Decimal("24900000.00"),
            98.5,
            "Permenkes No. 3 Tahun 2023 Lampiran II (Kriteria Diagnosis Sepsis)",
            "Kemungkinan salah pemilihan kode sekunder otomatis oleh koder faskes saat memasukkan template riwayat infeksi lama.",
            None,
            True,
        ),
        (
            "FND-089-2",
            "CLM-2026-089",
            "INFLATED_ALKES",
            "CRITICAL",
            "Diskrepansi Jumlah Pemakaian Alkes Stent DES (+1 Unit Selisih)",
            "Inflasi Alkes Implan",
            "Lembar rincian billing farmasi menagihkan 2 unit Drug-Eluting Stent (DES) seharga Rp 24.900.000. Namun pada Laporan Operasi Bedah resmi yang ditandatangani DPJP, narasi tindakan menegaskan hanya 1 unit DES yang terpasang pada mid LAD.",
            "Dilakukan pemasangan 1 (satu) unit Drug-Eluting Stent (DES) Resolute Onyx ukuran 2.75 x 26 mm pada mid LAD dengan inflasi 14 atm selama 20 detik.",
            "DOC-089-2",
            "Laporan Operasi Tindakan Intervensi",
            1,
            2,
            0,
            145,
            Decimal("12450000.00"),
            99.0,
            "Permenkes No. 3 Tahun 2023 Bab IV Pasal 24 (Kesesuaian Pemakaian Riil Alkes)",
            "Alkes kedua mungkin telah disiapkan di meja steril tetapi tidak jadi dipasang karena pembuluh darah sudah optimal, namun bagian billing belum menerima retur farmasi.",
            None,
            True,
        ),
        (
            "FND-089-3",
            "CLM-2026-089",
            "NOTE_CLONING",
            "WARNING",
            "Peringatan Duplikasi Catatan Medis (94% Match Antar-Pasien)",
            "Duplikasi Catatan Medis",
            "Teks riwayat penyakit dan catatan perkembangan SOAP pada resume medis memiliki kemiripan semantik 94% dengan Pasien #CLM-2026-077 yang dirawat 2 hari sebelumnya oleh DPJP yang sama, mengindikasikan copy-paste narasi tanpa pemeriksaan individual yang komprehensif.",
            "Pasien mengeluh nyeri dada substernal menjalar ke lengan kiri sejak 3 jam SMRS disertai keringat dingin, mual, dan rasa tertekan beban berat pada dada sebelah kiri saat beristirahat.",
            "DOC-089-1",
            "Resume Medis Rawat Inap (RME)",
            1,
            1,
            0,
            160,
            Decimal("0.00"),
            94.0,
            "Permenkes No. 24 Tahun 2022 tentang Integritas Rekam Medis Elektronik",
            "Koder atau dokter residen menggunakan macro-template riwayat keluhan standar poliklinik jantung.",
            json.dumps({
                "donorClaimId": "CLM-2026-077",
                "donorDate": "07 Okt 2026",
                "similarityScore": 94,
                "donorText": "Pasien mengeluh nyeri dada substernal menjalar ke lengan kiri sejak 3 jam SMRS disertai keringat dingin, mual, dan rasa tertekan beban berat pada dada sebelah kiri saat beristirahat.",
                "currentText": "Pasien mengeluh nyeri dada substernal menjalar ke lengan kiri sejak 3 jam SMRS disertai keringat dingin, mual, dan rasa tertekan beban berat pada dada sebelah kiri saat beristirahat."
            }),
            True,
        ),
        (
            "FND-089-4",
            "CLM-2026-089",
            "UNBUNDLING",
            "INFO",
            "Aturan Kodifikasi INA-CBG: Batas Pemecahan Paket Angiografi",
            "Kaidah Koding INA-CBG",
            "Tindakan diagnostik arteriografi koroner (88.57) yang ditagihkan telah masuk dalam paket pembiayaan prosedur kateterisasi terapeutik utama (00.66) dan dilarang ditagihkan terpisah sesuai klausul unbundling INA-CBG.",
            "Paket Prosedur PTCA Balon + Diagnostik Koroner Angiografi Tambahan Rp 4.500.000",
            "DOC-089-4",
            "Lembar Tagihan Rincian Billing",
            1,
            4,
            0,
            85,
            Decimal("4500000.00"),
            99.0,
            "Permenkes No. 3 Tahun 2023 Lampiran II (Kaidah Koding JKN)",
            "Salah interpretasi aturan koding unbundling oleh koder pemula faskes.",
            None,
            True,
        ),
    ]

    for f in findings:
        await conn.execute(
            """
            INSERT INTO evidence_findings (
                id, claim_id, finding_type, severity, title, badge_label, description,
                verbatim_quote, source_document_id, source_document_title, source_page,
                paragraph_index, char_start, char_end, delta_rupiah, confidence_score,
                regulation_reference, alternative_hypothesis, comparison_details, is_verbatim_verified
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
            ) ON CONFLICT (id) DO NOTHING;
            """,
            *f
        )
    print(f"[SUCCESS] Seeded {len(findings)} structured evidence findings.")

    # 6. Seed Hospital Corpus with Embeddings
    print("\n--- Step 6: Seeding Hospital Corpus with Dense Vector Embeddings ---")
    corpus_text = "Pasien mengeluh nyeri dada substernal menjalar ke lengan kiri sejak 3 jam SMRS disertai keringat dingin, mual, dan rasa tertekan beban berat pada dada sebelah kiri saat beristirahat. Pemeriksaan fisik kardiovaskular TD 130/80 mmHg."
    print("Generating dense vector embedding from Gemini...")
    vector_embedding = await generate_embedding(corpus_text)

    # Format vector string for pgvector '[val1, val2, ...]'
    vec_str = "[" + ",".join(str(v) for v in vector_embedding) + "]"

    await conn.execute(
        """
        INSERT INTO hospital_corpus (id, hospital_id, source_claim_id, dpjp_name, soap_narrative, embedding, admission_date)
        VALUES ($1, $2, $3, $4, $5, $6::vector, $7)
        ON CONFLICT (id) DO NOTHING;
        """,
        "CORP-089-01",
        "HOSP-01",
        "CLM-2026-077",
        "dr. Hendra Sp.JP",
        corpus_text,
        vec_str,
        date(2026, 10, 7)
    )
    print(f"[SUCCESS] Seeded hospital corpus entry with {len(vector_embedding)}-dim vector embedding.")

    # 7. Seed Audit Trail Logs
    print("\n--- Step 7: Seeding Audit Trail Logs ---")
    audit_logs = [
        (
            "AUD-2026-004",
            "CLM-2026-089",
            "RS Sejahtera Medika",
            "dr. Siti Aminah",
            "Verifikator Utama BPJS",
            "PENDING_KLARIFIKASI_RS",
            Decimal("20100000.00"),
            Decimal("24900000.00"),
            "BA-BPJS/2026/KLM-089/KLARIFIKASI",
            "Klarifikasi resmi diterbitkan ke Komite Medik RS Sejahtera Medika terkait selisih 1 unit Stent DES dan kriteria diagnosis Sepsis.",
            "SURAT PERMINTAAN KLARIFIKASI DAN BUKTI PENDUKUNG KLAIM JKN...",
            json.dumps([{"finding": "UPCODING_SEPSIS"}, {"finding": "INFLATED_STENT"}]),
        ),
        (
            "AUD-2026-003",
            "CLM-2026-012",
            "RS Mitra Sehat",
            "dr. Siti Aminah",
            "Verifikator Utama BPJS",
            "DOWNCODE_DIUSULKAN",
            Decimal("8200000.00"),
            Decimal("7800000.00"),
            "BA-BPJS/2026/KLM-012/ADJUST",
            "Penyesuaian kode dari G-4-14-II ke G-4-14-I disetujui DPJP RS. Selisih tarif dikoreksi dalam Berita Acara Rekonsiliasi.",
            "BERITA ACARA PENYESUAIAN KODE TINGKAT KEPARAHAN...",
            json.dumps([{"finding": "UPCODING_SEVERITY"}]),
        ),
        (
            "AUD-2026-002",
            "CLM-2026-077",
            "RSUD Kota Madya",
            "dr. Siti Aminah",
            "Kaidah Koding & Verifikasi",
            "DISETUJUI",
            Decimal("6400000.00"),
            Decimal("0.00"),
            "BA-BPJS/2026/KLM-077/ACC",
            "Klaim tervalidasi lengkap tanpa diskrepansi dokumen asli. Diteruskan ke proses realisasi pembayaran.",
            "BERITA ACARA PERSETUJUAN KLAIM JKN...",
            json.dumps([]),
        ),
        (
            "AUD-2026-001",
            "CLM-2026-034",
            "RS Sentosa Kasih",
            "dr. Hendrawan Sp.PK",
            "Dewan Pertimbangan Klinis",
            "ESKALASI_PK_JKN",
            Decimal("18500000.00"),
            Decimal("12400000.00"),
            "ESK-PKJKN/2026/10-091",
            "Eskalasi ke tim Pencegahan Kecurangan JKN atas dugaan duplikasi catatan rekam medis (Note Cloning) berulang.",
            "NOTA DINAS ESKALASI DUGAAN ANOMALI...",
            json.dumps([{"finding": "NOTE_CLONING"}]),
        ),
    ]

    for a in audit_logs:
        await conn.execute(
            """
            INSERT INTO audit_trail_logs (
                id, claim_id, hospital_name, verifier_id, verifier_role, action_taken,
                final_tariff, saved_delta_rupiah, official_letter_number, verifier_notes,
                official_letter_draft, snapshot_findings
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
            ) ON CONFLICT (id) DO NOTHING;
            """,
            *a
        )
    print(f"[SUCCESS] Seeded {len(audit_logs)} historical audit trail logs.")

    await conn.close()
    print("\n==================================================")
    print("  DATABASE INITIALIZATION & POPULATION COMPLETE!  ")
    print("==================================================")


if __name__ == "__main__":
    asyncio.run(init_and_seed())
