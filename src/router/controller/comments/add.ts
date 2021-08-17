/**
 * @description 评论新增
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { ExceptionParameter, Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Message, Terminal } from "../../../enums";
import { formatDate, getUuId } from "../../../utils/tools";
import { CommentFindResult } from './interface'

/**
 * 第一级别评论新增
*/
export const doCommentFirstAdd = async (ctx: Context, next: Next) => {
  const sql: string = `INSERT comments_first (id, target_id, content, create_user, type, create_time, terminal) VALUES (?, ?, ?, ?, ?, ?, ?)`
  const data = [getUuId(), ctx.params.targetId, ctx.params.content, ctx.user.id, ctx.params.type, formatDate(new Date()), Terminal[ctx.terminal]]
  await query(sql, data)
  throw new Success();
}

/**
 * 第二级别评论新增
*/
export const doCommentSecondAdd = async (ctx: Context, next: Next) => {
  const commentInfo = <CommentFindResult>await _findCommentById(ctx.params.targetId)
  const sql: string = `INSERT comments_second (id, reply_comment_id, reply_content, create_user, create_time, terminal, comment_first_target_id, comment_first_id, reply_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const data = [getUuId(), ctx.params.targetId, ctx.params.content, ctx.user.id, formatDate(new Date()), Terminal[ctx.terminal], commentInfo.comment_first_target_id, commentInfo.comment_first_id, commentInfo.reply_user]
  await query(sql, data)
  throw new Success();
}

// 根据评论id寻找评论信息
export async function _findCommentById(id: string): Promise<CommentFindResult | void> {
  const sql1 = `SELECT * FROM comments_first WHERE id = ?`
  const res1: any = await query(sql1, id)
  if (res1 && res1.length)
    return {
      comment_first_target_id: res1[0]['target_id'],
      comment_first_id: res1[0]['id'],
      reply_user: res1[0]['create_user'],
      flag: 1
    }
  const sql2 = `SELECT * FROM comments_second WHERE id = ?`
  const res2: any = await query(sql2, id)
  if (res2 && res2.length)
    return {
      comment_first_target_id: res2[0]['comment_first_target_id'],
      comment_first_id: res2[0]['comment_first_id'],
      reply_user: res2[0]['create_user'],
      flag: 2
    }
  throw new ExceptionParameter({ message: Message.unexistComment })
}
