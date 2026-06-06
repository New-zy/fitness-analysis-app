# 🚀 一键部署到 Vercel

## 最简单的部署方式（只需 3 步）

### 第 1 步：点击下面的按钮

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/fitness-analysis-app)

### 第 2 步：授权 GitHub

- 登录或创建 Vercel 账户
- 授权访问您的 GitHub

### 第 3 步：点击 Deploy

- 等待部署完成（2-5 分钟）
- 获得您的公网 URL

---

## 手动部署步骤

### 前提条件
- GitHub 账户
- Vercel 账户（免费）

### 步骤

1. **将代码推送到 GitHub**
   ```bash
   git push origin main
   ```

2. **访问 Vercel**
   - 打开 https://vercel.com
   - 登录您的账户

3. **创建新项目**
   - 点击 "New Project"
   - 选择 "Import Git Repository"
   - 搜索并选择 `fitness-analysis-app`

4. **配置部署**
   - Framework: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **点击 Deploy**
   - 等待部署完成
   - 获得 URL

---

## 部署完成后

✅ 您的应用将在以下地址可访问：
```
https://fitness-analysis-app.vercel.app
```

✅ 所有功能都能正常使用：
- 上传视频
- 选择训练动作
- 查看分析结果
- 管理历史记录
- 应用设置

✅ 自动更新：
- 每次推送到 GitHub 时自动重新部署
- 无需手动操作

---

## 需要帮助？

- Vercel 文档：https://vercel.com/docs
- Expo 部署：https://docs.expo.dev/deploy/deploy-to-web/
- GitHub 帮助：https://docs.github.com

**部署完全免费，无需信用卡！** 💳✨
