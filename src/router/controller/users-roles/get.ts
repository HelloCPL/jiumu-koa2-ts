/**
 * @description 获取用户-角色关联数据
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '../../../utils/http-exception'
import { execTrans, query } from '../../../db'
import { Context, Next } from 'koa'
import { RoleReturnOptions, RoleOptions } from '../roles/interface'
import { UserListReturn, UserOptions } from '../users/interface'
import { UserRoleByRoleIdParams, UserRoleByUserIdParams } from './interface'
import { getFileById } from '../files-info/get'

// 获取指定权限关联的所有角色
export const doUserRoleGetAllRoleByUserId = async (ctx: Context, next: Next) => {
  const params: UserRoleByUserIdParams = {
    userId: ctx._params.userId,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
  }
  const data = <RoleReturnOptions>await getAllRoleByUserId(params)
  throw new Success(data)
}

// 获取指定角色关联的所有用户
export const doUserRoleGetAllUserByRoleId = async (ctx: Context, next: Next) => {
  const params: UserRoleByRoleIdParams = {
    roleId: ctx._params.roleId,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
  }
  const data = await getAllUserByRoleId(params)
  throw new Success(data)
}

/**
 * 根据 userId 获取所有关联的角色列表，返回数组或[]
 */
export const getAllRoleByUserId = async (options: UserRoleByUserIdParams): Promise<RoleReturnOptions | RoleOptions[]> => {
  if (options.all) {
    const sql = `SELECT t2.id, t2.code, t2.label, t2.sort, t2.configurable, t2.create_time, t2.update_time, t2.terminal, t2.remarks FROM users_roles t1 LEFT JOIN roles t2 ON t1.role_id = t2.id WHERE t1.user_id = ? ORDER BY t2.sort, t2.update_time DESC`
    const data = [options.userId]
    const res: RoleOptions[] = <RoleOptions[]>await query(sql, data)
    return res
  } else {
    options.pageNo = options.pageNo || 1
    options.pageSize = options.pageSize || 10
    const pageNo = (options.pageNo - 1) * options.pageSize
    const sql1 = `SELECT COUNT(t1.id) AS total FROM users_roles t1 WHERE t1.user_id = ?`
    const sql2 = `SELECT t2.id, t2.code, t2.label, t2.sort, t2.configurable, t2.create_time, t2.update_time, t2.terminal, t2.remarks FROM users_roles t1 LEFT JOIN roles t2 ON t1.role_id = t2.id WHERE t1.user_id = ? ORDER BY t2.sort, t2.update_time DESC LIMIT ?, ?`
    const res: any = await execTrans([
      { sql: sql1, data: [options.userId] },
      { sql: sql2, data: [options.userId, pageNo, options.pageSize] },
    ])
    return {
      total: res[0][0]['total'],
      data: res[1],
    }
  }
}

/**
 * 根据 roleId 获取所有关联的用户列表，返回数据或[]
 */
export const getAllUserByRoleId = async (options: UserRoleByRoleIdParams): Promise<UserListReturn> => {
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  const sql1 = `SELECT COUNT(t1.id) AS total FROM users_roles t1 WHERE t1.role_id = ?`
  const sql2 = `SELECT t2.id, t2.phone, t2.username, t2.sex, t3.label as sex_label, t2.birthday, t2.avatar, t2.professional, t2.address, t2.create_time, t2.update_time, t2.terminal, t2.remarks FROM users_roles t1 LEFT JOIN users t2 ON t1.user_id = t2.id LEFT JOIN tags t3 ON t2.sex = t3.code  WHERE t1.role_id = ? ORDER BY t2.update_time DESC LIMIT ?, ?`
  const res: any = await execTrans([
    { sql: sql1, data: [options.roleId] },
    { sql: sql2, data: [options.roleId, pageNo, options.pageSize] },
  ])
  let userData = <UserOptions[]>res[1]
  for (let i = 0, len = userData.length; i < len; i++) {
    userData[i]['avatar'] = await getFileById(userData[i]['avatar'], userData[i]['id'])
  }
  return {
    total: res[0][0]['total'],
    data: userData,
  }
}
