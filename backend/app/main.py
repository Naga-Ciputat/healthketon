from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title="HealthKaton API",
    description="Backend API & Investigation Pipeline untuk Tata Kelola & Efisiensi Risiko Klaim BPJS Kesehatan",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    }
