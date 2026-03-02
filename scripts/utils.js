/**
 * 腾讯云通用工具函数
 */

const path = require('path');
const fs = require('fs');

// 工作空间路径
const WORKSPACE = process.env.OPENCLAW_WORKSPACE || path.join(require('os').homedir(), '.openclaw/workspace');
const SECRETS_FILE = path.join(WORKSPACE, 'skills/tencent-cloud/secrets/tencent.env');

/**
 * 从环境变量或配置文件加载密钥
 */
function loadCredentials() {
  // 优先使用环境变量
  if (process.env.TENCENTCLOUD_SECRETID && process.env.TENCENTCLOUD_SECRETKEY) {
    return {
      secretId: process.env.TENCENTCLOUD_SECRETID,
      secretKey: process.env.TENCENTCLOUD_SECRETKEY,
      region: process.env.TENCENTCLOUD_REGION || 'ap-guangzhou',
    };
  }

  // 从配置文件读取
  if (fs.existsSync(SECRETS_FILE)) {
    const content = fs.readFileSync(SECRETS_FILE, 'utf-8');
    const lines = content.split('\n');
    const config = {};

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').trim();
      config[key.trim()] = value;
    }

    if (config.TENCENTCLOUD_SECRETID && config.TENCENTCLOUD_SECRETKEY) {
      return {
        secretId: config.TENCENTCLOUD_SECRETID,
        secretKey: config.TENCENTCLOUD_SECRETKEY,
        region: config.TENCENTCLOUD_REGION || 'ap-guangzhou',
      };
    }
  }

  throw new Error('未找到腾讯云密钥。请设置环境变量或配置 secrets/tencent.env');
}

/**
 * 创建客户端
 */
function createClient(ClientClass, region) {
  const cred = loadCredentials();
  return new ClientClass({
    credential: {
      secretId: cred.secretId,
      secretKey: cred.secretKey,
    },
    region: region || cred.region,
    profile: {},
  });
}

/**
 * 输出 JSON 结果
 */
function output(data) {
  console.log(JSON.stringify(data, null, 2));
}

/**
 * 输出错误
 */
function error(message, code) {
  console.error(JSON.stringify({ error: true, code, message }, null, 2));
  process.exit(1);
}

/**
 * 解析命令行参数
 */
function parseArgs(args, schema) {
  const result = {};
  let i = 0;

  while (i < args.length) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[i + 1];
      if (value && !value.startsWith('--')) {
        result[key] = value;
        i += 2;
      } else {
        result[key] = true;
        i += 1;
      }
    } else if (arg.startsWith('-')) {
      const key = arg.slice(1);
      result[key] = args[i + 1];
      i += 2;
    } else {
      // 位置参数
      const posKey = schema?.positional?.[Object.keys(result).filter(k => !schema?.positional?.includes(k)).length];
      if (posKey) {
        result[posKey] = arg;
      }
      i += 1;
    }
  }

  return result;
}

module.exports = {
  loadCredentials,
  createClient,
  output,
  error,
  parseArgs,
  WORKSPACE,
};
