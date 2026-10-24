import os
import io
import json
import asyncio
from datetime import datetime
import dotenv
import cloudinary
import cloudinary.uploader
import asyncpg

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

dotenv.load_dotenv()

# Setup Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)
CLOUDINARY_FOLDER = os.getenv("CLOUDINARY_FOLDER", "healthkaton/berkas")

# Styles
styles = getSampleStyleSheet()

header_title = ParagraphStyle(
    "HospitalHeaderTitle",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=13,
    leading=15,
    alignment=TA_CENTER,
    textColor=colors.HexColor("#0F172A"),
)

header_sub = ParagraphStyle(
    "HospitalHeaderSub",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8,
    leading=11,
    alignment=TA_CENTER,
    textColor=colors.HexColor("#475569"),
)

doc_title = ParagraphStyle(
    "DocTitle",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=11,
    leading=14,
    alignment=TA_CENTER,
    textColor=colors.HexColor("#1E3A8A"),
)

section_heading = ParagraphStyle(
    "SectionHeading",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=9,
    leading=12,
    textColor=colors.HexColor("#1E293B"),
)

body_text = ParagraphStyle(
    "BodyTextCustom",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.5,
    leading=11.5,
    alignment=TA_JUSTIFY,
    textColor=colors.HexColor("#334155"),
)

body_bold = ParagraphStyle(
    "BodyBoldCustom",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=8.5,
    leading=11.5,
    textColor=colors.HexColor("#1E293B"),
)

table_header = ParagraphStyle(
    "TableHeaderCustom",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=8,
    leading=10,
    alignment=TA_CENTER,
    textColor=colors.white,
)

table_cell = ParagraphStyle(
    "TableCellCustom",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=7.5,
    leading=10,
    textColor=colors.HexColor("#1E293B"),
)

table_cell_center = ParagraphStyle(
    "TableCellCenter",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=7.5,
    leading=10,
    alignment=TA_CENTER,
    textColor=colors.HexColor("#1E293B"),
)

table_cell_right = ParagraphStyle(
    "TableCellRight",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=7.5,
    leading=10,
    alignment=TA_RIGHT,
    textColor=colors.HexColor("#1E293B"),
)

table_cell_bold = ParagraphStyle(
    "TableCellBold",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=7.5,
    leading=10,
    textColor=colors.HexColor("#0F172A"),
)

table_cell_alert = ParagraphStyle(
    "TableCellAlert",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=7.5,
    leading=10,
    alignment=TA_CENTER,
    textColor=colors.HexColor("#DC2626"),
)

table_cell_success = ParagraphStyle(
    "TableCellSuccess",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=7.5,
    leading=10,
    alignment=TA_CENTER,
    textColor=colors.HexColor("#16A34A"),
)


def draw_kop(story, hospital_name, address, reg_number):
    """Membuat Kop Surat Rumah Sakit Resmi."""
    header_data = [
        [
            Paragraph(f"<b>{hospital_name.upper()}</b>", header_title),
        ],
        [
            Paragraph(f"{address} | Akreditasi Paripurna KARS", header_sub),
        ],
        [
            Paragraph(f"No. Izin Faskes: {reg_number} | Telp: (021) 789-2026 | Email: info@{hospital_name.lower().replace(' ', '')}.co.id", header_sub),
        ]
    ]
    t = Table(header_data, colWidths=[18*cm])
    t.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ]))
    story.append(t)
    story.append(Spacer(1, 2*mm))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0F172A"), spaceAfter=1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#94A3B8"), spaceAfter=4*mm))


def draw_patient_strip(story, data_dict):
    """Kotak Informasi Identitas Pasien & Berkas."""
    items = list(data_dict.items())
    rows = []
    for i in range(0, len(items), 2):
        k1, v1 = items[i]
        c1 = [Paragraph(f"<b>{k1}</b>: {v1}", body_text)]
        if i + 1 < len(items):
            k2, v2 = items[i+1]
            c2 = [Paragraph(f"<b>{k2}</b>: {v2}", body_text)]
        else:
            c2 = [Paragraph("", body_text)]
        rows.append([c1, c2])

    t = Table(rows, colWidths=[9*cm, 9*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#CBD5E1")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(t)
    story.append(Spacer(1, 4*mm))


def draw_signature(story, role_left, name_left, role_right, name_right, stamp_text="TERVERIFIKASI RME"):
    """Area tanda tangan dokter & stempel faskes."""
    sig_data = [
        [
            Paragraph(f"Petugas Verifikator / Farmasi<br/><b>{role_left}</b>", body_text),
            Paragraph(f"<b>{stamp_text}</b><br/><font size='6' color='#64748B'>KEMENKES RME-SATUSEHAT VALIDATED</font>", ParagraphStyle("Stamp", parent=styles["Normal"], alignment=TA_CENTER, fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=colors.HexColor("#166534"))),
            Paragraph(f"Dokter Penanggung Jawab Pelayanan<br/><b>{role_right}</b>", ParagraphStyle("Right", parent=styles["Normal"], alignment=TA_RIGHT, fontName="Helvetica", fontSize=8.5, leading=11, textColor=colors.HexColor("#334155"))),
        ],
        [
            Spacer(1, 14*mm),
            Spacer(1, 14*mm),
            Spacer(1, 14*mm),
        ],
        [
            Paragraph(f"( <u>{name_left}</u> )<br/><font size='7' color='#64748B'>SIP: 446/102/SIP-DS/2024</font>", body_text),
            Paragraph("<font size='7' color='#0284C7'>[ Digital Signature Authenticated ]</font>", ParagraphStyle("Center", parent=styles["Normal"], alignment=TA_CENTER)),
            Paragraph(f"( <u>{name_right}</u> )<br/><font size='7' color='#64748B'>SIP: 503/4821/SIP.Sp/2023</font>", ParagraphStyle("Right2", parent=styles["Normal"], alignment=TA_RIGHT, fontName="Helvetica", fontSize=8.5, leading=10)),
        ]
    ]
    t = Table(sig_data, colWidths=[6.5*cm, 5*cm, 6.5*cm])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (1, 0), (1, -1), "CENTER"),
        ("BACKGROUND", (1, 0), (1, 0), colors.HexColor("#F0FDF4")),
        ("BOX", (1, 0), (1, 0), 1, colors.HexColor("#86EFAC")),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    story.append(Spacer(1, 4*mm))
    story.append(KeepTogether(t))


# ==========================================================
# 1. Generator Resume Medis Rawat Inap (CLM-2026-089)
# ==========================================================
def build_resume_medis_clm089():
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=1.5*cm, rightMargin=1.5*cm, topMargin=1.5*cm, bottomMargin=1.5*cm)
    story = []

    draw_kop(story, "RS Sejahtera Medika", "Jl. Boulevard Sejahtera No. 88, Cilandak, Jakarta Selatan", "440/0912/DPMPTSP/2022")
    story.append(Paragraph("<b>RINGKASAN PULANG PASIEN RAWAT INAP (RESUME MEDIS ELEKTRONIK)</b>", doc_title))
    story.append(Spacer(1, 3*mm))

    patient_info = {
        "No. Rekam Medis": "00-48-29",
        "Nama Pasien": "Tn. R (Pasien Anonim)",
        "Tanggal Lahir / Usia": "14 Mei 1968 / 58 Tahun",
        "Jenis Kelamin": "Laki-laki (L)",
        "Tanggal Masuk": "09 Oktober 2026 (11:20 WIB)",
        "Tanggal Keluar": "11 Oktober 2026 (16:30 WIB)",
        "Ruang Perawatan": "CVCU Kardiologi Lt. 3",
        "DPJP Utama": "dr. Hendra Sp.JP, FIHA",
        "Cara Masuk": "IGD Rujukan Faskes Tk 1",
        "Penjaminan": "BPJS Kesehatan (JKN-PBI)",
    }
    draw_patient_strip(story, patient_info)

    story.append(Paragraph("<b>1. ANAMNESIS & RIWAYAT PENYAKIT SEKARANG</b>", section_heading))
    story.append(Spacer(1, 1.5*mm))
    story.append(Paragraph(
        "Pasien mengeluh nyeri dada substernal menjalar ke lengan kiri sejak 3 jam SMRS disertai keringat dingin, mual, dan rasa tertekan beban berat pada dada sebelah kiri saat beristirahat. Riwayat hipertensi sejak 5 tahun tidak teratur minum obat. Riwayat DM disangkal.",
        body_text
    ))
    story.append(Spacer(1, 3*mm))

    story.append(Paragraph("<b>2. PEMERIKSAAN FISIK AWAL (IGD & ADMISI CVCU)</b>", section_heading))
    story.append(Spacer(1, 1.5*mm))
    story.append(Paragraph(
        "Keadaan umum sedang, Compos Mentis (GCS E4M6V5). Tekanan Darah: 130/80 mmHg, Nadi: 88 x/menit teratur kuat angkat, Suhu: 36.8 C (Afebris), Pernapasan: 20 x/menit, SpO2: 98% room air. Pemeriksaan Thorax: Cor S1/S2 reguler murni, murmur (-), gallop (-). Pulmo: Vesikuler +/+, ronkhi basah halus basal (-), wheezing (-). Ekstremitas: Akral hangat, CRT < 2 detik, edema tungkai (-).",
        body_text
    ))
    story.append(Spacer(1, 3*mm))

    story.append(Paragraph("<b>3. KODIFIKASI DIAGNOSIS & TINDAKAN UTAMA</b>", section_heading))
    story.append(Spacer(1, 1.5*mm))

    diag_data = [
        [Paragraph("Klasifikasi", table_header), Paragraph("Kode ICD", table_header), Paragraph("Deskripsi Diagnosis / Tindakan Klinis", table_header), Paragraph("Status Verifikasi", table_header)],
        [Paragraph("Diagnosis Utama", table_cell_bold), Paragraph("I21.0", table_cell_center), Paragraph("Acute transmural myocardial infarction of anterior wall (STEMI)", table_cell), Paragraph("Valid Sesuai EKG", table_cell_success)],
        [Paragraph("Diagnosis Sekunder 1", table_cell_bold), Paragraph("A41.9", table_cell_center), Paragraph("Sepsis, Unspecified (Komplikasi Berat Severity III)", table_cell), Paragraph("Diskrepansi Lab (PCT Normal)", table_cell_alert)],
        [Paragraph("Diagnosis Sekunder 2", table_cell_bold), Paragraph("I10", table_cell_center), Paragraph("Essential (primary) hypertension", table_cell), Paragraph("Tervalidasi", table_cell_success)],
        [Paragraph("Prosedur Utama", table_cell_bold), Paragraph("00.66", table_cell_center), Paragraph("Percutaneous transluminal coronary angioplasty (PTCA / Primary PCI)", table_cell), Paragraph("Tindakan Selesai", table_cell_success)],
    ]
    t_diag = Table(diag_data, colWidths=[3.5*cm, 2.5*cm, 8.5*cm, 3.5*cm])
    t_diag.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1E3A8A")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#94A3B8")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(t_diag)
    story.append(Spacer(1, 3*mm))

    story.append(Paragraph("<b>4. INSTRUKSI & TERAPI SAAT PULANG</b>", section_heading))
    story.append(Spacer(1, 1.5*mm))
    story.append(Paragraph(
        "Dual Antiplatelet Therapy (DAPT): Aspirin 1 x 80 mg PO, Ticagrelor 2 x 90 mg PO. Atorvastatin 1 x 40 mg PO malam. Ramipril 1 x 2.5 mg PO. Bisoprolol 1 x 2.5 mg PO. Kontrol Poli Spesialis Jantung: 18 Oktober 2026.",
        body_text
    ))

    draw_signature(story, "Rekam Medis & Admisi", "Ns. Ratnawati S.Kep", "DPJP Kardiologi Intervensi", "dr. Hendra Sp.JP, FIHA")
    doc.build(story)
    buf.seek(0)
    return buf.getvalue()


# ==========================================================
# 2. Generator Laporan Tindakan PCI Intervensi (CLM-2026-089)
# ==========================================================
def build_laporan_operasi_clm089():
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=1.5*cm, rightMargin=1.5*cm, topMargin=1.5*cm, bottomMargin=1.5*cm)
    story = []

    draw_kop(story, "RS Sejahtera Medika", "Jl. Boulevard Sejahtera No. 88, Cilandak, Jakarta Selatan", "440/0912/DPMPTSP/2022")
    story.append(Paragraph("<b>LEMBAR LAPORAN TINDAKAN INTERVENSI KARDIOLOGI (CATH LAB)</b>", doc_title))
    story.append(Spacer(1, 3*mm))

    cath_info = {
        "No. Rekam Medis": "00-48-29",
        "Nama Pasien": "Tn. R (Pasien Anonim)",
        "Tanggal Tindakan": "09 Oktober 2026 (14:15 - 15:45 WIB)",
        "Ruang Tindakan": "Catheterization Laboratory 1",
        "Operator Utama": "dr. Hendra Sp.JP, FIHA",
        "Asisten Operator": "Ns. Budi Santoso S.Kep",
        "Perawat Instrument": "Ns. Eko Prasetyo",
        "Dokter Anestesi": "dr. Adrian Sp.An (Standby)",
        "Akses Vaskular": "Arteri Radialis Dekstra (Sheath 6F)",
        "Media Kontras": "Iopamiro 370 (Total 85 mL)",
    }
    draw_patient_strip(story, cath_info)

    story.append(Paragraph("<b>1. TEMUAN CORONARY ANGIOGRAPHY (CAG)</b>", section_heading))
    story.append(Spacer(1, 1.5*mm))
    story.append(Paragraph(
        "Kanulasi ostium LCA menggunakan guiding catheter EBU 3.5 6F. Arteri Left Anterior Descending (LAD) menunjukkan total occlusion / 95% stenosis trombotik pada segmen mid-LAD dengan aliran TIMI 0-1. Arteri Left Circumflex (LCx) menunjukkan lesi difus 70% dengan anatomi kalsifikasi dan tortuosity berat. Arteri Right Coronary Artery (RCA) paten, lesi minor 20-30%.",
        body_text
    ))
    story.append(Spacer(1, 3*mm))

    story.append(Paragraph("<b>2. RINCIAN PROSEDUR & PEMASANGAN STENT IMPLAN</b>", section_heading))
    story.append(Spacer(1, 1.5*mm))
    story.append(Paragraph(
        "Kawat pemandu Runthrough NS 0.014 inchi berhasil melewati lesi mid-LAD. Dilakukan predilatasi menggunakan balon semicompliant 2.0 x 15 mm up to 10 atm selama 15 detik.<br/><br/>"
        "<b>Pemasangan Implan Riil:</b> Dilakukan pemasangan <b>1 (satu) unit Drug-Eluting Stent (DES) Resolute Onyx ukuran 2.75 x 26 mm</b> pada mid LAD dengan inflasi 14 atm selama 20 detik. Dilanjutkan post-dilatasi menggunakan balon noncompliant NC 3.0 x 12 mm up to 18 atm.<br/><br/>"
        "<b>Catatan Khusus Alkes Implan:</b> Direncanakan pemasangan stent kedua pada cabang LCx, namun setelah evaluasi ulang guidewire tidak dapat diposisikan optimal akibat <u>tortuosity anatomi ekstrem</u>; <b>stenting alkes kedua dibatalkan dan 1 unit stent cadangan dikembalikan utuh ke Depo Farmasi</b>. Hasil angiografi akhir LAD: TIMI Flow 3, residual stenosis 0%, diseksi (-), perforasi (-).",
        body_text
    ))
    story.append(Spacer(1, 3*mm))

    story.append(Paragraph("<b>3. REKONSILIASI ALAT KESEHATAN TERPASANG PADA PASIEN</b>", section_heading))
    story.append(Spacer(1, 1.5*mm))

    alkes_data = [
        [Paragraph("No", table_header), Paragraph("Nama Alat Kesehatan / Implan", table_header), Paragraph("Spesifikasi Ukuran", table_header), Paragraph("Status Terpasang", table_header), Paragraph("Keterangan Logistik", table_header)],
        [Paragraph("1", table_cell_center), Paragraph("Drug-Eluting Stent (DES) Resolute Onyx", table_cell_bold), Paragraph("2.75 x 26 mm", table_cell_center), Paragraph("1 Unit TERPASANG (Mid LAD)", table_cell_success), Paragraph("Batch Lot: 8849201-B", table_cell)],
        [Paragraph("2", table_cell_center), Paragraph("Drug-Eluting Stent (DES) Cadangan LCx", table_cell_bold), Paragraph("2.75 x 18 mm", table_cell_center), Paragraph("0 Unit (BATAL DIPASANG)", table_cell_alert), Paragraph("Retur ke Depo Farmasi CathLab", table_cell_alert)],
        [Paragraph("3", table_cell_center), Paragraph("Balon PTCA Semi-compliant", table_cell), Paragraph("2.0 x 15 mm", table_cell_center), Paragraph("1 Unit (Habis Pakai)", table_cell), Paragraph("Terpakai Predilatasi", table_cell)],
        [Paragraph("4", table_cell_center), Paragraph("Balon PTCA Non-compliant (NC)", table_cell), Paragraph("3.0 x 12 mm", table_cell_center), Paragraph("1 Unit (Habis Pakai)", table_cell), Paragraph("Terpakai Post-dilatasi", table_cell)],
        [Paragraph("5", table_cell_center), Paragraph("Radimount Radial Sheath Introducer", table_cell), Paragraph("6 French (6F)", table_cell_center), Paragraph("1 Unit (Habis Pakai)", table_cell), Paragraph("Hemostasis Radistop Band", table_cell)],
    ]
    t_alkes = Table(alkes_data, colWidths=[1*cm, 6.5*cm, 3*cm, 4*cm, 3.5*cm])
    t_alkes.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0F766E")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#94A3B8")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(t_alkes)

    draw_signature(story, "Perawat Cath Lab", "Ns. Budi Santoso S.Kep", "Operator Kardiologi Intervensi", "dr. Hendra Sp.JP, FIHA", "OPERASI SELESAI TIMI-3")
    doc.build(story)
    buf.seek(0)
    return buf.getvalue()


# ==========================================================
# 3. Generator Hasil Lab Biomarker & Infeksi (CLM-2026-089)
# ==========================================================
def build_hasil_lab_clm089():
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=1.5*cm, rightMargin=1.5*cm, topMargin=1.5*cm, bottomMargin=1.5*cm)
    story = []

    draw_kop(story, "RS Sejahtera Medika", "Jl. Boulevard Sejahtera No. 88, Cilandak, Jakarta Selatan", "440/0912/DPMPTSP/2022")
    story.append(Paragraph("<b>INSTALASI LABORATORIUM PATOLOGI KLINIK & BIOMARKER</b>", doc_title))
    story.append(Spacer(1, 3*mm))

    lab_info = {
        "No. Order Laboratorium": "LAB-2026-10-8912",
        "No. Rekam Medis": "00-48-29",
        "Nama Pasien": "Tn. R (Pasien Anonim)",
        "Tanggal / Jam Sampling": "09 Oktober 2026 (13:30 WIB)",
        "Dokter Pengirim": "dr. Hendra Sp.JP",
        "Tanggal / Jam Otorisasi": "09 Oktober 2026 (14:45 WIB)",
        "Unit Pengirim": "IGD / CVCU",
        "Penanggung Jawab Lab": "dr. Ratna Sp.PK",
    }
    draw_patient_strip(story, lab_info)

    story.append(Paragraph("<b>HASIL PEMERIKSAAN BIOMARKER KARDIOLOGI & INFLAMASI SEPSIS</b>", section_heading))
    story.append(Spacer(1, 1.5*mm))

    lab_table_data = [
        [Paragraph("Pemeriksaan", table_header), Paragraph("Hasil", table_header), Paragraph("Nilai Rujukan", table_header), Paragraph("Satuan", table_header), Paragraph("Interpretasi Klinis", table_header)],
        # Kardiak
        [Paragraph("<b>Troponin I Kuantitatif (hs-cTnI)</b>", table_cell), Paragraph("<b>14.80</b>", table_cell_alert), Paragraph("< 0.04", table_cell_center), Paragraph("ng/mL", table_cell_center), Paragraph("<b>POSITIF (HIGH) — Infark Miokard Akut</b>", table_cell_alert)],
        [Paragraph("<b>CK-MB Mass</b>", table_cell), Paragraph("<b>88.0</b>", table_cell_alert), Paragraph("< 24.0", table_cell_center), Paragraph("U/L", table_cell_center), Paragraph("Meningkat Signifikan", table_cell_alert)],
        # Biomarker Sepsis (Paling penting untuk fraud upcoding)
        [Paragraph("<b>Prokalsitonin (PCT)</b>", table_cell_bold), Paragraph("<b>0.12</b>", table_cell_success), Paragraph("< 0.50", table_cell_center), Paragraph("ng/mL", table_cell_center), Paragraph("<b>NORMAL — BUKAN SEPSIS SISTEMIK</b><br/><font size='6' color='#475569'>(Sepsis Sistemik >0.50; Sepsis Berat >2.0)</font>", table_cell_success)],
        [Paragraph("Laktat Darah (Arteri)", table_cell), Paragraph("1.10", table_cell_center), Paragraph("0.50 - 2.00", table_cell_center), Paragraph("mmol/L", table_cell_center), Paragraph("Normal (Perfusi Jaringan Adekuat)", table_cell)],
        # Hematologi
        [Paragraph("Leukosit (WBC)", table_cell), Paragraph("8.600", table_cell_center), Paragraph("4.500 - 11.000", table_cell_center), Paragraph("/uL", table_cell_center), Paragraph("Dalam Batas Normal (Tidak Leukositosis)", table_cell_success)],
        [Paragraph("Hemoglobin (Hb)", table_cell), Paragraph("14.2", table_cell_center), Paragraph("13.0 - 17.5", table_cell_center), Paragraph("g/dL", table_cell_center), Paragraph("Normal", table_cell)],
        [Paragraph("Hematokrit (Ht)", table_cell), Paragraph("42.0", table_cell_center), Paragraph("40.0 - 52.0", table_cell_center), Paragraph("%", table_cell_center), Paragraph("Normal", table_cell)],
        [Paragraph("Trombosit (PLT)", table_cell), Paragraph("245.000", table_cell_center), Paragraph("150.000 - 450.000", table_cell_center), Paragraph("/uL", table_cell_center), Paragraph("Normal", table_cell)],
        # Kimia Darah
        [Paragraph("Gula Darah Sewaktu (GDS)", table_cell), Paragraph("138", table_cell_center), Paragraph("< 200", table_cell_center), Paragraph("mg/dL", table_cell_center), Paragraph("Normal", table_cell)],
        [Paragraph("Ureum Darah", table_cell), Paragraph("28.0", table_cell_center), Paragraph("15.0 - 45.0", table_cell_center), Paragraph("mg/dL", table_cell_center), Paragraph("Normal", table_cell)],
        [Paragraph("Kreatinin Serum", table_cell), Paragraph("0.90", table_cell_center), Paragraph("0.70 - 1.30", table_cell_center), Paragraph("mg/dL", table_cell_center), Paragraph("Normal", table_cell)],
        [Paragraph("Elektrolit Natrium (Na)", table_cell), Paragraph("140", table_cell_center), Paragraph("135 - 147", table_cell_center), Paragraph("mmol/L", table_cell_center), Paragraph("Normal", table_cell)],
        [Paragraph("Elektrolit Kalium (K)", table_cell), Paragraph("4.10", table_cell_center), Paragraph("3.50 - 5.10", table_cell_center), Paragraph("mmol/L", table_cell_center), Paragraph("Normal", table_cell)],
    ]
    t_lab = Table(lab_table_data, colWidths=[5.5*cm, 2*cm, 2.5*cm, 2*cm, 6*cm])
    t_lab.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#475569")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#94A3B8")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
        ("BACKGROUND", (0, 3), (-1, 3), colors.HexColor("#FEF2F2")), # Highlight Prokalsitonin baris
    ]))
    story.append(t_lab)
    story.append(Spacer(1, 3*mm))

    story.append(Paragraph("<b>CATATAN LABORATORIUM MIKROBIOLOGI:</b>", section_heading))
    story.append(Paragraph(
        "Kultur Darah Aerob & Anaerob (2 Botol): Inkubasi selama 5 hari (hingga 14/10/2026) tidak menunjukkan pertumbuhan mikroorganisme patogen (Steril / No Growth). Pemeriksaan Biomarker PCT 0.12 ng/mL mengindikasikan ketiadaan infeksi bakterial sistemik.",
        body_text
    ))

    draw_signature(story, "Analis Laboratorium", "Siti Rahma A.Md.AK", "Dokter Penanggung Jawab Lab", "dr. Ratna Sp.PK, M.Kes", "HASIL LAB TEROTORISASI")
    doc.build(story)
    buf.seek(0)
    return buf.getvalue()


# ==========================================================
# 4. Generator Kuitansi Rincian Billing Alkes (CLM-2026-089)
# ==========================================================
def build_kuitansi_billing_clm089():
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=1.5*cm, rightMargin=1.5*cm, topMargin=1.5*cm, bottomMargin=1.5*cm)
    story = []

    draw_kop(story, "RS Sejahtera Medika", "Jl. Boulevard Sejahtera No. 88, Cilandak, Jakarta Selatan", "440/0912/DPMPTSP/2022")
    story.append(Paragraph("<b>KUITANSI RINCIAN BIAYA PEMAKAIAN ALAT KESEHATAN IMPLAN & FARMASI</b>", doc_title))
    story.append(Spacer(1, 3*mm))

    bill_info = {
        "No. Kuitansi Penagihan": "KW-2026-0988",
        "No. Rekam Medis": "00-48-29",
        "Nama Pasien": "Tn. R (Pasien Anonim)",
        "Tanggal Tagihan": "11 Oktober 2026",
        "Penjamin Klaim": "BPJS Kesehatan KCU Jakarta Selatan",
        "Jenis Rawat": "Rawat Inap CVCU Kardiologi",
        "No. SEP BPJS": "0192S0021026V009218",
        "DPJP Perawat": "dr. Hendra Sp.JP",
    }
    draw_patient_strip(story, bill_info)

    story.append(Paragraph("<b>DAFTAR RINCIAN ITEM ALAT KESEHATAN IMPLAN & TINDAKAN YANG DITAGIHKAN:</b>", section_heading))
    story.append(Spacer(1, 1.5*mm))

    bill_table_data = [
        [Paragraph("No", table_header), Paragraph("Deskripsi Alkes / Prosedur Tagihan", table_header), Paragraph("Qty", table_header), Paragraph("Tarif Satuan (Rp)", table_header), Paragraph("Total Biaya (Rp)", table_header)],
        [Paragraph("1", table_cell_center), Paragraph("<b>Drug-Eluting Stent (DES) Resolute Onyx 2.75x26mm</b><br/><font color='#DC2626'>[Ditagihkan 2 Unit vs Laporan Bedah Terpasang 1 Unit]</font>", table_cell), Paragraph("<b>2 Unit</b>", table_cell_alert), Paragraph("12.450.000", table_cell_right), Paragraph("<b>24.900.000</b>", table_cell_right)],
        [Paragraph("2", table_cell_center), Paragraph("Balon Kateter Angioplasti PTCA 2.0x15mm", table_cell), Paragraph("1 Unit", table_cell_center), Paragraph("3.800.000", table_cell_right), Paragraph("3.800.000", table_cell_right)],
        [Paragraph("3", table_cell_center), Paragraph("Balon Noncompliant NC 3.0x12mm", table_cell), Paragraph("1 Unit", table_cell_center), Paragraph("4.200.000", table_cell_right), Paragraph("4.200.000", table_cell_right)],
        [Paragraph("4", table_cell_center), Paragraph("Sheath Introducer Radialis 6F", table_cell), Paragraph("1 Unit", table_cell_center), Paragraph("650.000", table_cell_right), Paragraph("650.000", table_cell_right)],
        [Paragraph("5", table_cell_center), Paragraph("<b>Paket Prosedur PTCA Balon + Diagnostik Koroner Angiografi</b><br/><font color='#DC2626'>[Unbundling: Dilarang ditagihkan terpisah dari paket utama]</font>", table_cell), Paragraph("1 Paket", table_cell_alert), Paragraph("4.500.000", table_cell_right), Paragraph("<b>4.500.000</b>", table_cell_right)],
        [Paragraph("6", table_cell_center), Paragraph("Bahan Habis Pakai Kateterisasi & Farmasi CVCU", table_cell), Paragraph("1 Paket", table_cell_center), Paragraph("6.950.000", table_cell_right), Paragraph("6.950.000", table_cell_right)],
        # Total
        [Paragraph("", table_cell), Paragraph("<b>TOTAL TAGIHAN RS DIAJUKAN (CLAIMED TARIFF)</b>", table_cell_bold), Paragraph("<b>-</b>", table_cell_center), Paragraph("<b>IDR</b>", table_cell_right), Paragraph("<b>45.000.000</b>", table_cell_right)],
    ]

    t_bill = Table(bill_table_data, colWidths=[1*cm, 9*cm, 2*cm, 3*cm, 3*cm])
    t_bill.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1E3A8A")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#94A3B8")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("BACKGROUND", (0, 1), (-1, 1), colors.HexColor("#FEF2F2")), # Highlight stent inflated
        ("BACKGROUND", (0, 5), (-1, 5), colors.HexColor("#FEF2F2")), # Highlight unbundling
        ("BACKGROUND", (0, -1), (-1, -1), colors.HexColor("#F1F5F9")),
    ]))
    story.append(t_bill)
    story.append(Spacer(1, 3*mm))

    story.append(Paragraph("<b>PERNYATAAN BAGIAN KEUANGAN FASKES:</b>", section_heading))
    story.append(Paragraph(
        "Kuitansi penagihan ini disusun berdasarkan lembar pemesanan farmasi dan data sistem billing rumah sakit. Seluruh tagihan diajukan ke BPJS Kesehatan Kantor Cabang Utama Jakarta Selatan untuk proses verifikasi klaim INA-CBG.",
        body_text
    ))

    draw_signature(story, "Bagian Kasir & Penagihan", "Maya Indriani S.E.", "Kepala Instalasi Farmasi", "Apt. Dedi Irawan S.Farm", "TAGIHAN KLAIM JKN")
    doc.build(story)
    buf.seek(0)
    return buf.getvalue()


# ==========================================================
# 5. Generator Dokumen untuk CLM-2026-012 (Stroke Iskemik)
# ==========================================================
def build_resume_medis_clm012():
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=1.5*cm, rightMargin=1.5*cm, topMargin=1.5*cm, bottomMargin=1.5*cm)
    story = []

    draw_kop(story, "RS Mitra Sehat", "Jl. Kesehatan Raya No. 45, Kebayoran Baru, Jakarta Selatan", "440/1182/PTSP/2021")
    story.append(Paragraph("<b>RESUME MEDIS RAWAT INAP — DEPARTEMEN NEUROLOGI</b>", doc_title))
    story.append(Spacer(1, 3*mm))

    pat_info = {
        "No. Rekam Medis": "00-12-88",
        "Nama Pasien": "Ny. T (Pasien Anonim)",
        "Tanggal Masuk": "08 Oktober 2026",
        "Tanggal Keluar": "12 Oktober 2026",
        "DPJP Spesialis": "dr. Budi Sp.S, M.Kes",
        "Diagnosa Primer": "I63.9 — Cerebral Infarction, Unspecified (Stroke Iskemik)",
        "Diagnosa Sekunder": "R40.2 — Coma, Unspecified (Dipertanyakan Koder)",
        "Kode INA-CBG Ditagih": "G-4-14-II (Komplikasi Sedang — Rp 16.000.000)",
    }
    draw_patient_strip(story, pat_info)

    story.append(Paragraph("<b>CATATAN KLINIS & SKALA KESADARAN:</b>", section_heading))
    story.append(Spacer(1, 1.5*mm))
    story.append(Paragraph(
        "Pasien datang dengan kelemahan anggota gerak kanan mendadak (hemiparesis dextra) sejak 6 jam SMRS. Skor GCS pada saat masuk IGD adalah E4M6V4 (Apatis / Somnolen ringan, BUKAN KOMA R40.2). Pasien masih dapat membuka mata spontan dan merespons perintah verbal sederhana. Penagihan kode komplikasi R40.2 (Koma) tidak memenuhi kriteria diagnosis objektif dan diusulkan downcode ke G-4-14-I (Tarif Wajar Rp 8.200.000).",
        body_text
    ))

    draw_signature(story, "Perawat Ruang Rawat", "Ns. Dewi S.Kep", "DPJP Spesialis Saraf", "dr. Budi Sp.S, M.Kes", "STATUS NEUROLOGI VALID")
    doc.build(story)
    buf.seek(0)
    return buf.getvalue()


# ==========================================================
# 6. Generator Dokumen untuk CLM-2026-077 (Donor Note Cloning)
# ==========================================================
def build_resume_medis_clm077():
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=1.5*cm, rightMargin=1.5*cm, topMargin=1.5*cm, bottomMargin=1.5*cm)
    story = []

    draw_kop(story, "RS Sejahtera Medika", "Jl. Boulevard Sejahtera No. 88, Cilandak, Jakarta Selatan", "440/0912/DPMPTSP/2022")
    story.append(Paragraph("<b>RESUME MEDIS RAWAT INAP ELEKTRONIK (BERKAS ACUAN DONOR)</b>", doc_title))
    story.append(Spacer(1, 3*mm))

    pat_info = {
        "No. Rekam Medis": "00-47-19",
        "Nama Pasien": "Tn. M (Pasien Donor)",
        "Tanggal Masuk": "07 Oktober 2026",
        "Tanggal Keluar": "09 Oktober 2026",
        "DPJP Utama": "dr. Hendra Sp.JP, FIHA",
        "Diagnosa": "I21.1 — Acute transmural myocardial infarction of inferior wall",
        "Status Verifikasi": "DISETUJUI PENUH (Klaim Acuan Historis)",
    }
    draw_patient_strip(story, pat_info)

    story.append(Paragraph("<b>CATATAN PERKEMBANGAN PASIEN TERINTEGRASI (SOAP):</b>", section_heading))
    story.append(Spacer(1, 1.5*mm))
    story.append(Paragraph(
        "Pasien mengeluh nyeri dada substernal menjalar ke lengan kiri sejak 3 jam SMRS disertai keringat dingin, mual, dan rasa tertekan beban berat pada dada sebelah kiri saat beristirahat. Pemeriksaan Fisik: TD 130/80 mmHg, Nadi: 88 x/menit, Suhu: 36.8 C.<br/><br/>"
        "<font color='#0284C7'>[Catatan Audit AI: Teks narasi di atas terdeteksi memiliki kemiripan redaksional 94% dengan Pasien #CLM-2026-089 yang dirawat 2 hari setelahnya oleh DPJP yang sama, mengindikasikan copy-paste narasi RME].</font>",
        body_text
    ))

    draw_signature(story, "Rekam Medis", "Ns. Ratnawati S.Kep", "DPJP Kardiologi", "dr. Hendra Sp.JP, FIHA", "BERKAS HISTORIS RESMI")
    doc.build(story)
    buf.seek(0)
    return buf.getvalue()


# ==========================================================
# Main Upload Pipeline
# ==========================================================
async def main():
    print("==================================================")
    print("  GENERATING REAL PDF FILES & UPLOADING TO CLOUDINARY")
    print("==================================================")

    pdf_definitions = [
        # CLM-2026-089
        {
            "claim_id": "CLM-2026-089",
            "doc_id": "DOC-089-1",
            "type": "RESUME_MEDIS",
            "file_name": "Resume_Medis_CLM089.pdf",
            "builder": build_resume_medis_clm089,
        },
        {
            "claim_id": "CLM-2026-089",
            "doc_id": "DOC-089-2",
            "type": "LAPORAN_OPERASI",
            "file_name": "Laporan_Operasi_PCI.pdf",
            "builder": build_laporan_operasi_clm089,
        },
        {
            "claim_id": "CLM-2026-089",
            "doc_id": "DOC-089-3",
            "type": "LAB_RESULT",
            "file_name": "Hasil_Lab_Biomarker.pdf",
            "builder": build_hasil_lab_clm089,
        },
        {
            "claim_id": "CLM-2026-089",
            "doc_id": "DOC-089-4",
            "type": "BILLING_ALKES",
            "file_name": "Kuitansi_Rincian_Billing.pdf",
            "builder": build_kuitansi_billing_clm089,
        },
        # CLM-2026-012
        {
            "claim_id": "CLM-2026-012",
            "doc_id": "DOC-012-1",
            "type": "RESUME_MEDIS",
            "file_name": "Resume_Medis_CLM012.pdf",
            "builder": build_resume_medis_clm012,
        },
        # CLM-2026-077
        {
            "claim_id": "CLM-2026-077",
            "doc_id": "DOC-077-1",
            "type": "RESUME_MEDIS",
            "file_name": "Resume_Medis_Donor_CLM077.pdf",
            "builder": build_resume_medis_clm077,
        },
    ]

    # Connect to PostgreSQL
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("[ERROR] DATABASE_URL not found!")
        return

    print("Connecting to PostgreSQL...")
    conn = await asyncpg.connect(db_url)

    # Pastikan tabel clinical_documents memiliki kolom pdf_url jika belum ada
    await conn.execute("""
        ALTER TABLE clinical_documents ADD COLUMN IF NOT EXISTS pdf_url TEXT;
    """)

    results = {}

    for item in pdf_definitions:
        print(f"\n[1/3] Generating {item['file_name']}...")
        pdf_bytes = item["builder"]()

        # Simpan lokal juga untuk cache/fallback jika offline
        local_dir = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "docs")
        os.makedirs(local_dir, exist_ok=True)
        local_path = os.path.join(local_dir, item["file_name"])
        with open(local_path, "wb") as f:
            f.write(pdf_bytes)
        print(f"      Saved local copy: {local_path}")

        print(f"[2/3] Uploading {item['file_name']} to Cloudinary (folder: {CLOUDINARY_FOLDER})...")
        upload_res = cloudinary.uploader.upload(
            pdf_bytes,
            resource_type="raw",
            folder=CLOUDINARY_FOLDER,
            public_id=item["file_name"],
            overwrite=True,
            invalidate=True,
        )
        secure_url = upload_res["secure_url"]
        print(f"      Uploaded! URL: {secure_url}")
        results[item["doc_id"]] = {
            "file_name": item["file_name"],
            "url": secure_url,
            "claim_id": item["claim_id"],
            "type": item["type"],
        }

        print(f"[3/3] Updating PostgreSQL clinical_documents for {item['doc_id']}...")
        # Update or Insert
        await conn.execute("""
            INSERT INTO clinical_documents (id, claim_id, document_type, file_name, raw_text, metadata_json, pdf_url)
            VALUES ($1, $2, $3, $4, '', $5::jsonb, $6)
            ON CONFLICT (id) DO UPDATE SET
                pdf_url = EXCLUDED.pdf_url,
                metadata_json = clinical_documents.metadata_json || EXCLUDED.metadata_json;
        """,
            item["doc_id"],
            item["claim_id"],
            item["type"],
            item["file_name"],
            json.dumps({"pdf_url": secure_url, "verified": True}),
            secure_url,
        )

    await conn.close()

    # Simpan hasil mapping ke json file untuk kemudahan akses
    output_mapping_path = os.path.join(os.path.dirname(__file__), "cloudinary_pdf_urls.json")
    with open(output_mapping_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"\n[DONE] Saved Cloudinary mapping to {output_mapping_path}")
    print("All authentic medical PDFs generated and uploaded successfully!")


if __name__ == "__main__":
    asyncio.run(main())
