from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import get_db_pool, close_db_pool
from app.api.v1 import api_v1_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database pool
    try:
        await get_db_pool()
        print("[INFO] Database connection pool initialized.")
    except Exception as e:
        print(f"[WARN] Database pool init warning: {e}")
    yield
    # Shutdown: close database pool
    await close_db_pool()
    print("[INFO] Database connection pool closed.")


app = FastAPI(
    title="HealthKaton API",
    description="Backend API & Investigation Pipeline untuk Tata Kelola & Efisiensi Risiko Klaim BPJS Kesehatan",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register v1 router
app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)


@app.get("/health", tags=["Health"])
async def health_check():
    """Endpoint untuk verifikasi status liveness server."""
    return {
        "status": "healthy",
        "service": "healthkaton-backend",
        "environment": settings.APP_ENV,
    }


@app.get(f"{settings.API_V1_PREFIX}", tags=["Root"])
async def root():
    """Root API endpoint info."""
    return {
        "message": "Welcome to HealthKaton API",
        "version": "v1",
        "docs": "/docs",
        "endpoints": [
            f"{settings.API_V1_PREFIX}/claims",
            f"{settings.API_V1_PREFIX}/audit-logs",
            f"{settings.API_V1_PREFIX}/metrics/overview",
            f"{settings.API_V1_PREFIX}/benchmark/cases",
        ],
    }

