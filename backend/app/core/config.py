import os
from typing import List, Optional
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from app.core.key_rotator import groq_key_pool, gemini_key_pool, nvidia_key_pool

# Pastikan .env terbaca ke os.environ sebelum pembacaan pool
load_dotenv(dotenv_path=".env", override=False)
groq_key_pool.refresh()
gemini_key_pool.refresh()
nvidia_key_pool.refresh()


class Settings(BaseSettings):
    """Konfigurasi aplikasi backend yang membaca dari .env atau environment runtime."""

    # Server & Runtime
    APP_ENV: str = "development"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]

    # Database (Neon Serverless PostgreSQL)
    DATABASE_URL: str = ""

    # Tri-Engine AI Providers
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    NVIDIA_API_KEY: str = ""
    NVIDIA_BASE_URL: str = "https://integrate.api.nvidia.com/v1"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def async_database_url(self) -> str:
        """Memastikan skema URL menggunakan postgresql+asyncpg:// untuk SQLAlchemy AsyncEngine."""
        url = self.DATABASE_URL.strip()
        if not url:
            return ""
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        return url

    @property
    def sync_database_url(self) -> str:
        """Memastikan skema URL standar postgresql:// untuk koneksi sinkron (Psycopg/Seeder/DDL)."""
        url = self.DATABASE_URL.strip()
        if not url:
            return ""
        if url.startswith("postgresql+asyncpg://"):
            url = url.replace("postgresql+asyncpg://", "postgresql://", 1)
        return url

    # Rotasi Kunci Dinamis
    def get_groq_key(self) -> str:
        key = groq_key_pool.get_next_key()
        return key or self.GROQ_API_KEY

    def get_gemini_key(self) -> str:
        key = gemini_key_pool.get_next_key()
        return key or self.GEMINI_API_KEY

    def get_nvidia_key(self) -> str:
        key = nvidia_key_pool.get_next_key()
        return key or self.NVIDIA_API_KEY


settings = Settings()
