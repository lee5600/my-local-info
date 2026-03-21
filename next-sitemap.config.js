/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://my-local-info.pages.dev',
  generateRobotsTxt: true, // robots.txt 파일도 함께 생성
  sitemapSize: 7000,
};
