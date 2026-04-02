#!/usr/bin/env node
/**
 * 获取腾讯云 MySQL 实例详情
 */
const tencentcloud = require('tencentcloud-sdk-nodejs');

const CdbClient = tencentcloud.cdb.v20170320.Client;

async function main() {
  const client = new CdbClient({
    credential: {
      secretId: process.env.TENCENTCLOUD_SECRETID,
      secretKey: process.env.TENCENTCLOUD_SECRET_KEY,
    },
    region: 'ap-guangzhou',
    profile: {
      httpProfile: { endpoint: 'cdb.tencentcloudapi.com' },
    },
  });

  try {
    const result = await client.DescribeDBInstances({});
    const items = result.Items || [];

    if (items.length > 0) {
      const inst = items[0];
      console.log('=== MySQL 实例详情 ===');
      console.log(`名称: ${inst.InstanceName}`);
      console.log(`InstanceId: ${inst.InstanceId}`);
      console.log(`内网地址: ${inst.Vip}:${inst.Vport}`);
      console.log(`外网地址: ${inst.WanDomain || '未开通'}`);
      console.log(`外网IP: ${inst.WanVip || '未开通'}`);
      console.log(`外网端口: ${inst.WanPort || 'N/A'}`);
      console.log(`引擎: ${inst.EngineVersion}`);
      console.log(`配置: ${inst.DeviceType}`);
      console.log(`地域: ${inst.Region}`);
      console.log(`可用区: ${inst.Zone}`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
