# 微信公众号接入指南 📱

## 目录
1. [接入方式概述](#接入方式概述)
2. [方式一：网页授权接入（推荐）](#方式一网页授权接入推荐)
3. [方式二：自定义菜单接入](#方式二自定义菜单接入)
4. [方式三：图文消息接入](#方式三图文消息接入)
5. [方式四：自动回复接入](#方式四自动回复接入)
6. [技术实现细节](#技术实现细节)
7. [常见问题解答](#常见问题解答)

---

## 接入方式概述

智能空调方案推荐工具可以通过多种方式接入微信公众号，为用户提供便捷的服务。

### 可选方案对比

| 方案 | 难度 | 用户体验 | 功能完整度 | 推荐指数 |
|------|------|----------|------------|----------|
| 网页授权 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 100% | ⭐⭐⭐⭐⭐ |
| 自定义菜单 | ⭐ | ⭐⭐⭐⭐ | 100% | ⭐⭐⭐⭐⭐ |
| 图文消息 | ⭐ | ⭐⭐⭐ | 100% | ⭐⭐⭐⭐ |
| 自动回复 | ⭐ | ⭐⭐⭐ | 100% | ⭐⭐⭐⭐ |

---

## 方式一：网页授权接入（推荐）

### 适用场景
- 需要获取用户微信信息
- 需要个性化服务
- 需要保存用户数据

### 实现步骤

#### 1. 配置微信公众号

**1.1 登录微信公众平台**
```
网址：https://mp.weixin.qq.com/
```

**1.2 配置网页授权域名**
```
路径：设置与开发 → 公众号设置 → 功能设置 → 网页授权域名
域名：your-domain.com（你的应用域名）
```

**1.3 获取开发者凭证**
```
路径：设置与开发 → 基本配置
获取：AppID 和 AppSecret
```

#### 2. 修改应用代码

**2.1 安装微信JS-SDK**
```bash
cd /workspace/app-7ua9s9vs9fr5
pnpm add weixin-js-sdk
pnpm add @types/weixin-js-sdk -D
```

**2.2 创建微信授权配置文件**

创建文件：`src/utils/wechat-auth.ts`

```typescript
// 微信授权配置
export const WECHAT_CONFIG = {
  appId: import.meta.env.VITE_WECHAT_APPID || '',
  redirectUri: import.meta.env.VITE_WECHAT_REDIRECT_URI || '',
};

// 判断是否在微信浏览器中
export const isWechat = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('micromessenger');
};

// 获取微信授权URL
export const getWechatAuthUrl = (scope: 'snsapi_base' | 'snsapi_userinfo' = 'snsapi_base') => {
  const { appId, redirectUri } = WECHAT_CONFIG;
  const encodedUri = encodeURIComponent(redirectUri);
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodedUri}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`;
};

// 从URL获取授权code
export const getWechatCode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
};

// 微信授权流程
export const wechatAuth = async () => {
  // 如果不在微信浏览器中，直接返回
  if (!isWechat()) {
    return null;
  }

  // 检查是否已有code
  const code = getWechatCode();
  if (code) {
    // 使用code换取用户信息（需要后端接口）
    return code;
  }

  // 如果没有code，跳转到授权页面
  window.location.href = getWechatAuthUrl('snsapi_base');
  return null;
};
```

**2.3 修改环境变量**

编辑文件：`.env`

```bash
# 微信公众号配置
VITE_WECHAT_APPID=your_wechat_appid
VITE_WECHAT_REDIRECT_URI=https://your-domain.com/
```

**2.4 修改首页，添加微信授权检测**

编辑文件：`src/pages/Home.tsx`

在组件开头添加：

```typescript
import { useEffect } from 'react';
import { isWechat, wechatAuth } from '@/utils/wechat-auth';

export default function Home() {
  // ... 现有代码

  // 微信授权检测
  useEffect(() => {
    if (isWechat()) {
      wechatAuth().then(code => {
        if (code) {
          console.log('微信授权成功，code:', code);
          // 这里可以将code发送到后端，换取用户信息
        }
      });
    }
  }, []);

  // ... 其余代码
}
```

#### 3. 创建后端授权接口（可选）

如果需要获取用户信息，需要创建后端接口：

**3.1 创建Supabase Edge Function**

创建文件：`supabase/functions/wechat-auth/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const WECHAT_APPID = Deno.env.get('WECHAT_APPID') || '';
const WECHAT_SECRET = Deno.env.get('WECHAT_SECRET') || '';

serve(async (req) => {
  // 处理CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    const { code } = await req.json();

    if (!code) {
      throw new Error('缺少授权code');
    }

    // 使用code换取access_token
    const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WECHAT_APPID}&secret=${WECHAT_SECRET}&code=${code}&grant_type=authorization_code`;
    
    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();

    if (tokenData.errcode) {
      throw new Error(tokenData.errmsg);
    }

    // 获取用户信息（如果需要）
    const { access_token, openid } = tokenData;
    const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
    
    const userInfoResponse = await fetch(userInfoUrl);
    const userInfo = await userInfoResponse.json();

    return new Response(JSON.stringify({
      success: true,
      data: userInfo,
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});
```

**3.2 配置环境变量**

在Supabase项目中添加环境变量：
```
WECHAT_APPID=your_wechat_appid
WECHAT_SECRET=your_wechat_secret
```

---

## 方式二：自定义菜单接入

### 适用场景
- 最简单快捷的接入方式
- 不需要获取用户信息
- 适合快速上线

### 实现步骤

#### 1. 登录微信公众平台

```
网址：https://mp.weixin.qq.com/
```

#### 2. 设置自定义菜单

**2.1 进入菜单设置**
```
路径：管理 → 自定义菜单
```

**2.2 创建菜单**

**方案A：单个菜单按钮**
```
菜单名称：空调推荐
菜单类型：跳转网页
页面地址：https://your-domain.com/
```

**方案B：多级菜单**
```
一级菜单：智能服务
  ├─ 空调推荐：https://your-domain.com/
  ├─ 产品库：https://your-domain.com/products
  └─ 联系客服：客服消息
```

**2.3 保存并发布**
```
点击"保存并发布"按钮
等待审核通过（通常几分钟）
```

#### 3. 测试菜单

- 关注公众号
- 点击底部菜单
- 验证页面跳转

### 菜单配置示例

```json
{
  "button": [
    {
      "type": "view",
      "name": "空调推荐",
      "url": "https://your-domain.com/"
    },
    {
      "name": "更多服务",
      "sub_button": [
        {
          "type": "view",
          "name": "产品知识库",
          "url": "https://your-domain.com/products"
        },
        {
          "type": "view",
          "name": "管理后台",
          "url": "https://your-domain.com/admin/login"
        }
      ]
    },
    {
      "type": "click",
      "name": "联系我们",
      "key": "CONTACT_US"
    }
  ]
}
```

---

## 方式三：图文消息接入

### 适用场景
- 需要推送通知
- 需要营销推广
- 需要内容展示

### 实现步骤

#### 1. 创建图文消息

**1.1 进入素材管理**
```
路径：管理 → 素材管理 → 新建图文消息
```

**1.2 编辑图文消息**

**标题**：
```
智能空调方案推荐 - 为您的家选择最合适的空调
```

**封面图**：
```
上传一张吸引人的空调图片
建议尺寸：900x500px
```

**正文**：
```html
<h2>🌟 智能空调方案推荐工具</h2>

<p>上传户型图，AI为您推荐最合适的空调方案！</p>

<h3>✨ 核心功能</h3>
<ul>
  <li>📸 户型图智能分析</li>
  <li>🤖 AI方案推荐</li>
  <li>📚 产品知识库</li>
  <li>💰 预算估算</li>
</ul>

<h3>🎯 立即体验</h3>
<p>点击下方"阅读原文"开始使用</p>
```

**原文链接**：
```
https://your-domain.com/
```

#### 2. 发送图文消息

**方式A：群发消息**
```
路径：管理 → 群发功能
选择：已创建的图文消息
发送：立即发送或定时发送
```

**方式B：自动回复**
```
路径：设置与开发 → 自动回复
类型：关注后自动回复
内容：选择图文消息
```

---

## 方式四：自动回复接入

### 适用场景
- 用户主动咨询
- 关键词触发
- 关注后引导

### 实现步骤

#### 1. 设置关键词自动回复

**1.1 进入自动回复设置**
```
路径：设置与开发 → 自动回复 → 关键词回复
```

**1.2 添加规则**

**规则1：空调推荐**
```
规则名：空调推荐
关键词：空调、推荐、方案
回复类型：文字+图文
文字内容：
  您好！我们的智能空调推荐工具可以根据您的户型图，
  为您推荐最合适的空调方案。点击下方链接开始使用👇
图文消息：选择已创建的图文消息
```

**规则2：产品查询**
```
规则名：产品查询
关键词：产品、型号、价格
回复类型：文字
文字内容：
  查看产品详情请点击：https://your-domain.com/products
```

#### 2. 设置关注后自动回复

**2.1 进入被关注回复**
```
路径：设置与开发 → 自动回复 → 被关注回复
```

**2.2 设置欢迎消息**
```
回复类型：文字+图文
文字内容：
  🎉 欢迎关注！
  
  我们提供智能空调方案推荐服务：
  
  📸 上传户型图
  🤖 AI智能分析
  💡 专业方案推荐
  
  点击下方链接立即体验👇
  
图文消息：选择已创建的图文消息
```

---

## 技术实现细节

### 1. 微信浏览器适配

#### 1.1 检测微信浏览器

```typescript
// src/utils/wechat-detect.ts
export const isWechat = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('micromessenger');
};

export const getWechatVersion = (): string => {
  const ua = navigator.userAgent.toLowerCase();
  const match = ua.match(/micromessenger\/(\d+\.\d+\.\d+)/);
  return match ? match[1] : '';
};
```

#### 1.2 微信分享配置

```typescript
// src/utils/wechat-share.ts
import wx from 'weixin-js-sdk';

export const configWechatShare = async () => {
  if (!isWechat()) return;

  try {
    // 从后端获取签名配置
    const config = await getWechatSignature();
    
    wx.config({
      debug: false,
      appId: config.appId,
      timestamp: config.timestamp,
      nonceStr: config.nonceStr,
      signature: config.signature,
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData',
      ],
    });

    wx.ready(() => {
      // 分享给朋友
      wx.updateAppMessageShareData({
        title: '智能空调方案推荐',
        desc: '上传户型图，AI为您推荐最合适的空调方案',
        link: window.location.href,
        imgUrl: 'https://your-domain.com/share-icon.png',
      });

      // 分享到朋友圈
      wx.updateTimelineShareData({
        title: '智能空调方案推荐',
        link: window.location.href,
        imgUrl: 'https://your-domain.com/share-icon.png',
      });
    });
  } catch (error) {
    console.error('微信分享配置失败:', error);
  }
};
```

### 2. 移动端优化

应用已经完成了移动端UI优化，在微信浏览器中可以直接使用。

关键优化点：
- ✅ 响应式布局
- ✅ 触摸友好设计
- ✅ 适配微信浏览器
- ✅ 图片上传兼容

### 3. 性能优化

#### 3.1 首屏加载优化

```typescript
// vite.config.ts 添加配置
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-tabs'],
        },
      },
    },
  },
});
```

#### 3.2 图片懒加载

```typescript
// 使用原生懒加载
<img src="..." loading="lazy" alt="..." />
```

### 4. 安全配置

#### 4.1 配置业务域名

```
路径：设置与开发 → 公众号设置 → 功能设置 → 业务域名
域名：your-domain.com
```

#### 4.2 配置JS接口安全域名

```
路径：设置与开发 → 公众号设置 → 功能设置 → JS接口安全域名
域名：your-domain.com
```

---

## 完整接入流程

### 快速接入（推荐新手）

**第1步：部署应用**
```bash
# 确保应用已部署到线上
# 获得访问地址：https://your-domain.com/
```

**第2步：配置公众号**
```
1. 登录微信公众平台
2. 设置自定义菜单
3. 添加菜单按钮，链接到应用地址
4. 保存并发布
```

**第3步：测试验证**
```
1. 关注公众号
2. 点击菜单按钮
3. 验证功能正常
```

**完成！** 🎉

### 高级接入（需要用户信息）

**第1步：配置域名**
```
1. 配置网页授权域名
2. 配置JS接口安全域名
3. 配置业务域名
```

**第2步：获取凭证**
```
1. 获取AppID
2. 获取AppSecret
3. 配置到环境变量
```

**第3步：开发授权功能**
```
1. 安装微信JS-SDK
2. 创建授权工具函数
3. 修改应用代码
4. 创建后端接口
```

**第4步：测试验证**
```
1. 在微信中打开应用
2. 验证授权流程
3. 验证用户信息获取
```

**完成！** 🎉

---

## 常见问题解答

### Q1: 如何获取微信公众号？

**A:** 
1. 访问：https://mp.weixin.qq.com/
2. 点击"立即注册"
3. 选择账号类型（订阅号/服务号）
4. 填写信息并提交审核
5. 审核通过后即可使用

**注意**：
- 订阅号：个人可申请，功能较少
- 服务号：企业申请，功能完整，支持网页授权

### Q2: 自定义菜单不显示怎么办？

**A:**
1. 检查是否保存并发布
2. 取消关注后重新关注
3. 等待5-10分钟缓存更新
4. 检查菜单配置是否正确

### Q3: 网页授权失败怎么办？

**A:**
1. 检查域名配置是否正确
2. 确认AppID和AppSecret正确
3. 检查redirect_uri是否编码
4. 查看错误码对照表

### Q4: 如何在微信中调试？

**A:**
1. 使用微信开发者工具
2. 开启vconsole调试
3. 查看微信公众平台日志
4. 使用Chrome远程调试

### Q5: 图片上传在微信中失败？

**A:**
1. 检查文件大小限制
2. 检查文件格式支持
3. 使用微信JS-SDK上传
4. 检查CORS配置

### Q6: 如何测试微信授权？

**A:**
1. 使用微信开发者工具
2. 使用测试公众号
3. 在真机上测试
4. 查看授权日志

### Q7: 菜单可以设置几个？

**A:**
- 一级菜单：最多3个
- 二级菜单：每个一级菜单最多5个
- 菜单名称：一级4个汉字，二级8个汉字

### Q8: 如何统计用户访问？

**A:**
1. 使用微信公众平台统计
2. 集成第三方统计工具
3. 自建统计系统
4. 使用Google Analytics

### Q9: 如何优化加载速度？

**A:**
1. 使用CDN加速
2. 压缩图片资源
3. 启用Gzip压缩
4. 使用懒加载
5. 减少首屏资源

### Q10: 如何处理分享？

**A:**
1. 配置JS-SDK
2. 设置分享参数
3. 自定义分享图标
4. 自定义分享文案

---

## 推荐配置方案

### 方案A：快速上线（5分钟）

**适合**：快速体验、测试验证

**步骤**：
1. ✅ 部署应用到线上
2. ✅ 设置自定义菜单
3. ✅ 完成！

**优点**：
- 超级简单
- 快速上线
- 无需开发

**缺点**：
- 无法获取用户信息
- 无法个性化服务

### 方案B：标准接入（1小时）

**适合**：正式运营、完整功能

**步骤**：
1. ✅ 配置公众号域名
2. ✅ 获取AppID和AppSecret
3. ✅ 修改应用代码
4. ✅ 设置自定义菜单
5. ✅ 配置自动回复
6. ✅ 完成！

**优点**：
- 功能完整
- 用户体验好
- 支持个性化

**缺点**：
- 需要一定开发
- 配置较复杂

### 方案C：完整接入（2小时）

**适合**：企业应用、高级功能

**步骤**：
1. ✅ 方案B的所有步骤
2. ✅ 开发后端授权接口
3. ✅ 配置微信分享
4. ✅ 集成微信支付（可选）
5. ✅ 完成！

**优点**：
- 功能最完整
- 用户体验最好
- 支持所有功能

**缺点**：
- 开发工作量大
- 需要后端支持

---

## 检查清单

### 部署前检查

- [ ] 应用已部署到线上
- [ ] 获得HTTPS访问地址
- [ ] 移动端显示正常
- [ ] 所有功能测试通过

### 公众号配置检查

- [ ] 已注册微信公众号
- [ ] 已完成认证（服务号）
- [ ] 已配置域名
- [ ] 已获取AppID和AppSecret

### 菜单配置检查

- [ ] 菜单名称清晰
- [ ] 链接地址正确
- [ ] 已保存并发布
- [ ] 菜单显示正常

### 授权配置检查（高级）

- [ ] 网页授权域名已配置
- [ ] JS接口安全域名已配置
- [ ] 业务域名已配置
- [ ] 环境变量已配置
- [ ] 授权流程测试通过

---

## 技术支持

### 官方文档
- 微信公众平台：https://mp.weixin.qq.com/
- 开发文档：https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html
- JS-SDK文档：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html

### 开发工具
- 微信开发者工具：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
- 接口调试工具：https://mp.weixin.qq.com/debug/

### 社区资源
- 微信开放社区：https://developers.weixin.qq.com/community/
- Stack Overflow：搜索"wechat"相关问题

---

## 总结

接入微信公众号有多种方式，可以根据实际需求选择：

1. **快速接入**：使用自定义菜单，5分钟完成
2. **标准接入**：添加网页授权，1小时完成
3. **完整接入**：包含所有功能，2小时完成

**推荐流程**：
1. 先使用方案A快速上线测试
2. 验证功能后升级到方案B
3. 根据需要实现方案C的高级功能

**关键要点**：
- ✅ 确保应用已部署到HTTPS域名
- ✅ 移动端UI已优化（已完成）
- ✅ 配置正确的域名和凭证
- ✅ 充分测试后再正式发布

---

**文档更新时间**: 2024-12-27
**适用版本**: 当前版本
**状态**: ✅ 完整可用
