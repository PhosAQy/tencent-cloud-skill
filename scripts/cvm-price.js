#!/usr/bin/env node
/**
 * 腾讯云 CVM 价格查询脚本
 * 
 * 用法:
 *   node cvm-price.js <InstanceType> [Zone] [Region]
 * 
 * 示例:
 *   node cvm-price.js S5.MEDIUM4              # 查询 S5.MEDIUM4 在广州的价格
 *   node cvm-price.js S5.MEDIUM4 ap-guangzhou-3 ap-guangzhou  # 指定可用区
 */

const tencentcloud = require('tencentcloud-sdk-nodejs');
const CvmClient = tencentcloud.cvm.v20170312.Client;
const { createClient, output, error, loadEnv } = require('./utils');

const DEFAULT_REGION = 'ap-guangzhou';

async function inquiryPrice(instanceType, zone, region) {
  const client = createClient(CvmClient, region);
  
  const params = {
    InstanceType: instanceType,
    ImageId: 'img-487zeit5',  // 公共镜像 Ubuntu Server 22.04 LTS 64bit x86_64
    InstanceChargeType: 'POSTPAID_BY_HOUR',  // 按量计费
    Placement: {
      Zone: zone || `${region}-6`,  // 默认可用区6
    },
    SystemDisk: {
      DiskType: 'CLOUD_PREMIUM',
      DiskSize: 50,
    },
    InternetAccessible: {
      InternetChargeType: 'TRAFFIC_POSTPAID_BY_HOUR',
      InternetMaxBandwidthOut: 0,  // 不分配公网带宽
    },
  };
  
  try {
    const result = await client.InquiryPriceRunInstances(params);
    
    // 提取价格信息
    if (result.Price) {
      const price = result.Price;
      console.log(JSON.stringify({
        InstanceType: instanceType,
        Zone: params.Placement.Zone,
        InstanceChargeType: params.InstanceChargeType,
        Price: {
          UnitPrice: price.InstancePrice?.UnitPrice,
          ChargeUnit: price.InstancePrice?.ChargeUnit,
          OriginalPrice: price.InstancePrice?.OriginalPrice,
          DiscountPrice: price.InstancePrice?.DiscountPrice,
        },
        DiskPrice: price.BandwidthPrice ? {
          UnitPrice: price.BandwidthPrice.UnitPrice,
          ChargeUnit: price.BandwidthPrice.ChargeUnit,
        } : null,
        Raw: result,
      }, null, 2));
    } else {
      output(result);
    }
  } catch (err) {
    // 如果询价失败，尝试更简单的参数
    if (err.code === 'InvalidParameter' || err.code === 'InvalidParameterValue') {
      console.log(`询价失败，尝试查询实例类型配置...\n`);
      const typeResult = await client.DescribeInstanceTypeConfigs({
        Filters: [
          { Name: 'instance-type', Values: [instanceType] }
        ]
      });
      output(typeResult);
    } else {
      throw err;
    }
  }
}

async function listInstanceTypes(region) {
  const client = createClient(CvmClient, region);
  const result = await client.DescribeInstanceTypeConfigs({});
  
  // 简化输出
  const types = result.InstanceTypeConfigSet?.map(t => ({
    Type: t.InstanceType,
    CPU: t.CPU,
    Memory: t.Memory,
    GPU: t.GPU,
    Family: t.InstanceFamily,
    TypeName: t.TypeName,
  })) || [];
  
  console.log(JSON.stringify(types, null, 2));
}

function help() {
  console.log(`
腾讯云 CVM 价格查询

用法:
  node cvm-price.js <InstanceType> [Zone] [Region]  查询指定实例类型价格
  node cvm-price.js types [Region]                  列出所有实例类型

常用实例类型:
  S5.SMALL1     - 1核1G
  S5.SMALL2     - 1核2G
  S5.MEDIUM2    - 2核2G
  S5.MEDIUM4    - 2核4G
  S5.LARGE4     - 4核4G
  S5.LARGE8     - 4核8G
  S5.2XLARGE16  - 8核16G

地域代码:
  ap-guangzhou  广州
  ap-shanghai   上海
  ap-beijing    北京
  ap-chengdu    成都
  ap-hongkong   香港
  ap-singapore  新加坡

示例:
  node cvm-price.js S5.MEDIUM4
  node cvm-price.js S5.LARGE8 ap-shanghai-2 ap-shanghai
`);
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  try {
    if (!cmd || cmd === 'help') {
      help();
    } else if (cmd === 'types') {
      await listInstanceTypes(args[1] || DEFAULT_REGION);
    } else {
      const instanceType = cmd;
      const zone = args[1];
      const region = args[2] || DEFAULT_REGION;
      await inquiryPrice(instanceType, zone, region);
    }
  } catch (err) {
    error(err.message, err.code || 'UNKNOWN');
  }
}

main();
