#!/usr/bin/env node

/**
 * 腾讯云语音合成 (TTS) 工具
 * 
 * 用法:
 *   node tts.js --text "要合成的文本" --output /path/to/output.wav
 *   node tts.js --list  # 列出可用音色
 */

const tencentcloud = require("tencentcloud-sdk-nodejs");
const fs = require('fs');
const path = require('path');

// 导入 TTS 客户端
const TtsClient = tencentcloud.tts.v20190823.Client;

// 从环境变量或配置文件读取配置
function loadConfig() {
  // 先尝试从环境变量读取
  if (process.env.TENCENTCLOUD_SECRETID && process.env.TENCENTCLOUD_SECRETKEY) {
    return {
      secretId: process.env.TENCENTCLOUD_SECRETID,
      secretKey: process.env.TENCENTCLOUD_SECRETKEY,
      region: process.env.TENCENTCLOUD_REGION || 'ap-guangzhou'
    };
  }

  // 尝试从配置文件读取
  const envPath = path.join(__dirname, '..', 'secrets', 'tencent.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const config = {};
    content.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        config[key.trim()] = value.trim();
      }
    });
    return {
      secretId: config.TENCENTCLOUD_SECRETID,
      secretKey: config.TENCENTCLOUD_SECRETKEY,
      region: config.TENCENTCLOUD_REGION || 'ap-guangzhou'
    };
  }

  return null;
}

const config = loadConfig();
if (!config || !config.secretId || !config.secretKey) {
  console.error('错误: 请设置 TENCENTCLOUD_SECRETID 和 TENCENTCLOUD_SECRETKEY 环境变量');
  console.error('或者在 secrets/tencent.env 文件中配置');
  process.exit(1);
}

const { secretId, secretKey, region } = config;

if (!secretId || !secretKey) {
  console.error('错误: 请设置 TENCENTCLOUD_SECRETID 和 TENCENTCLOUD_SECRETKEY 环境变量');
  process.exit(1);
}

// 创建客户端
const client = new TtsClient({
  credential: {
    secretId,
    secretKey,
  },
  region,
  profile: {
    httpProfile: {
      endpoint: "tts.tencentcloudapi.com",
    },
  },
});

// 列出常用音色
function listVoices() {
  console.log('\n可用音色（常用）:\n');
  console.log('女声:');
  console.log('  1001 - 欣欣（亲和女声）');
  console.log('  1002 - 晓晓（温柔女声）');
  console.log('  1003 - 晓燕（知性女声）');
  console.log('  1005 - 晓梦（温柔女声）');
  console.log('  1007 - 晓美（亲切女声）');
  console.log('  1010 - 晓彤（温柔女声）');
  console.log('\n男声:');
  console.log('  1004 - 云龙（磁性男声）');
  console.log('  1006 - 云浩（大气男声）');
  console.log('  1008 - 云野（沉稳男声）');
  console.log('  1009 - 云希（亲切男声）');
  console.log('\n默认使用: 1002 (晓晓)');
}

// 合成语音
async function synthesize(text, outputPath, voiceType = 1002) {
  try {
    console.log(`正在合成语音...`);
    console.log(`文本: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
    console.log(`音色: ${voiceType}`);

    const params = {
      Text: text,
      VoiceType: voiceType,
      Codec: 'wav',
      SampleRate: 16000,
      Speed: 0,  // 语速，-2 到 6
      Volume: 5, // 音量，0 到 10
      SessionId: `session-${Date.now()}`, // 添加 SessionId
    };

    const response = await client.TextToVoice(params);

    // 解码 Base64 音频数据
    const audioData = Buffer.from(response.Audio, 'base64');
    
    // 确保输出目录存在
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 写入文件
    fs.writeFileSync(outputPath, audioData);
    
    console.log(`\n✓ 语音合成成功！`);
    console.log(`文件: ${outputPath}`);
    console.log(`大小: ${(audioData.length / 1024).toFixed(2)} KB`);
    
    return outputPath;
  } catch (error) {
    console.error('合成失败:', error.message);
    if (error.code === 'UnauthorizedOperation') {
      console.error('\n可能原因:');
      console.error('1. 未开通语音合成服务');
      console.error('2. API 密钥权限不足');
      console.error('\n请访问 https://console.cloud.tencent.com/tts 开通服务');
    }
    process.exit(1);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--list') || args.includes('-l')) {
    listVoices();
    return;
  }

  const textIndex = args.indexOf('--text');
  const outputIndex = args.indexOf('--output');
  const voiceIndex = args.indexOf('--voice');

  if (textIndex === -1 || outputIndex === -1) {
    console.log('用法:');
    console.log('  node tts.js --text "文本内容" --output /path/to/output.wav');
    console.log('  node tts.js --text "文本内容" --output /path/to/output.wav --voice 1002');
    console.log('  node tts.js --list  # 列出可用音色');
    process.exit(1);
  }

  const text = args[textIndex + 1];
  const outputPath = args[outputIndex + 1];
  const voiceType = voiceIndex !== -1 ? parseInt(args[voiceIndex + 1]) : 1002;

  await synthesize(text, outputPath, voiceType);
}

main();
