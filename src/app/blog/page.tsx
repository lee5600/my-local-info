import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default function BlogList() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-orange-600 mb-8 border-b pb-4 border-orange-200">
        📚 동네 블로그
      </h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <header className="mb-4">
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                <span className="bg-orange-100 text-orange-700 font-medium px-2.5 py-1 rounded-md">
                  {post.category || '기타'}
                </span>
                <time>{post.date}</time>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 hover:text-orange-500 transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
            </header>
            <p className="text-gray-600 line-clamp-2">
              {post.summary}
            </p>
            <div className="mt-4">
              <Link href={`/blog/${post.slug}`} className="text-orange-500 font-semibold hover:text-orange-600">
                자세히 보기 →
              </Link>
            </div>
          </article>
        ))}
        {posts.length === 0 && (
          <p className="text-gray-500 text-center py-10">아직 등록된 블로그 글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
