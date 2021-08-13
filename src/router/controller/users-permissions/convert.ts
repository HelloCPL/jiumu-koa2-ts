/**
 * @description: 用户-权限关联额外权限模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
*/

import { Context, Next } from 'koa'
import { query } from '../../../db'
import { Message } from '../../../enums'
import { validateRange } from '../../../utils/validator'
import { isExist } from '../convert'

/**
 * 新增时 
 * 先判断用户是否不存在
 * 判断权限是否不存在
 * 判断状态标签是否不存在
 * 判断用户-权限关联是否已存在
*/
export const doUserPermissionAddExist = async (ctx: Context, next: Next) => {
  // 判断用户是否不存在
  await isExist({
    table: 'users',
    where: [{ key: 'id', value: ctx.params.userId }],
    throwType: false,
    message: Message.unexistUser
  })
  // 判断权限是否不存在
  await isExist({
    table: 'permissions',
    where: [{ key: 'id', value: ctx.params.permissionId }],
    throwType: false,
    message: Message.unexistPermission
  })
  // 判断状态标签是否不存在
  await validateRange({
    value: ctx.params.status,
    range: '100',
    message: 'status参数必须为系统标签100下的标签'
  })
  // 判断用户-权限关联是否已存在
  await isExist({
    table: 'users_permissions',
    where: [
      { key: 'permission_id', value: ctx.params.permissionId },
      { key: 'user_id', value: ctx.params.userId },
    ],
    throwType: true,
    message: Message.existUserPermission
  })
  await next()
}

/**
 * 修改时 
 * 先判断用户-权限关联是否不存在
 * 如果传userId，判断用户是否不存在
 * 如果传permissionId，判断权限是否不存在
 * 如果传status，判断是否在指定标签范围
*/
export const doUserPermissionUpdateExist = async (ctx: Context, next: Next) => {
  // 先判断用户-权限关联是否不存在
  await isExist({
    table: 'users_permissions',
    where: [{ key: 'id', value: ctx.params.id }],
    throwType: false,
    message: Message.unexistUserPermission
  })
  // 如果传userId，判断用户是否不存在
  if (ctx.params.userId) {
    await isExist({
      table: 'users',
      where: [{ key: 'id', value: ctx.params.userId }],
      throwType: false,
      message: Message.unexistUser
    })
  }
  // 如果传permissionId，判断权限是否不存在
  if (ctx.params.permissionId) {
    await isExist({
      table: 'permissions',
      where: [{ key: 'id', value: ctx.params.permissionId }],
      throwType: false,
      message: Message.unexistPermission
    })
  }
  //  如果传status，判断是否在指定标签范围
  if (ctx.params.status) {
    await validateRange({
      value: ctx.params.status,
      range: '100',
      message: 'status参数必须为系统标签100下的范围'
    })
  }
  await next()
}

/**
 * 删除时 
 * 判断用户-权限关联是否不存在
*/
export async function doUserPermissionDeleteExist(ctx: Context, next: Next) {
  // 判断用户-权限关联是否不存在
  await isExist({
    table: 'users_permissions',
    where: [{ key: 'id', value: ctx.params.id }],
    throwType: false,
    message: Message.unexistUserPermission
  })
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