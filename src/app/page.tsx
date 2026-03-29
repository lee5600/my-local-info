import fs from 'fs/promises';
import path from 'path';
import AdBanner from '@/components/AdBanner';

// 데이터의 형태(타입)를 정의합니다. TypeScript를 쓰면 오류를 미리 막을 수 있어요!
type InfoItem = {
  id: number;
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
};

type LocalData = {
  events: InfoItem[];
  benefits: InfoItem[];
};

export default async function Home() {
  // 샘플 데이터를 불러옵니다.
  const filePath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const data: LocalData = JSON.parse(fileContents);

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const jsonLdData = [
    ...data.events.map(item => ({
      "@context": "https://schema.org",
      "@type": "Event",
      "name": item.name,
      "startDate": item.startDate?.replace(/\./g, '-'),
      "endDate": item.endDate?.replace(/\./g, '-') || item.startDate?.replace(/\./g, '-'),
      "location": {
        "@type": "Place",
        "name": item.location,
        "address": item.location
      },
      "description": item.summary
    })),
    ...data.benefits.map(item => ({
      "@context": "https://schema.org",
      "@type": "GovernmentService",
      "name": item.name,
      "description": item.summary,
      "provider": {
        "@type": "GovernmentOrganization",
        "name": item.location || "행정기관"
      }
    }))
  ];

  return (
    // 배경색은 따뜻한 느낌의 크림/베이지 톤(bg-orange-50)을 사용합니다.
    <div className="min-h-screen bg-orange-50 font-sans flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
      {/* 1. 상단 헤더 */}
      <header className="bg-white shadow-sm pt-10 pb-8 px-4 text-center border-b border-orange-100">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-2 tracking-tight">
          🌸 인천 미추홀구 생활 정보
        </h1>
        <p className="text-gray-600 text-lg">
          우리 동네의 따뜻한 소식과 알찬 혜택을 전해드려요.
        </p>
      </header>

      {/* 메인 내용 영역 */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-10 space-y-12">
        
        {/* 2. 이번 달 행사/축제 목록 */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🎉</span>
            <h2 className="text-2xl font-bold text-gray-800">이번 달 행사 / 축제</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.events.map((item) => (
              <a 
                href="/blog" 
                key={item.id}
                className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100/50 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-orange-300 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <div className="mb-4 flex items-start justify-between">
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-md font-semibold">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate" title={item.name}>
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.summary}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500 bg-gray-50/50 p-3 rounded-xl">
                  <p className="flex items-center gap-2">
                    <span className="text-orange-400">📅</span>
                    {item.startDate} ~ {item.endDate}
                  </p>
                  <p className="flex items-center gap-2 truncate" title={item.location}>
                    <span className="text-orange-400">📍</span>
                    {item.location}
                  </p>
                  <p className="flex items-center gap-2 truncate" title={item.target}>
                    <span className="text-orange-400">👤</span>
                    {item.target}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <AdBanner />

        {/* 3. 지원금/혜택 정보 목록 */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🎁</span>
            <h2 className="text-2xl font-bold text-gray-800">놓치면 안 될 혜택 / 지원금</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.benefits.map((item) => (
              <a 
                href="/blog" 
                key={item.id}
                className="flex flex-col md:flex-row bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-green-100/50 group gap-6 items-center"
              >
                <div className="flex-1 w-full">
                  <div className="mb-3 flex items-start justify-between">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md font-semibold">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {item.summary}
                  </p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                    <p className="flex items-center gap-1">
                      <span className="text-green-500">🧑‍🤝‍🧑</span>
                      {item.target}
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="text-green-500">🏢</span>
                      {item.location}
                    </p>
                  </div>
                </div>
                
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </section>

      </main>

      {/* 4. 하단 푸터 */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
          <p>© 2026 우리 동네 생활 정보. All rights reserved.</p>
          <div className="flex flex-col md:flex-row items-center gap-2 mt-4 md:mt-0 text-center md:text-right">
            <span>데이터 출처: 공공데이터포털(data.go.kr)</span>
            <span className="hidden md:inline">|</span>
            <span>마지막 업데이트: {today}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
