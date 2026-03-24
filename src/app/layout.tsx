import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700"] });

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
      <body className={`${inter.className} bg-orange-50 min-h-screen flex flex-col`}>
        <nav className="bg-white shadow-sm border-b border-orange-100 py-4 px-6">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-extrabold text-orange-600 hover:text-orange-700 transition-colors">
              🌸 성남시 생활 정보
            </Link>
            <div className="space-x-6 font-semibold text-gray-600">
              <Link href="/" className="hover:text-orange-500 transition-colors">홈</Link>
              <Link href="/blog" className="hover:text-orange-500 transition-colors">블로그</Link>
            </div>
          </div>
        </nav>
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
