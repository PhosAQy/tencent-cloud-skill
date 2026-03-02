# 腾讯云操作工具

模块化的腾讯云资源操作脚本集合，每个服务独立脚本，便于维护和扩展。

## 安装

```bash
# 安装依赖
cd ~/.openclaw/workspace/skills/tencent-cloud
npm install tencentcloud-sdk-nodejs cos-nodejs-sdk-v5
```

## 配置

复制并编辑密钥配置：

```bash
cp secrets/tencent.env.example secrets/tencent.env
# 编辑 secrets/tencent.env，填入你的密钥
```

配置内容：
```bash
TENCENTCLOUD_SECRETID=your_secret_id
TENCENTCLOUD_SECRETKEY=your_secret_key
TENCENTCLOUD_REGION=ap-guangzhou
```

## 使用方式

### 方式一：使用 tc 入口脚本

```bash
./scripts/tc scf list           # 列出云函数
./scripts/tc cvm list           # 列出 CVM
./scripts/tc cdb list           # 列出 MySQL
./scripts/tc vpc list           # 列出 VPC
./scripts/tc cam users          # 列出用户
./scripts/tc cos buckets        # 列出 Bucket
```

### 方式二：直接调用脚本

```bash
node scripts/scf.js list
node scripts/cvm.js list
node scripts/cdb.js list
```

## 服务列表

| 服务 | 脚本 | 文档 | 说明 |
|------|------|------|------|
| SCF | scripts/scf.js | docs/scf.md | 云函数 |
| CVM | scripts/cvm.js | docs/cvm.md | 云服务器 |
| CDB | scripts/cdb.js | docs/cdb.md | 云数据库 MySQL |
| VPC | scripts/vpc.js | docs/vpc.md | 私有网络 |
| CAM | scripts/cam.js | docs/cam.md | 访问管理 |
| COS | scripts/cos.js | docs/cos.md | 对象存储 |

## 快速参考

### SCF 云函数

```bash
node scripts/scf.js list [region]
node scripts/scf.js get <functionName>
node scripts/scf.js invoke <functionName> [payload]
node scripts/scf.js create <name> <runtime> <handler> <zipFile>
node scripts/scf.js update-code <functionName> <zipFile>
node scripts/scf.js update-config <functionName> <configJson>
node scripts/scf.js delete <functionName>
```

### CVM 云服务器

```bash
node scripts/cvm.js list [region]
node scripts/cvm.js get <instanceId>
node scripts/cvm.js zones [region]
node scripts/cvm.js start <instanceId>
node scripts/cvm.js stop <instanceId>
node scripts/cvm.js reboot <instanceId>
```

### CDB 云数据库

```bash
node scripts/cdb.js list [region]
node scripts/cdb.js get <instanceId>
node scripts/cdb.js params <instanceId>
node scripts/cdb.js slow-logs <instanceId> <start> <end>
```

### VPC 私有网络

```bash
node scripts/vpc.js list [region]
node scripts/vpc.js get <vpcId>
node scripts/vpc.js subnets [vpcId]
node scripts/vpc.js security-groups [region]
```

### CAM 访问管理

```bash
node scripts/cam.js users
node scripts/cam.js roles
node scripts/cam.js policies [scope]
node scripts/cam.js api-keys <uin>
```

### COS 对象存储

```bash
node scripts/cos.js buckets
node scripts/cos.js list <bucket> [region] [prefix]
node scripts/cos.js upload <bucket> <local> <key> [region]
node scripts/cos.js download <bucket> <key> <local> [region]
node scripts/cos.js delete <bucket> <key> [region]
node scripts/cos.js url <bucket> <key> [region] [expires]
```

## 地域代码

| 代码 | 地域 |
|------|------|
| ap-guangzhou | 广州 |
| ap-shanghai | 上海 |
| ap-beijing | 北京 |
| ap-chengdu | 成都 |
| ap-hongkong | 香港 |
| ap-singapore | 新加坡 |
| ap-tokyo | 东京 |
| eu-frankfurt | 法兰克福 |
| na-ashburn | 美东 |

## 扩展脚本

如果需要新的服务或 API，可以：

1. 在 `scripts/` 下创建新脚本
2. 参考 `utils.js` 中的通用函数
3. 在 `docs/` 下添加文档

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

// ... 命令处理
```

## 目录结构

```
tencent-cloud/
├── scripts/
│   ├── tc           # 入口脚本
│   ├── utils.js     # 通用工具
│   ├── scf.js       # 云函数
│   ├── cvm.js       # 云服务器
│   ├── cdb.js       # 云数据库
│   ├── vpc.js       # 私有网络
│   ├── cam.js       # 访问管理
│   └── cos.js       # 对象存储
├── docs/
│   ├── scf.md       # SCF 文档
│   └── ...
├── secrets/
│   └── tencent.env  # 密钥配置
├── SKILL.md         # Skill 说明
└── README.md        # 本文档
```

## 官方文档

- [腾讯云文档中心](https://cloud.tencent.com/document/product)
- [API Explorer](https://console.cloud.tencent.com/api/explorer)
- [SDK 文档](https://cloud.tencent.com/document/sdk)
