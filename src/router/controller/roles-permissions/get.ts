/**
 * @description 获取角色-权限关联数据
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { execTrans } from '@/db'
import { Context } from 'koa'
import { PermissionReturnOptions, PermissionOptions } from '../permissions/interface'
import { RoleReturnOptions } from '../roles/interface'
import { RolePermissionByRoleIdParams, RolePermissionByPermissionIdParams } from './interface'
import { UserRoleByUserIdParams } from '../users-roles/interface'
import { UserListReturn, UserOptions } from '../users/interface'
import { handleUser } from '../roles-menus/utils'

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
  const sql1 = `
    SELECT 
      COUNT(t1.id) AS total 
    FROM permissions t1 
    WHERE 
      t1.id IN (
        SELECT t3.permission_id FROM roles_permissions t3 WHERE t3.role_id = ?
      ) `
  const sql2 = `
    SELECT 
      t2.id As relevance_id, t1.id, t1.code, t1.label, t1.href, t1.sort, 
      t1.configurable, t1.create_time, t1.update_time, t1.terminal, t1.remarks 
    FROM permissions t1 
    LEFT JOIN roles_permissions t2 ON (t2.permission_id = t1.id AND t2.role_id = ?)
    WHERE 
      t1.id IN (
        SELECT t3.permission_id FROM roles_permissions t3 WHERE t3.role_id = ?
      ) 
    ORDER BY t1.sort, t1.update_time DESC 
    LIMIT ?, ?`
  const res: any = await execTrans([
    { sql: sql1, data: [options.roleId] },
    { sql: sql2, data: [options.roleId, options.roleId, pageNo, options.pageSize] }
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
  const sql1 = `
    SELECT 
      COUNT(t1.id) AS total 
    FROM roles t1 
    WHERE 
      t1.id IN (
        SELECT t3.role_id FROM roles_permissions t3 WHERE t3.permission_id = ?
      )`
  const sql2 = `
    SELECT 
      t2.id As relevance_id, t1.id, t1.code, t1.label, t1.sort, 
      t1.configurable, t1.create_time, t1.update_time, t1.terminal, t1.remarks 
    FROM roles t1 
    LEFT JOIN roles_permissions t2 ON (t2.role_id = t1.id AND t2.permission_id = ?)
    WHERE 
      t1.id IN (
        SELECT t3.role_id FROM roles_permissions t3 WHERE t3.permission_id = ?
      )
    ORDER BY t1.sort, t1.update_time DESC 
    LIMIT ?, ?`
  const res: any = await execTrans([
    { sql: sql1, data: [options.permissionId] },
    { sql: sql2, data: [options.permissionId, options.permissionId, pageNo, options.pageSize] }
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
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  const sql1 = `
    SELECT 
      COUNT(t1.id) AS total 
    FROM permissions t1 
    WHERE 
      t1.id IN (
        SELECT t2.permission_id FROM roles_permissions t2 
        WHERE t2.role_id IN (
          SELECT t3.role_id FROM users_roles t3 
          WHERE t3.user_id = ?
        )
      )`
  const sql2 = `
    SELECT 
      t1.id, t1.code, t1.label, t1.href, t1.sort, t1.configurable, 
      t1.create_time, t1.update_time, t1.terminal, t1.remarks 
    FROM permissions t1 
    WHERE 
      t1.id IN (
        SELECT t2.permission_id FROM roles_permissions t2 
        WHERE t2.role_id IN (
          SELECT t3.role_id FROM users_roles t3 
          WHERE t3.user_id = ?
        )
      ) 
    ORDER BY t1.sort, t1.update_time DESC 
    LIMIT ?, ?`
  const res: any = await execTrans([
    { sql: sql1, data: [options.userId] },
    { sql: sql2, data: [options.userId, pageNo, options.pageSize] }
  ])
  return {
    total: res[0][0]['total'],
    data: res[1]
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
  const sql1 = `
    SELECT 
      COUNT(t1.id) AS total 
    FROM users t1 
    WHERE 
      t1.id IN (
        SELECT t3.user_id FROM users_roles t3 
        WHERE t3.role_id IN (
          SELECT t4.role_id FROM roles_permissions t4
          WHERE t4.permission_id = ?
        )
      )`
  let sql2: string
  if (options.simple === '1') {
    sql2 = `
      SELECT 
        t1.id, t1.phone, t1.username, t1.create_time, t1.update_time, t1.terminal
      FROM users t1 
      WHERE 
        t1.id IN (
          SELECT t3.user_id FROM users_roles t3 
          WHERE t3.role_id IN (
            SELECT t4.role_id FROM roles_permissions t4
            WHERE t4.permission_id = ?
          )
        )
      ORDER BY t1.update_time DESC 
      LIMIT ?, ?`
  } else {
    sql2 = `
      SELECT 
        t1.id, t1.phone, t1.username, t1.sex, t2.label as sex_label, 
        t1.birthday, t1.avatar, t1.professional, t1.address, 
        t1.create_time, t1.update_time, t1.terminal, t1.remarks 
      FROM users t1 
      LEFT JOIN tags t2 ON t1.sex = t2.code 
      WHERE 
        t1.id IN (
          SELECT t3.user_id FROM users_roles t3 
          WHERE t3.role_id IN (
            SELECT t4.role_id FROM roles_permissions t4
            WHERE t4.permission_id = ?
          )
        )
      ORDER BY t1.update_time DESC 
      LIMIT ?, ?`
  }
  const res: any = await execTrans([
    { sql: sql1, data: [options.permissionId] },
    { sql: sql2, data: [options.permissionId, pageNo, options.pageSize] }
  ])
  const userData = <UserOptions[]>res[1]
  await handleUser(userData, options.simple)
  return {
    total: res[0][0]['total'],
    data: userData
  }
}
