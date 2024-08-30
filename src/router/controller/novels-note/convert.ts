/**
 * @author chen
 * @description 笔记模块中间件
 * @update 2022-03-20 15:25:20
 */

import { Context, Next } from 'koa'
import { Message } from '@/enums'
import { validateRange } from '@/utils/validator'
import { query } from '@/db'
import { ExceptionParameter, ExceptionForbidden } from '@/utils/http-exception'
import { isExist } from '../convert'
import { getNovelNoteLinkType } from '../novels-note-link/utils'

/**
 * 新增时
 * 判断传 targetId 时必传 targetType
 */
export const doNovelNoteAddConvert = async (ctx: Context, next: Next) => {
  // 判断传 targetId 时必传 targetType
  if (ctx._params.targetId) {
    const currentType = getNovelNoteLinkType(ctx._params.targetType)
    if (!currentType)
      throw new ExceptionParameter({
        message: Message.errorType
      })
    // 判断目标id是否不存在
    await isExist({
      table: currentType.table,
      where: [{ key: 'id', value: ctx._params.targetId }],
      throwType: false,
      message: currentType.unexistMessage
    })
  }
  await next()
}

/**
 * 修改时
 * 判断笔记是否不存在，且是否为自己发布的笔记 使用 doNovelNoteDeleteConvert
 * 若传 isSecret 判断 isSecret 是否 ['1', '0'] 范围
 */
export const doNovelNoteUpdateConvert = async (ctx: Context, next: Next) => {
  // 若传 isSecret 判断 isSecret 是否 ['1', '0'] 范围
  if (ctx._params.hasOwnProperty('isSecret')) {
    await validateRange({
      value: ctx._params.isSecret,
      range: ['1', '0'],
      message: 'isSecret参数必须为["1", "0"]范围'
    })
  }
  await next()
}

/**
 * 删除时
 * 判断笔记是否不存在，且是否为自己发布的笔记
 */
export const doNovelNoteDeleteConvert = async (ctx: Context, next: Next) => {
  // 判断笔记是否不存在
  const sql = 'SELECT id, create_user FROM novels_note WHERE id = ?'
  const res: any = await query(sql, ctx._params.id)
  if (!(res && res.length)) throw new ExceptionParameter({ message: Message.unexistNovelNote })
  // 是否为自己发布的笔记
  if (res[0]['create_user'] !== ctx._user.id) throw new ExceptionForbidden({ message: Message.forbidden })
  await next()
}
