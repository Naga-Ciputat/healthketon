"""
Comprehensive Test Suite for Dispute Mediation API & AI Arbitration Engine
Covers Milestone M1:
- Endpoints verification (GET /disputes, GET /disputes/{id}, POST /analyze, POST /generate-agreement, POST /resolve)
- Strict Constraint R2: Strictly NO Gemini Pro (code-level assertion and API rejection)
- Fast AI engine verification (Groq LPU LLaMA 3.3 70B & Gemini Flash & Deterministic BAK fallback)
- Strict Constraint R3: Zero Secret Leakage (no API keys, system prompts, or database secrets in responses)
- Audit trail logging and WIB timestamp verification
"""

import json
import re
import sys
from datetime import datetime
from fastapi.testclient import TestClient

from app.main import app
from app.api.v1.disputes import (
    validate_fast_model,
    _infer_deterministic_bak,
    DISPUTE_DATABASE,
    PROHIBITED_MODEL_KEYWORD,
    ALLOWED_FAST_MODELS,
)

client = TestClient(app)


def test_list_disputes():
    """Verify GET /api/v1/disputes lists dispute cases with proper metadata and SLA countdown."""
    print("\n[TEST] 1. Testing GET /api/v1/disputes...")
    response = client.get("/api/v1/disputes")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    body = response.json()

    assert body["status"] == "success"
    assert "total" in body
    assert body["total"] >= 4, f"Expected at least 4 dispute cases, got {body['total']}"
    assert len(body["data"]) > 0

    first_item = body["data"][0]
    required_keys = [
        "claimId", "hospitalName", "hospitalClass", "patientAge", "patientGender",
        "dpjpName", "dpjpSpecialty", "admissionDate", "dischargeDate", "primaryDiagnosis",
        "claimedTariff", "bpjsProposedTariff", "deltaTariff", "disputeReason",
        "disputeStatus", "slaDaysRemaining", "hospitalRebuttal", "bpjsFinding", "matchedBak"
    ]
    for key in required_keys:
        assert key in first_item, f"Missing required key '{key}' in DisputeItem"

    # Verify hospitalRebuttal structure
    rebuttal = first_item["hospitalRebuttal"]
    assert "statement" in rebuttal
    assert "submittedAt" in rebuttal
    assert "dpjpName" in rebuttal
    assert "supportingEvidence" in rebuttal
    assert isinstance(rebuttal["supportingEvidence"], list)

    # Verify bpjsFinding structure
    finding = first_item["bpjsFinding"]
    assert "findingType" in finding
    assert "title" in finding
    assert "verbatimQuote" in finding
    assert "regulationReference" in finding

    # Verify matchedBak structure
    bak = first_item["matchedBak"]
    assert "regulationCode" in bak
    assert "year" in bak
    assert "title" in bak
    assert "relevantClause" in bak

    # Test filtering by status
    resp_dispute = client.get("/api/v1/disputes?status=DISPUTE")
    assert resp_dispute.status_code == 200
    for d in resp_dispute.json()["data"]:
        assert d["disputeStatus"] == "DISPUTE"

    resp_pending = client.get("/api/v1/disputes?status=PENDING_KLARIFIKASI_RS")
    assert resp_pending.status_code == 200
    for d in resp_pending.json()["data"]:
        assert d["disputeStatus"] == "PENDING_KLARIFIKASI_RS"

    # Test search query
    resp_search = client.get("/api/v1/disputes?search=Sepsis")
    assert resp_search.status_code == 200
    assert len(resp_search.json()["data"]) >= 1
    assert "089" in resp_search.json()["data"][0]["claimId"]

    print("  -> GET /api/v1/disputes PASSED (All filters, schemas, and SLA fields verified)")


def test_get_dispute_detail():
    """Verify GET /api/v1/disputes/{claim_id} returns comprehensive dossier."""
    print("\n[TEST] 2. Testing GET /api/v1/disputes/{claim_id}...")
    response = client.get("/api/v1/disputes/CLM-2026-089")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    body = response.json()

    assert body["status"] == "success"
    data = body["data"]
    assert data["claimId"] == "CLM-2026-089"
    assert data["hospitalName"] == "RS Sejahtera Medika"
    assert data["claimedTariff"] == 45000000.0
    assert data["bpjsProposedTariff"] == 20100000.0
    assert data["deltaTariff"] == 24900000.0
    assert data["bpjsFinding"]["findingType"] == "UPCODING_SEPSIS"
    assert "0.12" in data["bpjsFinding"]["verbatimQuote"]
    assert data["matchedBak"]["year"] in [2020, 2021]

    # Verify 404 on nonexistent claim
    resp_404 = client.get("/api/v1/disputes/CLM-NON-EXISTENT-999")
    assert resp_404.status_code == 404
    assert "tidak ditemukan" in resp_404.json()["detail"].lower()

    print("  -> GET /api/v1/disputes/{claim_id} PASSED (Dossier & 404 handler verified)")


def test_strict_constraint_r2_zero_gemini_pro():
    """Verify Strict Constraint R2: Strictly NO Gemini Pro or any Pro model."""
    print("\n[TEST] 3. Testing Strict Constraint R2 (Zero Gemini Pro enforcement)...")

    # 3.1 Code-level validator assertion
    allowed_models = ["llama-3.3-70b-versatile", "gemini-2.5-flash", "gemini-2.0-flash", "qwen/qwen3.8-27b"]
    for m in allowed_models:
        try:
            validate_fast_model(m)
        except ValueError:
            assert False, f"Fast model '{m}' should be accepted without error"

    prohibited_models = [
        "gemini-pro",
        "gemini-1.5-pro",
        "gemini-2.5-pro",
        "gemini-2.0-pro-exp-02-05",
        "claude-3-5-sonnet-pro",
        "custom-pro-model",
    ]
    for m in prohibited_models:
        caught = False
        try:
            validate_fast_model(m)
        except ValueError as e:
            caught = True
            assert "STRICT CONSTRAINT R2 VIOLATION" in str(e)
            assert "Gemini Pro" in str(e)
        assert caught, f"Prohibited model '{m}' was NOT rejected by validate_fast_model!"

    # 3.2 API-level model override rejection
    resp_pro_1 = client.post(
        "/api/v1/disputes/CLM-2026-089/analyze",
        json={"modelOverride": "gemini-1.5-pro"}
    )
    assert resp_pro_1.status_code == 400, f"Expected 400, got {resp_pro_1.status_code}: {resp_pro_1.text}"
    assert "R2" in resp_pro_1.json()["detail"] or "dilarang" in resp_pro_1.json()["detail"].lower()

    resp_pro_2 = client.post(
        "/api/v1/disputes/CLM-2026-089/analyze",
        json={"modelOverride": "gemini-pro"}
    )
    assert resp_pro_2.status_code == 400
    assert "R2" in resp_pro_2.json()["detail"] or "dilarang" in resp_pro_2.json()["detail"].lower()

    print("  -> Constraint R2 PASSED (Zero Gemini Pro strictly enforced at code and API level)")


def test_ai_mediation_inference_and_bak_matcher():
    """Verify POST /api/v1/disputes/{claim_id}/analyze produces fast AI mediation recommendation."""
    print("\n[TEST] 4. Testing POST /api/v1/disputes/{claim_id}/analyze (Fast AI Mediation)...")
    payload = {
        "focus": "biomarker prokalsitonin dan kriteria sepsis",
        "additionalNotes": "Tinjau kriteria SIRS vs SOFA score",
    }
    response = client.post("/api/v1/disputes/CLM-2026-089/analyze", json=payload)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    body = response.json()

    assert "recommendationType" in body
    assert body["recommendationType"] in ["SEPAKAT_DOWNCODE", "SETUJUI_KLAIM_RS", "TOLAK_SENGKETA_RS", "ESKALASI_TAPK"]
    assert "recommendedTariff" in body
    assert body["recommendedTariff"] > 0
    assert "tariffAdjustmentDelta" in body
    assert body["tariffAdjustmentDelta"] >= 0
    assert "bakMatchedArticle" in body
    assert len(body["bakMatchedArticle"]) > 0
    assert "clinicalRationale" in body
    assert len(body["clinicalRationale"]) > 20
    assert "reasoningSteps" in body
    assert isinstance(body["reasoningSteps"], list) and len(body["reasoningSteps"]) > 0
    assert "compromiseTerms" in body
    assert isinstance(body["compromiseTerms"], list) and len(body["compromiseTerms"]) > 0
    assert "confidenceScore" in body
    assert 0.0 < body["confidenceScore"] <= 1.0
    assert "inferenceModelUsed" in body

    # STRICT R2: Model used must NOT contain "pro"
    assert "pro" not in body["inferenceModelUsed"].lower(), f"Pro model was used in inference! {body['inferenceModelUsed']}"

    # Also test CLM-2026-055 (Unbundling)
    resp_055 = client.post("/api/v1/disputes/CLM-2026-055/analyze", json={})
    assert resp_055.status_code == 200
    body_055 = resp_055.json()
    assert body_055["recommendedTariff"] == 7500000.0
    assert body_055["tariffAdjustmentDelta"] == 3700000.0
    assert "pro" not in body_055["inferenceModelUsed"].lower()

    print(f"  -> AI Mediation Analysis PASSED (Model used: '{body['inferenceModelUsed']}', Rec: {body['recommendationType']})")


def test_generate_agreement():
    """Verify POST /api/v1/disputes/{claim_id}/generate-agreement generates formal Berita Acara."""
    print("\n[TEST] 5. Testing POST /api/v1/disputes/{claim_id}/generate-agreement...")
    payload = {
        "resolutionType": "SEPAKAT_DOWNCODE",
        "agreedTariff": 20100000.0,
        "agreedIcd10": "I21.0 (STEMI)",
        "agreedInacbg": "I-4-10-I (Penyakit Jantung Akut Ringan)",
        "notes": "Pencabutan komplikasi sepsis karena prokalsitonin 0.12 ng/mL di bawah ambang batas BAK Kemenkes.",
        "mediatorRs": "dr. Hendra Sp.JP (Ketua Komite Medik)",
        "mediatorBpjs": "dr. Siti Aminah (Verifikator Medis Utama BPJS)",
    }
    response = client.post("/api/v1/disputes/CLM-2026-089/generate-agreement", json=payload)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    body = response.json()

    assert "letterNumber" in body
    assert body["letterNumber"].startswith("BA-ARB/2026/XI/")
    assert "agreementTitle" in body
    assert "BERITA ACARA KESEPAKATAN BERSAMA" in body["agreementTitle"]
    assert "legalClauses" in body
    assert len(body["legalClauses"]) >= 3
    assert any("Final & Mengikat" in c for c in body["legalClauses"])
    assert any("Pelepasan Hak Sengketa" in c for c in body["legalClauses"])
    assert any("Dasar Realisasi Keuangan" in c for c in body["legalClauses"])
    assert "fullDraftHtml" in body
    assert "<html>" in body["fullDraftHtml"]
    assert "20,100,000" in body["fullDraftHtml"]
    assert "generatedAt" in body
    assert "WIB" in body["generatedAt"]

    print(f"  -> Agreement Generator PASSED (Letter No: {body['letterNumber']}, generatedAt: {body['generatedAt']})")


def test_resolve_dispute_and_audit_trail():
    """Verify POST /api/v1/disputes/{claim_id}/resolve updates status and records into audit trail."""
    print("\n[TEST] 6. Testing POST /api/v1/disputes/{claim_id}/resolve (Resolution & Audit Trail)...")
    payload = {
        "resolutionType": "SEPAKAT_DOWNCODE",
        "finalTariff": 20100000.0,
        "officialLetterNumber": "BA-ARB/2026/XI/RSSEJA/089",
        "agreementText": "Kesepakatan mediasi bersama antara RS Sejahtera Medika dan BPJS Kesehatan.",
        "notes": "Sengketa diselesaikan dengan sepakat downcode ke Severity Level I.",
    }
    response = client.post("/api/v1/disputes/CLM-2026-089/resolve", json=payload)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    body = response.json()

    assert body["success"] is True
    assert body["claimId"] == "CLM-2026-089"
    assert body["updatedStatus"] == "SEPAKAT_MEDIASI"
    assert body["auditLogId"].startswith("AUD-DISP-2026-")
    assert body["timestamp"].endswith("WIB")

    # Verify dispute item reflects new status
    get_resp = client.get("/api/v1/disputes/CLM-2026-089")
    assert get_resp.status_code == 200
    assert get_resp.json()["data"]["disputeStatus"] == "SEPAKAT_MEDIASI"
    assert get_resp.json()["data"]["bpjsProposedTariff"] == 20100000.0

    print(f"  -> Resolve & Audit Trail PASSED (Log ID: {body['auditLogId']}, Timestamp: {body['timestamp']})")


def test_zero_secret_leakage_security():
    """
    Verify Strict Constraint R3: Zero Secret Leakage.
    Ensures that no internal API keys, server credentials, database passwords,
    or raw backend system prompts are leaked in response payloads.
    """
    print("\n[TEST] 7. Testing Strict Constraint R3 (Zero Secret Leakage)...")

    responses_to_audit = [
        client.get("/api/v1/disputes").text,
        client.get("/api/v1/disputes/CLM-2026-089").text,
        client.post("/api/v1/disputes/CLM-2026-089/analyze", json={}).text,
        client.post(
            "/api/v1/disputes/CLM-2026-089/generate-agreement",
            json={
                "resolutionType": "SEPAKAT_DOWNCODE",
                "agreedTariff": 20100000.0,
                "agreedIcd10": "I21.0",
                "agreedInacbg": "I-4-10-I",
                "notes": "Testing leakage",
            }
        ).text,
        client.post(
            "/api/v1/disputes/CLM-2026-089/resolve",
            json={
                "resolutionType": "SEPAKAT_DOWNCODE",
                "finalTariff": 20100000.0,
                "officialLetterNumber": "BA-ARB/2026/XI/RSSEJA/089",
                "agreementText": "Testing leakage",
                "notes": "Testing leakage",
            }
        ).text,
    ]

    sensitive_patterns = [
        r"gsk_[a-zA-Z0-9]{20,}",                # Groq API key pattern
        r"AIzaSy[a-zA-Z0-9_-]{33}",             # Google API key pattern
        r"nvapi-[a-zA-Z0-9_-]{20,}",            # NVIDIA API key pattern
        r"postgresql:\/\/[^:]+:[^@]+@",         # Database connection credentials
        r"ep-misty-flower-[a-zA-Z0-9]+",         # Neon DB internal host
        r"SYSTEM_MEDIATION_PROMPT",             # Raw prompt variable
        r"SYSTEM_INSTRUCTION",                  # Copilot prompt variable
    ]

    for idx, resp_text in enumerate(responses_to_audit):
        for pattern in sensitive_patterns:
            matches = re.findall(pattern, resp_text)
            assert len(matches) == 0, f"Sensitive leakage detected in response [{idx}] for pattern '{pattern}': {matches}"

    print("  -> Zero Secret Leakage PASSED (All 5 endpoints verified clean of credentials and raw prompts)")


def test_deterministic_bak_fallback():
    """Verify deterministic fallback engine produces complete grounded recommendations offline."""
    print("\n[TEST] 8. Testing Deterministic BAK Fallback Engine...")
    dispute_099 = DISPUTE_DATABASE["CLM-2026-099"]
    res_099 = _infer_deterministic_bak(dispute_099)
    assert res_099.recommendationType == "SEPAKAT_DOWNCODE"
    assert res_099.recommendedTariff == 19500000.0
    assert res_099.tariffAdjustmentDelta == 8500000.0
    assert "Pasal 24" in res_099.clinicalRationale
    assert "Deterministic" in res_099.inferenceModelUsed
    assert "pro" not in res_099.inferenceModelUsed.lower()

    dispute_012 = DISPUTE_DATABASE["CLM-2026-012"]
    res_012 = _infer_deterministic_bak(dispute_012)
    assert res_012.recommendedTariff == 8200000.0
    assert "96.71" in res_012.clinicalRationale
    assert "pro" not in res_012.inferenceModelUsed.lower()

    print("  -> Deterministic BAK Fallback PASSED (All dispute categories correctly arbitrated)")


def run_all_tests():
    print("=" * 70)
    print("  RUNNING MILESTONE M1 DISPUTE API & AI MEDIATION TEST SUITE")
    print("=" * 70)

    test_list_disputes()
    test_get_dispute_detail()
    test_strict_constraint_r2_zero_gemini_pro()
    test_ai_mediation_inference_and_bak_matcher()
    test_generate_agreement()
    test_resolve_dispute_and_audit_trail()
    test_zero_secret_leakage_security()
    test_deterministic_bak_fallback()

    print("\n" + "=" * 70)
    print("  ALL 8 TESTS PASSED SUCCESSFULLY! (100% SUCCESS RATE)")
    print("=" * 70)


if __name__ == "__main__":
    run_all_tests()
