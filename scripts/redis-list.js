#!/usr/bin/env node
/**
 * 列出腾讯云 Redis 实例
 */
const tencentcloud = require('tencentcloud-sdk-nodejs');

const RedisClient = tencentcloud.redis.v20180412.Client;

async function listRedis() {
  const client = new RedisClient({
    credential: {
      secretId: process.env.TENCENTCLOUD_SECRETID,
      secretKey: process.env.TENCENTCLOUD_SECRET_KEY,
    },
    region: 'ap-guangzhou',
    profile: {
      httpProfile: { endpoint: 'redis.tencentcloudapi.com' },
    },
  });

  try {
    const result = await client.DescribeInstances({});
    return result.InstanceSet || [];
  } catch (err) {
    console.log('Redis Error:', err.message);
    return [];
  }
}

async function main() {
  const instances = await listRedis();
  if (instances.length > 0) {
    console.log('=== Redis 实例 ===');
    instances.forEach(inst => {
      console.log(`- ${inst.InstanceName}`);
      console.log(`  InstanceId: ${inst.InstanceId}`);
      console.log(`  VIP: ${inst.WanIp || inst.Vip}`);
      console.log('');
    });
  } else {
    console.log('未找到 Redis 实例');
  }
}

main();
