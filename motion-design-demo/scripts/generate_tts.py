import os
import wave
import sys
from dotenv import dotenv_values
from google import genai
from google.genai import types

# 1. Load Gemini API Key from backend/.env
env_path = os.path.join(os.path.dirname(__file__), "..", "..", "backend", ".env")
env_vars = dotenv_values(env_path)
api_key = env_vars.get("GEMINI_API_KEY_1") or env_vars.get("GEMINI_API_KEY_2")

if not api_key:
    print("ERROR: No Gemini API Key found in backend/.env")
    sys.exit(1)

client = genai.Client(api_key=api_key)

# 2. Narration Scripts for all 7 scenes
scenes = [
    {
        "id": "scene_1",
        "title": "Prolog & Krisis Antarmuka Digital",
        "text": "Pernahkah Anda menggunakan aplikasi yang terasa kaku seperti kertas fotokopi? Atau sebaliknya, antarmuka yang penuh animasi lambat dan melompat-lompat hingga membuat pusing? Di era rekayasa perangkat lunak modern, motion bukan sekadar dekorasi kosmetik. Motion adalah bahasa visual yang menerjemahkan niat sistem ke dalam pemahaman manusia secara instan dan tanpa kata-kata."
    },
    {
        "id": "scene_2",
        "title": "Tiga Pilar Gerak: Timing, Easing, & Koreografi",
        "text": "Skill Motion Design berpijak pada tiga pilar fundamental: Timing, Easing, dan Koreografi. Timing menghormati batas kognitif manusia: perubahan di bawah seratus milidetik terasa instan, sementara durasi dua ratus hingga tiga ratus milidetik adalah titik emas untuk navigasi. Easing memberi bobot fisik nyata, memastikan elemen melambat secara wajar saat berhenti. Dan koreografi menyelaraskan banyak elemen agar mata pengguna diarahkan pada hal yang paling penting."
    },
    {
        "id": "scene_3",
        "title": "Empat Arketipe Kepribadian Motion",
        "text": "Tidak ada satu formula gerak untuk semua aplikasi. Skill ini menyediakan empat arketipe kepribadian: Gaya Productive sangat ideal untuk aplikasi enterprise dan analisis data medis yang membutuhkan kecepatan tanpa gangguan. Gaya Expressive memberikan kegembiraan melalui fisika pegas yang memuaskan. Sementara gaya Elegant menghadirkan kemewahan tempo tenang, dan Playful menyuntikkan energi jenaka pada interaksi kasual."
    },
    {
        "id": "scene_4",
        "title": "12 Prinsip Disney untuk Rekayasa Frontend Modern",
        "text": "Prinsip animasi legendaris Disney yang berusia hampir satu abad kini diadaptasi langsung ke dalam kode web. Konsep Anticipation mengajarkan tombol untuk sedikit menekan ke dalam sebelum bereaksi, memberi kepastian pada jari pengguna. Follow Through dan Secondary Action memastikan elemen pendukung bereaksi terhadap elemen utama. Hasilnya adalah antarmuka yang terasa organik, intuitif, dan responsif terhadap sentuhan manusia."
    },
    {
        "id": "scene_5",
        "title": "Anatomi Siklus State: Idle, Feedback, Sukses, & Error",
        "text": "Mari bedah anatomi siklus state pada komponen formulir. Ketika pengguna menekan tombol simpan, tombol tidak sekadar memuat teks baru, melainkan bermutasi mulus menjadi indikator proses. Jika verifikasi berhasil, tombol bertransformasi menjadi tanda sukses dengan goresan centang yang hidup. Bila terjadi galat, getaran lateral yang halus memberi tahu pengguna tanpa perlu memunculkan pesan peringatan yang berlebihan."
    },
    {
        "id": "scene_6",
        "title": "Performa Ekstrem (60 FPS) & Aksesibilitas",
        "text": "Keindahan visual tidak boleh mengorbankan performa. Skill motion-design mengunci aturan ketat: animasi hanya menggunakan akselerasi GPU lewat transform dan opacity, menjamin kestabilan enam puluh frame per detik tanpa membebani baterai. Dan yang terpenting, dukungan penuh bagi prefers-reduced-motion memastikan pengalaman tetap ramah dan nyaman bagi seluruh lapisan pengguna."
    },
    {
        "id": "scene_7",
        "title": "Penutup & Masa Depan UI Berbasis Motion",
        "text": "Dengan skill motion-design yang kini aktif di workspace Anda, agen AI dapat merancang antarmuka yang tidak hanya cerdas dan fungsional, tetapi juga terasa hidup dan berjiwa. Mari bangun pengalaman digital masa depan yang berbobot, terarah, dan bermakna."
    }
]

output_dir = os.path.join(os.path.dirname(__file__), "..", "audio")
os.makedirs(output_dir, exist_ok=True)

models_to_try = ["gemini-2.5-flash-preview-tts", "gemini-3.8-flash-tts"]

for scene in scenes:
    output_wav = os.path.join(output_dir, f"{scene['id']}.wav")
    print(f"\n[+] Synthesizing {scene['id']}: '{scene['title']}'...")
    
    success = False
    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=scene["text"],
                config=types.GenerateContentConfig(
                    response_modalities=["AUDIO"],
                    speech_config=types.SpeechConfig(
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name="Puck"
                            )
                        )
                    )
                )
            )
            
            audio_bytes = None
            for part in response.candidates[0].content.parts:
                if part.inline_data and part.inline_data.data:
                    audio_bytes = part.inline_data.data
                    break
            
            if audio_bytes:
                # Write as 24kHz Mono 16-bit PCM WAV
                with wave.open(output_wav, "wb") as wav_file:
                    wav_file.setnchannels(1)      # Mono
                    wav_file.setsampwidth(2)     # 16-bit (2 bytes)
                    wav_file.setframerate(24000) # 24kHz
                    wav_file.writeframes(audio_bytes)
                
                # Check duration
                duration_sec = len(audio_bytes) / (24000 * 2)
                print(f"    --> Generated {output_wav} successfully! Duration: {duration_sec:.2f} seconds ({len(audio_bytes)} bytes)")
                success = True
                break
        except Exception as e:
            print(f"    [!] Error with {model_name}: {e}")
            continue

    if not success:
        print(f"    [-] FAILED to generate audio for {scene['id']}")

print("\n[Done] TTS Generation Process Completed.")
