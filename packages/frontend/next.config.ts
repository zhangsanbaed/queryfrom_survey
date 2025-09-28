import type { NextConfig } from "next";

// 自动推导 basePath，根据仓库名是否为 用户名.github.io 自动设置为空或 /<repo>
const getBasePath = () => {
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
  const isUserSite = repoName.endsWith('.github.io');
  return isUserSite ? '' : `/${repoName}`;
};

const nextConfig: NextConfig = {
  // 静态导出配置
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  
  // 自动推导 basePath
  basePath: process.env.NODE_ENV === 'production' ? getBasePath() : '',
  
  // 资源路径配置
  assetPrefix: process.env.NODE_ENV === 'production' ? getBasePath() : '',
  
  // 图片优化配置（静态导出时需要禁用）
  images: {
    unoptimized: true,
  },
  
  // 注意：静态导出不支持自定义 headers
  // 如果需要 FHEVM 的 CORS 策略，需要在服务器层面配置
  // headers() {
  //   // Required by FHEVM 
  //   return Promise.resolve([
  //     {
  //       source: '/',
  //       headers: [
  //         {
  //           key: 'Cross-Origin-Opener-Policy',
  //           value: 'same-origin',
  //         },
  //         {
  //           key: 'Cross-Origin-Embedder-Policy',
  //           value: 'require-corp',
  //         },
  //       ],
  //     },
  //   ]);
  // }
};

export default nextConfig;
