# Tencent Cloud Skill

腾讯云资源操作指南 Skill - 帮助 AI 查找正确文档并使用正确方式操作腾讯云资源。

## 安装

```bash
npx skills add https://github.com/PhosAQy/tencent-cloud-skill
```

## 功能

- 文档查找指南 - 产品编号、API 文档、API Explorer
- SDK 调用示例 - SCF、COS、CVM、MySQL、CAM
- 认证配置 - 密钥管理、环境变量、CAM 角色
- 地域代码
- 错误处理

## 触发场景

- 操作腾讯云资源（SCF、COS、CVM、MySQL、VPC、CAM 等）
- 询问腾讯云 API 或 SDK 使用方法
- 查找腾讯云文档
- 配置认证或权限
- 解决腾讯云相关错误

## 目录结构

```
tencent-cloud-skill/
├── SKILL.md              # 主文档
└── references/
    └── sdk-examples.md   # SDK 调用示例
```

## License

MIT
