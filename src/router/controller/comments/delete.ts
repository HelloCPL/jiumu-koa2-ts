/**
 * @description 评论删除
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { ExceptionParameter, Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Message } from "../../../enums";
import { _findCommentById } from './add'
import { CommentFindResult } from './interface'

/**
 * 删除自己的某条评论
*/
export const doCommentDeleteSelf = async (ctx: Context, next: Next) => {
  const commentInfo = <CommentFindResult>await _findCommentById(ctx.params.id)
  if (commentInfo.flag === 1 && commentInfo.reply_user === ctx.user.id) {
    const sql1: string = `DELETE FROM comments_first WHERE id = ? AND create_user = ?`
    const data1 = [ctx.params.id, ctx.user.id]
    await query(sql1, data1)
    throw new Success();
  }
  if (commentInfo.flag === 2 && commentInfo.reply_user === ctx.user.id) {
    const sql2: string = `DELETE FROM comments_second WHERE id = ? AND create_user = ?`
    const data2 = [ctx.params.id, ctx.user.id]
    await query(sql2, data2)
    throw new Success();
  }
  throw new ExceptionParameter({ message: Message.forbidden })
}

/**
 * 删除指定某条评论，不管谁的评论均可删除
*/
export const doCommentDeleteById = async (ctx: Context, next: Next) => {
  const commentInfo = <CommentFindResult>await _findCommentById(ctx.params.id)
  if (commentInfo.flag === 1) {
    const sql1: string = `DELETE FROM comments_first WHERE id = `
    const data1 = [ctx.params.id]
    await query(sql1, data1)
    throw new Success();
  }
  if (commentInfo.flag === 2) {
    const sql2: string = `DELETE FROM comments_second WHERE id = ?`
    const data2 = [ctx.params.id]
    await query(sql2, data2)
    throw new Success();
  }
  throw new ExceptionParameter({ message: Message.forbidden })
}
