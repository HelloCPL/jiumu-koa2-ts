/**
 * @author chen
 * @description 小说章节中间件
 * @update 2021-10-28 10:55:36
 */

import { Context, Next } from 'koa'
import { Message } from '../../../enums'
import { isExist } from '../convert'
import { validateRange } from '../../../utils/validator'
import { query } from '../../../db'
import { ExceptionParameter } from '../../../utils/http-exception'

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
      { key: 'id', value: ctx.params.novelId },
      { key: 'create_user', value: ctx.user.id },
    ],
    throwType: false,
    message: Message.unexistNovel,
  })
  const sql: string = `SELECT id FROM novels_chapter WHERE novel_id = ? AND sort = ?`
  const data = [ctx.params.novelId, ctx.params.sort]
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
  const sql: string = `SELECT id, novel_id FROM novels_chapter WHERE id = ? AND create_user = ?`
  const data = [ctx.params.id, ctx.user.id]
  const res: any = await query(sql, data)
  if (!(res && res.length)) {
    throw new ExceptionParameter({ message: Message.unexistNovelChapter })
  }
  await isExist({
    table: 'novels_chapter',
    where: [
      { key: 'id', value: ctx.params.id },
      { key: 'create_user', value: ctx.user.id },
    ],
    throwType: false,
    message: Message.unexistNovel,
  })

  await next()
}
