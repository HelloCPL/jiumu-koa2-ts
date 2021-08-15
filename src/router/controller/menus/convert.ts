/**
 * @description: 菜单模块中间件
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
 * 判断菜单是否已存在
 * 若 parentCode 为真，判断 parentCode 是否不存在
*/
export const doMenuAddConvert = async (ctx: Context, next: Next) => {
  // code 必须为真
  if (!ctx.params.code)
    throw new ExceptionParameter({ message: 'code参数值必须为真' })
  // 判断菜单是否已存在
  await isExist({
    table: 'menus',
    where: [{ key: 'code', value: ctx.params.code }],
    throwType: true,
    message: Message.existMenus
  })
  // 若 parentCode 为真，判断 parentCode 是否不存在
  if (ctx.params.parentCode) {
    await isExist({
      table: 'menus',
      where: [{ key: 'code', value: ctx.params.parentCode }],
      throwType: false,
      message: Message.unexistMenus
    })
  }
  await next()
}

/**
 * 修改时 
 * 若传 code 其中 code 值必须为真
 * 判断菜单是否不存在
 * 若修改 code 再判断 code 除自身外是否存在
 * 若 parentCode 为真，判断 parentCode 是否不存在
*/
export async function doMenuUpdateConvert(ctx: Context, next: Next) {
  // 若传 code 其中 code 值必须为真
  if (ctx.params.hasOwnProperty('code') && !ctx.params.code)
    throw new ExceptionParameter({ message: 'code参数值必须为真' })
  // 判断菜单是否不存在
  await isExist({
    table: 'menus',
    where: [{ key: 'id', value: ctx.params.id }],
    throwType: false,
    message: Message.unexistMenus
  })
  // 若修改 code 再判断 code 除自身外是否存在
  if (ctx.params.code) {
    await isExist({
      table: 'menus',
      where: [
        { key: 'code', value: ctx.params.code },
        { key: 'id', value: ctx.params.id, connector: '!=' },
      ],
      throwType: true,
      message: Message.existMenus
    })
  }
  // 若 parentCode 为真，判断 parentCode 是否不存在
  if (ctx.params.parentCode) {
    await isExist({
      table: 'menus',
      where: [{ key: 'code', value: ctx.params.parentCode }],
      throwType: false,
      message: Message.unexistMenus
    })
  }
  await next()
}

/**
 * 删除时 
 * 先判断菜单是否不存在
 * 再判断是否有子级
 * 再判断是否有 roles-menus 角色-菜单关联
*/
export async function doMenuDeleteConvert(ctx: Context, next: Next) {
  // 先判断菜单是否不存在
  await isExist({
    table: 'menus',
    where: [{ key: 'id', value: ctx.params.id }],
    throwType: false,
    message: Message.unexistMenus
  })
  // 再判断是否有子级
  await isExistHasChildren({
    table: 'menus',
    where: { key: 'id', value: ctx.params.id },
    throwType: true,
    message: Message.relevantHasChildren
  })
  // 再判断是否有 roles-menus 角色-菜单关联
  await isExist({
    table: 'roles_menus',
    where: [{ key: 'menu_id', value: ctx.params.id }],
    throwType: true,
    message: Message.relevantRoleMenu
  })
  await next()
}
