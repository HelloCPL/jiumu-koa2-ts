/**
 * @description 标签模块中间件
 * @author chen
 * @update 2021-08-07 15:12:57
 */

import { Context, Next } from 'koa'
import { Message } from '@/enums'
import { isExist, isExistHasChildren, isSuper } from '../convert'
import { getTagByCode } from './get'
import { TagOptions } from './interface'
import { ExceptionForbidden, ExceptionParameter } from '@/utils/http-exception'
import { query } from '@/db'

/**
 * 新增时
 * 判断标签是否已存在
 * 若 parentCode 为真，再判断 parentCode 是否不存在
 */
export const doTagAddConvert = async (ctx: Context, next: Next) => {
  //  判断标签是否已存在
  await isExist({
    table: 'tags',
    where: [{ key: 'code', value: ctx._params.code }],
    throwType: true,
    message: Message.existTag
  })
  // 若 parentCode 为真，再判断 parentCode 是否不存在
  if (ctx._params.parentCode) {
    await isExist({
      table: 'tags',
      where: [{ key: 'code', value: ctx._params.parentCode }],
      throwType: false,
      message: Message.unexistTag
    })
  }
  await next()
}

/**
 * 修改时
 * 若传 code 其中 code 值必须为真
 * 判断标签是否不存在
 * 判断是否拥可修改
 * 判断是否仅管理员可修改
 * 若修改 code 判断 code 除自身外是否存在
 * 若 parentCode 为真，判断 parentCode 是否不存在
 */
export async function doTagUpdateConvert(ctx: Context, next: Next) {
  // 若传 code 其中 code 值必须为真
  if (ctx._params.hasOwnProperty('code') && !ctx._params.code)
    throw new ExceptionParameter({ message: 'code参数值必须为真' })
  // 判断标签是否不存在
  const sql = 'SELECT code, configurable FROM tags WHERE id = ?'
  let res: any = await query(sql, ctx._params.id)
  if (!(res && res.length)) throw new ExceptionParameter({ message: Message.unexistTag })
  res = res[0]
  // 判断是否拥可修改
  if (res.configurable === '-1') {
    throw new ExceptionForbidden({ message: Message.forbiddenEdit })
  }
  // 判断是否仅管理员可修改
  if (res.configurable === '1') {
    const isS = await isSuper(ctx._user.id)
    if (!isS) throw new ExceptionForbidden({ message: Message.forbiddenSuper })
  }
  // 若修改 code 判断 code 除自身外是否存在
  if (ctx._params.hasOwnProperty('code')) {
    await isExist({
      table: 'tags',
      where: [
        { key: 'code', value: ctx._params.code },
        { key: 'id', value: ctx._params.id, connector: '!=' }
      ],
      throwType: true,
      message: Message.existTag
    })
  }
  // 若 parentCode 为真，判断 parentCode 是否不存在
  if (ctx._params.parentCode) {
    await isExist({
      table: 'tags',
      where: [{ key: 'code', value: ctx._params.parentCode }],
      throwType: false,
      message: Message.unexistTag
    })
  }
  await next()
}

/**
 * 删除时
 * 先判断标签是否不存在
 * 判断是否拥可修改
 * 判断是否仅管理员可修改
 * 再判断是否有子级
 * 再判断是否有 users-tags 用户-标签关联
 */
export async function doTagDeleteConvert(ctx: Context, next: Next) {
  // 先判断标签是否不存在
  const sql = 'SELECT code, configurable FROM tags WHERE id = ?'
  let res: any = await query(sql, ctx._params.id)
  if (!(res && res.length)) throw new ExceptionParameter({ message: Message.unexistTag })
  res = res[0]
  // 判断是否拥可修改
  if (res.configurable === '-1') {
    throw new ExceptionForbidden({ message: Message.forbiddenEdit })
  }
  // 判断是否仅管理员可修改
  if (res.configurable === '1') {
    const isS = await isSuper(ctx._user.id)
    if (!isS) throw new ExceptionForbidden({ message: Message.forbiddenSuper })
  }
  // 再判断是否有子级
  await isExistHasChildren({
    table: 'tags',
    where: { key: 'id', value: ctx._params.id },
    throwType: true,
    message: Message.relevantHasChildren
  })
  // 再判断是否有 users-tags 用户-标签关联
  const tagInfo = <TagOptions>await getTagByCode(ctx._params.id)
  await isExist({
    table: 'users_tags',
    where: [{ key: 'tag_code', value: tagInfo.code }],
    throwType: true,
    message: Message.existUserTag
  })
  await next()
}
