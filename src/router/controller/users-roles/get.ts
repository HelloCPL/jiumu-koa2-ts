/**
 * @description 获取用户-角色关联数据
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { execTrans } from '@/db'
import { Context } from 'koa'
import { RoleReturnOptions, RoleOptions } from '../roles/interface'
import { UserListReturn, UserOptions } from '../users/interface'
import { UserRoleByRoleIdParams, UserRoleByUserIdParams } from './interface'
import { handleUser } from '../roles-menus/utils'

// 获取指定权限关联的所有角色
export const doUserRoleGetAllRoleByUserId = async (ctx: Context) => {
  const params: UserRoleByUserIdParams = {
    userId: ctx._params.userId,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10
  }
  const data = <RoleReturnOptions>await getAllRoleByUserId(params)
  throw new Success(data)
}

// 获取指定角色关联的所有用户
export const doUserRoleGetAllUserByRoleId = async (ctx: Context) => {
  const params: UserRoleByRoleIdParams = {
    roleId: ctx._params.roleId,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    simple: ctx._params.simple || '1'
  }
  const data = await getAllUserByRoleId(params)
  throw new Success(data)
}

/**
 * 根据 userId 获取所有关联的角色列表，返回数组或[]
 */
export const getAllRoleByUserId = async (
  options: UserRoleByUserIdParams
): Promise<RoleReturnOptions | RoleOptions[]> => {
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  const sql1 = `
    SELECT 
      COUNT(t1.id) AS total 
    FROM roles t1 
    WHERE 
      t1.id IN (
        SELECT t3.role_id FROM users_roles t3
        WHERE t3.user_id = ?
      )`
  const sql2 = `
    SELECT 
      t2.id As relevance_id, t1.id, t1.code, t1.label, t1.sort, 
      t1.configurable, t1.create_time, t1.update_time, t1.terminal, t1.remarks 
    FROM roles t1 
    LEFT JOIN users_roles t2 ON (t2.role_id = t1.id AND t2.user_id = ?)
    WHERE 
      t1.id IN (
        SELECT t3.role_id FROM users_roles t3
        WHERE t3.user_id = ?
      )
    ORDER BY t1.sort, t1.update_time DESC 
    LIMIT ?, ?`
  const res: any = await execTrans([
    { sql: sql1, data: [options.userId] },
    { sql: sql2, data: [options.userId, options.userId, pageNo, options.pageSize] }
  ])
  return {
    total: res[0][0]['total'],
    data: res[1]
  }
}

/**
 * 根据 roleId 获取所有关联的用户列表，返回数据或[]
 */
export const getAllUserByRoleId = async (options: UserRoleByRoleIdParams): Promise<UserListReturn> => {
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  const sql1 = `
    SELECT 
      COUNT(t1.id) AS total 
      FROM users t1 
      WHERE 
        t1.id IN (
          SELECT t4.user_id FROM users_roles t4
          WHERE t4.role_id = ?
        )`
  let sql2: string
  if (options.simple === '1') {
    sql2 = `
      SELECT 
        t3.id As relevance_id, t1.id, t1.phone, t1.username, 
        t1.create_time, t1.update_time, t1.terminal 
      FROM users t1 
      LEFT JOIN users_roles t3 ON (t3.user_id = t1.id AND t3.role_id = ?)
      WHERE 
        t1.id IN (
          SELECT t4.user_id FROM users_roles t4
          WHERE t4.role_id = ?
        )
      ORDER BY t1.update_time DESC 
      LIMIT ?, ?`
  } else {
    sql2 = `
      SELECT 
        t3.id As relevance_id, t1.id, t1.phone, t1.username, t1.sex, 
        t2.label as sex_label, t1.birthday, t1.avatar, t1.professional, t1.address, 
        t1.create_time, t1.update_time, t1.terminal, t1.remarks 
      FROM users t1 
      LEFT JOIN tags t2 ON t1.sex = t2.code 
      LEFT JOIN users_roles t3 ON (t3.user_id = t1.id AND t3.role_id = ?)
      WHERE 
        t1.id IN (
          SELECT t4.user_id FROM users_roles t4
          WHERE t4.role_id = ?
        )
      ORDER BY t1.update_time DESC 
      LIMIT ?, ?`
  }
  const res: any = await execTrans([
    { sql: sql1, data: [options.roleId] },
    { sql: sql2, data: [options.roleId, options.roleId, pageNo, options.pageSize] }
  ])
  const userData = <UserOptions[]>res[1]
  await handleUser(userData, options.simple)
  return {
    total: res[0][0]['total'],
    data: userData
  }
}
