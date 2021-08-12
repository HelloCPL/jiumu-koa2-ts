/**
 * @description 获取指定角色拥有的所有权限
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Context, Next } from 'koa';
import _ from 'lodash'

// 获取指定角色拥有的所有权限，多个角色用逗号隔开
export const doRolePermissionGetAllPermission = async (ctx: Context, next: Next) => {
  const data = await GetAllPermissionByRoleIds(ctx.params.roleIds)
  throw new Success({ data });
}

interface AllPermissionOptions extends ObjectAny {
  id: string,
  code: string,
  label: string,
  parent_id: string,
  href?: string,
  sort?: number
}

/**
 * 获取指定角色拥有的所有权限，多个角色用逗号隔开，返回数据或[]
*/
export const GetAllPermissionByRoleIds = async (roleIds: string): Promise<AllPermissionOptions[]> => {
  // 先获取关联的所有权限
  const sql: string = `SELECT * FROM roles_permissions WHERE FIND_IN_SET(role_id, ?)`
  let res: any = await query(sql, roleIds)
  let data: AllPermissionOptions[] = []
  if (res && res.length) {
    // 去重
    res = _.uniqBy(res, 'permission_id')
    res = _.map(res, item => item.permission_id)
    const permissionId = _.join(res)
    const sql2: string = `SELECT * FROM permissions WHERE FIND_IN_SET(id, ?)`
    data = <AllPermissionOptions[]>await query(sql2, permissionId)
  }
  return data
}
