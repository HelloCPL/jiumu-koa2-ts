/**
 * @description 获取指定用户拥有的额外权限
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Context, Next } from 'koa';
import _ from 'lodash'
import {PermissionOptions} from '../permissions/interface'

// 获取指定用户拥有的额外权限
export const doUserPermissionGetAllPermission = async (ctx: Context, next: Next) => {
  const data = await GetAllPermissionByUserId(ctx.params.userId)
  throw new Success({ data });
}


/**
 * 获取指定用户拥有的额外权限，返回数据或[]
*/
export const GetAllPermissionByUserId = async (userId: string): Promise<PermissionOptions[]> => {
  // 先获取关联的所有权限
  const sql: string = `SELECT * FROM users_permissions WHERE user_id = ?`
  let res: any = await query(sql, userId)
  let data: PermissionOptions[] = []
  if (res && res.length) {
    // 去重
    // res = _.uniqBy(res, 'permission_id')
    res = _.map(res, item => item.permission_id)
    const permissionId = _.join(res)
    const sql2: string = `SELECT * FROM permissions WHERE FIND_IN_SET(id, ?)`
    data = <PermissionOptions[]>await query(sql2, permissionId)
  }
  return data
}
