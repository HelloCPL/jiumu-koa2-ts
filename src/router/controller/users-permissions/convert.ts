/**
 * @description: 用户-权限关联额外权限模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
*/

import { Context, Next } from 'koa'
import { query } from '../../../db'
import { ExceptionParameter } from '../../../utils/http-exception'
import { Message } from '../../../enums'
import { isExistUser } from '../users/convert'
import { isExistPermission } from '../permissions/convert'
import { isExistTag } from '../tags/convert'

/**
 * 新增时 
 * 先判断用户是否不存在
 * 再判断权限是否不存在
 * 再判断状态标签是否不存在
 * 最后判断用户-权限关联是否已存在
*/
export const doUserPermissionAddExist = async (ctx: Context, next: Next) => {
  const flag1 = await isExistUser(ctx.params.userId, 'id')
  if (!flag1)
    throw new ExceptionParameter({ message: Message.unexistUser })
  const flag2 = await isExistPermission(ctx.params.permissionId)
  if (!flag2)
    throw new ExceptionParameter({ message: Message.unexistPermission })
  const flag3 = await isExistTag(ctx.params.status, 'code')
  if (!flag3)
    throw new ExceptionParameter({ message: Message.unexistTag })
  const flag4 = await isExistUserPermission(ctx.params.userId, ctx.params.permissionId)
  if (flag4)
    throw new ExceptionParameter({ message: Message.existUserPermission })
  await next()
}

/**
 * 修改时 
 * 先判断用户-权限关联是否已存在
 * 如果传userId，判断用户是否存在
 * 如果传permissionId，判断权限是否不存在
 * 如果传status，状态标签是否不存在
*/
export const doUserPermissionUpdateExist = async (ctx: Context, next: Next) => {
  const flag4 = await isExistUserPermissionById(ctx.params.id)
  if (!flag4)
    throw new ExceptionParameter({ message: Message.unexistUserPermission })
  if (ctx.params.userId) {
    const flag1 = await isExistUser(ctx.params.userId, 'id')
    if (!flag1)
      throw new ExceptionParameter({ message: Message.unexistUser })
  }
  if (ctx.params.permissionId) {
    const flag2 = await isExistPermission(ctx.params.permissionId)
    if (!flag2)
      throw new ExceptionParameter({ message: Message.unexistPermission })
  }
  if (ctx.params.status) {
    const flag3 = await isExistTag(ctx.params.status, 'code')
    if (!flag3)
      throw new ExceptionParameter({ message: Message.unexistTag })
  }
  await next()
}


/**
 * 删除时 判断用户-权限关联是否不存在
*/
export async function doUserPermissionDeleteExist(ctx: Context, next: Next) {
  const isExist = await isExistUserPermissionById(ctx.params.id)
  if (!isExist)
    throw new ExceptionParameter({ message: Message.unexistUserPermission })
  await next()
}

// 根据 id 判断用户是否存在
export async function isExistUserPermissionById(id: string): Promise<boolean> {
  const sql = `SELECT id FROM users_permissions WHERE id = ?`
  const res: any = await query(sql, id)
  if (res && res.length) return true
  return false
}

// 根据 userId permissionId 判断用户-权限关联是否存在
export async function isExistUserPermission(userId: string, permissionId: string): Promise<boolean> {
  const sql = `SELECT id FROM users_permissions WHERE user_id = ? AND permission_id = ?`
  const data = [userId, permissionId]
  const res: any = await query(sql, data)
  if (res && res.length) return true
  return false
}