# GitHub Pages 部署指南

本项目已配置支持 GitHub Pages 静态部署，包含自动 basePath 推导功能。

## 🚀 自动部署

### 前提条件
1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 "GitHub Actions" 作为部署源

### 部署流程
1. **推送代码**：将代码推送到 `main` 或 `master` 分支
2. **自动构建**：GitHub Actions 会自动：
   - 安装依赖
   - 生成 ABI 文件
   - 构建静态文件
   - 部署到 GitHub Pages

### basePath 自动推导
系统会根据仓库名自动设置 basePath：

- **用户站点** (`username.github.io`)：`basePath = ""`
- **项目站点** (其他仓库名)：`basePath = "/<repository-name>"`

例如：
- 仓库 `john.github.io` → 访问地址：`https://john.github.io/`
- 仓库 `john/my-app` → 访问地址：`https://john.github.io/my-app/`

## 🛠️ 本地测试

### 使用部署脚本
```bash
# 在项目根目录运行
./scripts/deploy.sh
```

### 手动构建测试
```bash
# 进入前端目录
cd packages/frontend

# 安装依赖
npm ci

# 生成 ABI
npm run genabi

# 构建静态文件
NODE_ENV=production npm run build

# 查看构建结果
ls -la out/
```

### 本地预览
```bash
# 使用 serve 预览静态文件
npx serve packages/frontend/out

# 或使用 Python
cd packages/frontend/out
python3 -m http.server 8080
```

## 📁 文件结构

```
├── .github/workflows/deploy.yml    # GitHub Actions 工作流
├── scripts/deploy.sh               # 本地部署脚本
├── packages/frontend/
│   ├── next.config.ts              # Next.js 配置（支持静态导出）
│   ├── package.json                # 构建脚本
│   └── out/                        # 静态文件输出目录
└── DEPLOYMENT.md                   # 本文件
```

## 🔧 配置说明

### Next.js 配置
- `output: 'export'`：启用静态导出
- `trailingSlash: true`：URL 以斜杠结尾
- `images.unoptimized: true`：禁用图片优化（静态导出需要）
- 自动 basePath 推导

### GitHub Actions 工作流
- 使用 Node.js 20
- 自动缓存依赖
- 构建后自动部署到 GitHub Pages

## 🐛 故障排除

### 构建失败
1. 检查 Node.js 版本（需要 20+）
2. 确保所有依赖已安装
3. 检查 ABI 生成是否成功

### 部署失败
1. 检查 GitHub Pages 设置
2. 确认仓库权限
3. 查看 GitHub Actions 日志

### 路径问题
1. 确认 basePath 设置正确
2. 检查静态资源路径
3. 验证 URL 结构

## 📝 注意事项

1. **环境变量**：构建时会自动设置 `NODE_ENV=production`
2. **ABI 文件**：每次构建前会自动生成最新的 ABI 文件
3. **缓存**：GitHub Actions 会缓存 npm 依赖以提高构建速度
4. **权限**：确保 GitHub Actions 有足够的权限部署到 Pages

## 🔗 相关链接

- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [Next.js 静态导出](https://nextjs.org/docs/advanced-features/static-html-export)
- [GitHub Actions](https://docs.github.com/en/actions)
