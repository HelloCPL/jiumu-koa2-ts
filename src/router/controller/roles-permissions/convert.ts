/**
 * @description: 角色-权限关联模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
*/

import { Context, Next } from 'koa'
import { Message } from '../../../enums'
import { isExist } from '../convert'

/**
 * 新增时 
 * 先判断角色是否不存在
 * 再判断权限是否不存在
 * 最后判断角色-权限关联是否已存在
*/
export const doRolePermissionAddConvert = async (ctx: Context, next: Next) => {
  // 先判断角色是否不存在
  await isExist({
    table: 'roles',
    where: [{ key: 'id', value: ctx.params.roleId }],
    throwType: false,
    message: Message.unexistRole
  })
  // 再判断权限是否不存在
  await isExist({
    table: 'permissions',
    where: [{ key: 'id', value: ctx.params.permissionId }],
    throwType: false,
    message: Message.unexistPermission
  })
  // 最后判断角色-权限关联是否已存在
  await isExist({
    table: 'roles_permissions',
    where: [
      { key: 'role_id', value: ctx.params.roleId },
      { key: 'permission_id', value: ctx.params.permissionId },
    ],
    throwType: true,
    message: Message.existRolePermission
  })
  await next()
}

/**
 * 删除时 
 * 判断角色-权限关联是否不存在
*/
export async function doRolePermissionDeleteConvert(ctx: Context, next: Next) {
  // 判断角色-权限关联是否不存在
  await isExist({
    table: 'roles_permissions',
    where: [{ key: 'id', value: ctx.params.id }],
    throwType: false,
    message: Message.unexistRolePermission
  })
  await next()
}
