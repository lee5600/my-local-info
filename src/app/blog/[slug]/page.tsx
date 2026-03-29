import { getPostBySlug, getAllPosts } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import AdBanner from '@/components/AdBanner';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return { title: 'Not Found' };
  }

  return {
    title: post.title,
    description: post.summary || `${post.title} 안내`,
    openGraph: {
      title: post.title,
      description: post.summary || `${post.title} 안내`,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function BlogPost(props: Props) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // 로컬 데이터를 불러와서 원문 링크 찾기
  let sourceLink = '';
  try {
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
    if (fs.existsSync(dataPath)) {
      const db = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const allItems = [...(db.events || []), ...(db.benefits || [])];
      // 블로그 제목에 원문 서비스명이 포함되어 있거나, 그 역으로 포함된 경우 매칭
      const matched = allItems.find((item: any) => post.title.includes(item.name) || item.name.includes(post.title));
      if (matched && matched.link && matched.link !== '#') {
        sourceLink = matched.link;
      }
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "datePublished": post.date,
        "description": post.summary || `${post.title} 안내`,
        "author": { "@type": "Organization", "name": "성남시 생활 정보" },
        "publisher": { "@type": "Organization", "name": "성남시 생활 정보" }
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://my-local-info.pages.dev/" },
          { "@type": "ListItem", "position": 2, "name": "블로그", "item": "https://my-local-info.pages.dev/blog" },
          { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://my-local-info.pages.dev/blog/${post.slug}` }
        ]
      }) }} />
      <div className="mb-8 border-b border-gray-200 pb-8 text-center">
        <div className="mb-4">
          <span className="bg-orange-100 text-orange-700 px-3 py-1 text-sm font-semibold rounded-full">
            {post.category || '미분류'}
          </span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
        <div className="text-gray-500 text-sm">
          <span>작성일: {post.date}</span>
          <span className="mx-2">|</span>
          <span className="font-medium text-orange-600">최종 업데이트: {post.date}</span>
        </div>
      </div>
      
      {/* markdown 콘텐츠가 스타일링되어 렌더링되는 영역입니다. (prose 클래스 활용) */}
      <div className="prose prose-orange lg:prose-lg max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      <AdBanner />

      <div className="mt-12 bg-gray-50 border border-gray-200 rounded-xl p-6 text-sm text-gray-700 leading-relaxed shadow-sm">
        <p className="mb-3 text-base font-semibold text-gray-800 flex items-center">
          <span className="mr-2">💡</span> 신뢰할 수 있는 공공정보 안내
        </p>
        <p>이 글은 공공데이터포털(<a href="http://data.go.kr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">data.go.kr</a>)의 정보를 바탕으로 AI가 작성하였습니다. 정확한 신청 자격 및 내용은 반드시 공식 안내 페이지 원문 링크를 통해 다시 한번 확인해주세요.</p>
        
        {sourceLink && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <a href={sourceLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-medium hover:bg-gray-100 transition-colors text-blue-700">
              🔗 공식 안내 페이지 (원문) 바로가기
            </a>
          </div>
        )}
      </div>

      <div className="mt-10 pt-8 border-t border-gray-200 text-center">
        <Link href="/blog" className="inline-block bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold py-3 px-8 rounded-full transition-colors">
          ← 블로그 목록으로 돌아가기
        </Link>
      </div>
    </article>
  );
}
