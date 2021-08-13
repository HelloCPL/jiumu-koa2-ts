/**
 * @description: 用户-角色关联模块中间件
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { query } from '../../../db'
import { Message } from '../../../enums'
import { isExist } from '../convert'

/**
 * 新增时 
 * 判断用户是否不存在
 * 判断角色是否不存在
 * 判断用户-角色关联是否已存在
*/
export const doUserRoleAddExist = async (ctx: Context, next: Next) => {
  //  判断用户是否不存在
  await isExist({
    table: 'users',
    where: [{ key: 'id', value: ctx.params.userId }],
    throwType: false,
    message: Message.unexistUser
  })
  // 判断角色是否不存在
  await isExist({
    table: 'roles',
    where: [{ key: 'id', value: ctx.params.roleId }],
    throwType: false,
    message: Message.unexistRole
  })
  // 判断用户-角色关联是否已存在
  await isExist({
    table: 'users_roles',
    where: [
      { key: 'role_id', value: ctx.params.roleId },
      { key: 'user_id', value: ctx.params.userId },
    ],
    throwType: true,
    message: Message.unexistUserRole
  })
  await next()
}

/**
 * 删除时 
 * 判断用户-角色关联是否不存在
*/
export async function doUserRoleDeleteExist(ctx: Context, next: Next) {
  // 判断用户-角色关联是否不存在
  await isExist({
    table: 'users_roles',
    where: [{ key: 'id', value: ctx.params.id }],
    throwType: false,
    message: Message.unexistRolePermission
  })
  await next()
}










// 根据 id 判断用户-角色关联是否存在
export async function isExistUserRoleById(id: string): Promise<boolean> {
  const sql = `SELECT id FROM users_roles WHERE id = ?`
  const res: any = await query(sql, id)
  if (res && res.length) return true
  return false
}

// 根据 roleId userId 判断用户-角色关联是否存在
export async function isExistUserRole(roleId: string, userId: string): Promise<boolean> {
  const sql = `SELECT id FROM users_roles WHERE role_id = ? AND user_id = ?`
  const data = [roleId, userId]
  const res: any = await query(sql, data)
  if (res && res.length) return true
  return false
}


