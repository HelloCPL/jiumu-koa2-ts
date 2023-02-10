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
  const tb = novelNoteLinkTypes[ctx._params.targetType]
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
  if (flag) throw new Success()
  await next()
}

/**
 * 删除时
 * 判断笔记-目标关联是否不存在
 */
export async function doNovelNoteLinkDeleteConvert(ctx: Context, next: Next) {
  // 判断用户-角色关联是否不存在
  const flag = await _isExist(ctx)
  if (!flag)
    throw new ExceptionParameter({
      message: Message.unexistNovelNoteLink
    })
  await next()
}

// 笔记关联可选类型
export const novelNoteLinkTypes: ObjectAny = {
  '502': {
    table: 'questions',
    unexistMessage: Message.unexistQuestion,
    titleKey: 'title'
    // label: '问答来源'
  },
  '503': {
    table: 'sources',
    unexistMessage: Message.unexistSource,
    titleKey: 'title'
    // label: '资源文件来源'
  },
  '504': {
    table: 'novels',
    unexistMessage: Message.unexistNovel,
    titleKey: 'name'
    // label: '连载来源'
  },
  '505': {
    table: 'articles',
    unexistMessage: Message.unexistArticle,
    titleKey: 'title'
    // label: '博客文章来源'
  },
  '507': {
    table: 'novels_chapter',
    unexistMessage: Message.unexistNovelChapter,
    titleKey: 'title'
    // label: '连载章节'
  }
}

// 判断关联是否存在
async function _isExist(ctx: Context): Promise<boolean> {
  const sql = 'SELECT t1.id FROM novels_note_link t1 WHERE t1.id = ? OR (t1.note_id = ? AND t1.target_id = ?)'
  const data = [ctx._params.id, ctx._params.noteId, ctx._params.targetId]
  const res: any = await query(sql, data)
  return res && res.length
}
