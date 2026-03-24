import { getPostBySlug, getAllPosts } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPost(props: Props) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8 border-b border-gray-200 pb-8 text-center">
        <div className="mb-4">
          <span className="bg-orange-100 text-orange-700 px-3 py-1 text-sm font-semibold rounded-full">
            {post.category || '미분류'}
          </span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
        <time className="text-gray-500">{post.date}</time>
      </div>
      
      {/* markdown 콘텐츠가 스타일링되어 렌더링되는 영역입니다. (prose 클래스 활용) */}
      <div className="prose prose-orange lg:prose-lg max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-200 text-center">
        <Link href="/blog" className="inline-block bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold py-3 px-8 rounded-full transition-colors">
          ← 블로그 목록으로 돌아가기
        </Link>
      </div>
    </article>
  );
}
