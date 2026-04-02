#!/usr/bin/env node
/**
 * 腾讯云访问管理 CAM 操作脚本（只读）
 * 
 * 支持所有 CAM 只读 API
 * 
 * 用法:
 *   node cam.js users
 *   node cam.js roles
 *   node cam.js policies [scope]
 *   node cam.js groups
 *   node cam.js get-user <name>
 *   node cam.js get-role <role-id>
 *   node cam.js get-policy <policy-id>
 *   node cam.js list-attached-user-policies <uin>
 *   node cam.js list-attached-role-policies <role-id>
 *   node cam.js api-keys <uin>
 *   node cam.js account-summary
 */

const tencentcloud = require('tencentcloud-sdk-nodejs');
const CamClient = tencentcloud.cam.v20190116.Client;
const { createClient, output, error } = require('./utils');

const DEFAULT_REGION = 'ap-guangzhou';

// ==================== 用户相关 ====================

// 列出所有用户
async function listUsers() {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.ListUsers({});
  output(result);
}

// 获取用户详情
async function getUser(name) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.GetUser({ Name: name });
  output(result);
}

// 列出协作者
async function listCollaborators() {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.ListCollaborators({});
  output(result);
}

// 列出子账号
async function describeSubAccounts(uinList) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.DescribeSubAccounts({
    FilterSubAccountUin: uinList.split(',').map(u => parseInt(u.trim()))
  });
  output(result);
}

// ==================== 角色相关 ====================

// 列出所有角色
async function listRoles() {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.DescribeRoleList({ Page: 1, Rp: 200 });
  output(result);
}

// 获取角色详情
async function getRole(roleId) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.GetRole({ RoleId: roleId });
  output(result);
}

// 列出角色（新接口）
async function describeRoleList() {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.DescribeRoleList({ Page: 1, Rp: 100 });
  output(result);
}

// ==================== 策略相关 ====================

// 列出策略
async function listPolicies(scope, page = 1, rp = 50) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.ListPolicies({
    Scope: scope || 'All',
    Page: parseInt(page),
    Rp: parseInt(rp)
  });
  output(result);
}

// 获取策略详情
async function getPolicy(policyId) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.GetPolicy({
    PolicyId: parseInt(policyId)
  });
  output(result);
}

// 列出策略版本
async function listPolicyVersions(policyId) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.ListPolicyVersions({
    PolicyId: parseInt(policyId)
  });
  output(result);
}

// 获取策略版本
async function getPolicyVersion(policyId, versionId) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.GetPolicyVersion({
    PolicyId: parseInt(policyId),
    VersionId: parseInt(versionId)
  });
  output(result);
}

// 列出策略关联的实体
async function listEntitiesForPolicy(policyId) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.ListEntitiesForPolicy({
    PolicyId: parseInt(policyId)
  });
  output(result);
}

// ==================== 关联关系 ====================

// 列出用户关联的策略
async function listAttachedUserPolicies(targetUin) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.ListAttachedUserPolicies({
    TargetUin: parseInt(targetUin)
  });
  output(result);
}

// 列出用户所有关联的策略（包括组策略）
async function listAttachedUserAllPolicies(targetUin) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.ListAttachedUserAllPolicies({
    TargetUin: parseInt(targetUin)
  });
  output(result);
}

// 列出角色关联的策略
async function listAttachedRolePolicies(roleId) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.ListAttachedRolePolicies({
    RoleId: roleId
  });
  output(result);
}

// 列出用户组关联的策略
async function listAttachedGroupPolicies(groupId) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.ListAttachedGroupPolicies({
    GroupId: parseInt(groupId)
  });
  output(result);
}

// ==================== 用户组相关 ====================

// 列出用户组
async function listGroups(page = 1, rp = 50) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.ListGroups({
    Page: parseInt(page),
    Rp: parseInt(rp)
  });
  output(result);
}

// 获取用户组详情
async function getGroup(groupId) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.GetGroup({ GroupId: parseInt(groupId) });
  output(result);
}

// 列出用户组中的用户
async function listUsersForGroup(groupId) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.ListUsersForGroup({
    GroupId: parseInt(groupId)
  });
  output(result);
}

// 列出用户所在的用户组
async function listGroupsForUser(uin) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.ListGroupsForUser({
    SubUin: parseInt(uin)
  });
  output(result);
}

// ==================== 密钥相关 ====================

// 列出 API 密钥
async function listAccessKeys(targetUin) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.ListAccessKeys({
    TargetUin: parseInt(targetUin)
  });
  output(result);
}

// ==================== 账号相关 ====================

// 获取账号摘要
async function getAccountSummary() {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.GetAccountSummary({});
  output(result);
}

// 获取用户 AppId
async function getUserAppId() {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.GetUserAppId({});
  output(result);
}

// 获取安全最后使用时间
async function getSecurityLastUsed() {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.GetSecurityLastUsed({});
  output(result);
}

// ==================== 权限边界 ====================

// 获取用户权限边界
async function getUserPermissionBoundary(targetUin) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.GetUserPermissionBoundary({
    TargetUin: parseInt(targetUin)
  });
  output(result);
}

// 获取角色权限边界
async function getRolePermissionBoundary(roleId) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.GetRolePermissionBoundary({
    RoleId: roleId
  });
  output(result);
}

// ==================== SAML/OIDC 相关 ====================

// 列出 SAML 身份提供商
async function listSAMLProviders() {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.ListSAMLProviders({});
  output(result);
}

// 获取 SAML 身份提供商
async function getSAMLProvider(name) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.GetSAMLProvider({ Name: name });
  output(result);
}

// 获取 OIDC 配置
async function describeOIDCConfig() {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.DescribeOIDCConfig({});
  output(result);
}

// 获取用户 OIDC 配置
async function describeUserOIDCConfig() {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.DescribeUserOIDCConfig({});
  output(result);
}

// 获取用户 SAML 配置
async function describeUserSAMLConfig() {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.DescribeUserSAMLConfig({});
  output(result);
}

// ==================== 写操作（需要管理员权限） ====================

// 更新策略（仅限管理员）
async function updatePolicy(policyId, policyDocument) {
  const client = createClient(CamClient, DEFAULT_REGION);
  const result = await client.UpdatePolicy({
    PolicyId: parseInt(policyId),
    PolicyDocument: policyDocument
  });
  output(result);
}

// ==================== 帮助 ====================

function help() {
  console.log(`
腾讯云访问管理 CAM 操作脚本（只读）

用法:
  node cam.js <command> [args...]

用户相关:
  users                              列出所有用户
  collaborators                      列出协作者
  get-user <name>                    获取用户详情
  describe-sub-accounts <uin,uin>    获取子账号信息

角色相关:
  roles                              列出所有角色
  describe-roles                     列出角色（新接口）
  get-role <role-id>                 获取角色详情

策略相关:
  policies [scope] [page] [rp]       列出策略 (All | QCS | Local)
  get-policy <policy-id>             获取策略详情
  policy-versions <policy-id>        列出策略版本
  policy-version <policy-id> <ver>   获取策略版本
  entities-for-policy <policy-id>    列出策略关联的实体

关联关系:
  user-policies <uin>                列出用户关联的策略
  user-all-policies <uin>            列出用户所有策略（含组）
  role-policies <role-id>            列出角色关联的策略
  group-policies <group-id>          列出组关联的策略

用户组相关:
  groups [page] [rp]                 列出用户组
  get-group <group-id>               获取用户组详情
  users-for-group <group-id>         列出组中的用户
  groups-for-user <uin>              列出用户所在的组

密钥相关:
  api-keys <uin>                     列出用户的 API 密钥

账号相关:
  account-summary                    获取账号摘要
  app-id                             获取用户 AppId
  security-last-used                 获取密钥最后使用时间

权限边界:
  user-boundary <uin>                获取用户权限边界
  role-boundary <role-id>            获取角色权限边界

SAML/OIDC:
  saml-providers                     列出 SAML 身份提供商
  saml-provider <name>               获取 SAML 提供商详情
  oidc-config                        获取 OIDC 配置
  user-oidc-config                   获取用户 OIDC 配置
  user-saml-config                   获取用户 SAML 配置

管理员操作:
  update-policy <id> <doc>           更新策略文档

示例:
  node cam.js users
  node cam.js roles
  node cam.js policies Local
  node cam.js get-policy 265462305
  node cam.js user-policies 100038994581
  node cam.js account-summary
`);
}

// 主入口
async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  try {
    switch (cmd) {
      // 用户
      case 'users':
      case 'list-users':
        await listUsers();
        break;
      case 'collaborators':
        await listCollaborators();
        break;
      case 'get-user':
        if (!args[1]) error('请指定用户名', 'MISSING_ARG');
        await getUser(args[1]);
        break;
      case 'describe-sub-accounts':
        if (!args[1]) error('请指定 UIN 列表', 'MISSING_ARG');
        await describeSubAccounts(args[1]);
        break;
        
      // 角色
      case 'roles':
      case 'list-roles':
        await listRoles();
        break;
      case 'describe-roles':
        await describeRoleList();
        break;
      case 'get-role':
        if (!args[1]) error('请指定角色 ID', 'MISSING_ARG');
        await getRole(args[1]);
        break;
        
      // 策略
      case 'policies':
      case 'list-policies':
        await listPolicies(args[1], args[2], args[3]);
        break;
      case 'get-policy':
        if (!args[1]) error('请指定策略 ID', 'MISSING_ARG');
        await getPolicy(args[1]);
        break;
      case 'policy-versions':
      case 'list-policy-versions':
        if (!args[1]) error('请指定策略 ID', 'MISSING_ARG');
        await listPolicyVersions(args[1]);
        break;
      case 'policy-version':
      case 'get-policy-version':
        if (!args[1] || !args[2]) error('请指定策略 ID 和版本 ID', 'MISSING_ARG');
        await getPolicyVersion(args[1], args[2]);
        break;
      case 'entities-for-policy':
        if (!args[1]) error('请指定策略 ID', 'MISSING_ARG');
        await listEntitiesForPolicy(args[1]);
        break;
        
      // 关联关系
      case 'user-policies':
      case 'list-attached-user-policies':
        if (!args[1]) error('请指定用户 UIN', 'MISSING_ARG');
        await listAttachedUserPolicies(args[1]);
        break;
      case 'user-all-policies':
        if (!args[1]) error('请指定用户 UIN', 'MISSING_ARG');
        await listAttachedUserAllPolicies(args[1]);
        break;
      case 'role-policies':
      case 'list-attached-role-policies':
        if (!args[1]) error('请指定角色 ID', 'MISSING_ARG');
        await listAttachedRolePolicies(args[1]);
        break;
      case 'group-policies':
      case 'list-attached-group-policies':
        if (!args[1]) error('请指定组 ID', 'MISSING_ARG');
        await listAttachedGroupPolicies(args[1]);
        break;
        
      // 用户组
      case 'groups':
      case 'list-groups':
        await listGroups(args[1], args[2]);
        break;
      case 'get-group':
        if (!args[1]) error('请指定组 ID', 'MISSING_ARG');
        await getGroup(args[1]);
        break;
      case 'users-for-group':
      case 'list-users-for-group':
        if (!args[1]) error('请指定组 ID', 'MISSING_ARG');
        await listUsersForGroup(args[1]);
        break;
      case 'groups-for-user':
      case 'list-groups-for-user':
        if (!args[1]) error('请指定用户 UIN', 'MISSING_ARG');
        await listGroupsForUser(args[1]);
        break;
        
      // 密钥
      case 'api-keys':
      case 'list-access-keys':
        if (!args[1]) error('请指定用户 UIN', 'MISSING_ARG');
        await listAccessKeys(args[1]);
        break;
        
      // 账号
      case 'account-summary':
        await getAccountSummary();
        break;
      case 'app-id':
        await getUserAppId();
        break;
      case 'security-last-used':
        await getSecurityLastUsed();
        break;
        
      // 权限边界
      case 'user-boundary':
        if (!args[1]) error('请指定用户 UIN', 'MISSING_ARG');
        await getUserPermissionBoundary(args[1]);
        break;
      case 'role-boundary':
        if (!args[1]) error('请指定角色 ID', 'MISSING_ARG');
        await getRolePermissionBoundary(args[1]);
        break;
        
      // SAML/OIDC
      case 'saml-providers':
        await listSAMLProviders();
        break;
      case 'saml-provider':
        if (!args[1]) error('请指定提供商名称', 'MISSING_ARG');
        await getSAMLProvider(args[1]);
        break;
      case 'oidc-config':
        await describeOIDCConfig();
        break;
      case 'user-oidc-config':
        await describeUserOIDCConfig();
        break;
      case 'user-saml-config':
        await describeUserSAMLConfig();
        break;
        
      // 管理员操作
      case 'update-policy':
        if (!args[1] || !args[2]) error('请指定策略 ID 和策略文档', 'MISSING_ARG');
        await updatePolicy(args[1], args[2]);
        break;
        
      case 'help':
      case '--help':
      case '-h':
      default:
        help();
    }
  } catch (err) {
    error(err.message, err.code || 'UNKNOWN');
  }
}

main();
