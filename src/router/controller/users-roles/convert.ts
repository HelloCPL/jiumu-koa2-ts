/**
 * @description: 用户-角色关联模块中间件
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Message } from '../../../enums'
import { isExist } from '../convert'

/**
 * 新增时 
 * 判断用户是否不存在
 * 判断角色是否不存在
 * 判断用户-角色关联是否已存在
*/
export const doUserRoleAddConvert = async (ctx: Context, next: Next) => {
  //  判断用户是否不存在
  await isExist({
    table: 'users',
    where: [{ key: 'id', value: ctx._params.userId }],
    throwType: false,
    message: Message.unexistUser
  })
  // 判断角色是否不存在
  await isExist({
    table: 'roles',
    where: [{ key: 'id', value: ctx._params.roleId }],
    throwType: false,
    message: Message.unexistRole
  })
  // 判断用户-角色关联是否已存在
  await isExist({
    table: 'users_roles',
    where: [
      { key: 'role_id', value: ctx._params.roleId },
      { key: 'user_id', value: ctx._params.userId },
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
export async function doUserRoleDeleteConvert(ctx: Context, next: Next) {
  // 判断用户-角色关联是否不存在
  await isExist({
    table: 'users_roles',
    where: [{ key: 'id', value: ctx._params.id }],
    throwType: false,
    message: Message.unexistRolePermission
  })
  await next()
}
