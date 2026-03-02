#!/usr/bin/env node
/**
 * 腾讯云云函数 SCF 操作脚本
 *
 * 用法:
 *   node scf.js list [region]
 *   node scf.js get <functionName> [region]
 *   node scf.js invoke <functionName> <payload> [region]
 *   node scf.js create <name> <runtime> <handler> <zipFile>
 *   node scf.js update-code <functionName> <zipFile>
 *   node scf.js update-config <functionName> <configJson>
 *   node scf.js delete <functionName>
 */

const tencentcloud = require('tencentcloud-sdk-nodejs');
const ScfClient = tencentcloud.scf.v20180416.Client;
const fs = require('fs');
const path = require('path');
const { createClient, output, error, parseArgs } = require('./utils');

const DEFAULT_REGION = 'ap-guangzhou';

// 列出函数
async function list(region) {
  const client = createClient(ScfClient, region);
  const result = await client.ListFunctions({ Limit: 100 });
  output(result);
}

// 获取函数详情
async function get(functionName, region) {
  const client = createClient(ScfClient, region);
  const result = await client.GetFunction({
    FunctionName: functionName,
  });
  output(result);
}

// 调用函数
async function invoke(functionName, payload, region) {
  const client = createClient(ScfClient, region);
  const result = await client.Invoke({
    FunctionName: functionName,
    InvocationType: 'RequestResponse',
    ClientContext: payload || '{}',
  });
  output(result);
}

// 创建函数
async function create(name, runtime, handler, zipPath) {
  const client = createClient(ScfClient);

  if (!fs.existsSync(zipPath)) {
    error(`ZIP 文件不存在: ${zipPath}`, 'FILE_NOT_FOUND');
  }

  const zipContent = fs.readFileSync(zipPath);
  const zipBase64 = zipContent.toString('base64');

  const result = await client.CreateFunction({
    FunctionName: name,
    Runtime: runtime || 'Nodejs18.15',
    Handler: handler || 'index.main',
    Code: { ZipFile: zipBase64 },
    MemorySize: 128,
    Timeout: 10,
  });
  output(result);
}

// 更新函数代码
async function updateCode(functionName, zipPath) {
  const client = createClient(ScfClient);

  if (!fs.existsSync(zipPath)) {
    error(`ZIP 文件不存在: ${zipPath}`, 'FILE_NOT_FOUND');
  }

  const zipContent = fs.readFileSync(zipPath);
  const zipBase64 = zipContent.toString('base64');

  const result = await client.UpdateFunctionCode({
    FunctionName: functionName,
    ZipFile: zipBase64,
  });
  output(result);
}

// 更新函数配置
async function updateConfig(functionName, configJson) {
  const client = createClient(ScfClient);

  let config = {};
  try {
    config = JSON.parse(configJson);
  } catch (e) {
    error('配置 JSON 格式错误', 'INVALID_JSON');
  }

  const params = {
    FunctionName: functionName,
  };

  if (config.memorySize) params.MemorySize = config.memorySize;
  if (config.timeout) params.Timeout = config.timeout;
  if (config.description) params.Description = config.description;
  if (config.envVars) {
    params.Environment = {
      Variables: Object.entries(config.envVars).map(([Key, Value]) => ({ Key, Value })),
    };
  }

  const result = await client.UpdateFunctionConfiguration(params);
  output(result);
}

// 删除函数
async function deleteFunction(functionName) {
  const client = createClient(ScfClient);
  const result = await client.DeleteFunction({
    FunctionName: functionName,
  });
  output(result);
}

// 帮助
function help() {
  console.log(`
腾讯云云函数 SCF 操作脚本

用法:
  node scf.js list [region]                    列出所有函数
  node scf.js get <functionName> [region]      获取函数详情
  node scf.js invoke <functionName> [payload] [region]  调用函数
  node scf.js create <name> <runtime> <handler> <zipFile>  创建函数
  node scf.js update-code <functionName> <zipFile>  更新函数代码
  node scf.js update-config <functionName> <configJson>  更新函数配置
  node scf.js delete <functionName>            删除函数

地域代码:
  ap-guangzhou  广州
  ap-shanghai   上海
  ap-beijing    北京
  ap-chengdu    成都
  ap-hongkong   香港

Runtime:
  Nodejs18.15, Nodejs16.13, Python3.10, Java8, Go1, Php7, Php8

示例:
  node scf.js list
  node scf.js get my-function
  node scf.js invoke my-function '{"key": "value"}'
  node scf.js create my-func Nodejs18.15 index.main ./code.zip
  node scf.js update-config my-func '{"memorySize": 256, "timeout": 30}'
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
        if (!args[1]) error('请指定函数名', 'MISSING_ARG');
        await get(args[1], args[2] || DEFAULT_REGION);
        break;
      case 'invoke':
        if (!args[1]) error('请指定函数名', 'MISSING_ARG');
        await invoke(args[1], args[2], args[3] || DEFAULT_REGION);
        break;
      case 'create':
        if (!args[1]) error('请指定函数名', 'MISSING_ARG');
        await create(args[1], args[2], args[3], args[4]);
        break;
      case 'update-code':
        if (!args[1]) error('请指定函数名', 'MISSING_ARG');
        await updateCode(args[1], args[2]);
        break;
      case 'update-config':
        if (!args[1]) error('请指定函数名', 'MISSING_ARG');
        await updateConfig(args[1], args[2]);
        break;
      case 'delete':
        if (!args[1]) error('请指定函数名', 'MISSING_ARG');
        await deleteFunction(args[1]);
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
