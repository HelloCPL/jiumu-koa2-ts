/**
 * @description: 笔记关联模块中间件
 * @author: cpl
 * @create: 2023-02-07 12:03:22
 */

import { query } from '@/db'
import { Message } from '@/enums'
import { ExceptionParameter, Success } from '@/utils/http-exception'
import { Context, Next } from 'koa'
import { isExist } from '../convert'
import { getNovelNoteLinkType } from './utils'

/**
 * 新增时
 * 判断笔记是否不存在
 * 判断目标类型是否正确
 * 判断目标是否不存在
 * 判断笔记-目标关联是否已存在
 */
export const doNovelNoteLinkAddConvert = async (ctx: Context, next: Next) => {
  //  判断笔记是否不存在
  await isExist({
    table: 'novels_note',
    where: [{ key: 'id', value: ctx._params.noteId }],
    throwType: false,
    message: Message.unexistNovelNote
  })
  // 判断目标类型是否正确
  const tb = getNovelNoteLinkType(ctx._params.targetType)
  if (!tb)
    throw new ExceptionParameter({
      message: Message.errorType
    })
  // 判断目标是否不存在
  await isExist({
    table: tb.table,
    where: [{ key: 'id', value: ctx._params.targetId }],
    throwType: false,
    message: tb.unexistMessage
  })
  // 判断笔记-目标关联是否已存在
  const flag = await _isExist(ctx)
  if (flag === '1') throw new Success()
  ctx._params.__status = flag
  await next()
}

/**
 * 删除时
 * 判断笔记-目标关联是否不存在
 */
export async function doNovelNoteLinkDeleteConvert(ctx: Context, next: Next) {
  // 判断用户-角色关联是否不存在
  const flag = await _isExist(ctx)
  if (flag === '-1')
    throw new ExceptionParameter({
      message: Message.unexistNovelNoteLink
    })
  if (flag === '0') throw new Success()
  ctx._params.__status = flag
  await next()
}

// 判断关联是否存在
async function _isExist(ctx: Context): Promise<string> {
  const sql =
    'SELECT t1.id, t1.status FROM novels_note_link t1 WHERE t1.id = ? OR (t1.note_id = ? AND t1.target_id = ?)'
  const data = [ctx._params.id, ctx._params.noteId, ctx._params.targetId]
  const res: any = await query(sql, data)
  let flag = '-1'
  if (res && res.length) {
    if (res[0].status === '1') {
      flag = '1'
    } else {
      flag = '0'
    }
  }
  return flag
}
