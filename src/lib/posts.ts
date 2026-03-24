import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 블로그 글 한 개의 데이터 구조를 정의합니다.
export type Post = {
  slug: string; // 파일 이름 (예: my-first-post)
  title: string;
  date: string; // YYYY-MM-DD
  summary: string; // 목록에서 보일 짧은 설명
  category?: string;
  tags?: string[];
  content: string; // 본문 내용
};

// 마크다운 파일들이 모여있는 폴더 경로
const postsDirectory = path.join(process.cwd(), 'src/content/posts');

// 1. 모든 블로그 글 목록을 가져오는 함수 (날짜순 정렬)
export function getAllPosts(): Post[] {
  // 폴더가 없으면 에러를 피하기 위해 빈 목록 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      return getPostBySlug(slug);
    })
    // null 인 글은 제외 (안전망)
    .filter((post): post is Post => post !== null);

  // 날짜 기준 내림차순(최신 글이 위로) 정렬
  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// 2. 특정 주소(slug)의 블로그 글 하나를 가져오는 함수
export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    // 파일이 없으면 null 반환
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // gray-matter 라이브러리로 윗부분(데이터)과 아랫부분(본문) 분리
    const { data, content } = matter(fileContents);

    // 날짜(Date) 객체 처리 로직 (YYYY-MM-DD 변환)
    let formattedDate = '';
    if (data.date) {
      if (data.date instanceof Date) {
        // "2024-03-24T00:00:00.000Z" -> "2024-03-24" 로 잘라내기
        formattedDate = data.date.toISOString().split('T')[0];
      } else {
        formattedDate = String(data.date);
      }
    }

    return {
      slug,
      title: data.title || '제목 없음',
      date: formattedDate,
      summary: data.summary || '',
      category: data.category || '미분류',
      tags: data.tags || [],
      content: content,
    };
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}
