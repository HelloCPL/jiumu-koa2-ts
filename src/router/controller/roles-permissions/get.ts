/**
 * @description 获取角色-权限关联数据
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '../../../utils/http-exception'
import { execTrans, query } from '../../../db'
import { Context, Next } from 'koa'
import _ from 'lodash'
import { PermissionOptions, PermissionReturnOptions } from '../permissions/interface'
import { RoleOptions, RoleReturnOptions } from '../roles/interface'
import { RolePermissionOptions, RolePermissionByRoleIdParams, RolePermissionByPermissionIdParams } from './interface'
import { getAllRoleByUserId, getAllUserByRoleId } from '../users-roles/get'
import { UserRoleByUserIdParams } from '../users-roles/interface'
import { UserListReturn, UserOptions } from '../users/interface'
import { getFileById } from '../files-info/get'

// 获取指定角色关联的所有权限
export const doRolePermissiongetAllPermissionByRoleId = async (ctx: Context, next: Next) => {
  const data = await getAllPermissionByRoleId({
    roleId: ctx.params.roleId,
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
  })
  throw new Success(data)
}

// 获取指定权限关联的所有角色
export const doRolePermissionGetAllRoleByPermissionId = async (ctx: Context, next: Next) => {
  const data = await getAllRoleByPermissionId({
    permissionId: ctx.params.permissionId,
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
  })
  throw new Success(data)
}

// 获取指定用户关联的所有权限
export const doRolePermissiongetAllPermissionByUserId = async (ctx: Context, next: Next) => {
  // const userList = await getAllRoleByUserId({ userId: ctx.params.userId })
  // const roleIds = _.join(_.map(userList.data, (item) => item.id))
  const data = await getAllPermissionByUserId({
    userId: ctx.params.userId,
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
  })
  throw new Success(data)
}

// 获取指定权限关联的所有用户
export const doRolePermissionGetAllUserByPermissionId = async (ctx: Context, next: Next) => {
  const data = await getAllUserByPermissionId({
    permissionId: ctx.params.permissionId,
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
  })
  throw new Success(data)
}

/**
 * 根据 roleId/roleIds 获取所有关联的权限列表，返回数组或[]
 */
export const getAllPermissionByRoleId = async (
  options: RolePermissionByRoleIdParams
): Promise<PermissionReturnOptions> => {
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  let whereSQL = ''
  let whereData: any[] = []
  if (options.roleId) {
    whereSQL = 't1.role_id = ?'
    whereData.push(options.roleId)
  } else if (options.roleIds) {
    whereSQL = 'FIND_IN_SET(t1.role_id, ?)'
    whereData.push(options.roleIds)
  }
  const sql1 = `SELECT COUNT(t1.id) AS total FROM roles_permissions t1 WHERE ${whereSQL}`
  const sql2 = `SELECT t2.id, t2.code, t2.label, t2.href, t2.sort, t2.create_time, t2.update_time, t2.terminal, t2.remarks FROM roles_permissions t1 LEFT JOIN permissions t2 ON t1.permission_id = t2.id WHERE ${whereSQL} ORDER BY t2.sort, t2.update_time DESC LIMIT ?, ?`
  const res: any = await execTrans([
    { sql: sql1, data: [...whereData] },
    { sql: sql2, data: [...whereData, pageNo, options.pageSize] },
  ])
  return {
    total: res[0][0]['total'],
    data: res[1],
  }
}

/**
 * 根据 permissionId/permissionIds 获取所有关联的角色列表，返回数组或[]
 */
export const getAllRoleByPermissionId = async (
  options: RolePermissionByPermissionIdParams
): Promise<RoleReturnOptions> => {
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  let whereSQL = ''
  let whereData: any[] = []
  if (options.permissionId) {
    whereSQL = 't1.permission_id = ?'
    whereData.push(options.permissionId)
  } else if (options.permissionIds) {
    whereSQL = 'FIND_IN_SET(t1.permission_id, ?)'
    whereData.push(options.permissionIds)
  }
  const sql1 = `SELECT COUNT(t1.id) AS total FROM roles_permissions t1 WHERE ${whereSQL}`
  const sql2 = `SELECT t2.id, t2.code, t2.label, t2.sort, t2.create_time, t2.update_time, t2.terminal, t2.remarks FROM roles_permissions t1 LEFT JOIN roles t2 ON t1.role_id = t2.id WHERE ${whereSQL} ORDER BY t2.sort, t2.update_time DESC LIMIT ?, ?`
  const res: any = await execTrans([
    { sql: sql1, data: [...whereData] },
    { sql: sql2, data: [...whereData, pageNo, options.pageSize] },
  ])
  return {
    total: res[0][0]['total'],
    data: res[1],
  }
}

/**
 * 根据 userId/userIds 获取所有关联的权限列表，返回数组或[]
 */
export const getAllPermissionByUserId = async (options: UserRoleByUserIdParams): Promise<PermissionReturnOptions> => {
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  let whereSQL = ''
  let whereData: any[] = []
  if (options.userId) {
    whereSQL = 't2.user_id = ?'
    whereData.push(options.userId)
  } else if (options.userIds) {
    whereSQL = 'FIND_IN_SET(t2.user_id, ?)'
    whereData.push(options.userIds)
  }
  const sql1 = `SELECT COUNT(t1.id) AS total FROM roles_permissions t1 WHERE t1.role_id IN (SELECT t2.role_id FROM users_roles t2 WHERE ${whereSQL})  GROUP BY t1.permission_id `
  const sql2 = `SELECT t3.id, t3.code, t3.label, t3.href, t3.sort, t3.create_time, t3.update_time, t3.terminal, t3.remarks FROM roles_permissions t1 LEFT JOIN permissions t3 ON t1.permission_id = t3.id WHERE t1.role_id IN (SELECT t2.role_id FROM users_roles t2 WHERE ${whereSQL}) GROUP BY t1.permission_id ORDER BY t3.sort, t3.update_time DESC LIMIT ?, ?`
  const res: any = await execTrans([
    { sql: sql1, data: [...whereData] },
    { sql: sql2, data: [...whereData, pageNo, options.pageSize] },
  ])
  return {
    total: res[0].length,
    data: res[1],
  }
}

/**
 * 根据 permissionId/permissionIds 获取所有关联的用户列表，返回数组或[]
 */
export const getAllUserByPermissionId = async (
  options: RolePermissionByPermissionIdParams
): Promise<UserListReturn> => {
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  let whereSQL = ''
  let whereData: any[] = []
  if (options.permissionId) {
    whereSQL = 't2.permission_id = ?'
    whereData.push(options.permissionId)
  } else if (options.permissionIds) {
    whereSQL = 'FIND_IN_SET(t2.permission_id, ?)'
    whereData.push(options.permissionIds)
  }
  const sql1 = `SELECT COUNT(t1.id) AS total FROM users_roles t1 WHERE t1.role_id IN (SELECT t2.role_id FROM roles_permissions t2 WHERE ${whereSQL}) GROUP BY t1.user_id`
  const sql2 = `SELECT t3.id, t3.phone, t3.username, t3.sex, t4.label as sex_label, t3.birthday, t3.avatar, t3.professional, t3.address, t3.create_time, t3.update_time, t3.terminal, t3.remarks FROM users_roles t1 LEFT JOIN users t3 ON t1.user_id = t3.id LEFT JOIN tags t4 ON t3.sex = t4.code WHERE t1.role_id IN (SELECT t2.role_id FROM roles_permissions t2 WHERE ${whereSQL}) GROUP BY t1.user_id ORDER BY t3.update_time DESC LIMIT ?, ?`
  const res: any = await execTrans([
    { sql: sql1, data: [...whereData] },
    { sql: sql2, data: [...whereData, pageNo, options.pageSize] },
  ])
  let userData = <UserOptions[]>res[1]
  for (let i = 0, len = userData.length; i < len; i++) {
    userData[i]['avatar'] = await getFileById(userData[i]['avatar'], userData[i]['id'])
  }
  return {
    total: res[0].length,
    data: userData,
  }
}
