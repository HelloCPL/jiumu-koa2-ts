/**
 * @description: 权限模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
*/

import { Context, Next } from 'koa'
import { Message } from '../../../enums'
import { isExist, isExistHasChildren } from '../convert'
import { ExceptionParameter } from '../../../utils/http-exception';

/**
 * 新增时 
 * code 必须为真
 * 判断权限是否已存在
 * 若 parentCode 为真，判断 parentCode 是否不存在
*/
export const doPermissionAddConvert = async (ctx: Context, next: Next) => {
  // code 必须为真
  if (!ctx.params.code)
    throw new ExceptionParameter({ message: 'code参数值必须为真' })
  // 判断权限是否已存在
  await isExist({
    table: 'permissions',
    where: [{ key: 'code', value: ctx.params.code }],
    throwType: true,
    message: Message.existPermission
  })
  // 若 parentCode 为真，判断 parentCode 是否不存在
  if (ctx.params.hasOwnProperty('parentCode')) {
    await isExist({
      table: 'permissions',
      where: [{ key: 'code', value: ctx.params.parentCode }],
      throwType: false,
      message: Message.unexistPermission
    })
  }
  await next()
}

/**
 * 修改时 
 * 若传 code 其中 code 值必须为真
 * 判断权限是否不存在
 * 若修改 code 再判断 code 除自身外是否存在
 * 若 parentCode 为真，判断 parentCode 是否不存在
*/
export async function doPermissionUpdateConvert(ctx: Context, next: Next) {
  // 若传 code 其中 code 值必须为真
  if (ctx.params.hasOwnProperty('code') && !ctx.params.code)
    throw new ExceptionParameter({ message: 'code参数值必须为真' })
  // 判断权限是否不存在
  await isExist({
    table: 'permissions',
    where: [{ key: 'id', value: ctx.params.id }],
    throwType: false,
    message: Message.unexistPermission
  })
  // 若修改 code 再判断 code 除自身外是否存在
  if (ctx.params.hasOwnProperty('code')) {
    await isExist({
      table: 'permissions',
      where: [
        { key: 'code', value: ctx.params.code },
        { key: 'id', value: ctx.params.id, connector: '!=' },
      ],
      throwType: true,
      message: Message.existPermission
    })
  }
  // 若 parentCode 为真，判断 parentCode 是否不存在
  if (ctx.params.hasOwnProperty('parentCode')) {
    await isExist({
      table: 'permissions',
      where: [{ key: 'code', value: ctx.params.parentCode }],
      throwType: false,
      message: Message.unexistPermission
    })
  }
  await next()
}

/**
 * 删除时 
 * 先判断权限是否不存在
 * 再判断是否有子级
 * 再判断是否有 roles-permissions 角色-权限关联
*/
export async function doPermissionDeleteConvert(ctx: Context, next: Next) {
  // 先判断权限是否不存在
  await isExist({
    table: 'permissions',
    where: [{ key: 'id', value: ctx.params.id }],
    throwType: false,
    message: Message.unexistPermission
  })
  // 再判断是否有子级
  await isExistHasChildren({
    table: 'permissions',
    where: { key: 'id', value: ctx.params.id },
    throwType: true,
    message: Message.relevantHasChildren
  })
  // 再判断是否有 roles-permissions 角色-权限关联
  await isExist({
    table: 'roles_permissions',
    where: [{ key: 'permission_id', value: ctx.params.id }],
    throwType: true,
    message: Message.relevantRolePermission
  })
}
