# 腾讯云 SDK 调用示例

## 目录

1. [云函数 SCF](#云函数-scf)
2. [对象存储 COS](#对象存储-cos)
3. [云服务器 CVM](#云服务器-cvm)
4. [云数据库 MySQL](#云数据库-mysql)
5. [访问管理 CAM](#访问管理-cam)

---

## 云函数 SCF

```javascript
const tencentcloud = require("tencentcloud-sdk-nodejs");
const ScfClient = tencentcloud.scf.v20180416.Client;

const client = new ScfClient({
  credential: {
    secretId: process.env.TENCENTCLOUD_SECRETID,
    secretKey: process.env.TENCENTCLOUD_SECRETKEY,
  },
  region: "ap-guangzhou",
});

// 列出函数
async function listFunctions() {
  const result = await client.ListFunctions({
    Limit: 100,
    Order: "DESC",
    OrderBy: "AddTime",
  });
  return result.Functions;
}

// 获取函数详情
async function getFunction(functionName) {
  return await client.GetFunction({
    FunctionName: functionName,
  });
}

// 创建函数
async function createFunction(name, codeZip, runtime = "Nodejs18.15") {
  return await client.CreateFunction({
    FunctionName: name,
    Runtime: runtime,
    Handler: "index.main",
    Code: { ZipFile: codeZip },  // Base64 编码的 ZIP
    MemorySize: 128,
    Timeout: 10,
  });
}

// 更新函数代码
async function updateFunctionCode(functionName, codeZip) {
  return await client.UpdateFunctionCode({
    FunctionName: functionName,
    ZipFile: codeZip,
  });
}

// 更新函数配置
async function updateFunctionConfig(functionName, config) {
  return await client.UpdateFunctionConfiguration({
    FunctionName: functionName,
    MemorySize: config.memorySize || 128,
    Timeout: config.timeout || 10,
    Environment: config.envVars ? {
      Variables: Object.entries(config.envVars).map(([Key, Value]) => ({ Key, Value })),
    } : undefined,
  });
}

// 删除函数
async function deleteFunction(functionName) {
  return await client.DeleteFunction({
    FunctionName: functionName,
  });
}

// 调用函数（同步）
async function invokeFunction(functionName, payload) {
  const result = await client.Invoke({
    FunctionName: functionName,
    InvocationType: "RequestResponse",
    ClientContext: JSON.stringify(payload),
  });
  return JSON.parse(result.Result.RetMsg);
}
```

---

## 对象存储 COS

COS 使用独立的 SDK，不是 tencentcloud-sdk-nodejs。

```javascript
const COS = require('cos-nodejs-sdk-v5');

const cos = new COS({
  SecretId: process.env.TENCENTCLOUD_SECRETID,
  SecretKey: process.env.TENCENTCLOUD_SECRETKEY,
});

const bucket = 'my-bucket-1250000000';  // bucket-appid
const region = 'ap-guangzhou';

// 上传文件
function uploadFile(key, filePath) {
  return new Promise((resolve, reject) => {
    cos.putObject({
      Bucket: bucket,
      Region: region,
      Key: key,
      Body: require('fs').createReadStream(filePath),
    }, (err, data) => err ? reject(err) : resolve(data));
  });
}

// 上传 Buffer
function uploadBuffer(key, buffer) {
  return new Promise((resolve, reject) => {
    cos.putObject({
      Bucket: bucket,
      Region: region,
      Key: key,
      Body: buffer,
    }, (err, data) => err ? reject(err) : resolve(data));
  });
}

// 下载文件
function downloadFile(key, localPath) {
  return new Promise((resolve, reject) => {
    cos.getObject({
      Bucket: bucket,
      Region: region,
      Key: key,
      Output: localPath,
    }, (err, data) => err ? reject(err) : resolve(data));
  });
}

// 列出文件
function listFiles(prefix = '') {
  return new Promise((resolve, reject) => {
    cos.getBucket({
      Bucket: bucket,
      Region: region,
      Prefix: prefix,
    }, (err, data) => err ? reject(err) : resolve(data.Contents));
  });
}

// 删除文件
function deleteFile(key) {
  return new Promise((resolve, reject) => {
    cos.deleteObject({
      Bucket: bucket,
      Region: region,
      Key: key,
    }, (err, data) => err ? reject(err) : resolve(data));
  });
}

// 批量删除
function deleteMultiple(keys) {
  return new Promise((resolve, reject) => {
    cos.deleteMultipleObject({
      Bucket: bucket,
      Region: region,
      Objects: keys.map(key => ({ Key: key })),
    }, (err, data) => err ? reject(err) : resolve(data));
  });
}

// 获取临时访问 URL
function getSignedUrl(key, expireSeconds = 3600) {
  return cos.getObjectUrl({
    Bucket: bucket,
    Region: region,
    Key: key,
    Sign: true,
    Expires: expireSeconds,
  });
}

// 获取文件元数据
function headFile(key) {
  return new Promise((resolve, reject) => {
    cos.headObject({
      Bucket: bucket,
      Region: region,
      Key: key,
    }, (err, data) => err ? reject(err) : resolve(data));
  });
}
```

---

## 云服务器 CVM

```javascript
const tencentcloud = require("tencentcloud-sdk-nodejs");
const CvmClient = tencentcloud.cvm.v20170312.Client;

const client = new CvmClient({
  credential: {
    secretId: process.env.TENCENTCLOUD_SECRETID,
    secretKey: process.env.TENCENTCLOUD_SECRETKEY,
  },
  region: "ap-guangzhou",
});

// 列出实例
async function listInstances() {
  const result = await client.DescribeInstances({ Limit: 100 });
  return result.InstanceSet;
}

// 查询实例详情
async function getInstance(instanceId) {
  const result = await client.DescribeInstances({
    InstanceIds: [instanceId],
  });
  return result.InstanceSet[0];
}

// 创建实例
async function createInstance(params) {
  return await client.RunInstances({
    InstanceType: params.instanceType || "S5.SMALL1",
    ImageId: params.imageId,
    InstanceChargeType: "POSTPAID_BY_HOUR",
    InternetAccessible: {
      InternetMaxBandwidthOut: 10,
      PublicIpAssigned: true,
    },
    LoginSettings: {
      Password: params.password,
    },
    InstanceCount: params.count || 1,
  });
}

// 停止实例
async function stopInstance(instanceIds) {
  return await client.StopInstances({
    InstanceIds: Array.isArray(instanceIds) ? instanceIds : [instanceIds],
  });
}

// 启动实例
async function startInstance(instanceIds) {
  return await client.StartInstances({
    InstanceIds: Array.isArray(instanceIds) ? instanceIds : [instanceIds],
  });
}

// 重启实例
async function rebootInstance(instanceIds) {
  return await client.RebootInstances({
    InstanceIds: Array.isArray(instanceIds) ? instanceIds : [instanceIds],
  });
}

// 终止实例
async function terminateInstance(instanceIds) {
  return await client.TerminateInstances({
    InstanceIds: Array.isArray(instanceIds) ? instanceIds : [instanceIds],
  });
}

// 查询可用区
async function listZones() {
  const result = await client.DescribeZones({});
  return result.ZoneSet;
}

// 查询实例类型
async function listInstanceTypes() {
  const result = await client.DescribeInstanceTypeConfigs({});
  return result.InstanceTypeConfigSet;
}
```

---

## 云数据库 MySQL

```javascript
const tencentcloud = require("tencentcloud-sdk-nodejs");
const CdbClient = tencentcloud.cdb.v20170320.Client;

const client = new CdbClient({
  credential: {
    secretId: process.env.TENCENTCLOUD_SECRETID,
    secretKey: process.env.TENCENTCLOUD_SECRETKEY,
  },
  region: "ap-guangzhou",
});

// 列出实例
async function listInstances() {
  const result = await client.DescribeDBInstances({ Limit: 100 });
  return result.Items;
}

// 查询实例详情
async function getInstance(instanceId) {
  const result = await client.DescribeDBInstanceInfo({
    InstanceId: instanceId,
  });
  return result;
}

// 创建实例
async function createInstance(params) {
  return await client.CreateDBInstance({
    Memory: params.memory || 1000,        // MB
    Volume: params.volume || 50,          // GB
    InstanceName: params.name,
    Zone: params.zone || "ap-guangzhou-3",
    MasterInstanceId: params.masterId,    // 只读实例时需要
  });
}

// 删除实例
async function deleteInstance(instanceId) {
  return await client.DeleteDBInstance({
    InstanceId: instanceId,
  });
}

// 执行 SQL（需要先开启 SQL 操作权限）
async function executeSql(instanceId, sql) {
  return await client.ExecuteSql({
    InstanceId: instanceId,
    Sql: sql,
  });
}

// 查询慢日志
async function getSlowLog(instanceId, startTime, endTime) {
  return await client.DescribeSlowLogs({
    InstanceId: instanceId,
    StartTime: startTime,
    EndTime: endTime,
  });
}

// 修改实例参数
async function modifyParam(instanceId, params) {
  return await client.ModifyInstanceParam({
    InstanceId: instanceId,
    Params: Object.entries(params).map(([name, value]) => ({
      Name: name,
      Value: String(value),
    })),
  });
}
```

---

## 访问管理 CAM

```javascript
const tencentcloud = require("tencentcloud-sdk-nodejs");
const CamClient = tencentcloud.cam.v20190116.Client;

const client = new CamClient({
  credential: {
    secretId: process.env.TENCENTCLOUD_SECRETID,
    secretKey: process.env.TENCENTCLOUD_SECRETKEY,
  },
  region: "ap-guangzhou",  // CAM 是全局服务，region 可忽略
});

// 列出用户
async function listUsers() {
  const result = await client.ListUsers({});
  return result.Data;
}

// 创建用户
async function createUser(name, options = {}) {
  return await client.AddUser({
    Name: name,
    Remark: options.remark || "",
    ConsoleLogin: options.consoleLogin ? 1 : 0,
    UseApi: options.useApi !== false ? 1 : 0,
  });
}

// 删除用户
async function deleteUser(uin) {
  return await client.DeleteUser({
    Uin: uin,
  });
}

// 列出角色
async function listRoles() {
  const result = await client.ListRoles({});
  return result.List;
}

// 创建角色
async function createRole(roleName, policyDocument, options = {}) {
  return await client.CreateRole({
    RoleName: roleName,
    PolicyDocument: JSON.stringify(policyDocument),
    Description: options.description || "",
    MaxSessionDuration: options.maxSessionDuration || 7200,
  });
}

// 删除角色
async function deleteRole(roleName) {
  return await client.DeleteRole({
    RoleName: roleName,
  });
}

// 列出策略
async function listPolicies(scope = "All") {
  const result = await client.ListPolicies({
    Scope: scope,  // All | QCS | Local
  });
  return result.List;
}

// 创建自定义策略
async function createPolicy(policyName, policyDocument) {
  return await client.CreatePolicy({
    PolicyName: policyName,
    PolicyDocument: JSON.stringify(policyDocument),
  });
}

// 删除策略
async function deletePolicy(policyId) {
  return await client.DeletePolicy({
    PolicyId: policyId,
  });
}

// 绑定策略到用户
async function attachUserPolicy(uin, policyId) {
  return await client.AttachUserPolicy({
    Uin: uin,
    PolicyId: policyId,
  });
}

// 解绑用户策略
async function detachUserPolicy(uin, policyId) {
  return await client.DetachUserPolicy({
    Uin: uin,
    PolicyId: policyId,
  });
}

// 绑定策略到角色
async function attachRolePolicy(roleName, policyId) {
  return await client.AttachRolePolicy({
    RoleName: roleName,
    PolicyId: policyId,
  });
}

// 创建 API 密钥
async function createApiKey(uin) {
  return await client.CreateAccessKey({
    TargetUin: uin,
  });
}

// 删除 API 密钥
async function deleteApiKey(accessKeyId) {
  return await client.DeleteAccessKey({
    AccessKeyId: accessKeyId,
  });
}
```

---

## 策略文档示例

```javascript
// 允许访问特定 COS bucket
const cosPolicy = {
  version: "2.0",
  statement: [
    {
      effect: "allow",
      action: ["name/cos:*"],
      resource: [
        "qcs::cos:ap-guangzhou:uid/1250000000:my-bucket-1250000000/*",
      ],
    },
  ],
};

// 允许访问特定 SCF 函数
const scfPolicy = {
  version: "2.0",
  statement: [
    {
      effect: "allow",
      action: ["name/scf:*"],
      resource: [
        "qcs::scf:ap-guangzhou:uid/1250000000:appname/functionname",
      ],
    },
  ],
};

// 只读权限
const readOnlyPolicy = {
  version: "2.0",
  statement: [
    {
      effect: "allow",
      action: [
        "name/cos:List*",
        "name/cos:Get*",
        "name/cos:Head*",
      ],
      resource: ["*"],
    },
  ],
};
```
