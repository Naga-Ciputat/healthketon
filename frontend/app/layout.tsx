import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/widgets/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Attio CRM Workspace",
  description: "Next-generation CRM UI recreation inspired by Attio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} h-full overflow-hidden flex bg-white text-gray-900 antialiased`}
      >
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
