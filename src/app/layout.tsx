import type { Metadata } from "next";
import { Cairo, Rajdhani } from "next/font/google";
import "./globals.css";
import "../styles/nasa-theme.css";
import { Toaster } from "@/components/ui/toaster";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "منصة القيادة والتحكم v1.1 - الحماية المدنية الجزائرية",
  description: "نظام قيادة متطور بأسلوب NASA للمديرية العامة للحماية المدنية الجزائرية - تكامل Firebase الحقيقي",
  keywords: ["الحماية المدنية", "الجزائر", "نظام القيادة", "NASA Style", "Firebase", "الطوارئ", "الإنقاذ"],
  authors: [{ name: "المديرية العامة للحماية المدنية الجزائرية" }],
  openGraph: {
    title: "منصة القيادة والتحكم v1.1",
    description: "نظام قيادة متطور بأسلوب NASA - تكامل Firebase الحقيقي",
    type: "website",
    locale: 'ar_DZ',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body
        className={`${cairo.variable} ${rajdhani.variable} font-cairo antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
