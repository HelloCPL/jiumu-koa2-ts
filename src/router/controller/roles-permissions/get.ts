/**
 * @description 获取角色-权限关联数据
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { execTrans, query } from '@/db'
import { Context } from 'koa'
import { PermissionReturnOptions, PermissionOptions } from '../permissions/interface'
import { RoleReturnOptions } from '../roles/interface'
import { RolePermissionByRoleIdParams, RolePermissionByPermissionIdParams } from './interface'
import { UserRoleByUserIdParams } from '../users-roles/interface'
import { UserListReturn, UserOptions } from '../users/interface'
import { getFileById } from '../files-info/get'

// 获取指定角色关联的所有权限
export const doRolePermissiongetAllPermissionByRoleId = async (ctx: Context) => {
  const data = await getAllPermissionByRoleId({
    roleId: ctx._params.roleId,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10
  })
  throw new Success(data)
}

// 获取指定权限关联的所有角色
export const doRolePermissionGetAllRoleByPermissionId = async (ctx: Context) => {
  const data = await getAllRoleByPermissionId({
    permissionId: ctx._params.permissionId,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10
  })
  throw new Success(data)
}

// 获取指定用户关联的所有权限
export const doRolePermissiongetAllPermissionByUserId = async (ctx: Context) => {
  const data = <PermissionReturnOptions>await getAllPermissionByUserId({
    userId: ctx._params.userId,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10
  })
  throw new Success(data)
}

// 获取指定权限关联的所有用户
export const doRolePermissionGetAllUserByPermissionId = async (ctx: Context) => {
  const data = await getAllUserByPermissionId({
    permissionId: ctx._params.permissionId,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    simple: ctx._params.simple || '1'
  })
  throw new Success(data)
}

/**
 * 根据 roleId 获取所有关联的权限列表，返回数组或[]
 */
export const getAllPermissionByRoleId = async (
  options: RolePermissionByRoleIdParams
): Promise<PermissionReturnOptions> => {
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  const sql1 = 'SELECT COUNT(t1.id) AS total FROM roles_permissions t1 WHERE t1.role_id = ?'
  const sql2 =
    'SELECT t1.id As relevance_id, t2.id, t2.code, t2.label, t2.href, t2.sort, t2.configurable, t2.create_time, t2.update_time, t2.terminal, t2.remarks FROM roles_permissions t1 LEFT JOIN permissions t2 ON t1.permission_id = t2.id WHERE t1.role_id = ? ORDER BY t2.sort, t2.update_time DESC LIMIT ?, ?'
  const res: any = await execTrans([
    { sql: sql1, data: [options.roleId] },
    { sql: sql2, data: [options.roleId, pageNo, options.pageSize] }
  ])
  return {
    total: res[0][0]['total'],
    data: res[1]
  }
}

/**
 * 根据 permissionId 获取所有关联的角色列表，返回数组或[]
 */
export const getAllRoleByPermissionId = async (
  options: RolePermissionByPermissionIdParams
): Promise<RoleReturnOptions> => {
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  const sql1 = 'SELECT COUNT(t1.id) AS total FROM roles_permissions t1 WHERE t1.permission_id = ?'
  const sql2 =
    'SELECT t1.id As relevance_id, t2.id, t2.code, t2.label, t2.sort, t2.configurable, t2.create_time, t2.update_time, t2.terminal, t2.remarks FROM roles_permissions t1 LEFT JOIN roles t2 ON t1.role_id = t2.id WHERE t1.permission_id = ? ORDER BY t2.sort, t2.update_time DESC LIMIT ?, ?'
  const res: any = await execTrans([
    { sql: sql1, data: [options.permissionId] },
    { sql: sql2, data: [options.permissionId, pageNo, options.pageSize] }
  ])
  return {
    total: res[0][0]['total'],
    data: res[1]
  }
}

/**
 * 根据 userId 获取所有关联的权限列表，返回数组或[]
 */
export const getAllPermissionByUserId = async (
  options: UserRoleByUserIdParams
): Promise<PermissionReturnOptions | PermissionOptions[]> => {
  if (options.all) {
    const sql =
      'SELECT t3.id, t3.code, t3.label, t3.href, t3.sort, t3.configurable, t3.create_time, t3.update_time, t3.terminal, t3.remarks FROM roles_permissions t1 LEFT JOIN permissions t3 ON t1.permission_id = t3.id WHERE t1.role_id IN (SELECT t2.role_id FROM users_roles t2 WHERE t2.user_id = ?) GROUP BY t1.permission_id ORDER BY t3.sort, t3.update_time DESC'
    const data = [options.userId]
    const res: PermissionOptions[] = <PermissionOptions[]>await query(sql, data)
    return res
  } else {
    options.pageNo = options.pageNo || 1
    options.pageSize = options.pageSize || 10
    const pageNo = (options.pageNo - 1) * options.pageSize
    const sql1 =
      'SELECT COUNT(t1.id) AS total FROM roles_permissions t1 WHERE t1.role_id IN (SELECT t2.role_id FROM users_roles t2 WHERE t2.user_id = ?)  GROUP BY t1.permission_id '
    const sql2 =
      'SELECT t3.id, t3.code, t3.label, t3.href, t3.sort, t3.configurable, t3.create_time, t3.update_time, t3.terminal, t3.remarks FROM roles_permissions t1 LEFT JOIN permissions t3 ON t1.permission_id = t3.id WHERE t1.role_id IN (SELECT t2.role_id FROM users_roles t2 WHERE t2.user_id = ?) GROUP BY t1.permission_id ORDER BY t3.sort, t3.update_time DESC LIMIT ?, ?'
    const res: any = await execTrans([
      { sql: sql1, data: [options.userId] },
      { sql: sql2, data: [options.userId, pageNo, options.pageSize] }
    ])
    return {
      total: res[0].length,
      data: res[1]
    }
  }
}

/**
 * 根据 permissionId 获取所有关联的用户列表，返回数组或[]
 */
export const getAllUserByPermissionId = async (
  options: RolePermissionByPermissionIdParams
): Promise<UserListReturn> => {
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  const sql1 =
    'SELECT COUNT(t1.id) AS total FROM users_roles t1 WHERE t1.role_id IN (SELECT t2.role_id FROM roles_permissions t2 WHERE t2.permission_id = ?) GROUP BY t1.user_id'
  let sql2: string
  if (options.simple === '1') {
    sql2 =
      'SELECT t3.id, t3.phone, t3.username, t3.create_time, t3.update_time, t3.terminal FROM users_roles t1 LEFT JOIN users t3 ON t1.user_id = t3.id  WHERE t1.role_id IN (SELECT t2.role_id FROM roles_permissions t2 WHERE t2.permission_id = ?) GROUP BY t1.user_id ORDER BY t3.update_time DESC LIMIT ?, ?'
  } else {
    sql2 =
      'SELECT t3.id, t3.phone, t3.username, t3.sex, t4.label as sex_label, t3.birthday, t3.avatar, t3.professional, t3.address, t3.create_time, t3.update_time, t3.terminal, t3.remarks FROM users_roles t1 LEFT JOIN users t3 ON t1.user_id = t3.id LEFT JOIN tags t4 ON t3.sex = t4.code WHERE t1.role_id IN (SELECT t2.role_id FROM roles_permissions t2 WHERE t2.permission_id = ?) GROUP BY t1.user_id ORDER BY t3.update_time DESC LIMIT ?, ?'
  }
  const res: any = await execTrans([
    { sql: sql1, data: [options.permissionId] },
    { sql: sql2, data: [options.permissionId, pageNo, options.pageSize] }
  ])
  const userData = <UserOptions[]>res[1]
  if (options.simple !== '1')
    for (let i = 0, len = userData.length; i < len; i++) {
      userData[i]['avatar'] = await getFileById({
        id: userData[i]['avatar'],
        userId: userData[i]['id']
      })
    }
  return {
    total: res[0].length,
    data: userData
  }
}
