# 云函数 SCF

腾讯云云函数（Serverless Cloud Function）操作脚本。

## 快速开始

```bash
# 列出所有函数
node scf.js list

# 获取函数详情
node scf.js get <functionName>

# 调用函数
node scf.js invoke <functionName> '{"key": "value"}'
```

## 命令

### list - 列出函数

```bash
node scf.js list [region]
```

| 参数 | 说明 | 默认值 |
|------|------|--------|
| region | 地域 | ap-guangzhou |

### get - 获取函数详情

```bash
node scf.js get <functionName> [region]
```

### invoke - 调用函数

```bash
node scf.js invoke <functionName> [payload] [region]
```

| 参数 | 说明 |
|------|------|
| payload | JSON 格式的调用参数 |

### create - 创建函数

```bash
node scf.js create <name> <runtime> <handler> <zipFile>
```

| 参数 | 说明 | 示例 |
|------|------|------|
| name | 函数名 | my-function |
| runtime | 运行时 | Nodejs18.15 |
| handler | 入口函数 | index.main |
| zipFile | 代码 ZIP 文件 | ./code.zip |

### update-code - 更新函数代码

```bash
node scf.js update-code <functionName> <zipFile>
```

### update-config - 更新函数配置

```bash
node scf.js update-config <functionName> <configJson>
```

配置示例:
```json
{
  "memorySize": 256,
  "timeout": 30,
  "description": "我的函数",
  "envVars": {
    "DB_HOST": "localhost",
    "DB_PORT": "3306"
  }
}
```

### delete - 删除函数

```bash
node scf.js delete <functionName>
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

## Runtime

| Runtime | 说明 |
|---------|------|
| Nodejs18.15 | Node.js 18 |
| Nodejs16.13 | Node.js 16 |
| Python3.10 | Python 3.10 |
| Python3.9 | Python 3.9 |
| Java8 | Java 8 |
| Java11 | Java 11 |
| Go1 | Go 1.x |
| Php7 | PHP 7 |
| Php8 | PHP 8 |

## 示例

```bash
# 列出广州区域的所有函数
node scf.js list ap-guangzhou

# 获取函数详情
node scf.js get my-api

# 调用函数并传参
node scf.js invoke my-api '{"action": "list", "page": 1}'

# 创建新函数
node scf.js create my-func Nodejs18.15 index.main ./dist/code.zip

# 更新配置（增加内存和超时时间）
node scf.js update-config my-func '{"memorySize": 512, "timeout": 60}'

# 删除函数
node scf.js delete my-func
```

## API 参考

完整 API 文档: https://cloud.tencent.com/document/api/583/17235

API Explorer: https://console.cloud.tencent.com/api/explorer?Product=scf&Version=2018-04-16&Action=ListFunctions
