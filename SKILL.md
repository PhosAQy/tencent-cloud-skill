---
name: tencent-cloud
description: |
  腾讯云资源操作工具。每个服务独立脚本，便于维护和扩展。

  触发场景：
  - 用户需要操作腾讯云资源（SCF、COS、CVM、MySQL、VPC、CAM 等）
  - 用户询问腾讯云 API 或 SDK 使用方法
  - 用户需要查找腾讯云文档
  - 用户在配置腾讯云认证或权限
  - 用户遇到腾讯云相关错误需要解决

  优先使用 SDK 而非直接调用 API，除非 SDK 不支持该接口。
---

# 腾讯云资源操作工具

## 快速开始

```bash
cd ~/.openclaw/workspace/skills/tencent-cloud

# 使用入口脚本
./scripts/tc scf list        # 列出云函数
./scripts/tc cvm list        # 列出 CVM
./scripts/tc cdb list        # 列出 MySQL
./scripts/tc vpc list        # 列出 VPC
./scripts/tc cam users       # 列出用户
./scripts/tc cos buckets     # 列出 Bucket

# 或直接调用脚本
node scripts/scf.js list
node scripts/cvm.js list
```

## 配置

编辑 `secrets/tencent.env`：

```bash
TENCENTCLOUD_SECRETID=your_secret_id
TENCENTCLOUD_SECRETKEY=your_secret_key
TENCENTCLOUD_REGION=ap-guangzhou
```

## 服务脚本

| 服务 | 脚本 | 说明 |
|------|------|------|
| SCF | scripts/scf.js | 云函数 |
| CVM | scripts/cvm.js | 云服务器 |
| CDB | scripts/cdb.js | 云数据库 MySQL |
| VPC | scripts/vpc.js | 私有网络 |
| CAM | scripts/cam.js | 访问管理 |
| COS | scripts/cos.js | 对象存储 |
| APIGW | scripts/apigw.js | API 网关 |
| Domain | scripts/domain.js | 域名服务 |
| TTS | scripts/tts.js | 语音合成 |
| Redis | scripts/redis-list.js | Redis 实例 |
| Vector | docs/vector-bucket.md | 向量存储桶 |

## 扩展指南

### 添加新服务

1. 在 `scripts/` 下创建新脚本
2. 参考 `utils.js` 中的通用函数
3. 在 `docs/` 下添加文档
4. 测试通过后提交 PR 到 GitHub

### 脚本模板

```javascript
#!/usr/bin/env node
const tencentcloud = require('tencentcloud-sdk-nodejs');
const Client = tencentcloud.xxx.v20xxxxxx.Client; // 替换为对应产品
const { createClient, output, error } = require('./utils');

async function myAction(params) {
  const client = createClient(Client);
  const result = await client.SomeAction(params);
  output(result);
}
```

## 地域代码

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

## 官方文档

- 文档中心：https://cloud.tencent.com/document/product
- API Explorer：https://console.cloud.tencent.com/api/explorer
- SDK 文档：https://cloud.tencent.com/document/sdk

## 错误处理

常见错误码：

| 错误码 | 含义 | 处理 |
|-------|------|-----|
| AuthFailure.SecretIdNotFound | 密钥不存在 | 检查 SecretId |
| AuthFailure.SignatureFailure | 签名错误 | 检查 SecretKey |
| AuthFailure.TokenFailure | Token 错误 | 临时密钥过期 |
| InvalidParameter | 参数错误 | 查文档确认格式 |
| ResourceNotFound | 资源不存在 | 检查资源 ID |
| RequestLimitExceeded | 请求超限 | 添加重试逻辑 |
| UnauthorizedOperation | 无权限 | 检查 CAM 策略 |
