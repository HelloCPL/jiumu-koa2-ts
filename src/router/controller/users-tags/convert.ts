/**
 * @description: 用户-特殊标签关联模块中间件
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context, Next } from 'koa'
import { query } from '@/db'
import { Message } from '@/enums'
import { Success } from '@/utils/http-exception'
import { validateRange } from '@/utils/validator'
import { isExist } from '../convert'

/**
 * 新增时
 * 判断用户是否不存在
 * 判断特殊标签是否不存在
 * 判断用户-特殊标签关联是否已存在
 */
export const doUserTagAddConvert = async (ctx: Context, next: Next) => {
  // 判断用户是否不存在
  await isExist({
    table: 'users',
    where: [{ key: 'id', value: ctx._params.userId }],
    throwType: false,
    message: Message.unexistUser
  })
  // 判断特殊标签是否不存在
  await validateRange({
    value: ctx._params.tagCode,
    range: '8888',
    message: 'tagCode参数必须为特殊标签8888范围'
  })
  // 判断用户-特殊标签关联是否已存在
  const flag = await _isExist(ctx)
  if (flag) throw new Success()
  await next()
}

/**
 * 删除时
 * 判断用户-特殊标签关联是否不存在
 */
export async function doUserTagDeleteConvert(ctx: Context, next: Next) {
  // 判断用户-特殊标签关联是否不存在
  const flag = await _isExist(ctx)
  if (!flag) throw new Success()
  await next()
}

/**
 * 根据指定特殊标签获取关联的所有用户时
 * 判断特殊标签是否不存在
 */
export async function doUserTagGetAllUserByTagCodeConvert(ctx: Context, next: Next) {
  // 判断特殊标签是否不存在
  await validateRange({
    value: ctx._params.tagCode,
    range: '8888',
    message: 'tagCode参数必须为特殊标签8888范围'
  })
  await next()
}

// 判断关联是否存在
async function _isExist(ctx: Context): Promise<boolean> {
  const sql = 'SELECT t1.id FROM users_tags t1 WHERE t1.id = ? OR (t1.tag_code = ? AND t1.user_id = ?)'
  const data = [ctx._params.id, ctx._params.tagCode, ctx._params.userId]
  const res: any = await query(sql, data)
  return res && res.length
}
