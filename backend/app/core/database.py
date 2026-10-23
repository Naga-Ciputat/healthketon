import asyncpg
from typing import Optional
from app.core.config import settings

_pool: Optional[asyncpg.Pool] = None


async def get_db_pool() -> asyncpg.Pool:
    """Mengambil atau menginisialisasi connection pool asyncpg ke Neon PostgreSQL."""
    global _pool
    if _pool is None:
        url = settings.sync_database_url
        if not url:
            raise RuntimeError("DATABASE_URL is not set in environment or settings!")
        _pool = await asyncpg.create_pool(
            url,
            min_size=1,
            max_size=10,
            command_timeout=30,
        )
    return _pool


async def close_db_pool():
    """Menutup connection pool saat aplikasi shutdown."""
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None
