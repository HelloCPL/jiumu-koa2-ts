/**
 * @description 获取指定用户拥有的所有角色
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Context, Next } from 'koa';
import _ from 'lodash'

// 获取指定用户拥有的所有角色
export const doUserRoleGetAllRole = async (ctx: Context, next: Next) => {
  const data = await GetAllRoleByUserId(ctx.params.userId)
  throw new Success({ data });
}

interface AllRoleOptions extends ObjectAny {
  id: string,
  code: string,
  label: string,
  sort?: number
}

/**
 * 获取指定用户拥有的所有角色，返回数据或[]
*/
export const GetAllRoleByUserId = async (userId: string): Promise<AllRoleOptions[]> => {
  // 先获取关联的所有角色
  const sql: string = `SELECT * FROM users_roles WHERE user_id = ?`
  let res: any = await query(sql, userId)
  let data: AllRoleOptions[] = []
  if (res && res.length) {
    // 去重
    res = _.uniqBy(res, 'role_id')
    res = _.map(res, item => item.role_id)
    const roleIds = _.join(res)
    const sql2: string = `SELECT * FROM roles WHERE FIND_IN_SET(id, ?)`
    data = <AllRoleOptions[]>await query(sql2, roleIds)
  }
  return data
}
