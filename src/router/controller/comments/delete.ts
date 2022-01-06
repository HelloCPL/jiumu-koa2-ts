/**
 * @description 评论删除
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { ExceptionForbidden, Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Message } from "../../../enums";
import { _findCommentById } from './add'
import { CommentFindResult } from './interface'

/**
 * 删除指定某条评论
*/
export const doCommentDeleteById = async (ctx: Context, next: Next) => {
  const commentInfo = <CommentFindResult>await _findCommentById(ctx.params.id)
  let sql = ''
  let data: any = []
  let sqlWhere = ''
  if (ctx.params.userId)
    sqlWhere = ' AND create_user = ?'
  if (commentInfo.flag === 1) {
    sql = `DELETE FROM comments_first WHERE id = ? ${sqlWhere}`
    data = [ctx.params.id, ctx.params.userId]
  }
  if (commentInfo.flag === 2) {
    sql = `DELETE FROM comments_second WHERE id = ? ${sqlWhere}`
    data = [ctx.params.id, ctx.params.userId]
  }
  if (sql) {
    await query(sql, data)
    throw new Success();
  }
  throw new ExceptionForbidden({ message: Message.forbidden })
}
