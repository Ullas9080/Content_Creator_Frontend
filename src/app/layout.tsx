import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthHydrator from "@/components/auth/AuthHydrator";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CreatorOS — Your Creator Operating System",
  description:
    "Manage your YouTube, Instagram, and X analytics, brand deals, fan CRM, and AI-powered content ideas — all in one premium dashboard.",
  keywords: ["creator dashboard", "youtube analytics", "instagram analytics", "brand deals", "fan crm"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#0f111a] text-slate-50">
        <AuthHydrator>
          {children}
        </AuthHydrator>
      </body>
    </html>
  );
}
