/**
 * @description: 小说模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
 */

import { Context, Next } from 'koa'
import { Message } from '@/enums'
import { validateRange } from '@/utils/validator'
import { query } from '@/db'
import { ExceptionParameter, ExceptionForbidden } from '@/utils/http-exception'
import { isExist } from '../convert'

/**
 * 新增时
 * 如果小说类型为真 判断 type 是否系统标签600范围
 */
export const doNovelAddConvert = async (ctx: Context, next: Next) => {
  // 如果小说类型为真 判断 type 是否系统标签600范围
  if (ctx._params.hasOwnProperty('type')) {
    await validateRange({
      value: ctx._params.type,
      range: '600',
      message: 'type参数必须为系统标签600范围'
    })
  }
  await next()
}

/**
 * 编辑时
 * 判断小说是否不存在，且是否为自己发布的小说
 * 如果小说类型为真 判断 type 是否系统标签600范围
 * 若传 isDraft 判断 isDraft 是否 ['1', '0'] 范围
 * 若传 isSecret 判断 isSecret 是否 ['1', '0'] 范围
 */
export const doNovelUpdateConvert = async (ctx: Context, next: Next) => {
  // 判断小说是否不存在
  const sql = `SELECT id, create_user FROM novels WHERE id = ?`
  const res: any = await query(sql, ctx._params.id)
  if (!(res && res.length)) throw new ExceptionParameter({ message: Message.unexistNovel })
  // 是否为自己发布的小说
  if (res[0]['create_user'] !== ctx._user.id) throw new ExceptionForbidden({ message: Message.forbidden })
  // 如果小说类型为真 判断 type 是否系统标签600范围
  if (ctx._params.hasOwnProperty('type')) {
    await validateRange({
      value: ctx._params.type,
      range: '600',
      message: 'type参数必须为系统标签600范围'
    })
  }
  // 若传 isDraft 判断 isDraft 是否 ['1', '0'] 范围
  if (ctx._params.hasOwnProperty('isDraft')) {
    await validateRange({
      value: ctx._params.isDraft,
      range: ['1', '0'],
      message: `isDraft参数必须为['1', '0']范围`
    })
  }
  // 若传 isSecret 判断 isSecret 是否 ['1', '0'] 范围
  if (ctx._params.hasOwnProperty('isSecret')) {
    await validateRange({
      value: ctx._params.isSecret,
      range: ['1', '0'],
      message: `isSecret参数必须为['1', '0']范围`
    })
  }
  await next()
}

/**
 * 删除时
 * 判断小说是否不存在
 * 是否为自己发布的小说
 * 判断小说章节是否存在
 */
export const doNovelDeleteConvert = async (ctx: Context, next: Next) => {
  // 判断小说是否不存在
  const sql = `SELECT id, create_user FROM novels WHERE id = ?`
  const res: any = await query(sql, ctx._params.id)
  if (!(res && res.length)) throw new ExceptionParameter({ message: Message.unexistNovel })
  // 是否为自己发布的小说
  if (res[0]['create_user'] !== ctx._user.id) throw new ExceptionForbidden({ message: Message.forbidden })
  // 判断小说章节是否存在
  await isExist({
    table: 'novels_chapter',
    where: [{ key: 'novel_id', value: ctx._params.id }],
    throwType: true,
    message: '该小说存在章节，请删除所有章节后再操作'
  })
  await next()
}
