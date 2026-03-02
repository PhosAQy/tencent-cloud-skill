#!/usr/bin/env node
/**
 * 腾讯云访问管理 CAM 操作脚本
 *
 * 用法:
 *   node cam.js users
 *   node cam.js roles
 *   node cam.js policies [scope]
 *   node cam.js api-keys <uin>
 */

const tencentcloud = require('tencentcloud-sdk-nodejs');
const CamClient = tencentcloud.cam.v20190116.Client;
const { createClient, output, error } = require('./utils');

// CAM 是全局服务，region 可以忽略
const DEFAULT_REGION = 'ap-guangzhou';

// 列出用户
async function users() {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.ListUsers({});
  output(result);
}

// 列出角色
async function roles() {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.ListRoles({});
  output(result);
}

// 列出策略
async function policies(scope) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.ListPolicies({
    Scope: scope || 'All', // All | QCS | Local
  });
  output(result);
}

// 列出 API 密钥
async function apiKeys(uin) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.ListAccessKeys({
    TargetUin: parseInt(uin),
  });
  output(result);
}

// 帮助
function help() {
  console.log(`
腾讯云访问管理 CAM 操作脚本

用法:
  node cam.js users                  列出所有用户
  node cam.js roles                  列出所有角色
  node cam.js policies [scope]       列出策略 (All | QCS | Local)
  node cam.js api-keys <uin>         列出用户的 API 密钥

Scope 说明:
  All    - 所有策略
  QCS    - 腾讯云预设策略
  Local  - 自定义策略

示例:
  node cam.js users
  node cam.js roles
  node cam.js policies Local
  node cam.js api-keys 100038994581
`);
}

// 主入口
async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  try {
    switch (cmd) {
      case 'users':
        await users();
        break;
      case 'roles':
        await roles();
        break;
      case 'policies':
        await policies(args[1]);
        break;
      case 'api-keys':
        if (!args[1]) error('请指定用户 UIN', 'MISSING_ARG');
        await apiKeys(args[1]);
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
