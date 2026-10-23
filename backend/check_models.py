import asyncio
import os
from dotenv import load_dotenv

load_dotenv(".env")

from app.core.key_rotator import groq_key_pool, gemini_key_pool, nvidia_key_pool

# 1. Query Groq available models
print("--- Checking Groq Models ---")
groq_key = groq_key_pool.get_next_key()
from groq import Groq

groq_client = Groq(api_key=groq_key)
try:
    models = groq_client.models.list()
    groq_model_ids = [m.id for m in models.data]
    print(f"Available Groq models: {groq_model_ids[:10]}")
except Exception as e:
    print(f"Groq models list error: {e}")

# 2. Query Gemini available models
print("\n--- Checking Gemini Models ---")
gemini_key = gemini_key_pool.get_next_key()
import google.generativeai as genai

genai.configure(api_key=gemini_key)
try:
    gemini_models = [m.name for m in genai.list_models() if "generateContent" in m.supported_generation_methods]
    print(f"Available Gemini models: {gemini_models[:10]}")
except Exception as e:
    print(f"Gemini models list error: {e}")

# 3. Query NVIDIA models
print("\n--- Checking NVIDIA Models ---")
import httpx
nvidia_key = nvidia_key_pool.get_next_key()
try:
    resp = httpx.get(
        "https://integrate.api.nvidia.com/v1/models",
        headers={"Authorization": f"Bearer {nvidia_key}"},
        timeout=10.0
    )
    if resp.status_code == 200:
        n_models = [m["id"] for m in resp.json().get("data", []) if "embed" in m["id"].lower()]
        print(f"Available NVIDIA embedding models: {n_models[:10]}")
    else:
        print(f"NVIDIA models status: {resp.status_code} - {resp.text[:100]}")
except Exception as e:
    print(f"NVIDIA models error: {e}")
