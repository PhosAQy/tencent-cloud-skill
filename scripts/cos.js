#!/usr/bin/env node
/**
 * 腾讯云对象存储 COS 操作脚本
 *
 * 注意: COS 使用独立的 SDK (cos-nodejs-sdk-v5)
 * 需要先安装: npm install cos-nodejs-sdk-v5
 *
 * 用法:
 *   node cos.js list <bucket> [region] [prefix]
 *   node cos.js upload <bucket> <localPath> <key> [region]
 *   node cos.js download <bucket> <key> <localPath> [region]
 *   node cos.js delete <bucket> <key> [region]
 *   node cos.js url <bucket> <key> [region] [expires]
 *   node cos.js buckets
 */

const path = require('path');
const fs = require('fs');

// 检查 COS SDK
let COS;
try {
  COS = require('cos-nodejs-sdk-v5');
} catch (e) {
  console.error('请先安装 COS SDK: npm install cos-nodejs-sdk-v5');
  process.exit(1);
}

const { loadCredentials, output, error } = require('./utils');

const DEFAULT_REGION = 'ap-guangzhou';

// 创建 COS 客户端
function createCosClient() {
  const cred = loadCredentials();
  return new COS({
    SecretId: cred.secretId,
    SecretKey: cred.secretKey,
  });
}

// 列出所有 Bucket
async function buckets() {
  const cos = createCosClient();
  return new Promise((resolve, reject) => {
    cos.getService((err, data) => {
      if (err) reject(err);
      else {
        output(data);
        resolve(data);
      }
    });
  });
}

// 列出文件
async function list(bucket, region, prefix) {
  const cos = createCosClient();
  return new Promise((resolve, reject) => {
    cos.getBucket(
      {
        Bucket: bucket,
        Region: region || DEFAULT_REGION,
        Prefix: prefix || '',
      },
      (err, data) => {
        if (err) reject(err);
        else {
          output(data);
          resolve(data);
        }
      }
    );
  });
}

// 上传文件
async function upload(bucket, localPath, key, region) {
  const cos = createCosClient();

  if (!fs.existsSync(localPath)) {
    error(`文件不存在: ${localPath}`, 'FILE_NOT_FOUND');
  }

  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: bucket,
        Region: region || DEFAULT_REGION,
        Key: key,
        Body: fs.createReadStream(localPath),
      },
      (err, data) => {
        if (err) reject(err);
        else {
          output(data);
          resolve(data);
        }
      }
    );
  });
}

// 下载文件
async function download(bucket, key, localPath, region) {
  const cos = createCosClient();
  return new Promise((resolve, reject) => {
    cos.getObject(
      {
        Bucket: bucket,
        Region: region || DEFAULT_REGION,
        Key: key,
        Output: localPath,
      },
      (err, data) => {
        if (err) reject(err);
        else {
          output({ success: true, localPath, key });
          resolve(data);
        }
      }
    );
  });
}

// 删除文件
async function deleteFile(bucket, key, region) {
  const cos = createCosClient();
  return new Promise((resolve, reject) => {
    cos.deleteObject(
      {
        Bucket: bucket,
        Region: region || DEFAULT_REGION,
        Key: key,
      },
      (err, data) => {
        if (err) reject(err);
        else {
          output({ success: true, key });
          resolve(data);
        }
      }
    );
  });
}

// 获取签名 URL
async function getUrl(bucket, key, region, expires) {
  const cos = createCosClient();
  const url = cos.getObjectUrl({
    Bucket: bucket,
    Region: region || DEFAULT_REGION,
    Key: key,
    Sign: true,
    Expires: parseInt(expires) || 3600,
  });
  output({ url, expires: expires || 3600 });
}

// 设置 Bucket ACL
async function setBucketAcl(bucket, acl, region) {
  const cos = createCosClient();
  return new Promise((resolve, reject) => {
    cos.putBucketAcl(
      {
        Bucket: bucket,
        Region: region || DEFAULT_REGION,
        ACL: acl, // private, public-read, public-read-write
      },
      (err, data) => {
        if (err) reject(err);
        else {
          output({ success: true, bucket, acl, region: region || DEFAULT_REGION });
          resolve(data);
        }
      }
    );
  });
}

// 设置 Bucket 自定义域名
async function setBucketDomain(bucket, domain, region) {
  const cos = createCosClient();
  return new Promise((resolve, reject) => {
    cos.putBucketDomain({
      Bucket: bucket,
      Region: region || DEFAULT_REGION,
      DomainConfiguration: {
        DomainRules: [{
          Status: 'ENABLED',
          Name: domain,
          Type: 'REST',
          ForcedReplacement: 'CNAME',
        }]
      }
    }, (err, data) => {
      if (err) reject(err);
        else {
          output({ success: true, bucket, domain, region: region || DEFAULT_REGION });
          resolve(data);
        }
      }
    );
  });
}

// 巻加域名解析 (需要DNS CNAME记录)
// CNAME: claw-camp-1307257815.cos.ap-guangzhou.myqcloud.com

// 设置 Bucket 自定义域名
async function setBucketDomain(bucket, domain, region) {
  const cos = createCosClient();
  return new Promise((resolve, reject) => {
    cos.putBucketDomain({
      Bucket: bucket,
      Region: region || DEFAULT_REGION,
      DomainConfiguration: {
        DomainRules: [{
          Status: 'ENABLED',
          Name: domain,
          Type: 'REST',
          ForcedReplacement: 'CNAME',
        }]
      }
    }, (err, data) => {
      if (err) reject(err);
      else {
        output({ success: true, bucket, domain, region: region || DEFAULT_REGION });
        resolve(data);
      }
    });
  });
}

// 帮助
function help() {
  console.log(`
腾讯云对象存储 COS 操作脚本

注意: Bucket 格式为 <bucketname>-<appid>，例如 mybucket-1250000000

用法:
  node cos.js buckets                              列出所有 Bucket
  node cos.js list <bucket> [region] [prefix]     列出文件
  node cos.js upload <bucket> <local> <key> [region]  上传文件
  node cos.js download <bucket> <key> <local> [region] 下载文件
  node cos.js delete <bucket> <key> [region]      删除文件
  node cos.js url <bucket> <key> [region] [expires]  获取签名 URL
  node cos.js set-acl <bucket> <acl> [region]     设置 Bucket ACL (private/public-read/public-read-write)

地域代码:
  ap-guangzhou  广州
  ap-shanghai   上海
  ap-beijing    北京
  ap-chengdu    成都
  ap-hongkong   香港

示例:
  node cos.js buckets
  node cos.js list mybucket-1250000000 ap-guangzhou images/
  node cos.js upload mybucket-1250000000 ./test.txt uploads/test.txt
  node cos.js download mybucket-1250000000 uploads/test.txt ./downloaded.txt
  node cos.js url mybucket-1250000000 uploads/test.txt ap-guangzhou 7200
`);
}

// 主入口
async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  try {
    switch (cmd) {
      case 'buckets':
        await buckets();
        break;
      case 'list':
        if (!args[1]) error('请指定 Bucket', 'MISSING_ARG');
        await list(args[1], args[2], args[3]);
        break;
      case 'upload':
        if (!args[1] || !args[2] || !args[3]) error('请指定 bucket、本地路径和 key', 'MISSING_ARG');
        await upload(args[1], args[2], args[3], args[4]);
        break;
      case 'download':
        if (!args[1] || !args[2] || !args[3]) error('请指定 bucket、key 和本地路径', 'MISSING_ARG');
        await download(args[1], args[2], args[3], args[4]);
        break;
      case 'delete':
        if (!args[1] || !args[2]) error('请指定 bucket 和 key', 'MISSING_ARG');
        await deleteFile(args[1], args[2], args[3]);
        break;
      case 'url':
        if (!args[1] || !args[2]) error('请指定 bucket 和 key', 'MISSING_ARG');
        await getUrl(args[1], args[2], args[3], args[4]);
        break;
      case 'set-acl':
        if (!args[1] || !args[2]) error('请指定 bucket 和 acl (private/public-read/public-read-write)', 'MISSING_ARG');
        await setBucketAcl(args[1], args[2], args[3]);
        break;
      case 'set-domain':
        if (!args[1] || !args[2]) error('请指定 bucket 和域名', 'MISSING_ARG');
        await setBucketDomain(args[1], args[2], args[3]);
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
