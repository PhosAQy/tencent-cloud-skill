#!/usr/bin/env node
/**
 * 列出腾讯云数据库实例
 */
const tencentcloud = require('tencentcloud-sdk-nodejs');

// MySQL/CDB
const CdbClient = tencentcloud.cdb.v20170320.Client;

async function listMySQL() {
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
    return result.Items || [];
  } catch (err) {
    if (err.code === 'AuthFailure') {
      console.log('⚠️ MySQL/CDB: 无权限或未开通');
    } else {
      console.log('MySQL/CDB Error:', err.message);
    }
    return [];
  }
}

async function main() {
  console.log('正在查询腾讯云数据库实例...\n');

  const mysqlInstances = await listMySQL();

  if (mysqlInstances.length > 0) {
    console.log('=== MySQL/CDB 实例 ===');
    mysqlInstances.forEach(inst => {
      console.log(`- ${inst.InstanceName}`);
      console.log(`  InstanceId: ${inst.InstanceId}`);
      console.log(`  VIP: ${inst.Vip}:${inst.Vport}`);
      console.log(`  状态: ${inst.Status === 1 ? '运行中' : '其他'}`);
      console.log('');
    });
  } else {
    console.log('未找到 MySQL/CDB 实例');
  }
}

main();
