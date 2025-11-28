# 📱 微信公众号接入快速指南

## 🎯 推荐方案

**网页授权方案**（H5页面）

- ✅ 开发成本最低（复用现有应用）
- ✅ 用户体验好（完整功能）
- ✅ 快速上线（1-2周）
- ✅ 易于维护（一套代码）

---

## 📋 三种方案对比

| 方案 | 开发难度 | 成本 | 用户体验 | 推荐度 |
|------|---------|------|---------|--------|
| **网页授权（H5）** | ⭐⭐ | ¥350-900/年 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 消息接口 | ⭐⭐⭐ | ¥0 | ⭐⭐ | ⭐⭐⭐ |
| 小程序 | ⭐⭐⭐⭐⭐ | ¥300-600/年 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🚀 快速开始（网页授权方案）

### 第一步：准备工作（1-2天）

#### 1. 申请微信服务号

- 访问：https://mp.weixin.qq.com/
- 选择"服务号"（⚠️ 需要企业资质）
- 完成微信认证（¥300/年）

#### 2. 准备域名

- 购买域名（如：`ac.yourdomain.com`）
- 完成ICP备案（⚠️ 必需）
- 配置SSL证书（HTTPS）

#### 3. 配置公众号

在公众号后台配置：
- 业务域名：`ac.yourdomain.com`
- JS接口安全域名：`ac.yourdomain.com`
- 网页授权域名：`ac.yourdomain.com`

---

### 第二步：前端开发（3-5天）

#### 1. 安装微信JS-SDK

```bash
npm install weixin-js-sdk
npm install @types/weixin-js-sdk -D
```

#### 2. 创建微信工具类

```typescript
// src/utils/wechat.ts
export class WeChatSDK {
  // 判断是否在微信浏览器中
  isWeChatBrowser(): boolean {
    const ua = navigator.userAgent.toLowerCase();
    return /micromessenger/.test(ua);
  }

  // 初始化微信JS-SDK
  async init(config: WeChatConfig): Promise<void> {
    // 配置微信JS-SDK
    wx.config({
      appId: config.appId,
      timestamp: config.timestamp,
      nonceStr: config.nonceStr,
      signature: config.signature,
      jsApiList: ['chooseImage', 'uploadImage']
    });
  }

  // 选择图片
  async chooseImage(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 1,
        success: (res) => resolve(res.localIds),
        fail: (err) => reject(err)
      });
    });
  }
}
```

#### 3. 修改图片上传组件

```typescript
// src/components/ImageUpload.tsx
import { WeChatSDK } from '@/utils/wechat';

export function ImageUpload({ onImageSelect }: Props) {
  const wechat = WeChatSDK.getInstance();

  const handleChooseImage = async () => {
    if (wechat.isWeChatBrowser()) {
      // 使用微信接口选择图片
      const localIds = await wechat.chooseImage();
      // 处理图片...
    } else {
      // 使用普通文件上传
      // ...
    }
  };

  return (
    <Button onClick={handleChooseImage}>
      选择图片
    </Button>
  );
}
```

#### 4. 响应式优化

```css
/* 针对手机屏幕优化 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
}
```

---

### 第三步：后端开发（2-3天）

#### 1. 创建微信授权接口

```typescript
// supabase/functions/wechat-auth/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { code } = await req.json();

  // 1. 用code换取access_token
  const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APPID}&secret=${SECRET}&code=${code}&grant_type=authorization_code`;
  
  const tokenRes = await fetch(tokenUrl);
  const tokenData = await tokenRes.json();

  // 2. 获取用户信息
  const userUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${tokenData.access_token}&openid=${tokenData.openid}`;
  
  const userRes = await fetch(userUrl);
  const userData = await userRes.json();

  return new Response(JSON.stringify({
    success: true,
    user: userData
  }));
});
```

#### 2. 配置环境变量

在Supabase中添加：
```
WECHAT_APPID=your_appid
WECHAT_SECRET=your_secret
```

---

### 第四步：部署（1-2天）

#### 1. 部署前端

```bash
# 使用Vercel部署
npm install -g vercel
vercel login
vercel --prod
```

#### 2. 配置公众号菜单

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
      "name": "管理后台",
      "url": "https://ac.yourdomain.com/admin"
    }
  ]
}
```

#### 3. 测试

- [ ] 微信授权登录
- [ ] 图片上传
- [ ] AI推荐功能
- [ ] 各种机型适配

---

## 💰 成本估算

### 必需成本

- 微信公众号认证：¥300/年
- 域名：¥50-100/年
- **合计：¥350-400/年**

### 可选成本

- SSL证书：¥0-500/年（可用免费）
- 服务器：¥0-100/月（Vercel免费版够用）
- **合计：¥0-1700/年**

### 总成本

**第一年：¥350-2100**  
**后续每年：¥300-1800**

---

## ⚠️ 重要提示

### 必需条件

1. ✅ **必须是服务号**（订阅号不支持网页授权）
2. ✅ **必须有企业资质**（个人无法申请服务号）
3. ✅ **必须完成微信认证**（¥300/年）
4. ✅ **必须有备案域名**（中国大陆）
5. ✅ **必须配置HTTPS**（SSL证书）

### 开发时间

- 准备工作：1-2天
- 前端开发：3-5天
- 后端开发：2-3天
- 部署测试：1-2天
- **总计：8-14天**

---

## 📚 详细文档

- **`WECHAT_INTEGRATION_PLAN.md`** - 完整接入方案（推荐阅读）
- **`QUICK_START.md`** - 快速入门
- **`ADMIN_GUIDE.md`** - 管理后台使用指南

---

## 🔄 替代方案

### 如果无法申请服务号

**方案A：订阅号 + 外部链接**
- 在订阅号文章中放置链接
- 用户点击访问Web应用
- 缺点：无法使用微信授权

**方案B：开发小程序**
- 申请小程序账号（¥300/年）
- 开发小程序版本
- 优点：体验最好
- 缺点：开发成本高

---

## 📞 常见问题

**Q：个人可以申请服务号吗？**  
A：不可以。服务号需要企业资质。

**Q：域名必须备案吗？**  
A：是的。在中国大陆使用必须备案。

**Q：开发成本大概多少？**  
A：自己开发主要是时间成本（1-2周）。外包约¥5000-20000。

**Q：可以使用小程序吗？**  
A：可以。小程序体验更好，但开发成本更高。

---

## ✅ 下一步行动

### 立即开始

1. **申请微信公众号**
   - 准备企业资质
   - 注册服务号
   - 申请微信认证

2. **准备域名**
   - 购买域名
   - 完成备案
   - 配置SSL

3. **开始开发**
   - 阅读详细方案
   - 分配开发任务
   - 制定时间表

---

## 🎉 总结

### 推荐方案：网页授权（H5）

**优势**：
- ✅ 复用现有应用，开发成本低
- ✅ 功能完整，用户体验好
- ✅ 1-2周快速上线
- ✅ 一套代码，易于维护

**成本**：
- 💰 第一年：¥350-2100
- 💰 后续每年：¥300-1800

**时间**：
- ⏱️ 开发周期：8-14天

**要求**：
- 📋 企业资质
- 📋 服务号认证
- 📋 备案域名
- 📋 HTTPS证书

---

**准备好了吗？开始接入微信公众号吧！** 🚀

---

**文档版本**：v1.0  
**创建时间**：2025-11-27  
**更新时间**：2025-11-27
