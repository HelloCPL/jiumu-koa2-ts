/**
 * @description: 角色-权限关联模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
*/

import { Context, Next } from 'koa'
import { query } from '../../../db'
import { ExceptionParameter } from '../../../utils/http-exception'
import { Message } from '../../../enums'
import { isExistRole } from '../roles/convert'
import { isExistPermission } from '../permissions/convert'

/**
 * 新增时 
 * 先判断角色是否不存在
 * 再判断权限是否不存在
 * 最后判断角色-权限关联是否已存在
*/
export const doRolePermissionAddExist = async (ctx: Context, next: Next) => {
  const flag1 = await isExistRole(ctx.params.roleId)
  if (!flag1)
    throw new ExceptionParameter({ message: Message.unexistRole })
  const flag2 = await isExistPermission(ctx.params.permissionId)
  if (!flag2)
    throw new ExceptionParameter({ message: Message.unexistPermission })
  const flag3 = await isExistRolePermission(ctx.params.roleId, ctx.params.permissionId)
  if (flag3)
    throw new ExceptionParameter({ message: Message.existRolePermission })
  await next()
}

/**
 * 删除时 判断角色-权限关联是否不存在
*/
export async function doRolePermissionDeleteExist(ctx: Context, next: Next) {
  const isExist = await isExistRolePermissionById(ctx.params.id)
  if (!isExist)
    throw new ExceptionParameter({ message: Message.unexistRolePermission })
  await next()
}


// 根据 id 判断角色是否存在
export async function isExistRolePermissionById(id: string): Promise<boolean> {
  const sql = `SELECT id FROM roles_permissions WHERE id = ?`
  const res: any = await query(sql, id)
  if (res && res.length) return true
  return false
}

// 根据 roleId permissionId 判断角色-权限关联是否存在
export async function isExistRolePermission(roleId: string, permissionId: string): Promise<boolean> {
  const sql = `SELECT id FROM roles_permissions WHERE role_id = ? AND permission_id = ?`
  const data = [roleId, permissionId]
  const res: any = await query(sql, data)
  if (res && res.length) return true
  return false
}