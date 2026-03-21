import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic", "greek"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "우리 동네 생활 정보",
  description: "공공데이터포털 기반 지역 행사, 축제 및 지원금 정보 제공",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
