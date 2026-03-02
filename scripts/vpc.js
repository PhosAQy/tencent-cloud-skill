#!/usr/bin/env node
/**
 * 腾讯云私有网络 VPC 操作脚本
 *
 * 用法:
 *   node vpc.js list [region]
 *   node vpc.js get <vpcId> [region]
 *   node vpc.js subnets <vpcId> [region]
 *   node vpc.js security-groups [region]
 */

const tencentcloud = require('tencentcloud-sdk-nodejs');
const VpcClient = tencentcloud.vpc.v20170312.Client;
const { createClient, output, error } = require('./utils');

const DEFAULT_REGION = 'ap-guangzhou';

// 列出 VPC
async function list(region) {
  const client = createClient(VpcClient, region);
  const result = await client.DescribeVpcs({ Limit: 100 });
  output(result);
}

// 获取 VPC 详情
async function get(vpcId, region) {
  const client = createClient(VpcClient, region);
  const result = await client.DescribeVpcs({
    VpcIds: [vpcId],
  });
  output(result);
}

// 列出子网
async function subnets(vpcId, region) {
  const client = createClient(VpcClient, region);
  const params = { Limit: 100 };
  if (vpcId) {
    params.Filters = [{ Name: 'vpc-id', Values: [vpcId] }];
  }
  const result = await client.DescribeSubnets(params);
  output(result);
}

// 列出安全组
async function securityGroups(region) {
  const client = createClient(VpcClient, region);
  const result = await client.DescribeSecurityGroups({ Limit: 100 });
  output(result);
}

// 帮助
function help() {
  console.log(`
腾讯云私有网络 VPC 操作脚本

用法:
  node vpc.js list [region]                    列出所有 VPC
  node vpc.js get <vpcId> [region]             获取 VPC 详情
  node vpc.js subnets [vpcId] [region]         列出子网
  node vpc.js security-groups [region]         列出安全组

示例:
  node vpc.js list
  node vpc.js get vpc-xxxxxx
  node vpc.js subnets vpc-xxxxxx
  node vpc.js security-groups
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
        if (!args[1]) error('请指定 VPC ID', 'MISSING_ARG');
        await get(args[1], args[2] || DEFAULT_REGION);
        break;
      case 'subnets':
        await subnets(args[1], args[2] || DEFAULT_REGION);
        break;
      case 'security-groups':
        await securityGroups(args[1] || DEFAULT_REGION);
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
