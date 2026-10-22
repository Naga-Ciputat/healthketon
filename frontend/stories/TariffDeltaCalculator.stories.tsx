import type { Meta, StoryObj } from "@storybook/react";
import { TariffDeltaCalculator } from "@/components/widgets/TariffDeltaCalculator";

const meta: Meta<typeof TariffDeltaCalculator> = {
  title: "Clarix AI Clinical/TariffDeltaCalculator",
  component: TariffDeltaCalculator,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof TariffDeltaCalculator>;

export const MyocardialInfarctionUpcodingAndAlkes: Story = {
  args: {
    claimedCode: "I-4-10-III",
    claimedDescription: "Infark Miokard Akut dengan Komplikasi Berat (Severity Level III)",
    claimedTariff: 45000000,
    recommendedCode: "I-4-10-I",
    recommendedDescription: "Infark Miokard Akut Tanpa Komplikasi Berat (Severity Level I)",
    recommendedTariff: 20100000,
    breakdowns: [
      {
        label: "Severity Downcode (A41.9 Sepsis tidak memenuhi kriteria qSOFA/Lab)",
        category: "UPCODING",
        originalAmount: 35000000,
        adjustedAmount: 20100000,
        deltaRupiah: 14900000,
        note: "Permenkes 3/2023 Bab VII Pedoman Tarif INA-CBG",
      },
      {
        label: "Alkes Stent DES (Kuitansi 2 unit vs Laporan Operasi pasang 1 unit)",
        category: "INFLATED_ALKES",
        originalAmount: 10000000,
        adjustedAmount: 0,
        deltaRupiah: 10000000,
        note: "Lampiran Berita Acara Rekonsiliasi Tindakan Bedah",
      },
    ],
    regulationRef: "Permenkes RI No. 3 Tahun 2023 tentang Standar Tarif Pelayanan Kesehatan dalam Program JKN",
  },
};

export const AppendectomyUnbundling: Story = {
  args: {
    claimedCode: "K-4-17-II",
    claimedDescription: "Apendektomi dengan Drainase Peritonitis (Severity Level II)",
    claimedTariff: 18500000,
    recommendedCode: "K-4-17-I",
    recommendedDescription: "Apendektomi Standar Tanpa Komplikasi Berat",
    recommendedTariff: 12200000,
    breakdowns: [
      {
        label: "Larangan Unbundling Prosedur Pembersihan Rongga Peritoneum",
        category: "UNBUNDLING",
        originalAmount: 6300000,
        adjustedAmount: 0,
        deltaRupiah: 6300000,
        note: "Permenkes 3/2023 Kaidah Koding Prosedur Terkait",
      },
    ],
    regulationRef: "Pedoman Teknis Verifikasi Klaim Rumah Sakit BPJS Kesehatan",
  },
};
