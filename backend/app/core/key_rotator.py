import os
import re
import threading
from typing import List, Dict, Optional
import time


class DynamicKeyPool:
    """
    Manajer rotasi API Key dinamis tanpa batasan range(0, n).
    Secara otomatis mendeteksi seluruh key yang cocok dengan prefix di environment variable
    (misal: GROQ_API_KEY, GROQ_API_KEY_1, GROQ_API_KEY_2, GROQ_API_KEY_CUSTOM, dll).
    Mendukung rotasi round-robin thread-safe dan penanganan cooldown saat terkena 429 Rate Limit.
    """

    def __init__(self, prefix: str):
        self.prefix = prefix
        self._lock = threading.Lock()
        self._index = 0
        self._cooldowns: Dict[str, float] = {}  # key -> cooldown expiry timestamp
        self._keys = self._discover_keys()

    def _discover_keys(self) -> List[str]:
        """Menemukan semua key di os.environ yang berawalan prefix tanpa batas."""
        discovered = []
        pattern = re.compile(rf"^{re.escape(self.prefix)}(?:_.*)?$", re.IGNORECASE)

        # Kumpulkan key dan nilainya
        matched_entries = []
        for env_k, env_v in os.environ.items():
            if pattern.match(env_k) and env_v and env_v.strip():
                val = env_v.strip()
                if not val.startswith("your_") and len(val) > 5:
                    matched_entries.append((env_k, val))

        # Urutkan secara natural: nama dasar dulu, lalu yang bernomor urut
        def natural_sort_key(item):
            key_name = item[0]
            # Ekstrak angka di akhir jika ada
            numbers = re.findall(r"\d+", key_name)
            if numbers:
                return (1, int(numbers[-1]), key_name)
            return (0, 0, key_name)

        matched_entries.sort(key=natural_sort_key)
        discovered = [val for _, val in matched_entries]

        # Hapus duplikat nilai sembari menjaga urutan
        seen = set()
        unique_keys = []
        for k in discovered:
            if k not in seen:
                seen.add(k)
                unique_keys.append(k)

        return unique_keys

    def refresh(self):
        """Memuat ulang keys jika environment berubah di runtime."""
        with self._lock:
            self._keys = self._discover_keys()
            self._index = 0

    @property
    def total_keys(self) -> int:
        return len(self._keys)

    def get_all_keys(self) -> List[str]:
        return list(self._keys)

    def mark_rate_limited(self, key: str, cooldown_seconds: float = 60.0):
        """Tandai key tertentu terkena 429 rate limit agar dilewati sementara."""
        with self._lock:
            self._cooldowns[key] = time.time() + cooldown_seconds

    def get_next_key(self) -> Optional[str]:
        """Mengambil key berikutnya dalam pool secara rotasi (round-robin)."""
        with self._lock:
            if not self._keys:
                return None

            now = time.time()
            # Bersihkan cooldown kadaluarsa
            self._cooldowns = {k: exp for k, exp in self._cooldowns.items() if exp > now}

            # Cari key aktif yang tidak sedang cooldown
            for _ in range(len(self._keys)):
                candidate = self._keys[self._index % len(self._keys)]
                self._index += 1
                if candidate not in self._cooldowns:
                    return candidate

            # Jika semua key dalam status cooldown, tetap gunakan kandidat tertua
            candidate = self._keys[self._index % len(self._keys)]
            self._index += 1
            return candidate


# Inisialisasi pool dinamis untuk masing-masing provider
groq_key_pool = DynamicKeyPool("GROQ_API_KEY")
gemini_key_pool = DynamicKeyPool("GEMINI_API_KEY")
nvidia_key_pool = DynamicKeyPool("NVIDIA_API_KEY")
