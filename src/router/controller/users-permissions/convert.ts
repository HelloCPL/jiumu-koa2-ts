/**
 * @description: 用户-权限关联额外权限模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
*/

import { Context, Next } from 'koa'
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
export const doUserPermissionAddConvert = async (ctx: Context, next: Next) => {
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
    message: 'status参数必须为系统标签100范围'
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
export const doUserPermissionUpdateConvert = async (ctx: Context, next: Next) => {
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
      message: 'status参数必须为系统标签100范围'
    })
  }
  await next()
}

/**
 * 删除时 
 * 判断用户-权限关联是否不存在
*/
export async function doUserPermissionDeleteConvert(ctx: Context, next: Next) {
  // 判断用户-权限关联是否不存在
  await isExist({
    table: 'users_permissions',
    where: [{ key: 'id', value: ctx.params.id }],
    throwType: false,
    message: Message.unexistUserPermission
  })
  await next()
}
