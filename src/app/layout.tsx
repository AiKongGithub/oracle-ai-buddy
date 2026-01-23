import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Thai font for better Thai text rendering
const ibmPlexThai = IBM_Plex_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
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
        className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexThai.variable} font-thai antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
