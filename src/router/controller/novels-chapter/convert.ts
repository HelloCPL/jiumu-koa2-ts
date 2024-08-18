/**
 * @author chen
 * @description 小说章节中间件
 * @update 2021-10-28 10:55:36
 */

import { Context, Next } from 'koa'
import { Message } from '@/enums'
import { isExist } from '../convert'
import { validateRange } from '@/utils/validator'
import { query } from '@/db'
import { ExceptionParameter, ExceptionForbidden } from '@/utils/http-exception'

/**
 * 新增时
 * 判断小说id是否不存在，且必须为本人的小说
 * 判断章节序号是否重复
 */
export const doNovelChapterAddConvert = async (ctx: Context, next: Next) => {
  // 判断小说id是否不存在,
  await isExist({
    table: 'novels',
    where: [
      { key: 'id', value: ctx._params.novelId },
      { key: 'create_user', value: ctx._user.id }
    ],
    throwType: false,
    message: Message.unexistNovel
  })
  const sql: string = 'SELECT id FROM novels_chapter WHERE novel_id = ? AND sort = ?'
  const data = [ctx._params.novelId, ctx._params.sort]
  const res: any = await query(sql, data)
  if (res && res.length) {
    throw new ExceptionParameter({ message: Message.existNovelChapterSort })
  }
  await next()
}

/**
 * 修改时
 * 判断章节是否不存在，且是否为自己的章节
 * 若传 sort 判断 sort 是否除自己外已存在
 * 若传 isDraft 判断 isDraft 是否 ['1', '0'] 范围
 * 若传 isSecret 判断 isSecret 是否 ['1', '0'] 范围
 */
export const doNovelChapterUpdateConvert = async (ctx: Context, next: Next) => {
  // 判断章节是否不存在，且是否为自己的章节
  const sql: string = 'SELECT id, novel_id FROM novels_chapter WHERE id = ? AND create_user = ?'
  const data = [ctx._params.id, ctx._user.id]
  const res: any = await query(sql, data)
  if (!(res && res.length)) {
    throw new ExceptionParameter({ message: Message.unexistNovelChapter })
  }
  // 若传 sort 判断 sort 是否除自己外已存在
  if (ctx._params.hasOwnProperty('sort')) {
    const sql1: string =
      'SELECT id FROM novels_chapter WHERE novel_id = ? AND id != ? AND sort = ? AND create_user = ?'
    const data1 = [res[0].novel_id, ctx._params.id, ctx._params.sort, ctx._user.id]
    const res1: any = await query(sql1, data1)
    if (res1 && res1.length) throw new ExceptionParameter({ message: Message.existNovelChapterSort })
  }
  // 若传 isDraft 判断 isDraft 是否['1', '0'] 范围
  if (ctx._params.hasOwnProperty('isDraft')) {
    await validateRange({
      value: ctx._params.isDraft,
      range: ['1', '0'],
      message: 'isDraft参数必须为[\'1\', \'0\']范围'
    })
  }
  // 若传 isSecret 判断 isSecret 是否 ['1', '0'] 范围
  if (ctx._params.hasOwnProperty('isSecret')) {
    await validateRange({
      value: ctx._params.isSecret,
      range: ['1', '0'],
      message: 'isSecret参数必须为[\'1\', \'0\']范围'
    })
  }
  await next()
}

/**
 * 删除时
 * 判断章节是否不存在
 * 是否为自己发布的章节
 */
export const doNovelChapterDeleteConvert = async (ctx: Context, next: Next) => {
  // 判断章节是否不存在
  const sql = 'SELECT id, create_user FROM novels_chapter WHERE id = ?'
  const res: any = await query(sql, ctx._params.id)
  if (!(res && res.length)) throw new ExceptionParameter({ message: Message.unexistNovelChapter })
  // 是否为自己发布的章节
  if (res[0]['create_user'] !== ctx._user.id) throw new ExceptionForbidden({ message: Message.forbidden })
  await next()
}
