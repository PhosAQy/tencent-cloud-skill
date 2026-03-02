#!/usr/bin/env node
/**
 * 腾讯云云服务器 CVM 操作脚本
 *
 * 用法:
 *   node cvm.js list [region]
 *   node cvm.js get <instanceId> [region]
 *   node cvm.js zones [region]
 *   node cvm.js instance-types [region]
 *   node cvm.js start <instanceId>
 *   node cvm.js stop <instanceId>
 *   node cvm.js reboot <instanceId>
 */

const tencentcloud = require('tencentcloud-sdk-nodejs');
const CvmClient = tencentcloud.cvm.v20170312.Client;
const { createClient, output, error } = require('./utils');

const DEFAULT_REGION = 'ap-guangzhou';

// 列出实例
async function list(region) {
  const client = createClient(CvmClient, region);
  const result = await client.DescribeInstances({ Limit: 100 });
  output(result);
}

// 获取实例详情
async function get(instanceId, region) {
  const client = createClient(CvmClient, region);
  const result = await client.DescribeInstances({
    InstanceIds: [instanceId],
  });
  output(result);
}

// 查询可用区
async function zones(region) {
  const client = createClient(CvmClient, region);
  const result = await client.DescribeZones({});
  output(result);
}

// 查询实例类型
async function instanceTypes(region) {
  const client = createClient(CvmClient, region);
  const result = await client.DescribeInstanceTypeConfigs({});
  output(result);
}

// 启动实例
async function start(instanceId, region) {
  const client = createClient(CvmClient, region);
  const result = await client.StartInstances({
    InstanceIds: [instanceId],
  });
  output(result);
}

// 停止实例
async function stop(instanceId, region) {
  const client = createClient(CvmClient, region);
  const result = await client.StopInstances({
    InstanceIds: [instanceId],
  });
  output(result);
}

// 重启实例
async function reboot(instanceId, region) {
  const client = createClient(CvmClient, region);
  const result = await client.RebootInstances({
    InstanceIds: [instanceId],
  });
  output(result);
}

// 帮助
function help() {
  console.log(`
腾讯云云服务器 CVM 操作脚本

用法:
  node cvm.js list [region]              列出所有实例
  node cvm.js get <instanceId> [region]  获取实例详情
  node cvm.js zones [region]             查询可用区
  node cvm.js instance-types [region]    查询实例类型
  node cvm.js start <instanceId>         启动实例
  node cvm.js stop <instanceId>          停止实例
  node cvm.js reboot <instanceId>        重启实例

地域代码:
  ap-guangzhou  广州
  ap-shanghai   上海
  ap-beijing    北京
  ap-chengdu    成都
  ap-hongkong   香港
  ap-singapore  新加坡

示例:
  node cvm.js list
  node cvm.js get ins-xxxxxx
  node cvm.js zones ap-shanghai
  node cvm.js start ins-xxxxxx
`);
}

// 主入口
async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  try {
    switch (cmd) {
      case 'list':
        await list(args[1] || DEFAULT_REGION);
        break;
      case 'get':
        if (!args[1]) error('请指定实例ID', 'MISSING_ARG');
        await get(args[1], args[2] || DEFAULT_REGION);
        break;
      case 'zones':
        await zones(args[1] || DEFAULT_REGION);
        break;
      case 'instance-types':
        await instanceTypes(args[1] || DEFAULT_REGION);
        break;
      case 'start':
        if (!args[1]) error('请指定实例ID', 'MISSING_ARG');
        await start(args[1], args[2] || DEFAULT_REGION);
        break;
      case 'stop':
        if (!args[1]) error('请指定实例ID', 'MISSING_ARG');
        await stop(args[1], args[2] || DEFAULT_REGION);
        break;
      case 'reboot':
        if (!args[1]) error('请指定实例ID', 'MISSING_ARG');
        await reboot(args[1], args[2] || DEFAULT_REGION);
        break;
      case 'help':
      default:
        help();
    }
  } catch (err) {
    error(err.message, err.code || 'UNKNOWN');
  }
}

main();
