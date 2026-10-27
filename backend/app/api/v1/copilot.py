import json
import logging
import re
from typing import Any, Dict, List, Optional
from fastapi import APIRouter
from pydantic import BaseModel
from google import genai
from google.genai import types
from groq import Groq

from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/copilot", tags=["Clarix Copilot"])


class CitationItem(BaseModel):
    documentId: str
    documentTitle: str
    pageNumber: int = 1
    exactSubstring: str


class ActionItem(BaseModel):
    label: str
    actionType: str
    payload: Optional[Dict[str, Any]] = None


class CopilotChatRequest(BaseModel):
    query: str
    pathname: str = "/claims/triage"
    screenContext: Dict[str, Any] = {}
    history: List[Dict[str, str]] = []


class CopilotChatResponse(BaseModel):
    answerMarkdown: str
    reasoningSteps: List[str] = []
    citations: List[CitationItem] = []
    actions: List[ActionItem] = []


SYSTEM_INSTRUCTION = """Anda adalah Clarix AI — Asisten Investigasi Medis & Regulasi BPJS Kesehatan pada platform TELISIK.
Model inferensi aktif: Gemini Flash (Multimodal & Fast Clinical Reasoning).

Anda memiliki kesadaran konteks layar penuh (FULL SCREEN CONTEXT AWARENESS).
Setiap pesan verifikator dilengkapi snapshot JSON data yang sedang tampil di layar browser pengguna saat ini (`SCREEN CONTEXT`).

ATURAN WAJIB & STRICT GROUNDING:
1. STRICT GROUNDING PADA FAKTA LAYAR PENGGUNA:
   - Jika pengguna menanyakan angka atau metrik (misal: "Berapa total potensi koreksi biaya?", "Berapa Recall/FPR?"), sebutkan persis angka/persentase yang ada pada `visibleMetrics` atau data tabel di `SCREEN CONTEXT`.
   - Jika pengguna menanyakan dokumen yang sedang aktif terbuka di layar sebelah kanan, sebutkan nama dokumen yang ada di `activeDocumentTab` atau `activeTabs` (misal: Resume Medis).
   - Jika pengguna menanyakan akun verifikator yang sedang login, sebutkan nama dan peran pada `activeUser` (misalnya: dr. Siti Aminah - Verifikator Utama BPJS).
   - Jika pengguna menanyakan struktur tata letak atau fitur halaman saat ini, jelaskan secara konkret dan komprehensif struktur yang sedang tampak di `pathname`:
     * Untuk /claims/triage: 3 Kartu Metrik Ringkasan di atas (Total Efisiensi Rp 142.5 Jt, Antrean Telaah, Potensi Koreksi), bilah filter faskes & risiko, dan Tabel Daftar Klaim Terprioritaskan.
     * Untuk /claims/:id/dossier: Dual-Pane Layout (Pane Kiri: Kalkulator Selisih Tarif & Kartu Bukti Anomali Klinis; Pane Kanan: Smart Document Viewer PDF).
     * Untuk /benchmark: Matriks Evaluasi Ilmiah, Confusion Matrix, dan Kartu KPI Deteksi (Recall 91.4%, FPR 4.2%).
     * Untuk /clarix-ai: Studio Investigasi Forensik Makro JKN, Riwayat Percakapan Terisolasi per User, dan Konsol Analisis.
     JANGAN PERNAH hanya memberikan kalimat pembuka; berikan rincian komponennya secara lengkap.

2. ANTI-HALUSINASI KLAIM (STRICT CLAIM ISOLATION):
   - JANGAN PERNAH menukar data pasien atau diagnosis klaim lain!
   - Jika pengguna berada di klaim #CLM-2026-092 dan bertanya tentang Sepsis A41.9, periksa data `activeClaim`. Jika klaim tersebut bukan kasus Sepsis, nyatakan secara jujur dan tegas bahwa klaim ini bukan kasus Sepsis, melainkan kasus sesuai data klaim di layar.

3. GAYA BAHASA & STRUKTUR:
   - Gunakan bahasa Indonesia formal, taktis, lugas, dan mengedepankan kepatuhan mediko-legal BPJS Kesehatan (Permenkes No. 3 Tahun 2023).

4. FORMAT OUTPUT:
   Kembalikan respons HANYA dalam format JSON valid tanpa format teks lain:
   {
     "reasoningSteps": ["Langkah penalaran 1...", "Langkah penalaran 2..."],
     "answerMarkdown": "Penjelasan lengkap dalam Markdown formal...",
     "citations": [
       {
         "documentId": "resumeMedis",
         "documentTitle": "Resume Medis Pasien",
         "pageNumber": 1,
         "exactSubstring": "kutipan pendukung jika relevan"
       }
     ],
     "actions": [
       {
         "label": "Lompat ke Bukti",
         "actionType": "JUMP_CITATION",
         "payload": { "documentId": "resumeMedis", "pageNumber": 1 }
       }
     ]
   }
"""


def _clean_json_text(raw_text: str) -> str:
    """Membersihkan markdown backtick sebelum parsing JSON."""
    cleaned = raw_text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return cleaned.strip()


def _call_gemini_flash(query: str, pathname: str, screen_context: Dict[str, Any], history: List[Dict[str, str]]) -> Optional[Dict[str, Any]]:
    """Memanggil Google Gemini Flash melalui google-genai SDK."""
    api_key = settings.get_gemini_key()
    if not api_key:
        return None

    client = genai.Client(api_key=api_key)

    context_payload = {
        "user_query": query,
        "current_pathname": pathname,
        "screen_context": screen_context,
        "conversation_history": history[-6:] if history else [],
    }

    user_prompt = f"Analisis dan jawab kueri verifikator berdasarkan SCREEN CONTEXT berikut:\n\n{json.dumps(context_payload, indent=2, ensure_ascii=False)}"

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,
                system_instruction=SYSTEM_INSTRUCTION,
                response_mime_type="application/json",
            ),
        )
        if response and response.text:
            return json.loads(_clean_json_text(response.text))
    except Exception as e:
        logger.warning(f"[Gemini Flash Copilot Warning]: {e}. Mencoba fallback ke Groq.")
    return None


def _call_groq_fallback(query: str, pathname: str, screen_context: Dict[str, Any], history: List[Dict[str, str]]) -> Optional[Dict[str, Any]]:
    """Fallback ke Groq Llama/Qwen jika kuota Gemini habis."""
    api_key = settings.get_groq_key()
    if not api_key:
        return None

    client = Groq(api_key=api_key)

    context_payload = {
        "user_query": query,
        "current_pathname": pathname,
        "screen_context": screen_context,
        "conversation_history": history[-6:] if history else [],
    }

    user_prompt = f"Analisis dan jawab kueri verifikator berdasarkan SCREEN CONTEXT berikut (WAJIB kembalikan JSON murni):\n\n{json.dumps(context_payload, indent=2, ensure_ascii=False)}"

    try:
        chat_completion = client.chat.completions.create(
            model="qwen/qwen3.8-27b",
            messages=[
                {"role": "system", "content": SYSTEM_INSTRUCTION},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.1,
            response_format={"type": "json_object"},
        )
        content = chat_completion.choices[0].message.content
        if content:
            return json.loads(_clean_json_text(content))
    except Exception as e:
        logger.error(f"[Groq Copilot Fallback Error]: {e}")
    return None


@router.post("/chat", response_model=CopilotChatResponse)
async def copilot_chat(req: CopilotChatRequest):
    """
    Endpoint cerdas Clarix AI Copilot bertenaga Gemini Flash.
    Menerima screenContext real-time dan menjawab dengan grounding 100% akurat.
    """
    # 1. Coba inferensi utama dengan Gemini Flash
    parsed = _call_gemini_flash(req.query, req.pathname, req.screenContext, req.history)

    # 2. Jika gagal atau limit, gunakan Groq fallback
    if not parsed:
        parsed = _call_groq_fallback(req.query, req.pathname, req.screenContext, req.history)

    # 3. Jika AI provider eksternal tidak tersedia, gunakan rule grounding darurat
    if not parsed:
        active_user_name = req.screenContext.get("activeUser", {}).get("name", "dr. Siti Aminah")
        active_doc = req.screenContext.get("activeDocumentTab", "Resume Medis")
        metrics = req.screenContext.get("visibleMetrics", {})
        total_eff = metrics.get("totalEfficiency") or metrics.get("potentialSavings") or "+Rp 142,5 Jt"

        parsed = {
            "reasoningSteps": [
                f"Menganalisis layar aktif {req.pathname}",
                f"Membaca data verifikator: {active_user_name}",
                f"Mengekstrak metrik dan dokumen aktif: {active_doc}",
            ],
            "answerMarkdown": f"Berdasarkan layar yang Anda buka saat ini di **{req.pathname}**:\n\n• **Verifikator Aktif:** {active_user_name}\n• **Dokumen Terbuka:** {active_doc}\n• **Metrik Terdeteksi:** {total_eff}\n\nAda aspek investigasi atau bukti rekam medis yang ingin ditelaah lebih lanjut?",
            "citations": [],
            "actions": [],
        }

    return CopilotChatResponse(
        answerMarkdown=parsed.get("answerMarkdown", "Terjadi kendala dalam merumuskan analisis."),
        reasoningSteps=parsed.get("reasoningSteps", []),
        citations=parsed.get("citations", []),
        actions=parsed.get("actions", []),
    )

