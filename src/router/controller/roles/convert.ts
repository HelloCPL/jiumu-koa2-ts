/**
 * @description: 角色模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
*/

import { Context, Next } from 'koa'
import { Message } from '../../../enums'
import { isExist } from '../convert'

/**
 * 新增时 
 * 判断角色是否已存在
*/
export const doRoleAddConvert = async (ctx: Context, next: Next) => {
  // 判断角色是否已存在
  await isExist({
    table: 'roles',
    where: [{ key: 'code', value: ctx._params.code }],
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
export async function doRoleUpdateConvert(ctx: Context, next: Next) {
  // 判断角色是否不存在
  await isExist({
    table: 'roles',
    where: [{ key: 'id', value: ctx._params.id }],
    throwType: false,
    message: Message.unexistRole
  })
  // 若修改 code 再判断 code 除自身外是否存在
  if (ctx._params.hasOwnProperty('code')) {
    await isExist({
      table: 'roles',
      where: [
        { key: 'code', value: ctx._params.code },
        { key: 'id', value: ctx._params.id, connector: '!=' }
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
 * 再判断是否有 roles-menus 角色-菜单关联
*/
export async function doRoleDeleteConvert(ctx: Context, next: Next) {
  // 判断角色是否不存在
  await isExist({
    table: 'roles',
    where: [{ key: 'id', value: ctx._params.id }],
    throwType: false,
    message: Message.unexistRole
  })
  // 再判断是否有 roles-permissions 角色-权限关联
  await isExist({
    table: 'roles_permissions',
    where: [{ key: 'role_id', value: ctx._params.id }],
    throwType: true,
    message: Message.relevantRolePermission
  })
  // 再判断是否有 users-roles 用户-角色关联
  await isExist({
    table: 'users_roles',
    where: [{ key: 'role_id', value: ctx._params.id }],
    throwType: true,
    message: Message.relevantUserRole
  })
  // 再判断是否有 users-roles 用户-角色关联
  await isExist({
    table: 'roles_menus',
    where: [{ key: 'role_id', value: ctx._params.id }],
    throwType: true,
    message: Message.relevantRoleMenu
  })
  await next()
}
