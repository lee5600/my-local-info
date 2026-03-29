import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "성남시 생활 정보 | 행사·혜택·지원금 안내",
  description: "성남시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
  openGraph: {
    title: "성남시 생활 정보 | 행사·혜택·지원금 안내",
    description: "성남시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "성남시 생활 정보",
              "url": "https://my-local-info.pages.dev",
              "description": "성남시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보"
            })
          }}
        />
        {process.env.NEXT_PUBLIC_ADSENSE_ID && process.env.NEXT_PUBLIC_ADSENSE_ID !== '나중에_입력' && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          ></script>
        )}
      </head>
      <body className={`${inter.className} bg-orange-50 min-h-screen flex flex-col`}>
        <nav className="bg-white shadow-sm border-b border-orange-100 py-4 px-6">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-extrabold text-orange-600 hover:text-orange-700 transition-colors">
              🌸 성남시 생활 정보
            </Link>
            <div className="space-x-6 font-semibold text-gray-600">
              <Link href="/" className="hover:text-orange-500 transition-colors">홈</Link>
              <Link href="/about" className="hover:text-orange-500 transition-colors">소개</Link>
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
