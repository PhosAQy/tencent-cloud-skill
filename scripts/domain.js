#!/usr/bin/env node
/**
 * 腾讯云域名操作脚本
 * 支持：查询可注册、注册域名、列出已有域名
 */
const tencentcloud = require('tencentcloud-sdk-nodejs');
const Client = tencentcloud.domain.v20180808.Client;
const { createClient, output, error } = require('./utils');

const client = createClient(Client, 'ap-guangzhou');

async function checkDomain(domain) {
  const result = await client.CheckDomain({ DomainName: domain });
  output(result);
}

async function listDomains() {
  const result = await client.DescribeDomainNameList({
    Limit: 20,
    Offset: 0,
  });
  output(result);
}

async function buyDomain(domain, years = 1) {
  // 先查模板（注册人信息）
  const templates = await client.DescribeTemplateList({ Type: '1' });
  if (!templates.TemplateSet || templates.TemplateSet.length === 0) {
    error('没有找到注册模板，请先在腾讯云控制台创建域名信息模板');
    return;
  }
  const templateId = templates.TemplateSet[0].TemplateId;
  console.log(`使用模板: ${templateId} (${templates.TemplateSet[0].CnFirstName || ''} ${templates.TemplateSet[0].CnLastName || ''})`);

  const result = await client.CreateDomainBatch({
    TemplateId: templateId,
    Domains: [{ DomainName: domain, Period: years }],
    PayMode: 1, // 1=自动付费
  });
  output(result);
}

const [,, action, ...args] = process.argv;

switch (action) {
  case 'check':
    checkDomain(args[0]).catch(error);
    break;
  case 'list':
    listDomains().catch(error);
    break;
  case 'buy':
    buyDomain(args[0], parseInt(args[1]) || 1).catch(error);
    break;
  default:
    console.log(`用法:
  node domain.js check <域名>     # 查询是否可注册
  node domain.js list             # 列出已有域名
  node domain.js buy <域名> [年数] # 购买域名`);
}
