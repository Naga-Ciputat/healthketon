import type { Meta, StoryObj } from "@storybook/react";
import { TTEValidationStrip } from "@/components/widgets/TTEValidationStrip";

const meta: Meta<typeof TTEValidationStrip> = {
  title: "Clarix AI Clinical/TTEValidationStrip",
  component: TTEValidationStrip,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof TTEValidationStrip>;

export const DefaultValidTTE: Story = {
  args: {
    signerName: "dr. Hendra Sp.JP",
    signerRole: "DPJP Spesialis Jantung & Pembuluh Darah (SIP: 446.1/1029/DISKES/2023)",
    hospitalName: "RS Sejahtera Medika",
    certificateAuthority: "BSrE - BSSN Terverifikasi",
    sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    privacyCompliance: "Kepatuhan UU PDP No. 27/2022 Terpenuhi (NIK & Rekam Medis Ter-tokenisasi)",
    verificationTimestamp: "11 Okt 2026, 14:32:05 WIB",
  },
};

export const BedahDigestifSigner: Story = {
  args: {
    signerName: "dr. Suryo Wibowo Sp.B",
    signerRole: "DPJP Bedah Umum & Digestif (SIP: 331.2/882/IDISBY/2024)",
    hospitalName: "RS Mitra Sehat",
    certificateAuthority: "BSrE - BSSN Terverifikasi",
    sha256Hash: "9f83c6117931b4f9743fe6193620253736630f9b19e2340164e04191299f72a9",
    privacyCompliance: "Kepatuhan UU PDP No. 27/2022 Terpenuhi (NIK Ter-pseudonim)",
    verificationTimestamp: "12 Okt 2026, 09:15:22 WIB",
  },
};
