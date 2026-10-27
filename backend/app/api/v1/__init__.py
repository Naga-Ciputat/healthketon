from fastapi import APIRouter
from app.api.v1.claims import router as claims_router
from app.api.v1.audit import router as audit_router
from app.api.v1.metrics import router as metrics_router
from app.api.v1.benchmark import router as benchmark_router
from app.api.v1.copilot import router as copilot_router

api_v1_router = APIRouter()

api_v1_router.include_router(claims_router)
api_v1_router.include_router(audit_router)
api_v1_router.include_router(metrics_router)
api_v1_router.include_router(benchmark_router)
api_v1_router.include_router(copilot_router)
