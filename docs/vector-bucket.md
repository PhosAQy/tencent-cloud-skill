# 腾讯云向量存储桶（COS Vector Bucket）

## 产品概述

腾讯云向量存储桶（Vector Bucket）是面向 AI 场景的海量向量数据存储与检索服务。

- 支持向量存储
- JSON API 接口
- SDK 支持

## 配置

### 密钥

```bash
# 在 secrets/tencent.env 中配置
TENCENTCLOUD_SECRETID=your_secret_id
TENCENTCLOUD_SECRETKEY=your_secret_key
```

## API 域名

| 地域 | 外网 | 内网 |
|------|------|------|
| 广州 | `vectors-guangzhou.coslakesearch.tencent.cn` | `vectors-guangzhou.coslakesearch.internal.tencent.cn` |

## 常用操作

### 向量检索

```bash
# 上报：写入向量
# 搜索：查询最近邻
```

## 相关文档
- 产品概述：https://cloud.tencent.com/document/product/436/126985
- COS Vector 简介：https://cloud.tencent.com/document/product/436/126985
