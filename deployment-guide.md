# 🚀 塔罗占卜师应用部署指南

## 快速部署方案

### 1. 后端部署到 Railway

1. **创建 Railway 账户**
   - 访问 [railway.app](https://railway.app)
   - 使用 GitHub 登录

2. **部署步骤**
   ```bash
   # 1. 推送代码到 GitHub
   git add .
   git commit -m "准备部署"
   git push origin main
   
   # 2. 在 Railway 控制台
   # - 点击 "New Project"
   # - 选择 "Deploy from GitHub repo"
   # - 选择您的仓库
   # - 选择根目录部署
   ```

3. **环境变量配置**
   在 Railway 控制台设置以下环境变量：
   ```
   ENVIRONMENT=production
   PORT=8000
   OPENAI_API_KEY=your_openai_key_here
   GEMINI_API_KEY=your_gemini_key_here
   DEEPSEEK_API_KEY=your_deepseek_key_here
   ```

4. **获取后端URL**
   - 部署完成后，Railway 会提供一个 URL
   - 格式: `https://your-app-name.railway.app`

### 2. 前端部署到 Vercel

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **部署前端**
   ```bash
   cd frontend
   
   # 设置环境变量
   vercel env add NEXT_PUBLIC_API_BASE_URL
   # 输入: https://your-app-name.railway.app
   
   # 部署
   vercel --prod
   ```

3. **或者使用 Vercel 控制台**
   - 访问 [vercel.com](https://vercel.com)
   - 连接 GitHub 仓库
   - 设置根目录为 `frontend`
   - 配置环境变量: `NEXT_PUBLIC_API_BASE_URL`

## 🔍 验证部署

1. **后端健康检查**
   ```bash
   curl https://your-app-name.railway.app/api/v1/status
   ```
   期望返回：
   ```json
   {
     "status": "healthy",
     "service": "塔罗占卜师API",
     "version": "1.0.0",
     "timestamp": "2024-01-01T12:00:00.000000",
     "active_sessions": 0
   }
   ```

2. **前端检查**
   - 访问 Vercel 提供的域名
   - 测试完整占卜流程

## 🎯 替代方案

### 备选方案1: 前端 Vercel + 后端 Render
- **Render**: 免费额度更大，但启动稍慢
- **配置**: 类似 Railway，但需要手动配置构建命令

### 备选方案2: 全栈 Vercel
- **优势**: 单一平台管理
- **限制**: 需要改造为 Vercel 函数架构

### 备选方案3: 全栈 Railway
- **优势**: 统一平台，简化管理
- **配置**: 需要调整前端构建流程

## 💰 成本对比

| 平台 | 免费额度 | 付费起点 | 特点 |
|------|----------|----------|------|
| Vercel | 100GB 流量/月 | $20/月 | 前端优化极佳 |
| Railway | 5$/月免费额度 | $5/月 | 后端部署简单 |
| Render | 750小时/月 | $7/月 | 稳定可靠 |

## 🚨 注意事项

1. **CORS 配置**: 确保后端允许前端域名
2. **API 密钥**: 生产环境使用独立密钥
3. **监控**: 设置应用健康检查
4. **域名**: 可配置自定义域名

推荐使用 **Vercel + Railway** 组合，5分钟内完成部署！
