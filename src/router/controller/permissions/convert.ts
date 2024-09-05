/**
 * @description: 权限模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
 */

import { Context, Next } from 'koa'
import { Message } from '@/enums'
import { isExist, isSuper } from '../convert'
import { ExceptionForbidden, ExceptionParameter } from '@/utils/http-exception'
import { query } from '@/db'

/**
 * 新增时
 * 判断权限是否已存在
 * 若 parentCode 为真，判断 parentCode 是否不存在
 */
export const doPermissionAddConvert = async (ctx: Context, next: Next) => {
  // 判断权限是否已存在
  await isExist({
    table: 'permissions',
    where: [{ key: 'code', value: ctx._params.code }],
    throwType: true,
    message: Message.existPermission
  })
  // 若 parentCode 为真，判断 parentCode 是否不存在
  if (ctx._params.hasOwnProperty('parentCode')) {
    await isExist({
      table: 'permissions',
      where: [{ key: 'code', value: ctx._params.parentCode }],
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
 * 判断当前权限对象是否允许修改
 * 若修改 code 再判断 code 除自身外是否存在
 * 若 parentCode 为真，判断 parentCode 是否不存在
 */
export async function doPermissionUpdateConvert(ctx: Context, next: Next) {
  // 若传 code 其中 code 值必须为真
  if (ctx._params.hasOwnProperty('code') && !ctx._params.code)
    throw new ExceptionParameter({ message: 'code参数值必须为真' })
  // 判断权限是否不存在
  const sql = 'SELECT code, configurable FROM permissions WHERE id = ?'
  let res: any = await query(sql, ctx._params.id)
  if (!(res && res.length)) throw new ExceptionParameter({ message: Message.unexistPermission })
  res = res[0]
  // 判断当前权限对象是否允许修改
  if (res.configurable === '1') {
    const isS = await isSuper(ctx._user.id)
    if (!isS) throw new ExceptionForbidden()
  }
  // 若修改 code 再判断 code 除自身外是否存在
  if (ctx._params.hasOwnProperty('code')) {
    await isExist({
      table: 'permissions',
      where: [
        { key: 'code', value: ctx._params.code },
        { key: 'id', value: ctx._params.id, connector: '!=' }
      ],
      throwType: true,
      message: Message.existPermission
    })
  }
  // 若 parentCode 为真，判断 parentCode 是否不存在
  if (ctx._params.hasOwnProperty('parentCode')) {
    await isExist({
      table: 'permissions',
      where: [{ key: 'code', value: ctx._params.parentCode }],
      throwType: false,
      message: Message.unexistPermission
    })
  }
  await next()
}

/**
 * 删除时
 * 先判断权限是否不存在
 * 判断当前权限对象是否允许删除
 * 再判断是否有 roles-permissions 角色-权限关联
 */
export async function doPermissionDeleteConvert(ctx: Context, next: Next) {
  // 先判断权限是否不存在
  const sql = 'SELECT code, configurable FROM permissions WHERE id = ?'
  let res: any = await query(sql, ctx._params.id)
  if (!(res && res.length)) throw new ExceptionParameter({ message: Message.unexistPermission })
  res = res[0]
  // 判断当前权限对象是否允许删除
  if (res.configurable === '1') {
    const isS = await isSuper(ctx._user.id)
    if (!isS) throw new ExceptionForbidden()
  }
  // 再判断是否有 roles-permissions 角色-权限关联
  await isExist({
    table: 'roles_permissions',
    where: [{ key: 'permission_id', value: ctx._params.id }],
    throwType: true,
    message: Message.relevantRolePermission
  })
  await next()
}
