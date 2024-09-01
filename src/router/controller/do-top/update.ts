/**
 * @description 置顶/取消操作
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success, ExceptionForbidden, ExceptionParameter } from '@/utils/http-exception'
import { query } from '@/db'
import { CommentFindResult } from '../comments/interface'
import { findCommentById } from '../comments/add'
import { Message } from '@/enums'
import { getTopSourcesType } from './utils'

/**
 * 问答、资源文件、小说、博客文章置顶/取消操作
 */
export const doTopUpdate = async (ctx: Context) => {
  const source = getTopSourcesType(ctx._params.type)
  const sql: string = `UPDATE ${source.table} SET is_top = ? WHERE id = ?`
  const data = [ctx._params.isTop, ctx._params.id]
  await query(sql, data)
  throw new Success()
}

/**
 * 评论置顶/取消操作
 */
export const doTopUpdateComment = async (ctx: Context) => {
  const commentInfo = <CommentFindResult>await findCommentById(ctx._params.id)
  let sql = ''
  if (commentInfo.flag === 1) {
    sql = 'UPDATE comments_first SET is_top = ? WHERE id = ? '
  } else if (commentInfo.flag === 2) {
    // 获取目标用户
    sql = 'UPDATE comments_second SET is_top = ? WHERE id = ? '
  } else throw new ExceptionParameter({ message: Message.unexistComment })
  // 获取评论目标的用户
  const source = getTopSourcesType(commentInfo.comment_first_target_type)
  if (!source) throw new ExceptionForbidden()
  const sql2 = `SELECT create_user FROM ${source.table} WHERE id = ?`
  const res2: any = await query(sql2, commentInfo.comment_first_target_id)
  const flag = res2 && res2.length && res2[0]['create_user'] === ctx._user.id
  if (!flag) throw new ExceptionForbidden()
  // 置顶评论操作
  const data = [ctx._params.isTop, ctx._params.id]
  await query(sql, data)
  throw new Success()
}
