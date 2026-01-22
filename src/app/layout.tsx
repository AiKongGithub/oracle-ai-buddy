import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oracle AI Buddy - AI Learning Platform สำหรับคนไทย",
  description: "เรียนรู้ AI ในแบบที่เข้าใจง่าย ด้วยปรัชญา Human in the Loop — AI เป็นเพื่อน ไม่ใช่เจ้านาย",
  keywords: ["AI", "Learning", "Thai", "Oracle", "Human in the Loop", "AI Buddy"],
  authors: [{ name: "KongNoCode" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
