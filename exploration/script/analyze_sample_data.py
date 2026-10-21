"""
Script Analisis Data Sampel BPJS Kesehatan Edisi 2025 (Tahun Data 2015-2024)
Fokus: Pemanfaatan untuk Clarix AI / TELISIK (Efisiensi Risiko Fasilitas Kesehatan)
"""

import os
import sys
import json
import time
from collections import Counter
import pandas as pd
import numpy as np

BASE_DIR = r"D:\Download\Data sampel 2015-2024\2025"
OUTPUT_DOC_DIR = r"D:\Projects\Web Shi\healthkaton\docs\insight"
OUTPUT_EXP_DIR = r"D:\Projects\Web Shi\healthkaton\exploration\extracted_samples"

os.makedirs(OUTPUT_DOC_DIR, exist_ok=True)
os.makedirs(OUTPUT_EXP_DIR, exist_ok=True)

print("="*70)
print("1. MEMINDAI STRUKTUR FOLDER & UKURAN BERKAS DATA SAMPEL 2025")
print("="*70)

inventory = []
for root, dirs, files in os.walk(BASE_DIR):
    for f in files:
        if f.endswith(('.dta', '.xlsx', '.csv')) and not f.startswith('.'):
            fp = os.path.join(root, f)
            sz_mb = round(os.path.getsize(fp) / (1024 * 1024), 2)
            rel_folder = os.path.relpath(root, BASE_DIR)
            inventory.append({
                "folder": rel_folder,
                "file": f,
                "size_mb": sz_mb,
                "full_path": fp
            })

df_inv = pd.DataFrame(inventory).sort_values(by="size_mb", ascending=False)
print(f"Total file data/referensi ditemukan: {len(df_inv)}")
print(df_inv[["folder", "file", "size_mb"]].head(15).to_string(index=False))

# Path berkas utama FKRTL dan Diagnosis Sekunder
fkrtl_path = os.path.join(BASE_DIR, "Data Sampel Reguler Edisi 2025", "data", "202403_fkrtl.dta")
dxsekunder_path = os.path.join(BASE_DIR, "Data Sampel Reguler Edisi 2025", "data", "202405_diagnosissekunder.dta")
kepesertaan_path = os.path.join(BASE_DIR, "Data Sampel Reguler Edisi 2025", "data", "2015202401_kepesertaan.dta")
fktp_path = os.path.join(BASE_DIR, "Data Sampel Reguler Edisi 2025", "data", "202402_fktpkapitasi.dta")

print("\n" + "="*70)
print("2. MENGANALISIS SAMPLE DATA FKRTL (RUMAH SAKIT) - 202403_fkrtl.dta")
print("="*70)

# Baca 100.000 baris pertama untuk analisis statistik yang cepat dan representatif
CHUNK_SIZE = 100000
start_time = time.time()
print(f"Membaca {CHUNK_SIZE:,} baris pertama dari FKRTL...")

reader = pd.read_stata(fkrtl_path, iterator=True)
df_fkrtl = reader.get_chunk(CHUNK_SIZE)
load_sec = round(time.time() - start_time, 2)
print(f"Selesai membaca {len(df_fkrtl):,} baris dalam {load_sec} detik.")

# Profiling kolom penting
col_info = {
    "PSTV01": "ID Peserta",
    "FKL02": "Nomor Kunjungan FKRTL (SEP)",
    "FKL03": "Tanggal Masuk",
    "FKL04": "Tanggal Pulang",
    "FKL05": "Provinsi Faskes",
    "FKL08": "Jenis Faskes",
    "FKL09": "Kelas RS",
    "FKL10": "Jenis Layanan (RJTL/RITL)",
    "FKL11": "Poli / Spesialis",
    "FKL15": "Diagnosis Masuk",
    "FKL16": "Kode ICD-10 Masuk",
    "FKL17": "Diagnosis Primer",
    "FKL18": "Kode ICD-10 Primer",
    "FKL19": "Kode INA-CBG",
    "FKL19A": "Deskripsi INA-CBG",
    "FKL20": "MDC INA-CBG",
    "FKL21": "Tipe INA-CBG",
    "FKL32": "Tarif INA-CBG",
    "FKL47": "Total Biaya Diajukan RS (Billing)",
    "FKL48": "Total Biaya Disetujui BPJS"
}

# Hitung metrik agregat
layanan_counts = df_fkrtl['FKL10'].value_counts()
kelas_rs_counts = df_fkrtl['FKL09'].value_counts()
top_dx_primer = df_fkrtl['FKL18'].value_counts().head(10)
top_inacbg = df_fkrtl['FKL19'].value_counts().head(10)

# Analisis Biaya
df_fkrtl['tarif_inacbg'] = pd.to_numeric(df_fkrtl['FKL32'], errors='coerce').fillna(0)
df_fkrtl['biaya_diajukan'] = pd.to_numeric(df_fkrtl['FKL47'], errors='coerce').fillna(0)
df_fkrtl['biaya_disetujui'] = pd.to_numeric(df_fkrtl['FKL48'], errors='coerce').fillna(0)
df_fkrtl['selisih_diajukan_disetujui'] = df_fkrtl['biaya_diajukan'] - df_fkrtl['biaya_disetujui']

# Durasi Rawat Inap (LOS)
df_fkrtl['los'] = (pd.to_datetime(df_fkrtl['FKL04']) - pd.to_datetime(df_fkrtl['FKL03'])).dt.days

# Statistik RITL (Rawat Inap)
df_ritl = df_fkrtl[df_fkrtl['FKL10'].astype(str).str.upper().str.contains('RITL|RAWAT INAP', na=False)]
df_rjtl = df_fkrtl[df_fkrtl['FKL10'].astype(str).str.upper().str.contains('RJTL|RAWAT JALAN', na=False)]

print(f"\nDistribusi Layanan:\n{layanan_counts}")
print(f"\nDistribusi Kelas RS:\n{kelas_rs_counts}")
print(f"\nRata-rata Biaya INA-CBG RITL (Rawat Inap): Rp {df_ritl['tarif_inacbg'].mean():,.2f}")
print(f"Rata-rata Biaya INA-CBG RJTL (Rawat Jalan): Rp {df_rjtl['tarif_inacbg'].mean():,.2f}")
print(f"Rata-rata LOS Rawat Inap: {df_ritl['los'].mean():.2f} hari (Max: {df_ritl['los'].max()} hari)")

# Analisis Diskrepansi Biaya
dispute_cases = df_fkrtl[df_fkrtl['selisih_diajukan_disetujui'] > 0]
print(f"\nKlaim dengan selisih Biaya Diajukan > Disetujui: {len(dispute_cases):,} kasus ({len(dispute_cases)/len(df_fkrtl)*100:.2f}%)")
if len(dispute_cases) > 0:
    print(f"Rata-rata selisih pemotongan/penyesuaian: Rp {dispute_cases['selisih_diajukan_disetujui'].mean():,.2f}")
    print(f"Total selisih pemotongan pada sampel 100k: Rp {dispute_cases['selisih_diajukan_disetujui'].sum():,.2f}")

print("\n" + "="*70)
print("3. MENGANALISIS DIAGNOSIS SEKUNDER (202405_diagnosissekunder.dta)")
print("="*70)

# Baca 100.000 baris diagnosis sekunder
reader_sec = pd.read_stata(dxsekunder_path, iterator=True)
df_sec = reader_sec.get_chunk(100000)
print(f"Selesai membaca {len(df_sec):,} baris diagnosis sekunder.")

# Hitung jumlah diagnosis sekunder per klaim (FKL02)
dx_sec_per_claim = df_sec.groupby('FKL02').size()
print(f"Rata-rata diagnosis sekunder per klaim: {dx_sec_per_claim.mean():.2f}")
print(f"Distribusi jumlah diagnosis sekunder:\n{dx_sec_per_claim.value_counts().head(6)}")

top_dx_sekunder = df_sec['FKL24'].value_counts().head(10)
print(f"\nTop 10 Diagnosis Sekunder Paling Sering Muncul:\n{top_dx_sekunder}")

# Cross-analysis dengan data primer untuk melihat pola komplikasi
sample_seps = set(df_sec['FKL02'].head(50000))
merged_subset = df_fkrtl[df_fkrtl['FKL02'].isin(sample_seps)][['FKL02', 'FKL10', 'FKL18', 'FKL19', 'tarif_inacbg']].copy()
sec_summary = df_sec[df_sec['FKL02'].isin(sample_seps)].groupby('FKL02')['FKL24'].apply(list).reset_index()
merged_subset = merged_subset.merge(sec_summary, on='FKL02', how='left')
merged_subset['num_sec_dx'] = merged_subset['FKL24'].apply(lambda x: len(x) if isinstance(x, list) else 0)

print("\n" + "="*70)
print("4. EKSTRAKSI KASUS NYATA UNTUK MOCKUP FRONTEND / BENCHMARK")
print("="*70)

# Ambil 20 kasus menarik (berbagai kelas RS, bedah, rawat inap, potensi sengketa/pemotongan klaim)
interesting_cases = []
high_cost_cases = df_ritl[df_ritl['tarif_inacbg'] > 5000000].head(10)
dispute_samples = dispute_cases.head(10)

selected_df = pd.concat([high_cost_cases, dispute_samples]).drop_duplicates(subset=['FKL02'])

for idx, row in selected_df.iterrows():
    sep = row['FKL02']
    sec_codes = df_sec[df_sec['FKL02'] == sep]['FKL24'].tolist()
    sec_names = df_sec[df_sec['FKL02'] == sep]['FKL24B'].tolist()
    
    case_obj = {
        "claim_id": str(sep),
        "hospital_name": f"{row['FKL08']} {row['FKL09']} ({row['FKL06']}, {row['FKL05']})",
        "hospital_class": str(row['FKL09']),
        "service_type": str(row['FKL10']),
        "department": str(row['FKL11']),
        "admission_date": str(row['FKL03'])[:10],
        "discharge_date": str(row['FKL04'])[:10],
        "los_days": int(row['los']) if not pd.isna(row['los']) else 0,
        "primary_icd10": str(row['FKL18']),
        "primary_dx_name": str(row['FKL17']),
        "secondary_icd10": sec_codes,
        "secondary_dx_names": sec_names,
        "ina_cbg_code": str(row['FKL19']),
        "ina_cbg_name": str(row['FKL19A']),
        "mdc_group": str(row['FKL20']),
        "tariff_ina_cbg": float(row['tarif_inacbg']),
        "hospital_billed": float(row['biaya_diajukan']),
        "bpjs_approved": float(row['biaya_disetujui']),
        "discrepancy": float(row['selisih_diajukan_disetujui'])
    }
    interesting_cases.append(case_obj)

json_sample_path = os.path.join(OUTPUT_EXP_DIR, "real_bpjs_sample_claims_2025.json")
with open(json_sample_path, "w", encoding="utf-8") as f:
    json.dump(interesting_cases, f, indent=2, ensure_ascii=False)
print(f"Berhasil mengekstrak {len(interesting_cases)} kasus realistis ke: {json_sample_path}")

# Tampilkan ringkasan 3 contoh kasus
for i, c in enumerate(interesting_cases[:3]):
    print(f"\n--- Kasus {i+1}: {c['claim_id']} ({c['service_type']}) ---")
    print(f"RS: {c['hospital_name']}")
    print(f"Diagnosis Primer: {c['primary_icd10']} - {c['primary_dx_name']}")
    print(f"Diagnosis Sekunder ({len(c['secondary_icd10'])}): {', '.join(c['secondary_icd10'][:4])}")
    print(f"INA-CBG: {c['ina_cbg_code']} ({c['ina_cbg_name']})")
    print(f"Tarif INA-CBG: Rp {c['tariff_ina_cbg']:,.0f} | Billed: Rp {c['hospital_billed']:,.0f} | Disetujui: Rp {c['bpjs_approved']:,.0f}")

print("\n" + "="*70)
print("5. ANALISIS SELESAI. SIAP GENERATE DOKUMEN INSIGHT.")
print("="*70)
