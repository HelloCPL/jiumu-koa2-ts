/**
 * @description: 角色模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
*/

import { Context, Next } from 'koa'
import { query } from '../../../db'
import { Message } from '../../../enums'
import { isExist } from '../convert'

/**
 * 新增时 
 * 判断角色是否已存在
*/
export const doRoleAddExist = async (ctx: Context, next: Next) => {
  // 判断角色是否已存在
  await isExist({
    table: 'roles',
    where: [{ key: 'code', value: ctx.params.code }],
    throwType: true,
    message: Message.existRole
  })
  await next()
}

/**
 * 修改时 
 * 判断角色是否不存在
 * 若修改 code 再判断 code 除自身外是否存在
*/
export async function doRoleUpdateNoExist(ctx: Context, next: Next) {
  // 判断角色是否不存在
  await isExist({
    table: 'roles',
    where: [{ key: 'id', value: ctx.params.id }],
    throwType: false,
    message: Message.unexistRole
  })
  // 若修改 code 再判断 code 除自身外是否存在
  if (ctx.params.code) {
    await isExist({
      table: 'roles',
      where: [
        { key: 'code', value: ctx.params.code },
        { key: 'id', value: ctx.params.id, connector: '!=' }
      ],
      throwType: true,
      message: Message.existRole
    })
  }
  await next()
}

/**
 * 删除时 
 * 判断角色是否不存在
 * 再判断是否有 roles-permissions 角色-权限关联
 * 再判断是否有 users-roles 用户-角色关联
*/
export async function doRoleDeleteNoExist(ctx: Context, next: Next) {
  // 判断角色是否不存在
  await isExist({
    table: 'roles',
    where: [{ key: 'id', value: ctx.params.id }],
    throwType: false,
    message: Message.unexistRole
  })
  // 再判断是否有 roles-permissions 角色-权限关联
  await isExist({
    table: 'roles_permissions',
    where: [{ key: 'role_id', value: ctx.params.id }],
    throwType: true,
    message: Message.relevantRolePermission
  })
  // 再判断是否有 users-roles 用户-角色关联
  await isExist({
    table: 'users_roles',
    where: [{ key: 'role_id', value: ctx.params.id }],
    throwType: true,
    message: Message.relevantUserRole
  })
  await next()
}







// 根据 id 判断角色是否存在
export async function isExistRole(value: any, key: string = 'id', table: string = 'roles'): Promise<boolean> {
  const sql = `SELECT id FROM ${table} WHERE ${key} = ?`
  const res: any = await query(sql, value)
  if (res && res.length) return true
  return false
}
