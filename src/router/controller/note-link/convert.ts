/**
 * @description: 笔记关联模块中间件
 * @author: cpl
 * @create: 2023-02-07 12:03:22
 */

import { query } from '@/db'
import { Message } from '@/enums'
import { ExceptionForbidden, ExceptionParameter, Success } from '@/utils/http-exception'
import { Context, Next } from 'koa'
import { isExist } from '../convert'

/**
 * 新增时
 * 判断笔记是否不存在
 * 判断是否为自己发布的笔记
 * 笔记自身不可关联，判断笔记所属目标是否为本身
 * 判断可关联性是否为全关联
 * 判断笔记-目标关联是否已存在
 */
export const doNoteLinkAddConvert = async (ctx: Context, next: Next) => {
  //  判断笔记是否不存在
  const sql = 'SELECT target_id, create_user, link_status FROM notes WHERE id = ?'
  const res = await query(sql, ctx._params.noteId)
  if (!(res && res.length)) {
    throw new ExceptionParameter({ message: Message.unexistNote })
  }
  // 判断是否为自己发布的笔记
  if (res[0]['create_user'] !== ctx._user.id) {
    throw new ExceptionForbidden({ message: Message.forbidden })
  }
  // 笔记自身不可关联，判断笔记所属目标是否为本身
  if (res[0]['target_id'] === ctx._params.targetId) {
    throw new ExceptionParameter({ message: Message.errorNoteLinkSelf })
  }
  // 判断可关联性是否为全关联
  if (res[0]['link_status'] !== '1') {
    throw new ExceptionParameter({ message: Message.errorNoteLink })
  }
  // 判断笔记-目标关联是否已存在
  await isExist({
    table: 'notes_link',
    where: [
      { key: 'note_id', value: ctx._params.noteId },
      { key: 'target_id', value: ctx._params.targetId }
    ],
    throwType: true,
    message: Message.existNoteLink
  })
  await next()
}

/**
 * 删除时
 * 判断笔记-目标关联是否不存在
 * 判断是否为自己创建的笔记关联
 */
export async function doNoteLinkDeleteConvert(ctx: Context, next: Next) {
  // 判断用户-角色关联是否不存在
  const sql = 'SELECT id, create_user FROM notes_link WHERE note_id = ? AND target_id = ?'
  const data = [ctx._params.noteId, ctx._params.targetId]
  const res = await query(sql, data)
  if (!(res && res.length)) {
    throw new ExceptionParameter({ message: Message.unexistNoteLink })
  }
  // 判断是否为自己创建的笔记关联
  if (res[0]['create_user'] !== ctx._user.id) throw new ExceptionForbidden({ message: Message.forbidden })
  await next()
}
