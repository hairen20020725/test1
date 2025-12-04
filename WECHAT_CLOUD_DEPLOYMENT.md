# 微信公众号云服务部署方案 ☁️

## 目录
1. [方案概述](#方案概述)
2. [推荐云服务平台](#推荐云服务平台)
3. [完整部署流程](#完整部署流程)
4. [性能优化配置](#性能优化配置)
5. [监控与运维](#监控与运维)
6. [成本预算](#成本预算)

---

## 方案概述

### 技术架构

```
用户微信 → 微信公众号 → 云服务器 → 应用服务
                              ↓
                         Supabase后端
                              ↓
                         数据库/存储
```

### 核心组件

1. **前端应用**：React + TypeScript + Vite
2. **后端服务**：Supabase（已配置）
3. **云服务器**：托管前端应用
4. **CDN加速**：提升访问速度
5. **SSL证书**：HTTPS安全访问

---

## 推荐云服务平台

### 方案对比

| 平台 | 价格 | 性能 | 易用性 | 推荐指数 |
|------|------|------|--------|----------|
| Vercel | 免费 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Netlify | 免费 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 阿里云 | 付费 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 腾讯云 | 付费 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 华为云 | 付费 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

---

## 完整部署流程

### 方案一：Vercel部署（推荐）

#### 优势
- ✅ 完全免费
- ✅ 自动HTTPS
- ✅ 全球CDN加速
- ✅ 自动部署
- ✅ 零配置

#### 部署步骤

**第1步：准备代码仓库**

```bash
# 1. 初始化Git仓库（如果还没有）
cd /workspace/app-7ua9s9vs9fr5
git init

# 2. 添加所有文件
git add .

# 3. 提交代码
git commit -m "Initial commit"

# 4. 推送到GitHub
# 先在GitHub创建仓库，然后执行：
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

**第2步：注册Vercel账号**

```
1. 访问：https://vercel.com/
2. 点击"Sign Up"
3. 使用GitHub账号登录
4. 授权Vercel访问GitHub
```

**第3步：导入项目**

```
1. 点击"New Project"
2. 选择GitHub仓库
3. 点击"Import"
4. 配置项目：
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: pnpm run build
   - Output Directory: dist
```

**第4步：配置环境变量**

```
在Vercel项目设置中添加环境变量：

VITE_APP_ID=app-7ua9s9vs9fr5
VITE_SUPABASE_URL=https://backend.appmiaoda.com/projects/supabase252312970925752320
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_ENV=production
```

**第5步：部署**

```
1. 点击"Deploy"
2. 等待构建完成（约2-3分钟）
3. 获得部署地址：https://your-project.vercel.app
```

**第6步：配置自定义域名（可选）**

```
1. 在Vercel项目设置中点击"Domains"
2. 添加自定义域名：your-domain.com
3. 按照提示配置DNS记录
4. 等待DNS生效（约10分钟）
```

**第7步：配置微信公众号**

```
1. 登录微信公众平台
2. 设置网页授权域名：your-project.vercel.app
3. 设置JS接口安全域名：your-project.vercel.app
4. 设置业务域名：your-project.vercel.app
5. 配置自定义菜单，链接到：https://your-project.vercel.app
```

---

### 方案二：Netlify部署

#### 优势
- ✅ 完全免费
- ✅ 自动HTTPS
- ✅ 全球CDN加速
- ✅ 表单处理
- ✅ 函数支持

#### 部署步骤

**第1步：注册Netlify账号**

```
1. 访问：https://www.netlify.com/
2. 点击"Sign Up"
3. 使用GitHub账号登录
```

**第2步：导入项目**

```
1. 点击"Add new site" → "Import an existing project"
2. 选择GitHub
3. 选择仓库
4. 配置构建设置：
   - Build command: pnpm run build
   - Publish directory: dist
```

**第3步：配置环境变量**

```
在Site settings → Environment variables中添加：

VITE_APP_ID=app-7ua9s9vs9fr5
VITE_SUPABASE_URL=https://backend.appmiaoda.com/projects/supabase252312970925752320
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**第4步：部署**

```
1. 点击"Deploy site"
2. 等待构建完成
3. 获得部署地址：https://your-site.netlify.app
```

**第5步：配置自定义域名（可选）**

```
1. 在Site settings → Domain management中
2. 添加自定义域名
3. 配置DNS记录
```

---

### 方案三：阿里云部署

#### 优势
- ✅ 国内访问速度快
- ✅ 稳定可靠
- ✅ 完整的云服务生态
- ✅ 技术支持好

#### 部署步骤

**第1步：购买云服务器**

```
1. 访问：https://www.aliyun.com/
2. 选择"云服务器ECS"
3. 推荐配置：
   - CPU: 2核
   - 内存: 4GB
   - 带宽: 5Mbps
   - 系统: Ubuntu 22.04
   - 价格: 约100元/月
```

**第2步：配置服务器**

```bash
# 1. 连接服务器
ssh root@your-server-ip

# 2. 更新系统
apt update && apt upgrade -y

# 3. 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 4. 安装pnpm
npm install -g pnpm

# 5. 安装Nginx
apt install -y nginx

# 6. 安装Git
apt install -y git
```

**第3步：部署应用**

```bash
# 1. 克隆代码
cd /var/www
git clone https://github.com/your-username/your-repo.git
cd your-repo

# 2. 安装依赖
pnpm install

# 3. 创建环境变量文件
cat > .env << EOF
VITE_APP_ID=app-7ua9s9vs9fr5
VITE_SUPABASE_URL=https://backend.appmiaoda.com/projects/supabase252312970925752320
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EOF

# 4. 构建应用
pnpm run build

# 5. 配置Nginx
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/your-repo/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF

# 6. 重启Nginx
nginx -t
systemctl restart nginx
```

**第4步：配置SSL证书**

```bash
# 1. 安装Certbot
apt install -y certbot python3-certbot-nginx

# 2. 获取证书
certbot --nginx -d your-domain.com

# 3. 自动续期
certbot renew --dry-run
```

**第5步：配置自动部署**

```bash
# 创建部署脚本
cat > /var/www/deploy.sh << 'EOF'
#!/bin/bash
cd /var/www/your-repo
git pull
pnpm install
pnpm run build
systemctl restart nginx
EOF

chmod +x /var/www/deploy.sh

# 设置定时任务（可选）
crontab -e
# 添加：0 2 * * * /var/www/deploy.sh
```

---

### 方案四：腾讯云部署

#### 优势
- ✅ 微信生态集成好
- ✅ 国内访问速度快
- ✅ 价格相对便宜
- ✅ 微信支付集成方便

#### 部署步骤

**第1步：购买云服务器**

```
1. 访问：https://cloud.tencent.com/
2. 选择"云服务器CVM"
3. 推荐配置：
   - CPU: 2核
   - 内存: 4GB
   - 带宽: 5Mbps
   - 系统: Ubuntu 22.04
   - 价格: 约90元/月
```

**第2步：配置服务器**

```
参考阿里云部署步骤第2-5步
```

**第3步：配置CDN加速（可选）**

```
1. 在腾讯云控制台选择"CDN"
2. 添加加速域名
3. 配置源站
4. 开启HTTPS
5. 配置缓存规则
```

---

## 性能优化配置

### 1. 构建优化

**修改 `vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';

export default defineConfig({
  plugins: [
    react(),
    // Gzip压缩
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
  ],
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-tabs',
            '@radix-ui/react-select',
          ],
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
    // 压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 资源内联限制
    assetsInlineLimit: 4096,
  },
});
```

### 2. Nginx优化配置

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL证书
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    root /var/www/your-repo/dist;
    index index.html;
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/json application/javascript;
    
    # 缓存配置
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # HTML不缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # SPA路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}

# HTTP重定向到HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 3. CDN配置

**阿里云CDN配置**

```
1. 开启CDN加速
2. 配置缓存规则：
   - HTML: 不缓存
   - CSS/JS: 缓存1年
   - 图片: 缓存1年
3. 开启Gzip压缩
4. 开启HTTPS
5. 配置回源Host
```

**腾讯云CDN配置**

```
1. 添加加速域名
2. 配置源站
3. 缓存配置：
   - 全部文件: 遵循源站
   - .html: 不缓存
   - .css/.js: 缓存30天
   - 图片: 缓存30天
4. 开启HTTPS
5. 开启智能压缩
```

---

## 监控与运维

### 1. 性能监控

**使用Vercel Analytics（Vercel部署）**

```typescript
// 在 src/main.tsx 中添加
import { inject } from '@vercel/analytics';

inject();
```

**使用Google Analytics**

```html
<!-- 在 index.html 中添加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. 错误监控

**使用Sentry**

```bash
# 安装Sentry
pnpm add @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### 3. 日志管理

**Nginx访问日志**

```bash
# 查看访问日志
tail -f /var/log/nginx/access.log

# 查看错误日志
tail -f /var/log/nginx/error.log

# 分析访问统计
cat /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10
```

### 4. 自动化运维

**创建监控脚本**

```bash
#!/bin/bash
# /var/www/monitor.sh

# 检查Nginx状态
if ! systemctl is-active --quiet nginx; then
    echo "Nginx is down, restarting..."
    systemctl restart nginx
    # 发送告警（可选）
fi

# 检查磁盘空间
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Disk usage is high: ${DISK_USAGE}%"
    # 发送告警（可选）
fi

# 检查内存使用
MEM_USAGE=$(free | grep Mem | awk '{print ($3/$2) * 100.0}' | cut -d. -f1)
if [ $MEM_USAGE -gt 80 ]; then
    echo "Memory usage is high: ${MEM_USAGE}%"
    # 发送告警（可选）
fi
```

**设置定时任务**

```bash
# 编辑crontab
crontab -e

# 添加监控任务（每5分钟执行一次）
*/5 * * * * /var/www/monitor.sh >> /var/log/monitor.log 2>&1
```

---

## 成本预算

### 免费方案（Vercel/Netlify）

| 项目 | 费用 | 说明 |
|------|------|------|
| 服务器托管 | ¥0 | 免费额度充足 |
| CDN加速 | ¥0 | 全球CDN |
| SSL证书 | ¥0 | 自动配置 |
| 域名 | ¥50/年 | 可选 |
| **总计** | **¥50/年** | 仅域名费用 |

### 阿里云方案

| 项目 | 费用 | 说明 |
|------|------|------|
| 云服务器ECS | ¥100/月 | 2核4G |
| 带宽 | 包含 | 5Mbps |
| CDN流量 | ¥20/月 | 约100GB |
| SSL证书 | ¥0 | Let's Encrypt |
| 域名 | ¥50/年 | .com域名 |
| **总计** | **¥1440/年** | 约¥120/月 |

### 腾讯云方案

| 项目 | 费用 | 说明 |
|------|------|------|
| 云服务器CVM | ¥90/月 | 2核4G |
| 带宽 | 包含 | 5Mbps |
| CDN流量 | ¥18/月 | 约100GB |
| SSL证书 | ¥0 | 免费证书 |
| 域名 | ¥50/年 | .com域名 |
| **总计** | **¥1296/年** | 约¥108/月 |

---

## 部署检查清单

### 部署前检查

- [ ] 代码已提交到Git仓库
- [ ] 环境变量已配置
- [ ] 构建命令测试通过
- [ ] 所有功能测试通过
- [ ] 移动端显示正常

### 部署后检查

- [ ] 网站可以正常访问
- [ ] HTTPS证书正常
- [ ] 所有页面路由正常
- [ ] 图片上传功能正常
- [ ] 数据库连接正常
- [ ] 管理后台可以访问

### 微信公众号配置检查

- [ ] 网页授权域名已配置
- [ ] JS接口安全域名已配置
- [ ] 业务域名已配置
- [ ] 自定义菜单已配置
- [ ] 在微信中测试通过

### 性能检查

- [ ] 首屏加载时间 < 3秒
- [ ] Lighthouse分数 > 90
- [ ] 移动端性能良好
- [ ] CDN加速生效

---

## 故障排查

### 问题1：部署失败

**可能原因**：
- 构建命令错误
- 环境变量缺失
- 依赖安装失败

**解决方案**：
```bash
# 本地测试构建
pnpm run build

# 检查环境变量
cat .env

# 清除缓存重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 问题2：网站无法访问

**可能原因**：
- DNS未生效
- Nginx配置错误
- 防火墙阻止

**解决方案**：
```bash
# 检查DNS
nslookup your-domain.com

# 检查Nginx配置
nginx -t

# 检查防火墙
ufw status

# 开放端口
ufw allow 80
ufw allow 443
```

### 问题3：HTTPS证书错误

**可能原因**：
- 证书未配置
- 证书过期
- 域名不匹配

**解决方案**：
```bash
# 重新获取证书
certbot --nginx -d your-domain.com --force-renewal

# 检查证书状态
certbot certificates
```

### 问题4：微信中无法打开

**可能原因**：
- 域名未备案（国内服务器）
- 域名未在微信配置
- 被微信拦截

**解决方案**：
1. 确认域名已备案
2. 在微信公众平台配置域名
3. 检查域名是否被拦截
4. 使用微信开发者工具测试

---

## 推荐部署方案

### 个人/小型项目（推荐）

**方案**：Vercel + Supabase

**优势**：
- ✅ 完全免费
- ✅ 零配置
- ✅ 自动部署
- ✅ 全球CDN
- ✅ 自动HTTPS

**步骤**：
1. 推送代码到GitHub
2. 在Vercel导入项目
3. 配置环境变量
4. 自动部署完成

**成本**：¥0（仅域名费用可选）

### 企业/商业项目

**方案**：阿里云/腾讯云 + CDN + Supabase

**优势**：
- ✅ 国内访问快
- ✅ 稳定可靠
- ✅ 完整控制
- ✅ 技术支持

**步骤**：
1. 购买云服务器
2. 配置服务器环境
3. 部署应用
4. 配置CDN加速
5. 配置SSL证书

**成本**：¥100-150/月

---

## 总结

### 快速开始（5分钟）

1. **选择Vercel部署**
2. **推送代码到GitHub**
3. **在Vercel导入项目**
4. **配置环境变量**
5. **自动部署完成**

### 生产环境（1小时）

1. **选择云服务商**
2. **购买云服务器**
3. **配置服务器环境**
4. **部署应用**
5. **配置CDN和SSL**
6. **配置微信公众号**
7. **测试验证**

### 关键要点

- ✅ **推荐使用Vercel**：免费、简单、快速
- ✅ **配置HTTPS**：微信公众号必需
- ✅ **启用CDN**：提升访问速度
- ✅ **监控运维**：确保稳定运行
- ✅ **定期备份**：防止数据丢失

---

**文档更新时间**: 2024-12-27
**适用版本**: 当前版本
**状态**: ✅ 生产就绪
