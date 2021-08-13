/**
 * @description: 用户-特殊标签关联模块中间件
 * @author chen
 * @update 2021-08-11 14:12:49
*/


import { Context, Next } from 'koa'
import { query } from '../../../db'
import { Message } from '../../../enums'
import { validateRange } from '../../../utils/validator'
import { isExist } from '../convert'

/**
 * 新增时 
 * 判断用户是否不存在
 * 判断特殊标签是否不存在
 * 判断用户-特殊标签关联是否已存在
*/
export const doUserTagAddExist = async (ctx: Context, next: Next) => {
  // 判断用户是否不存在
  await isExist({
    table: 'users',
    where: [{ key: 'id', value: ctx.params.userId }],
    throwType: false,
    message: Message.unexistUser
  })
  // 判断特殊标签是否不存在
  await validateRange({
    value: ctx.params.tagCode,
    range: '8888',
    message: 'tagCode必须为特殊标签8888下的标签'
  })
  // 判断用户-特殊标签关联是否已存在
  await isExist({
    table: 'users_tags',
    where: [
      { key: 'tag_code', value: ctx.params.tagCode },
      { key: 'user_id', value: ctx.params.userId },
    ],
    throwType: true,
    message: Message.existUserTag
  })
  await next()
}

/**
 * 删除时 
 * 判断用户-特殊标签关联是否不存在
*/
export async function doUserTagDeleteExist(ctx: Context, next: Next) {
  // 判断用户-特殊标签关联是否不存在
  await isExist({
    table: 'users_tags',
    where: [{ key: 'id', value: ctx.params.id }],
    throwType: false,
    message: Message.unexistUserTag
  })
  await next()
}










// 根据 id 判断用户-特殊标签关联是否存在
export async function isExistUserRoleById(id: string): Promise<boolean> {
  const sql = `SELECT id FROM users_tags WHERE id = ?`
  const res: any = await query(sql, id)
  if (res && res.length) return true
  return false
}

// 根据 tagCode userId 判断用户-特殊标签关联是否存在
export async function isExistUserTag(tagCode: string, userId: string): Promise<boolean> {
  const sql = `SELECT id FROM users_tags WHERE tag_code = ? AND user_id = ?`
  const data = [tagCode, userId]
  const res: any = await query(sql, data)
  if (res && res.length) return true
  return false
}
