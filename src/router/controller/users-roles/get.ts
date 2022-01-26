/**
 * @description 获取用户-角色关联数据
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query, execTrans } from "../../../db";
import { Context, Next } from 'koa';
import _ from 'lodash'
import { RoleOptions, RoleReturnOptions } from '../roles/interface'
import { UserOptions } from '../users/interface'
import { UserRoleOptions, UserRoleByRoleIdParams, UserRoleByUserIdParams } from './interface'
import { getFileById } from '../files-info/get'

// 获取指定权限关联的所有角色
export const doUserRoleGetAllRoleByUserId = async (ctx: Context, next: Next) => {
  const params: UserRoleByUserIdParams = {
    userId: ctx.params.userId,
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
  }
  const data = await getAllRoleByUserId(params)
  throw new Success(data);
}

// 获取指定角色关联的所有用户
export const doUserRoleGetAllUserByRoleId = async (ctx: Context, next: Next) => {
  const params: UserRoleByRoleIdParams = {
    roleId: ctx.params.roleId,
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
  }
  const data = await getAllUserByRoleId(params)
  throw new Success({ data });
}


/**
 * 根据 userId/userIds 获取所有关联的角色列表，返回数据或[]
*/
export const getAllRoleByUserId = async (options: UserRoleByUserIdParams): Promise<RoleReturnOptions> => {
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  let whereSQL = ''
  let whereData = []
  if (options.userId) {
    whereSQL= 't1.user_id = ?'
    whereData.push(options.userId)
  } else if (options.userIds) {
    whereSQL= 'FIND_IN_SET(t1.user_id, ?)'
    whereData.push(options.userIds)
  }
  const sql1 = `SELECT COUNT(t1.id) AS total FROM users_roles t1 WHERE ${whereSQL}`
  const sql2 = `SELECT t2.id, t2.code, t2.label, t2.sort, t2.create_time, t2.update_time, t2.terminal, t2.remarks FROM users_roles t1 LEFT JOIN roles t2 ON t1.role_id = t2.id WHERE ${whereSQL} LIMIT ?, ?`

  const res:any = await execTrans([
    {sql: sql1, data: [...whereData]},
    {sql: sql2, data: [...whereData, pageNo, options.pageSize]}
  ])
  return {
    total: res[0][0]['total'],
    data: res[1]
  }
}

/**
 * 根据 roleId/roleIds 获取所有关联的用户列表，返回数据或[]
*/
export const getAllUserByRoleId = async (options: UserRoleByRoleIdParams): Promise<UserOptions[]> => {
  let sql = `SELECT * FROM users_roles WHERE `
  let data: any[] = []
  if (options.roleId) {
    sql += 'role_id = ?'
    data.push(options.roleId)
  } else if (options.roleIds) {
    sql += 'FIND_IN_SET(role_id, ?)'
    data.push(options.roleIds)
  } else return []
  // 先获取指定角色关联的所有用户
  let res: UserRoleOptions[] = <UserRoleOptions[]>await query(sql, data)
  let targetData: UserOptions[] = []
  if (res && res.length) {
    // 去重
    res = _.uniqBy(res, 'user_id')
    // 获取关联的用户列表
    const userIds: string = _.join(_.map(res, item => item.user_id))
    const sql2: string = `SELECT t1.id, t1.phone, t1.username, t1.sex, t2.label AS sexLabel, t1.birthday, t1.avatar, t1.professional, t1.address, t1.create_time, t1.update_time, t1.terminal, t1.remarks FROM users t1 LEFT JOIN tags t2 ON t1.sex = t2.code  WHERE FIND_IN_SET(t1.id, ?) ORDER BY t1.update_time DESC`
    targetData = <UserOptions[]>await query(sql2, userIds)
    for (let i = 0, len = targetData.length; i < len; i++) {
      targetData[i]['avatar'] = await getFileById(targetData[i]['avatar'], targetData[i]['id'])
    }
  }
  return targetData
}
