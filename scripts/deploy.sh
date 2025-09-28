#!/bin/bash

# GitHub Pages 部署脚本
# 用于本地测试静态构建和部署

set -e

echo "🚀 开始 GitHub Pages 部署流程..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 检查 Node.js 版本
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}❌ 错误: 需要 Node.js 20 或更高版本，当前版本: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js 版本检查通过: $(node -v)${NC}"

# 进入前端目录
cd packages/frontend

echo -e "${BLUE}📦 安装依赖...${NC}"
npm ci

echo -e "${BLUE}🔧 生成 ABI...${NC}"
npm run genabi

echo -e "${BLUE}🏗️  构建静态文件...${NC}"
# 设置环境变量进行静态构建
NODE_ENV=production npm run build

# 检查构建输出
if [ ! -d "out" ]; then
    echo -e "${RED}❌ 错误: 构建失败，未找到 out 目录${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 构建完成！${NC}"

# 显示构建信息
echo -e "${YELLOW}📊 构建信息:${NC}"
echo "  - 构建目录: packages/frontend/out"
echo "  - 文件数量: $(find out -type f | wc -l)"
echo "  - 总大小: $(du -sh out | cut -f1)"

# 检查是否有 index.html
if [ ! -f "out/index.html" ]; then
    echo -e "${RED}❌ 错误: 未找到 index.html${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 静态文件构建成功！${NC}"

# 返回根目录
cd ../..

echo -e "${YELLOW}📋 部署说明:${NC}"
echo "1. 将代码推送到 GitHub 仓库"
echo "2. GitHub Actions 会自动构建并部署到 GitHub Pages"
echo "3. 访问 https://<username>.github.io/<repository-name> 查看部署结果"

# 检查是否在 Git 仓库中
if [ -d ".git" ]; then
    echo -e "${BLUE}🔍 当前 Git 状态:${NC}"
    git status --porcelain
    
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}⚠️  有未提交的更改，建议先提交:${NC}"
        echo "   git add ."
        echo "   git commit -m 'feat: add GitHub Pages deployment support'"
        echo "   git push"
    else
        echo -e "${GREEN}✅ 工作目录干净，可以直接推送${NC}"
    fi
fi

echo -e "${GREEN}🎉 部署准备完成！${NC}"
