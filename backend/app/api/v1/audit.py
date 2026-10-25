from fastapi import APIRouter, HTTPException
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime, timezone, timedelta
from app.core.database import get_db_pool

router = APIRouter(prefix="/audit-logs", tags=["Audit Trail"])

# Waktu Indonesia Barat (WIB) = UTC+7 (permanen tanpa DST)
WIB = timezone(timedelta(hours=7))
MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"]


def format_wib(dt: Optional[datetime]) -> str:
    """Mengonversi timestamp database ke format resmi WIB (Asia/Jakarta, UTC+7)."""
    if not dt:
        return ""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    dt_wib = dt.astimezone(WIB)
    return f"{dt_wib.day} {MONTHS_ID[dt_wib.month - 1]} {dt_wib.year}, {dt_wib.strftime('%H:%M')} WIB"


class CreateAuditLogRequest(BaseModel):
    id: Optional[str] = None
    claimId: str
    hospitalName: str
    verifierName: str = "dr. Siti Aminah"
    verifierRole: str = "Verifikator Utama BPJS"
    action: str
    finalTariff: float
    savedDeltaRupiah: float
    officialLetterNumber: Optional[str] = None
    notes: str
    letterContent: Optional[str] = None


@router.get("")
async def list_audit_logs():
    """Mengambil daftar log audit verifikasi append-only dari database PostgreSQL dalam zona waktu WIB."""
    pool = await get_db_pool()
    query = """
        SELECT 
            id,
            claim_id,
            hospital_name,
            verifier_id,
            verifier_role,
            action_taken,
            final_tariff,
            saved_delta_rupiah,
            official_letter_number,
            verifier_notes,
            official_letter_draft,
            created_at
        FROM audit_trail_logs
        ORDER BY created_at DESC;
    """
    async with pool.acquire() as conn:
        rows = await conn.fetch(query)

    logs = []
    for r in rows:
        logs.append({
            "id": r["id"],
            "claimId": r["claim_id"],
            "hospitalName": r["hospital_name"],
            "verifierName": r["verifier_id"],
            "verifierRole": r["verifier_role"],
            "timestamp": format_wib(r["created_at"]),
            "action": r["action_taken"],
            "finalTariff": float(r["final_tariff"]),
            "savedDeltaRupiah": float(r["saved_delta_rupiah"]),
            "officialLetterNumber": r["official_letter_number"],
            "notes": r["verifier_notes"],
            "letterContent": r["official_letter_draft"],
        })

    return {"status": "success", "total": len(logs), "data": logs}


@router.post("")
async def create_audit_log(payload: CreateAuditLogRequest):
    """Merekam entri putusan baru ke log audit append-only permanen di database."""
    pool = await get_db_pool()
    log_id = payload.id or f"AUD-2026-{int(datetime.now().timestamp()) % 100000:05d}"

    query = """
        INSERT INTO audit_trail_logs (
            id, claim_id, hospital_name, verifier_id, verifier_role,
            action_taken, final_tariff, saved_delta_rupiah,
            official_letter_number, verifier_notes, official_letter_draft
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id;
    """
    async with pool.acquire() as conn:
        await conn.execute(
            query,
            log_id,
            payload.claimId,
            payload.hospitalName,
            payload.verifierName,
            payload.verifierRole,
            payload.action,
            payload.finalTariff,
            payload.savedDeltaRupiah,
            payload.officialLetterNumber,
            payload.notes,
            payload.letterContent,
        )

        # Update claim status in tandem
        await conn.execute(
            "UPDATE claims SET verification_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2;",
            payload.action,
            payload.claimId,
        )

    return {"status": "success", "message": "Log audit berhasil direkam.", "id": log_id}
