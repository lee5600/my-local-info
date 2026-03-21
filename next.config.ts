import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 정적 HTML로 만듭니다 (Cloudflare Pages 배포용)
  images: {
    unoptimized: true, // 정적 배포 시 이미지 최적화 기능 비활성화 필수
  },
  trailingSlash: true, // Cloudflare URL 처리 호환성을 위해 끝에 슬래시(/) 추가
};

export default nextConfig;
