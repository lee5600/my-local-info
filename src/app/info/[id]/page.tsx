import fs from 'fs/promises';
import path from 'path';

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

// 모든 데이터를 미리 확인해서 배포용 HTML로 만들 수 있게 해줍니다.
export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const data: LocalData = JSON.parse(fileContents);

  const allItems = [...data.events, ...data.benefits];
  
  return allItems.map((item) => ({
    id: item.id.toString(),
  }));
}

export default async function InfoDetailPage({ params }: { params: any }) {
  // 최신 Next.js 버전과 구버전 모두에서 문제없게끔 안전하게 id를 가져옵니다.
  const resolvedParams = await Promise.resolve(params);
  const idValue = resolvedParams.id;

  const filePath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const data: LocalData = JSON.parse(fileContents);

  const allItems = [...data.events, ...data.benefits];
  const item = allItems.find(i => i.id.toString() === idValue);

  if (!item) {
    return <div className="p-10 text-center text-xl text-gray-500">정보를 찾을 수 없습니다.</div>;
  }

  // 메인 페이지와 동일한 베이지/오렌지 톤으로 배경색과 디자인을 맞춥니다.
  return (
    <div className="min-h-screen bg-orange-50 font-sans flex flex-col">
      <header className="bg-white shadow-sm pt-8 pb-6 px-4 text-center border-b border-orange-100">
        <h1 className="text-3xl font-extrabold text-orange-600 mb-1">상세 정보</h1>
        <p className="text-gray-500 text-sm">자세한 정보와 원본 링크를 확인하세요.</p>
      </header>
      
      <main className="flex-grow max-w-2xl w-full mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-orange-100">
          <div className="mb-4">
            <span className={`text-sm px-3 py-1 rounded-md font-bold ${
              item.category === '행사' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
            }`}>
              {item.category}
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 leading-tight">
            {item.name}
          </h2>
          
          <div className="bg-gray-50 rounded-xl p-5 mb-8 space-y-3 text-gray-700 text-sm sm:text-base shadow-inner">
            <p className="flex items-center gap-3">
              <span className="text-orange-400 text-xl">📅</span> 
              <span className="font-semibold text-gray-500 w-12 text-right">기간</span>
              <span>{item.startDate} ~ {item.endDate}</span>
            </p>
            <p className="flex items-center gap-3">
              <span className="text-orange-400 text-xl">📍</span> 
              <span className="font-semibold text-gray-500 w-12 text-right">장소</span>
              <span>{item.location}</span>
            </p>
            <p className="flex items-center gap-3">
              <span className="text-orange-400 text-xl">👤</span> 
              <span className="font-semibold text-gray-500 w-12 text-right">대상</span>
              <span>{item.target}</span>
            </p>
          </div>
          
          <div className="mb-10 text-gray-800 leading-relaxed text-base sm:text-lg whitespace-pre-wrap border-l-4 border-orange-300 pl-4">
            {item.summary}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 pt-8 border-t border-gray-100">
            <a 
              href="/"
              className="flex-1 max-w-[200px] mx-auto sm:mx-0 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors text-center shadow-sm"
            >
              ← 목록으로 가기
            </a>
            <a 
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 max-w-[260px] mx-auto sm:mx-0 px-4 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors text-center shadow-md flex items-center justify-center gap-2"
            >
              자세히 보기 (원본) <span className="text-xl">↗</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
