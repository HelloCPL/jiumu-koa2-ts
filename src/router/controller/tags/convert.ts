/**
 * @description 标签模块中间件
 * @author chen
 * @update 2021-08-07 15:12:57
*/

import { Context, Next } from 'koa'
import { query } from '../../../db'
import { ExceptionParameter } from '../../../utils/http-exception'
import { Message } from '../../../enums'
import { isExist } from '../convert'
import { getByCode, TagOptions } from './get'

/**
 * 新增时 
 * 判断标签是否已存在
 * 若 parentCode 为真，再判断 parentCode 是否不存在
*/
export const doTagAddExist = async (ctx: Context, next: Next) => {
  //  判断标签是否已存在
  await isExist({
    table: 'tags',
    where: [{ key: 'code', value: ctx.params.code }],
    throwType: true,
    message: Message.existTag
  })
  // 若 parentCode 为真，再判断 parentCode 是否不存在
  if (ctx.params.parentCode) {
    await isExist({
      table: 'tags',
      where: [{ key: 'code', value: ctx.params.parentCode }],
      throwType: false,
      message: Message.unexistTag
    })
  }
  await next()
}

/**
 * 修改时 
 * 判断标签是否不存在，
 * 若修改 code 判断 code 除自身外是否存在
 * 若 parentCode 为真，判断 parentCode 是否不存在
*/
export async function doTagUpdateNoExist(ctx: Context, next: Next) {
  // 判断标签是否不存在，
  await isExist({
    table: 'tags',
    where: [{ key: 'id', value: ctx.params.id }],
    throwType: false,
    message: Message.unexistTag
  })
  // 若修改 code 判断 code 除自身外是否存在
  if (ctx.params.code) {
    await isExist({
      table: 'tags',
      where: [
        { key: 'code', value: ctx.params.code },
        { key: 'id', value: ctx.params.id, connector: '!=' },
      ],
      throwType: true,
      message: Message.existTag
    })
  }
  // 若 parentCode 为真，判断 parentCode 是否不存在
  if (ctx.params.parentCode) {
    await isExist({
      table: 'tags',
      where: [{ key: 'code', value: ctx.params.parentCode }],
      throwType: false,
      message: Message.unexistTag
    })
  }
  await next()
}

/**
 * 删除时 
 * 先判断标签是否不存在
 * 再判断是否有子级
 * 再判断是否有 users-tags 用户-标签关联
*/
export async function doTagDeleteHasChild(ctx: Context, next: Next) {
  // 先判断标签是否不存在
  await isExist({
    table: 'tags',
    where: [{ key: 'id', value: ctx.params.id }],
    throwType: false,
    message: Message.unexistTag
  })
  // 再判断是否有子级
  const hasChildren = await isExistChildren(ctx.params.id)
  if (hasChildren)
    throw new ExceptionParameter({ message: Message.relevantChildren })
  // 再判断是否有 users-tags 用户-标签关联
  const tagInfo = <TagOptions>await getByCode(ctx.params.id)
  await isExist({
    table: 'users_tags',
    where: [{ key: 'tag_code', value: tagInfo.code }],
    throwType: true,
    message: Message.existUserTag
  })
  await next()
}

// 根据 id 或 code 判断是否有子级
export async function isExistChildren(value: any, key: string = 'id'): Promise<boolean> {
  if (!value && key === 'code') return true
  const sql = `SELECT t1.id FROM tags t1 WHERE t1.parent_code IN (SELECT t2.code FROM tags t2 WHERE t2.${key} = ?)`
  const res: any = await query(sql, value)
  if (res && res.length) return true
  return false
}







// 根据 id 或 code 判断标签是否存在
export async function isExistTag(value: any, key: string = 'id'): Promise<boolean> {
  let sql = `SELECT id FROM tags WHERE ${key} = ?`
  const res: any = await query(sql, value)
  if (res && res.length) return true
  return false
}
