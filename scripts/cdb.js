#!/usr/bin/env node
/**
 * 腾讯云云数据库 MySQL (CDB) 操作脚本
 *
 * 用法:
 *   node cdb.js list [region]
 *   node cdb.js get <instanceId> [region]
 *   node cdb.js params <instanceId>
 *   node cdb.js slow-logs <instanceId> <startTime> <endTime>
 */

const tencentcloud = require('tencentcloud-sdk-nodejs');
const CdbClient = tencentcloud.cdb.v20170320.Client;
const { createClient, output, error } = require('./utils');

const DEFAULT_REGION = 'ap-guangzhou';

// 列出实例
async function list(region) {
  const client = createClient(CdbClient, region);
  const result = await client.DescribeDBInstances({ Limit: 100 });
  output(result);
}

// 获取实例详情
async function get(instanceId, region) {
  const client = createClient(CdbClient, region);
  const result = await client.DescribeDBInstanceInfo({
    InstanceId: instanceId,
  });
  output(result);
}

// 查询实例参数
async function params(instanceId, region) {
  const client = createClient(CdbClient, region);
  const result = await client.DescribeInstanceParams({
    InstanceId: instanceId,
  });
  output(result);
}

// 查询慢日志
async function slowLogs(instanceId, startTime, endTime, region) {
  const client = createClient(CdbClient, region);
  const result = await client.DescribeSlowLogs({
    InstanceId: instanceId,
    StartTime: startTime,
    EndTime: endTime,
  });
  output(result);
}

// 帮助
function help() {
  console.log(`
腾讯云云数据库 MySQL (CDB) 操作脚本

用法:
  node cdb.js list [region]                        列出所有实例
  node cdb.js get <instanceId> [region]            获取实例详情
  node cdb.js params <instanceId> [region]         查询实例参数
  node cdb.js slow-logs <instanceId> <start> <end> [region]  查询慢日志

时间格式: 2024-01-01 00:00:00

示例:
  node cdb.js list
  node cdb.js get cdb-xxxxxx
  node cdb.js params cdb-xxxxxx
  node cdb.js slow-logs cdb-xxxxxx "2024-03-01 00:00:00" "2024-03-02 00:00:00"
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
      case 'params':
        if (!args[1]) error('请指定实例ID', 'MISSING_ARG');
        await params(args[1], args[2] || DEFAULT_REGION);
        break;
      case 'slow-logs':
        if (!args[1]) error('请指定实例ID', 'MISSING_ARG');
        await slowLogs(args[1], args[2], args[3], args[4] || DEFAULT_REGION);
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
