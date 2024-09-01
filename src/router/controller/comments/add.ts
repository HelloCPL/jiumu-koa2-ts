/**
 * @description 评论新增
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { ExceptionParameter, Success } from '@/utils/http-exception'
import { query } from '@/db'
import { Message, Terminal } from '@/enums'
import { formatDate, getUuId } from '@/utils/tools'
import { CommentFindResult } from './interface'

/**
 * 第一级别评论新增
 */
export const doCommentFirstAdd = async (ctx: Context) => {
  const sql: string = `
    INSERT comments_first 
      (id, target_id, content, create_user, type, create_time, terminal) 
    VALUES 
      (?, ?, ?, ?, ?, ?, ?)`
  const id = getUuId()
  const data = [
    id,
    ctx._params.targetId,
    ctx._params.content,
    ctx._user.id,
    ctx._params.type,
    formatDate(new Date()),
    Terminal[ctx._terminal]
  ]
  await query(sql, data)
  throw new Success({ data: id })
}

/**
 * 第二级别评论新增
 */
export const doCommentSecondAdd = async (ctx: Context) => {
  const commentInfo = <CommentFindResult>await findCommentById(ctx._params.targetId)
  const sql: string = `
    INSERT comments_second 
      (id, reply_comment_id, reply_content, create_user, create_time, terminal, comment_first_target_id, comment_first_id, reply_user) 
    VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const id = getUuId()
  const data = [
    id,
    ctx._params.targetId,
    ctx._params.content,
    ctx._user.id,
    formatDate(new Date()),
    Terminal[ctx._terminal],
    commentInfo.comment_first_target_id,
    commentInfo.comment_first_id,
    commentInfo.reply_user
  ]
  await query(sql, data)
  throw new Success({ data: id })
}

// 根据评论id寻找评论信息
export async function findCommentById(id: string): Promise<CommentFindResult | void> {
  const sql1 = `
    SELECT 
      id AS comment_first_id, target_id AS comment_first_target_id, create_user AS reply_user, type AS comment_first_target_type  
    FROM comments_first 
    WHERE id = ?`
  const res1: any = await query(sql1, id)
  if (res1 && res1.length)
    return {
      id,
      comment_first_target_type: res1[0]['comment_first_target_type'],
      comment_first_target_id: res1[0]['comment_first_target_id'],
      comment_first_id: res1[0]['comment_first_id'],
      reply_user: res1[0]['reply_user'],
      flag: 1
    }
  const sql2 = `
    SELECT 
      t1.comment_first_id, t1.comment_first_target_id, t2.type AS comment_first_target_type, t1.create_user AS reply_user  
    FROM comments_second t1 
    LEFT JOIN comments_first t2 ON t1.comment_first_id = t2.id 
    WHERE t1.id = ?`
  const res2: any = await query(sql2, id)
  if (res2 && res2.length)
    return {
      id,
      comment_first_target_type: res2[0]['comment_first_target_type'],
      comment_first_target_id: res2[0]['comment_first_target_id'],
      comment_first_id: res2[0]['comment_first_id'],
      reply_user: res2[0]['reply_user'],
      flag: 2
    }
  throw new ExceptionParameter({ message: Message.unexistComment })
}
