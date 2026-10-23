from fastapi import APIRouter
from app.core.database import get_db_pool

router = APIRouter(prefix="/metrics", tags=["Metrics"])


@router.get("/overview")
async def get_overview_metrics():
    """Mengambil metrik agregat antrean klaim dari database PostgreSQL."""
    pool = await get_db_pool()
    query = """
        SELECT 
            COUNT(*) AS total_claims,
            COALESCE(SUM(claimed_tariff - estimated_fair_tariff), 0) AS total_potential_savings,
            COALESCE(COUNT(*) FILTER (WHERE risk_level = 'TINGGI'), 0) AS high_risk_count,
            COALESCE(COUNT(*) FILTER (WHERE verification_status != 'PERLU_TINJAUAN'), 0) AS verified_count
        FROM claims;
    """
    async with pool.acquire() as conn:
        row = await conn.fetchrow(query)

    total = row["total_claims"] or 0
    savings = float(row["total_potential_savings"] or 0)
    high_risk = row["high_risk_count"] or 0
    verified = row["verified_count"] or 0
    rate = round((verified / total * 100), 1) if total > 0 else 0.0

    return {
        "status": "success",
        "data": {
            "totalClaims": total,
            "totalPotentialSavings": savings,
            "highRiskCount": high_risk,
            "verifiedCount": verified,
            "verificationRate": rate,
        },
    }
