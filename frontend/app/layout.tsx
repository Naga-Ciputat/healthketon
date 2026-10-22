import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClarixSidebar } from "@/components/widgets/ClarixSidebar";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Clarix AI — JKN Claims Verification Co-Pilot",
  description: "Agentic clinical evidence cross-examiner and dispute co-pilot for BPJS Kesehatan",
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
        <ClarixSidebar />
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
