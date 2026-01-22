/**
 * 笔记模块中间件
 */

import { query } from '@/db'
import { Message } from '@/enums'
import { ExceptionForbidden, ExceptionParameter } from '@/utils/http-exception'
import { Context, Next } from 'koa'

/**
 * 笔记删除中间件
 * 判断笔记是否不存在，且是否为自己发布的笔记
 */
export const doNoteDeleteConvert = async (ctx: Context, next: Next) => {
  // 判断笔记是否不存在
  const sql = 'SELECT id, create_user FROM notes WHERE id = ?'
  const res: any = await query(sql, ctx._params.id)
  if (!(res && res.length)) throw new ExceptionParameter({ message: Message.unexistNote })
  // 是否为自己发布的笔记
  if (res[0]['create_user'] !== ctx._user.id) throw new ExceptionForbidden({ message: Message.forbidden })
  await next()
}

/**
 * 获取笔记列表中间件
 * 判断 rootId targetId 两者必须传其一
 */
export const doNoteGetListConvert = async (ctx: Context, next: Next) => {
  // 判断 rootId targetId 两者必须传其一
  if (ctx._params.rootId || ctx._params.targetId) {
    await next()
  }
  throw new ExceptionParameter({ message: Message.parameter + '，rootId或targetId必须传其一' })
}
