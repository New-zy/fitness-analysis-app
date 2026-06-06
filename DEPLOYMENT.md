# FitCorrect AI - Vercel 部署指南

## 快速部署（推荐）

### 步骤 1：准备 GitHub 仓库

```bash
# 初始化 Git 仓库（如果还没有）
git init
git add .
git commit -m "Initial commit: FitCorrect AI fitness app"

# 推送到 GitHub
git remote add origin https://github.com/YOUR_USERNAME/fitness-analysis-app.git
git branch -M main
git push -u origin main
```

### 步骤 2：连接 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 点击 **"New Project"**
3. 选择 **"Import Git Repository"**
4. 输入您的 GitHub 仓库 URL
5. 点击 **"Import"**

### 步骤 3：配置项目

在 Vercel 中配置以下信息：

- **Framework Preset**: 选择 **"Other"**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 步骤 4：部署

1. 点击 **"Deploy"** 按钮
2. 等待部署完成（通常需要 2-5 分钟）
3. 获得公网 URL

## 部署后的应用 URL

部署完成后，您将获得一个类似以下格式的 URL：
```
https://fitness-analysis-app.vercel.app
```

## 自定义域名（可选）

1. 在 Vercel 项目设置中找到 **"Domains"**
2. 点击 **"Add"**
3. 输入您的自定义域名
4. 按照说明配置 DNS 记录

## 环境变量

如果应用需要环境变量，在 Vercel 项目设置中：

1. 找到 **"Environment Variables"**
2. 添加所需的变量
3. 重新部署

## 常见问题

### Q: 部署后应用无法正常显示？
A: 检查以下几点：
- 确保 `package.json` 中的 build 脚本正确
- 检查 `dist` 目录是否包含构建文件
- 查看 Vercel 的构建日志找出错误

### Q: 如何更新已部署的应用？
A: 只需推送新的代码到 GitHub，Vercel 会自动重新部署

```bash
git add .
git commit -m "Update: Add new features"
git push origin main
```

### Q: 部署的应用支持所有功能吗？
A: 是的，Web 版本支持以下功能：
- ✅ 所有五个页面（首页、上传、历史、详情、设置）
- ✅ 视频选择和动作分析
- ✅ 历史记录管理
- ✅ 本地数据存储（使用浏览器 LocalStorage）
- ✅ 所有交互和导航

## 性能优化

部署后的应用已包含以下优化：
- 自动代码分割
- 压缩和最小化
- CDN 加速
- 自动 HTTPS

## 支持

如需帮助，访问：
- [Vercel 文档](https://vercel.com/docs)
- [Expo 部署指南](https://docs.expo.dev/deploy/deploy-to-web/)

---

**部署完成后，您的应用将在全球范围内可访问！**
