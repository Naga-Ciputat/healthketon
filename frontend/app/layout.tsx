import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClarixSidebar } from "@/components/widgets/ClarixSidebar";
import { CopilotProvider } from "@/lib/copilotContext";
import { ClarixCopilot } from "@/components/widgets/ClarixCopilot";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TELISIK — Platform Verifikasi Klaim Faskes & Anti-Fraud BPJS Kesehatan",
  description: "Sistem investigasi bukti klinis dan tata kelola klaim JKN berbasis Clarix AI Copilot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <body
        className={`${plusJakartaSans.className} h-full overflow-hidden flex bg-white text-slate-900 antialiased`}
      >
        <CopilotProvider>
          <ClarixSidebar />
          <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
            {children}
          </main>
          <ClarixCopilot />
        </CopilotProvider>
      </body>
    </html>
  );
}
