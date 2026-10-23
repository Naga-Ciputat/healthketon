from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Any, Dict
import json
from decimal import Decimal
from pydantic import BaseModel
from app.core.database import get_db_pool

router = APIRouter(prefix="/claims", tags=["Claims"])


class StatusUpdateRequest(BaseModel):
    status: str
    notes: Optional[str] = None


@router.get("")
async def list_claims(
    status: Optional[str] = None,
    risk: Optional[str] = None,
    hospital_id: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "priority_score",
    sort_order: str = "desc",
):
    """Mengambil daftar seluruh klaim dari database PostgreSQL dengan filter dan sorting."""
    pool = await get_db_pool()
    query = """
        SELECT 
            c.id,
            h.name AS hospital_name,
            c.patient_age,
            c.patient_gender,
            c.dpjp_name,
            c.admission_date::text,
            c.discharge_date::text,
            c.primary_icd10,
            c.primary_diagnosis_name,
            c.secondary_icd10,
            c.inagroup_code AS inacbg_code,
            c.inagroup_description AS inacbg_description,
            c.claimed_tariff,
            c.estimated_fair_tariff AS fair_tariff,
            (c.claimed_tariff - c.estimated_fair_tariff) AS delta_tariff,
            c.risk_level,
            c.verification_status AS status,
            c.priority_score,
            c.modus_tags
        FROM claims c
        JOIN hospitals h ON c.hospital_id = h.id
        WHERE 1=1
    """
    params = []
    idx = 1

    if status and status != "ALL":
        query += f" AND c.verification_status = ${idx}"
        params.append(status)
        idx += 1

    if risk and risk != "ALL":
        query += f" AND c.risk_level = ${idx}"
        params.append(risk)
        idx += 1

    if hospital_id and hospital_id != "ALL":
        query += f" AND (c.hospital_id = ${idx} OR h.name = ${idx})"
        params.append(hospital_id)
        idx += 1

    if search:
        query += f" AND (c.id ILIKE ${idx} OR c.primary_diagnosis_name ILIKE ${idx} OR h.name ILIKE ${idx} OR c.dpjp_name ILIKE ${idx})"
        params.append(f"%{search}%")
        idx += 1

    # Sorting
    allowed_sorts = {
        "priority": "c.priority_score",
        "priority_score": "c.priority_score",
        "delta": "(c.claimed_tariff - c.estimated_fair_tariff)",
        "claimed": "c.claimed_tariff",
        "date": "c.admission_date",
    }
    col = allowed_sorts.get(sort_by, "c.priority_score")
    order = "DESC" if sort_order.lower() == "desc" else "ASC"
    query += f" ORDER BY {col} {order};"

    async with pool.acquire() as conn:
        rows = await conn.fetch(query, *params)

    claims = []
    for r in rows:
        sec = json.loads(r["secondary_icd10"]) if isinstance(r["secondary_icd10"], str) else (r["secondary_icd10"] or [])
        modus = json.loads(r["modus_tags"]) if isinstance(r["modus_tags"], str) else (r["modus_tags"] or [])
        claims.append({
            "id": r["id"],
            "hospitalName": r["hospital_name"],
            "patientAge": r["patient_age"],
            "patientGender": r["patient_gender"],
            "dpjpName": r["dpjp_name"],
            "admissionDate": r["admission_date"],
            "dischargeDate": r["discharge_date"],
            "primaryDiagnosis": {
                "code": r["primary_icd10"],
                "name": r["primary_diagnosis_name"],
            },
            "secondaryDiagnoses": sec,
            "procedures": [{"code": "00.66", "name": "PTCA or Coronary Atherosctomy"}],
            "inacbgCode": r["inacbg_code"],
            "inacbgDescription": r["inacbg_description"],
            "claimedTariff": float(r["claimed_tariff"]),
            "fairTariff": float(r["fair_tariff"]),
            "deltaTariff": float(r["delta_tariff"]),
            "status": r["status"],
            "riskLevel": r["risk_level"],
            "modusTags": modus,
            "confidenceScore": float(r["priority_score"]),
        })

    return {"status": "success", "total": len(claims), "data": claims}


@router.get("/{claim_id}")
async def get_claim_detail(claim_id: str):
    """Mengambil detail lengkap dossier klaim termasuk dokumen dan temuan bukti dari PostgreSQL."""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        claim_row = await conn.fetchrow(
            """
            SELECT 
                c.id,
                c.hospital_id,
                h.name AS hospital_name,
                c.patient_age,
                c.patient_gender,
                c.dpjp_name,
                c.admission_date::text,
                c.discharge_date::text,
                c.primary_icd10,
                c.primary_diagnosis_name,
                c.secondary_icd10,
                c.inagroup_code AS inacbg_code,
                c.inagroup_description AS inacbg_description,
                c.claimed_tariff,
                c.estimated_fair_tariff AS fair_tariff,
                (c.claimed_tariff - c.estimated_fair_tariff) AS delta_tariff,
                c.risk_level,
                c.verification_status AS status,
                c.priority_score,
                c.modus_tags
            FROM claims c
            JOIN hospitals h ON c.hospital_id = h.id
            WHERE c.id = $1
            """,
            claim_id,
        )

        if not claim_row:
            raise HTTPException(status_code=404, detail=f"Klaim {claim_id} tidak ditemukan.")

        # Ambil Evidence Findings
        findings_rows = await conn.fetch(
            """
            SELECT 
                id, finding_type, severity, title, badge_label, description,
                verbatim_quote, source_document_id, source_document_title,
                source_page, paragraph_index, delta_rupiah, confidence_score,
                regulation_reference, comparison_details, is_verbatim_verified
            FROM evidence_findings
            WHERE claim_id = $1
            ORDER BY source_page ASC, paragraph_index ASC
            """,
            claim_id,
        )

        # Ambil Clinical Documents
        docs_rows = await conn.fetch(
            """
            SELECT id, document_type, file_name, raw_text, metadata_json
            FROM clinical_documents
            WHERE claim_id = $1
            ORDER BY id ASC
            """,
            claim_id,
        )

    # Transform Findings
    findings = []
    for f in findings_rows:
        comp_details = None
        if f["comparison_details"]:
            comp_details = json.loads(f["comparison_details"]) if isinstance(f["comparison_details"], str) else f["comparison_details"]

        # Map document ID to frontend document keys
        doc_map = {
            "DOC-089-1": "resumeMedis",
            "DOC-089-2": "laporanOperasi",
            "DOC-089-3": "hasilLab",
            "DOC-089-4": "kuitansiAlkes",
        }
        mapped_doc_id = doc_map.get(f["source_document_id"], "resumeMedis")

        raw_badge = f["badge_label"] or ""
        sanitized_badge = "Kaidah Koding INA-CBG" if "rule engine" in raw_badge.lower() else raw_badge

        findings.append({
            "id": f["id"],
            "type": f["finding_type"],
            "title": f["title"],
            "badgeLabel": sanitized_badge,
            "severity": "danger" if f["severity"] == "HIGH" else ("warning" if f["severity"] == "MEDIUM" else "info"),
            "description": f["description"],
            "citation": {
                "documentId": mapped_doc_id,
                "documentTitle": f["source_document_title"],
                "pageNumber": f["source_page"],
                "paragraphIndex": f["paragraph_index"],
                "exactSubstring": f["verbatim_quote"],
            },
            "regulationReference": f["regulation_reference"],
            "isVerbatim100": f["is_verbatim_verified"],
            "deltaRupiah": float(f["delta_rupiah"]) if f["delta_rupiah"] else 0,
            "comparisonDetails": comp_details,
        })

    # Transform Documents into pages/paragraphs
    type_to_id = {
        "RESUME_MEDIS": "resumeMedis",
        "LAPORAN_OPERASI": "laporanOperasi",
        "LAB_RESULT": "hasilLab",
        "BILLING_ALKES": "kuitansiAlkes",
    }
    type_to_title = {
        "RESUME_MEDIS": "Resume Medis Rawat Inap (Lengkap)",
        "LAPORAN_OPERASI": "Laporan Tindakan Bedah / PCI Intervensi",
        "LAB_RESULT": "Hasil Pemeriksaan Laboratorium & Biomarker",
        "BILLING_ALKES": "Rincian Billing Farmasi & Pemakaian Alkes Implan",
    }

    documents = []
    for d in docs_rows:
        doc_type = d["document_type"]
        mapped_id = type_to_id.get(doc_type, "resumeMedis")
        title = type_to_title.get(doc_type, d["file_name"])
        raw_text = d["raw_text"]
        paragraphs = [p.strip() for p in raw_text.split("\n\n") if p.strip()]
        documents.append({
            "id": mapped_id,
            "title": title,
            "fileName": d["file_name"],
            "pages": [
                {
                    "pageNumber": 1,
                    "paragraphs": paragraphs,
                }
            ],
        })

    sec = json.loads(claim_row["secondary_icd10"]) if isinstance(claim_row["secondary_icd10"], str) else (claim_row["secondary_icd10"] or [])
    modus = json.loads(claim_row["modus_tags"]) if isinstance(claim_row["modus_tags"], str) else (claim_row["modus_tags"] or [])

    # Suggested actions mapping
    rec_action = {
        "type": "PENDING_KLARIFIKASI_RS",
        "label": "Rekomendasi Tindakan: Terbitkan Surat Klarifikasi Faskes",
        "confidence": 92,
        "suggestedNotes": "Klarifikasi resmi diterbitkan ke Komite Medik terkait selisih pemakaian stent dan kriteria diagnosis komplikasi.",
        "disputeDraftSummary": f"Surat klarifikasi resmi atas pengajuan klaim {claim_id}.",
    }
    if claim_row["status"] == "DOWNCODE_DIUSULKAN":
        rec_action = {
            "type": "DOWNCODE_DIUSULKAN",
            "label": "Rekomendasi Tindakan: Penyesuaian Tarif Koding",
            "confidence": 88,
            "suggestedNotes": f"Penyesuaian kode dari Severity III ke Severity I disetujui dengan efisiensi Rp {float(claim_row['delta_tariff']):,.0f}.",
            "disputeDraftSummary": f"Berita acara penyesuaian kode koding {claim_id}.",
        }
    elif claim_row["status"] == "DISETUJUI":
        rec_action = {
            "type": "DISETUJUI",
            "label": "Rekomendasi Tindakan: Persetujuan Realisasi Klaim",
            "confidence": 99,
            "suggestedNotes": "Klaim diverifikasi substantif memenuhi regulasi koding Permenkes No. 3/2023.",
            "disputeDraftSummary": f"Berita acara persetujuan pembayaran {claim_id}.",
        }

    claim_data = {
        "id": claim_row["id"],
        "hospitalName": claim_row["hospital_name"],
        "patientAge": claim_row["patient_age"],
        "patientGender": claim_row["patient_gender"],
        "dpjpName": claim_row["dpjp_name"],
        "admissionDate": claim_row["admission_date"],
        "dischargeDate": claim_row["discharge_date"],
        "primaryDiagnosis": {
            "code": claim_row["primary_icd10"],
            "name": claim_row["primary_diagnosis_name"],
        },
        "secondaryDiagnoses": sec,
        "procedures": [{"code": "00.66", "name": "PTCA or Coronary Atherosctomy"}],
        "inacbgCode": claim_row["inacbg_code"],
        "inacbgDescription": claim_row["inacbg_description"],
        "claimedTariff": float(claim_row["claimed_tariff"]),
        "fairTariff": float(claim_row["fair_tariff"]),
        "deltaTariff": float(claim_row["delta_tariff"]),
        "status": claim_row["status"],
        "riskLevel": claim_row["risk_level"],
        "modusTags": modus,
        "confidenceScore": float(claim_row["priority_score"]),
        "findings": findings,
        "alternativeHypotheses": "Klaim dapat disetujui penuh apabila pihak rumah sakit mampu menyertakan Berita Acara Kerusakan Alkes atau hasil lab penunjang kultur darah positif.",
        "recommendedAction": rec_action,
        "documents": documents,
    }

    return {"status": "success", "data": claim_data}


@router.patch("/{claim_id}/status")
async def update_claim_status(claim_id: str, payload: StatusUpdateRequest):
    """Memperbarui status verifikasi klaim di database."""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        res = await conn.execute(
            """
            UPDATE claims
            SET verification_status = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2;
            """,
            payload.status,
            claim_id,
        )
        if res == "UPDATE 0":
            raise HTTPException(status_code=404, detail=f"Klaim {claim_id} tidak ditemukan.")

    return {"status": "success", "message": f"Status klaim {claim_id} diperbarui menjadi {payload.status}"}
