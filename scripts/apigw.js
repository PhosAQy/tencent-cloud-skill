#!/usr/bin/env node
/**
 * 腾讯云 API Gateway 操作脚本
 */
const tencentcloud = require('tencentcloud-sdk-nodejs');
const ApigatewayClient = tencentcloud.apigateway.v20180808.Client;
const fs = require('fs');
const path = require('path');

const { createClient, output, error } = require('./utils');

async function createService(name, region = 'ap-singapore') {
  const client = createClient(ApigatewayClient, region);
  
  const result = await client.CreateService({
    ServiceName: name,
    Protocol: 'HTTP',
    ServiceDesc: name,
    ExclusiveSetName: '',
    NetTypes: ['INTERNET'],
  });
  output(result);
  return result;
}

async function createApi(serviceId, functionName, region = 'ap-singapore') {
  const client = createClient(ApigatewayClient, region);
  
  const result = await client.CreateApi({
    ServiceId: serviceId,
    ApiName: 'default',
    Method: 'ANY',
    Path: '/',
    Description: 'ProseUp API',
    FunctionType: 'SCF',
    RequestConfig: {
      Method: ['ANY']
    },
    ServiceType: 'SCF',
    ServiceConfig: {
      FunctionName: functionName,
    },
    ResponseType: 'HTML',
    ResponseSuccessExample: 'OK',
    ResponseFailExample: 'Error',
  });
  output(result);
  return result;
}

async function bindApi(serviceId, apiId, region = 'ap-singapore') {
  const client = createClient(ApigatewayClient, region);
  
  const result = await client.AttachApiToUsagePlan({
    UsagePlanIds: [], // Will use default
    ServiceId: serviceId,
    ApiId: apiId,
  });
  output(result);
  return result;
}

async function getServiceInfo(serviceId, region = 'ap-singapore') {
  const client = createClient(ApigatewayClient, region);
  
  const result = await client.DescribeService({
    ServiceId: serviceId,
  });
  output(result);
  return result;
}

const args = process.argv.slice(2);
const action = args[0];

const REGION = process.env.TENCENTCLOUD_REGION || 'ap-singapore';

(async () => {
  try {
    switch (action) {
      case 'create-service':
        await createService(args[1] || 'proseup-api-sg', REGION);
        break;
      case 'get-service':
        await getServiceInfo(args[1], REGION);
        break;
      default:
        console.log('Usage:');
        console.log('  node apigw.js create-service <name>');
        console.log('  node apigw.js get-service <service-id>');
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
