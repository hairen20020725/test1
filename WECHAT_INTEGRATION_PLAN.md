# 📱 微信公众号接入方案

## 📋 目录

1. [方案概述](#方案概述)
2. [方案对比](#方案对比)
3. [推荐方案详解](#推荐方案详解)
4. [技术架构](#技术架构)
5. [开发步骤](#开发步骤)
6. [成本分析](#成本分析)
7. [注意事项](#注意事项)

---

## 方案概述

将智能空调方案推荐工具接入微信公众号，让用户可以通过微信公众号使用该工具。

### 当前应用特点

- ✅ React + TypeScript Web应用
- ✅ 支持户型图上传
- ✅ AI智能分析推荐
- ✅ 完整的管理后台
- ✅ Supabase数据库支持

---

## 方案对比

### 方案一：网页授权方案 ⭐⭐⭐⭐⭐（推荐）

**原理**：
- 用户在公众号菜单点击链接
- 跳转到H5页面（当前Web应用）
- 使用微信网页授权获取用户信息
- 在微信内置浏览器中使用完整功能

**优点**：
- ✅ 开发成本最低（复用现有应用）
- ✅ 功能完整（所有功能都可用）
- ✅ 用户体验好（完整的UI界面）
- ✅ 维护简单（只需维护一套代码）
- ✅ 快速上线（1-2周）

**缺点**：
- ❌ 需要认证公众号（300元/年）
- ❌ 需要配置域名和SSL证书
- ❌ 首次加载可能较慢

**适用场景**：
- 已有Web应用，想快速接入公众号
- 需要完整的功能和良好的用户体验
- 有一定的开发和运维能力

---

### 方案二：公众号消息接口方案 ⭐⭐⭐

**原理**：
- 用户发送户型图到公众号
- 后端接收图片并调用AI分析
- 以文字消息返回推荐方案

**优点**：
- ✅ 交互简单（发图即可）
- ✅ 不需要认证公众号（订阅号即可）
- ✅ 无需域名和SSL证书

**缺点**：
- ❌ 需要开发后端服务
- ❌ 功能受限（无法展示复杂UI）
- ❌ 用户体验一般（纯文字交互）
- ❌ 无法使用管理后台
- ❌ 开发成本较高（需要重新开发）

**适用场景**：
- 只需要简单的问答功能
- 预算有限，无法申请认证公众号
- 不需要复杂的UI界面

---

### 方案三：小程序方案 ⭐⭐⭐⭐

**原理**：
- 开发微信小程序版本
- 公众号关联小程序
- 用户点击跳转到小程序

**优点**：
- ✅ 用户体验最好（原生体验）
- ✅ 功能完整
- ✅ 性能好
- ✅ 可以使用微信支付等功能

**缺点**：
- ❌ 需要重新开发（开发成本高）
- ❌ 需要小程序账号（300元/年）
- ❌ 需要审核（1-7天）
- ❌ 维护成本高（两套代码）

**适用场景**：
- 长期运营，需要最佳用户体验
- 有充足的开发预算和时间
- 需要使用微信支付等功能

---

## 推荐方案详解

### 🎯 推荐：方案一 - 网页授权方案

基于以下原因，我们推荐采用**网页授权方案**：

1. **已有完整的Web应用**
   - 无需重新开发
   - 所有功能都可复用
   - 开发成本最低

2. **用户体验好**
   - 完整的UI界面
   - 流畅的交互体验
   - 支持所有功能

3. **快速上线**
   - 1-2周即可完成
   - 风险低
   - 易于维护

---

## 技术架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                      微信公众号                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  公众号菜单                                       │  │
│  │  ├─ 首页                                          │  │
│  │  ├─ 获取推荐                                      │  │
│  │  └─ 管理后台                                      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
                    微信网页授权
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Web应用（H5）                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  React + TypeScript                              │  │
│  │  ├─ 首页（户型图上传）                            │  │
│  │  ├─ AI推荐（方案展示）                            │  │
│  │  └─ 管理后台（产品/案例管理）                     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
                    API调用
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   后端服务                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Supabase    │  │  文心一言AI  │  │  微信API     │ │
│  │  数据库/存储  │  │  图像分析    │  │  用户信息    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 技术栈

**前端**：
- React + TypeScript
- Tailwind CSS + shadcn/ui
- 微信JS-SDK（用于分享、支付等功能）

**后端**：
- Supabase（数据库、存储、认证）
- 文心一言AI接口
- 微信公众号API

**部署**：
- 前端：Vercel / Netlify / 阿里云OSS
- 域名：需要备案的域名
- SSL证书：Let's Encrypt（免费）

---

## 开发步骤

### 阶段一：准备工作（1-2天）

#### 1. 申请微信公众号

**类型选择**：
- ✅ **服务号**（推荐）
  - 支持网页授权
  - 支持微信支付
  - 每月4条群发消息
  - 需要企业资质
  - 认证费用：300元/年

- ❌ 订阅号
  - 不支持网页授权
  - 不适合本方案

**申请流程**：
1. 访问：https://mp.weixin.qq.com/
2. 注册公众号
3. 选择"服务号"
4. 提交企业资质
5. 等待审核（1-3天）
6. 申请微信认证（300元/年）

#### 2. 准备域名和SSL证书

**域名要求**：
- 必须备案（中国大陆）
- 建议使用独立域名
- 例如：`ac.yourdomain.com`

**SSL证书**：
- 使用Let's Encrypt免费证书
- 或购买商业证书

#### 3. 配置公众号

**基本配置**：
1. 登录公众号后台
2. 设置 → 公众号设置 → 功能设置
3. 配置业务域名：`ac.yourdomain.com`
4. 配置JS接口安全域名：`ac.yourdomain.com`
5. 配置网页授权域名：`ac.yourdomain.com`

**获取配置信息**：
- AppID：公众号唯一标识
- AppSecret：公众号密钥
- Token：用于验证消息来自微信

---

### 阶段二：前端开发（3-5天）

#### 1. 微信环境适配

**创建微信工具类**：

```typescript
// src/utils/wechat.ts

export interface WeChatConfig {
  appId: string;
  timestamp: number;
  nonceStr: string;
  signature: string;
}

export class WeChatSDK {
  private static instance: WeChatSDK;
  private isReady = false;

  static getInstance() {
    if (!WeChatSDK.instance) {
      WeChatSDK.instance = new WeChatSDK();
    }
    return WeChatSDK.instance;
  }

  // 判断是否在微信浏览器中
  isWeChatBrowser(): boolean {
    const ua = navigator.userAgent.toLowerCase();
    return /micromessenger/.test(ua);
  }

  // 初始化微信JS-SDK
  async init(config: WeChatConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isWeChatBrowser()) {
        reject(new Error('不在微信浏览器中'));
        return;
      }

      wx.config({
        debug: false,
        appId: config.appId,
        timestamp: config.timestamp,
        nonceStr: config.nonceStr,
        signature: config.signature,
        jsApiList: [
          'chooseImage',
          'uploadImage',
          'downloadImage',
          'previewImage',
          'updateAppMessageShareData',
          'updateTimelineShareData'
        ]
      });

      wx.ready(() => {
        this.isReady = true;
        resolve();
      });

      wx.error((err: any) => {
        reject(err);
      });
    });
  }

  // 选择图片（使用微信接口）
  async chooseImage(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (!this.isReady) {
        reject(new Error('微信SDK未初始化'));
        return;
      }

      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res: any) => {
          resolve(res.localIds);
        },
        fail: (err: any) => {
          reject(err);
        }
      });
    });
  }

  // 上传图片到微信服务器
  async uploadImage(localId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      wx.uploadImage({
        localId,
        isShowProgressTips: 1,
        success: (res: any) => {
          resolve(res.serverId);
        },
        fail: (err: any) => {
          reject(err);
        }
      });
    });
  }

  // 配置分享
  async setShare(options: {
    title: string;
    desc: string;
    link: string;
    imgUrl: string;
  }): Promise<void> {
    if (!this.isReady) return;

    // 分享到朋友圈
    wx.updateTimelineShareData({
      title: options.title,
      link: options.link,
      imgUrl: options.imgUrl,
      success: () => {
        console.log('分享到朋友圈配置成功');
      }
    });

    // 分享给朋友
    wx.updateAppMessageShareData({
      title: options.title,
      desc: options.desc,
      link: options.link,
      imgUrl: options.imgUrl,
      success: () => {
        console.log('分享给朋友配置成功');
      }
    });
  }
}
```

#### 2. 微信授权登录

**创建授权组件**：

```typescript
// src/components/WeChatAuth.tsx

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export function WeChatAuth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code) {
      // 用code换取用户信息
      handleWeChatCallback(code, state);
    } else {
      // 跳转到微信授权页面
      redirectToWeChatAuth();
    }
  }, [searchParams]);

  const redirectToWeChatAuth = () => {
    const appId = import.meta.env.VITE_WECHAT_APPID;
    const redirectUri = encodeURIComponent(window.location.href);
    const state = Math.random().toString(36).substring(7);
    
    const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
    
    window.location.href = authUrl;
  };

  const handleWeChatCallback = async (code: string, state: string | null) => {
    try {
      // 调用后端接口，用code换取用户信息
      const response = await fetch('/api/wechat/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, state })
      });

      const data = await response.json();

      if (data.success) {
        // 保存用户信息
        localStorage.setItem('wechat_user', JSON.stringify(data.user));
        toast.success('登录成功');
        navigate('/');
      } else {
        toast.error('登录失败');
        setLoading(false);
      }
    } catch (error) {
      console.error('微信授权失败:', error);
      toast.error('登录失败，请重试');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在登录...</p>
        </div>
      </div>
    );
  }

  return null;
}
```

#### 3. 修改图片上传组件

**支持微信选择图片**：

```typescript
// src/components/ImageUpload.tsx（修改）

import { WeChatSDK } from '@/utils/wechat';

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const wechat = WeChatSDK.getInstance();

  const handleWeChatChooseImage = async () => {
    try {
      const localIds = await wechat.chooseImage();
      if (localIds.length > 0) {
        // 上传到微信服务器
        const serverId = await wechat.uploadImage(localIds[0]);
        
        // 调用后端接口，从微信服务器下载图片
        const response = await fetch('/api/wechat/download-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ serverId })
        });

        const data = await response.json();
        
        if (data.success) {
          onImageSelect(data.base64);
        }
      }
    } catch (error) {
      console.error('微信选择图片失败:', error);
      toast.error('选择图片失败');
    }
  };

  return (
    <div>
      {wechat.isWeChatBrowser() ? (
        <Button onClick={handleWeChatChooseImage}>
          从相册选择
        </Button>
      ) : (
        <input type="file" accept="image/*" onChange={handleFileSelect} />
      )}
    </div>
  );
}
```

#### 4. 响应式优化

**针对手机屏幕优化**：

```typescript
// src/pages/Home.tsx（修改）

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      {/* 手机端垂直布局，PC端左右布局 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* 左侧：输入区域 */}
        <div>
          <ImageUpload />
          <ParameterForm />
        </div>

        {/* 右侧：结果展示 */}
        <div>
          <RecommendationResult />
        </div>
      </div>
    </div>
  );
}
```

---

### 阶段三：后端开发（2-3天）

#### 1. 创建Supabase Edge Function

**微信授权接口**：

```typescript
// supabase/functions/wechat-auth/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const WECHAT_APPID = Deno.env.get('WECHAT_APPID');
const WECHAT_SECRET = Deno.env.get('WECHAT_SECRET');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { code } = await req.json();

    // 1. 用code换取access_token
    const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WECHAT_APPID}&secret=${WECHAT_SECRET}&code=${code}&grant_type=authorization_code`;
    
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    if (tokenData.errcode) {
      throw new Error(tokenData.errmsg);
    }

    // 2. 用access_token获取用户信息
    const userUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${tokenData.access_token}&openid=${tokenData.openid}&lang=zh_CN`;
    
    const userRes = await fetch(userUrl);
    const userData = await userRes.json();

    if (userData.errcode) {
      throw new Error(userData.errmsg);
    }

    // 3. 保存用户信息到数据库（可选）
    // ...

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          openid: userData.openid,
          nickname: userData.nickname,
          avatar: userData.headimgurl
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
```

**微信图片下载接口**：

```typescript
// supabase/functions/wechat-download-image/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  try {
    const { serverId } = await req.json();

    // 1. 获取access_token
    const tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WECHAT_APPID}&secret=${WECHAT_SECRET}`;
    
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    // 2. 下载图片
    const imageUrl = `https://api.weixin.qq.com/cgi-bin/media/get?access_token=${tokenData.access_token}&media_id=${serverId}`;
    
    const imageRes = await fetch(imageUrl);
    const imageBuffer = await imageRes.arrayBuffer();

    // 3. 转换为base64
    const base64 = btoa(
      new Uint8Array(imageBuffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    return new Response(
      JSON.stringify({
        success: true,
        base64: `data:image/jpeg;base64,${base64}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
```

#### 2. 配置环境变量

**在Supabase中添加环境变量**：

```bash
# 微信公众号配置
WECHAT_APPID=your_appid
WECHAT_SECRET=your_secret
WECHAT_TOKEN=your_token
```

---

### 阶段四：部署和配置（1-2天）

#### 1. 部署前端应用

**使用Vercel部署**：

```bash
# 安装Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

**配置自定义域名**：
1. 在Vercel中添加域名
2. 配置DNS记录
3. 等待SSL证书生成

#### 2. 配置公众号菜单

**菜单配置示例**：

```json
{
  "button": [
    {
      "type": "view",
      "name": "获取推荐",
      "url": "https://ac.yourdomain.com/"
    },
    {
      "type": "view",
      "name": "历史案例",
      "url": "https://ac.yourdomain.com/cases"
    },
    {
      "name": "更多",
      "sub_button": [
        {
          "type": "view",
          "name": "管理后台",
          "url": "https://ac.yourdomain.com/admin"
        },
        {
          "type": "view",
          "name": "使用指南",
          "url": "https://ac.yourdomain.com/guide"
        }
      ]
    }
  ]
}
```

#### 3. 测试

**测试清单**：
- [ ] 微信授权登录
- [ ] 图片上传（微信相册）
- [ ] AI推荐功能
- [ ] 分享功能
- [ ] 管理后台访问
- [ ] 各种机型适配

---

### 阶段五：优化和上线（1-2天）

#### 1. 性能优化

- 图片压缩
- 代码分割
- CDN加速
- 缓存策略

#### 2. 用户体验优化

- 加载动画
- 错误提示
- 引导页面
- 帮助文档

#### 3. 监控和分析

- 用户行为分析
- 错误监控
- 性能监控

---

## 成本分析

### 一次性成本

| 项目 | 费用 | 说明 |
|------|------|------|
| 微信公众号认证 | ¥300/年 | 必需 |
| 域名 | ¥50-100/年 | 必需 |
| SSL证书 | ¥0-500/年 | 可用免费证书 |
| 开发成本 | ¥0 | 自己开发 |
| **合计** | **¥350-900/年** | |

### 运营成本

| 项目 | 费用 | 说明 |
|------|------|------|
| 服务器/托管 | ¥0-100/月 | Vercel免费版够用 |
| Supabase | ¥0-25/月 | 免费版够用 |
| 文心一言API | 按量计费 | 根据使用量 |
| **合计** | **¥0-125/月** | |

### 总成本估算

**第一年**：¥350-900（一次性）+ ¥0-1500（运营）= **¥350-2400**

**后续每年**：¥300（认证）+ ¥0-1500（运营）= **¥300-1800**

---

## 注意事项

### 1. 公众号要求

- ✅ 必须是**服务号**
- ✅ 必须完成**微信认证**（300元/年）
- ✅ 需要**企业资质**（个人无法申请服务号）

### 2. 域名要求

- ✅ 必须**备案**（中国大陆）
- ✅ 必须配置**SSL证书**（HTTPS）
- ✅ 必须在公众号后台**配置域名**

### 3. 开发注意事项

**微信浏览器兼容性**：
- 测试各种机型和系统版本
- 注意iOS和Android的差异
- 处理微信浏览器的特殊限制

**安全性**：
- 验证微信签名
- 防止CSRF攻击
- 保护用户隐私

**性能优化**：
- 图片压缩
- 懒加载
- 缓存策略

### 4. 审核和合规

**内容审核**：
- 避免违规内容
- 遵守微信公众平台规范
- 定期检查内容合规性

**隐私保护**：
- 用户协议
- 隐私政策
- 数据安全

---

## 替代方案

### 如果无法申请服务号

**方案A：使用订阅号 + 外部链接**
- 在订阅号中发布文章
- 文章中放置外部链接
- 用户点击链接访问Web应用
- 缺点：无法使用微信授权

**方案B：开发小程序**
- 申请小程序账号
- 开发小程序版本
- 公众号关联小程序
- 优点：体验好，功能完整
- 缺点：开发成本高

**方案C：使用第三方平台**
- 使用有赞、微盟等第三方平台
- 快速搭建公众号应用
- 优点：开发简单
- 缺点：功能受限，需要付费

---

## 开发时间表

| 阶段 | 任务 | 时间 | 负责人 |
|------|------|------|--------|
| 准备 | 申请公众号、域名、SSL | 1-2天 | 运营 |
| 前端 | 微信适配、授权登录 | 3-5天 | 前端 |
| 后端 | Edge Functions开发 | 2-3天 | 后端 |
| 部署 | 部署、配置、测试 | 1-2天 | 运维 |
| 优化 | 性能优化、用户体验 | 1-2天 | 全员 |
| **总计** | | **8-14天** | |

---

## 下一步行动

### 立即行动

1. **申请微信公众号**
   - 准备企业资质
   - 注册服务号
   - 申请微信认证

2. **准备域名**
   - 购买域名
   - 完成备案
   - 配置SSL证书

3. **确认开发计划**
   - 分配开发任务
   - 制定时间表
   - 准备开发环境

### 后续计划

1. **开发阶段**（1-2周）
   - 前端适配
   - 后端开发
   - 测试调试

2. **上线阶段**（1周）
   - 部署应用
   - 配置公众号
   - 全面测试

3. **运营阶段**（持续）
   - 用户反馈
   - 功能优化
   - 内容更新

---

## 总结

### 推荐方案

✅ **网页授权方案**（方案一）

**理由**：
1. 开发成本最低（复用现有应用）
2. 用户体验好（完整功能）
3. 快速上线（1-2周）
4. 易于维护（一套代码）

### 关键要点

1. **必须申请服务号**（需要企业资质）
2. **必须完成微信认证**（300元/年）
3. **必须准备备案域名**（HTTPS）
4. **开发周期约1-2周**
5. **总成本约¥350-2400/年**

### 风险提示

- ⚠️ 公众号申请需要企业资质
- ⚠️ 域名备案需要1-2周时间
- ⚠️ 微信认证需要300元/年
- ⚠️ 需要持续维护和更新

---

**文档版本**：v1.0  
**创建时间**：2025-11-27  
**适用场景**：智能空调方案推荐工具接入微信公众号

---

## 附录

### 参考资料

- [微信公众平台开发文档](https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html)
- [微信JS-SDK说明文档](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html)
- [微信网页授权](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html)

### 常见问题

**Q1：个人可以申请服务号吗？**
A：不可以。服务号需要企业资质，个人只能申请订阅号。

**Q2：订阅号可以使用网页授权吗？**
A：不可以。订阅号不支持网页授权，只有服务号支持。

**Q3：域名必须备案吗？**
A：是的。在中国大陆使用的域名必须完成ICP备案。

**Q4：开发成本大概多少？**
A：如果自己开发，主要是时间成本（1-2周）。如果外包，大概¥5000-20000。

**Q5：可以使用小程序吗？**
A：可以。小程序是另一个方案，用户体验更好，但开发成本更高。

---

**需要帮助？**

如果您在接入过程中遇到问题，请参考：
- `QUICK_START.md` - 快速入门
- `TROUBLESHOOTING.md` - 故障排除
- 或联系技术支持

**祝您接入顺利！** 🎉
