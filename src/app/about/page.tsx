import Link from 'next/link';

export const metadata = {
  title: "성남시 생활 정보 | 소개",
  description: "성남시 생활 정보 사이트 운영 목적 및 데이터 출처 안내",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-4">사이트 소개</h1>
        <p className="text-lg text-gray-600">성남시 생활 정보 블로그의 운영 목적과 데이터 출처를 안내합니다.</p>
      </div>

      <div className="space-y-10">
        <section className="bg-white p-8 rounded-xl shadow-sm border border-orange-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            🎯 운영 목적
          </h2>
          <p className="text-gray-600 leading-relaxed">
            성남시 주민분들이 지역 내에서 진행되는 다양한 행사, 축제, 그리고 꼭 챙겨야 할 지원금 혜택들을 
            보다 쉽고 빠르게 찾아볼 수 있도록 돕기 위해 만들어졌습니다. 일상 속 유용한 정보들을 놓치지 마세요!
          </p>
        </section>

        <section className="bg-white p-8 rounded-xl shadow-sm border border-orange-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            📊 데이터 출처 (공공데이터포털)
          </h2>
          <p className="text-gray-600 leading-relaxed">
            본 사이트에서 제공하는 모든 공공서비스 정보는 대한민국 정부가 운영하는 신뢰할 수 있는 
            <a href="http://data.go.kr/" target="_blank" rel="noopener noreferrer" className="text-orange-600 font-semibold hover:underline mx-1">
              공공데이터포털(data.go.kr)
            </a>
            의 데이터를 기반으로 하고 있습니다.
          </p>
        </section>

        <section className="bg-white p-8 rounded-xl shadow-sm border border-orange-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            🤖 콘텐츠 생성 방식 (AI 활용)
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            공공데이터의 딱딱한 원문 정보를 주민 여러분이 읽고 이해하기 쉽도록, 최신 인공지능(AI) 기술을 활용하여
            친근한 블로그 글 형태로 매일 자동 재가공하여 제공하고 있습니다.
          </p>
          <div className="bg-orange-50 p-4 rounded-lg text-sm text-orange-800">
            <strong>유의사항:</strong> AI가 요약한 글이므로 세부 신청 조건이나 일정이 변경될 수 있습니다. 
            중요한 혜택이나 행사는 반드시 각 글 하단에 안내된 <strong>공식 안내 페이지(원문 링크)</strong>를 통해 다시 한번 확인해주시기 바랍니다.
          </div>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Link href="/" className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
