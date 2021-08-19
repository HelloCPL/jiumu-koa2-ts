/**
 * @description 获取用户-角色关联数据
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Context, Next } from 'koa';
import _ from 'lodash'
import { RoleOptions } from '../roles/interface'
import { UserOptions } from '../users/interface'
import { UserRoleOptions, UserRoleByRoleIdParams, UserRoleByUserIdParams } from './interface'
import { getFileById } from '../files-info/get'

// 获取指定权限关联的所有角色
export const doUserRoleGetAllRoleByUserId = async (ctx: Context, next: Next) => {
  const data = await getAllRoleByUserId({ userId: ctx.params.userId })
  throw new Success({ data });
}

// 获取指定角色关联的所有用户
export const doUserRoleGetAllUserByRoleId = async (ctx: Context, next: Next) => {
  const data = await getAllUserByRoleId({ roleId: ctx.params.roleId })
  throw new Success({ data });
}


/**
 * 根据 userId/userIds 获取所有关联的角色列表，返回数据或[]
*/
export const getAllRoleByUserId = async (options: UserRoleByUserIdParams): Promise<RoleOptions[]> => {
  let sql = `SELECT * FROM users_roles WHERE `
  let data: any[] = []
  if (options.userId) {
    sql += 'user_id = ?'
    data.push(options.userId)
  } else if (options.userIds) {
    sql += 'FIND_IN_SET(user_id, ?)'
    data.push(options.userIds)
  } else return []
  // 先获取指定用户关联的所有角色
  let res: UserRoleOptions[] = <UserRoleOptions[]>await query(sql, data)
  let targetData: RoleOptions[] = []
  if (res && res.length) {
    // 去重
    res = _.uniqBy(res, 'role_id')
    // 获取关联的角色列表
    const roleIds: string = _.join(_.map(res, item => item.role_id))
    const sql2: string = `SELECT * FROM roles WHERE FIND_IN_SET(id, ?) ORDER BY sort, update_time DESC`
    targetData = <RoleOptions[]>await query(sql2, roleIds)
  }
  return targetData
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
    const sql2: string = `SELECT t1.id, t1.phone, t1.username, t1.sex, t2.label as sexLabel, t1.birthday, t1.avatar, t1.professional, t1.address, t1.create_time, t1.update_time, t1.terminal, t1.remarks FROM users t1 LEFT JOIN tags t2 ON t1.sex = t2.code  WHERE FIND_IN_SET(t1.id, ?) ORDER BY t1.update_time DESC`
    targetData = <UserOptions[]>await query(sql2, userIds)
    for (let i = 0, len = targetData.length; i < len; i++) {
      targetData[i]['avatar'] = await getFileById(targetData[i]['avatar'], targetData[i]['id'])
    }
  }
  return targetData
}