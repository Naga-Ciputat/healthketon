"""
Analisis Lanjutan Data Sampel BPJS 2025:
1. Analisis Dampak Diagnosis Sekunder terhadap Lonjakan Tarif (Severity Level I, II, III).
2. Analisis Potensi Repeat Billing / Readmisi (Kunjungan berulang pasien yang sama dalam 30 hari).
3. Analisis Kesesuaian Rujukan FKTP -> FKRTL (Diagnosis Rujukan vs Diagnosis Masuk RS).
4. Pembuatan Dataset Mockup Berbasis Pola Riil untuk Frontend Clarix AI.
"""

import os
import json
import time
import pandas as pd
import numpy as np

BASE_DIR = r"D:\Download\Data sampel 2015-2024\2025\Data Sampel Reguler Edisi 2025\data"
OUTPUT_EXP_DIR = r"D:\Projects\Web Shi\healthkaton\exploration\extracted_samples"

os.makedirs(OUTPUT_EXP_DIR, exist_ok=True)

fkrtl_path = os.path.join(BASE_DIR, "202403_fkrtl.dta")
dxsec_path = os.path.join(BASE_DIR, "202405_diagnosissekunder.dta")
fktp_path = os.path.join(BASE_DIR, "202402_fktpkapitasi.dta")

print("1. Membaca sampel 100,000 data FKRTL...")
df_fkrtl = pd.read_stata(fkrtl_path, iterator=True).get_chunk(100000)

df_fkrtl['tarif_cbg'] = pd.to_numeric(df_fkrtl['FKL32'], errors='coerce').fillna(0)
df_fkrtl['tgl_masuk'] = pd.to_datetime(df_fkrtl['FKL03'])
df_fkrtl['tgl_pulang'] = pd.to_datetime(df_fkrtl['FKL04'])

# Ekstrak Severity Level dari kode INA-CBG (FKL19)
# Format kode INA-CBG: e.g. G-4-17-I, G-4-17-II, G-4-17-III
def extract_severity(cbg):
    if not isinstance(cbg, str):
        return "Unknown"
    parts = cbg.strip().split('-')
    if len(parts) >= 4:
        sev = parts[-1].upper()
        if sev in ['I', 'II', 'III']:
            return sev
        elif sev == '0':
            return 'Rawat Jalan / Non-Severity'
    return 'Other'

df_fkrtl['severity_level'] = df_fkrtl['FKL19'].apply(extract_severity)
df_ritl = df_fkrtl[df_fkrtl['FKL10'].astype(str).str.upper().str.contains('RITL|RAWAT INAP', na=False)].copy()

print("\n--- DISTRIBUSI SEVERITY LEVEL RAWAT INAP (RITL) ---")
sev_stats = df_ritl.groupby('severity_level').agg(
    jumlah_klaim=('FKL02', 'count'),
    rata_tarif=('tarif_cbg', 'mean'),
    median_tarif=('tarif_cbg', 'median'),
    total_klaim_rp=('tarif_cbg', 'sum')
)
print(sev_stats)

# Hitung rasio kenaikan tarif antar Severity Level
if 'I' in sev_stats.index and 'II' in sev_stats.index and 'III' in sev_stats.index:
    t1 = sev_stats.loc['I', 'rata_tarif']
    t2 = sev_stats.loc['II', 'rata_tarif']
    t3 = sev_stats.loc['III', 'rata_tarif']
    print(f"\nRasio Kenaikan Tarif RITL:")
    print(f"Severity I -> II : Naik {((t2 - t1) / t1)*100:.1f}% (+Rp {t2 - t1:,.0f})")
    print(f"Severity I -> III: Naik {((t3 - t1) / t1)*100:.1f}% (+Rp {t3 - t1:,.0f})")

print("\n2. Analisis Potensi Repeat Billing / Readmisi...")
# Cari pasien dengan multiple visits di RITL dalam rentang <= 30 hari
ritl_sorted = df_ritl.sort_values(by=['PSTV01', 'tgl_masuk'])
ritl_sorted['prev_patient'] = ritl_sorted['PSTV01'].shift(1)
ritl_sorted['prev_discharge'] = ritl_sorted['tgl_pulang'].shift(1)
ritl_sorted['prev_faskes'] = ritl_sorted['FKL06'].shift(1)
ritl_sorted['prev_cbg'] = ritl_sorted['FKL19'].shift(1)

# Hitung jarak hari antar kunjungan
ritl_sorted['days_since_last_visit'] = (ritl_sorted['tgl_masuk'] - ritl_sorted['prev_discharge']).dt.days

readmissions = ritl_sorted[
    (ritl_sorted['PSTV01'] == ritl_sorted['prev_patient']) &
    (ritl_sorted['days_since_last_visit'] >= 0) &
    (ritl_sorted['days_since_last_visit'] <= 30)
]

print(f"Jumlah pasien rawat inap yang kembali masuk RS dalam <= 30 hari: {len(readmissions):,} kasus ({len(readmissions)/len(df_ritl)*100:.2f}% dari seluruh RITL)")
print("Contoh kasus readmisi cepat:")
print(readmissions[['PSTV01', 'FKL02', 'tgl_masuk', 'prev_discharge', 'days_since_last_visit', 'FKL19', 'prev_cbg', 'tarif_cbg']].head(5))

print("\n3. Ekstraksi Profil Kode Diagnosis & Prosedur Paling Sering untuk Mockup AI...")
top_ritl_cbg = df_ritl.groupby(['FKL19', 'FKL19A']).agg(
    frekuensi=('FKL02', 'count'),
    rata_biaya=('tarif_cbg', 'mean'),
    total_biaya=('tarif_cbg', 'sum')
).sort_values(by='total_biaya', ascending=False).head(15)

print("\nTop 15 INA-CBG Rawat Inap dengan Total Biaya Terbesar:")
print(top_ritl_cbg)

# Simpan hasil agregat ke CSV
csv_out = os.path.join(OUTPUT_EXP_DIR, "top_15_inacbg_cost_drivers.csv")
top_ritl_cbg.to_csv(csv_out)
print(f"Tersimpan di: {csv_out}")

# Ekspor ringkasan statistik ke JSON
summary_stats = {
    "total_claims_sampled": 100000,
    "ritl_count": int(len(df_ritl)),
    "rjtl_count": int(len(df_fkrtl) - len(df_ritl)),
    "severity_distribution": {
        str(k): {
            "count": int(v["jumlah_klaim"]),
            "avg_tariff": float(v["rata_tarif"]),
            "total_rp": float(v["total_klaim_rp"])
        } for k, v in sev_stats.iterrows()
    },
    "readmission_30d_count": int(len(readmissions)),
    "readmission_30d_rate_pct": round(float(len(readmissions) / len(df_ritl) * 100), 2)
}

summary_json_path = os.path.join(OUTPUT_EXP_DIR, "bpjs_sample_statistical_summary.json")
with open(summary_json_path, "w", encoding="utf-8") as f:
    json.dump(summary_stats, f, indent=2)
print(f"Statistik tersimpan di: {summary_json_path}")
print("Selesai analisis lanjutan.")
