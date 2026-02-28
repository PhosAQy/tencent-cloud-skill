---
name: tencent-cloud
description: |
  腾讯云资源操作指南，帮助查找正确文档并使用正确方式操作腾讯云资源。

  触发场景：
  - 用户需要操作腾讯云资源（SCF、COS、CVM、MySQL、VPC、CAM 等）
  - 用户询问腾讯云 API 或 SDK 使用方法
  - 用户需要查找腾讯云文档
  - 用户在配置腾讯云认证或权限
  - 用户遇到腾讯云相关错误需要解决

  优先使用 SDK 而非直接调用 API，除非 SDK 不支持该接口。
---

# 腾讯云资源操作指南

## 1. 文档查找

**官方文档入口：**
- 文档中心：`https://cloud.tencent.com/document/product/{产品编号}`
- API 文档：`https://cloud.tencent.com/document/api/{产品编号}/{版本}`
- API Explorer（在线调试）：`https://console.cloud.tencent.com/api/explorer`

**常用产品编号：**

| 产品 | 编号 | SDK 包名 |
|-----|------|---------|
| 云函数 SCF | 583 | tencentcloud-sdk-nodejs-scf |
| 对象存储 COS | 436 | cos-nodejs-sdk-v5（独立） |
| 云服务器 CVM | 213 | tencentcloud-sdk-nodejs-cvm |
| 云数据库 MySQL | 236 | tencentcloud-sdk-nodejs-cdb |
| 私有网络 VPC | 215 | tencentcloud-sdk-nodejs-vpc |
| 访问管理 CAM | 598 | tencentcloud-sdk-nodejs-cam |

**查找 API 流程：**
1. 确定产品 → 找产品编号
2. 打开 API Explorer → 选择产品 → 浏览接口
3. 查看接口文档 → 确认参数和返回值
4. SDK 对应 → 方法名通常是驼峰形式的 Action 名

---

## 2. SDK 安装

```bash
# 总入口（包含所有产品）
npm install tencentcloud-sdk-nodejs

# 按产品安装（体积更小）
npm install tencentcloud-sdk-nodejs-scf    # 云函数
npm install tencentcloud-sdk-nodejs-cvm    # 云服务器
npm install tencentcloud-sdk-nodejs-cdb    # 云数据库

# COS 独立 SDK
npm install cos-nodejs-sdk-v5
```

---

## 3. 认证配置

**密钥获取：** 访问管理 → API 密钥管理

**认证方式：**

| 方式 | 适用场景 |
|-----|---------|
| 固定密钥 | 本地开发、服务端 |
| 临时密钥 (STS) | 前端、移动端 |
| 环境变量 | SCF 运行时自动注入 |
| CAM 角色 | 跨账号、SCF 绑定角色 |

**SCF 运行时环境变量：**
```
TENCENTCLOUD_SECRETID      # SecretId
TENCENTCLOUD_SECRETKEY     # SecretKey
TENCENTCLOUD_SESSIONTOKEN  # 临时密钥 Token（角色方式时）
```

**代码中使用：**
```javascript
const client = new SomeClient({
  credential: {
    secretId: process.env.TENCENTCLOUD_SECRETID,
    secretKey: process.env.TENCENTCLOUD_SECRETKEY,
    token: process.env.TENCENTCLOUD_SESSIONTOKEN,  // 临时密钥时需要
  },
  region: "ap-guangzhou",
});
```

---

## 4. SDK 调用模式

**通用模式：**
```javascript
const tencentcloud = require("tencentcloud-sdk-nodejs");
const Client = tencentcloud.scf.v20180416.Client;  // 替换为对应产品

const client = new Client({
  credential: {
    secretId: process.env.TENCENTCLOUD_SECRETID,
    secretKey: process.env.TENCENTCLOUD_SECRETKEY,
  },
  region: "ap-guangzhou",
  profile: {
    httpProfile: {
      endpoint: "scf.tencentcloudapi.com",  // 替换为对应 endpoint
    },
  },
});

// 调用 API（方法名 = Action 驼峰形式）
const result = await client.ListFunctions({});
```

**各产品 SDK 示例：** 参见 [references/sdk-examples.md](references/sdk-examples.md)

---

## 5. 地域代码

```
ap-guangzhou    广州
ap-shanghai     上海
ap-beijing      北京
ap-chengdu      成都
ap-hongkong     香港
ap-singapore    新加坡
ap-tokyo        东京
eu-frankfurt    法兰克福
na-ashburn      美东
```

---

## 6. 错误处理

**常见错误码：**

| 错误码 | 含义 | 处理 |
|-------|------|-----|
| AuthFailure.SecretIdNotFound | 密钥不存在 | 检查 SecretId |
| AuthFailure.SignatureFailure | 签名错误 | 检查 SecretKey |
| AuthFailure.TokenFailure | Token 错误 | 临时密钥过期 |
| InvalidParameter | 参数错误 | 查文档确认格式 |
| ResourceNotFound | 资源不存在 | 检查资源 ID |
| RequestLimitExceeded | 请求超限 | 添加重试逻辑 |
| UnauthorizedOperation | 无权限 | 检查 CAM 策略 |

**错误处理示例：**
```javascript
try {
  const result = await client.SomeAction(params);
  return result;
} catch (error) {
  console.error("API 调用失败:", error.code, error.message);
  if (error.code === "RequestLimitExceeded") {
    await sleep(1000);
    return retry();
  }
  throw error;
}
```

---

## 7. SDK vs 直接调用 API

| | 直接调用 API | 使用 SDK |
|--|-------------|---------|
| 请求签名 | 手动计算 | 自动处理 |
| 参数序列化 | 手动处理 | 自动处理 |
| 响应解析 | 手动解析 | 结构化对象 |
| 错误处理 | 手动解析 | 结构化错误 |
| 代码量 | 多 | 少 |

**建议：** 优先使用 SDK，除非 SDK 不支持的接口才直接调用 API。
