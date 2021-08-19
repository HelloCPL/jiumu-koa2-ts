/**
 * @description 角色获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { execTrans } from "../../../db";
import { Context, Next } from 'koa';
import { CommentOptions } from './interface'

// 获取一级评论列表
export const doCommentFirstGetList = async (ctx: Context, next: Next) => {
  let pageNo = ctx.params.pageNo * 1 || 1
  const pageSize = ctx.params.pageSize * 1 || 10
  pageNo = (pageNo - 1) * pageSize
  const sql1 = `SELECT COUNT(id) as total FROM comments_first WHERE target_id = ? AND type = ?`
  const data1 = [ctx.params.targetId, ctx.params.type]
  const sql2 = `SELECT t1.id, t1.target_id, t1.content, t1.create_user, t2.username as create_user_name, t1.create_time, t1.terminal, t3.id as is_like, (SELECT COUNT(t4.id) FROM likes t4 WHERE t4.target_id = t1.id) as like_count, (SELECT COUNT(t5.id) FROM comments_second t5 WHERE t5.comment_first_id = t1.id) as comment_count FROM comments_first t1 LEFT JOIN users t2 ON t1.create_user = t2.id LEFT JOIN likes t3 ON (t1.id = t3.target_id AND t3.create_user = ?) WHERE t1.target_id = ?  AND t1.type = ? ORDER BY like_count DESC, comment_count DESC, t1.create_time DESC LIMIT ?, ?`
  const data2 = [ctx.user.id, ...data1, pageNo, pageSize]
  const res: any = await execTrans([{ sql: sql1, data: data1 }, { sql: sql2, data: data2 }])
  const comemntList: CommentOptions[] = res[1]
  _handleCommentFristList(comemntList, ctx.user.id)
  throw new Success({ total: res[0][0]['total'], data: comemntList });
}

// 获取二级评论列表
export const doCommentSecondGetList = async (ctx: Context, next: Next) => {
  let pageNo = ctx.params.pageNo * 1 || 1
  const pageSize = ctx.params.pageSize * 1 || 10
  pageNo = (pageNo - 1) * pageSize
  const sql1 = `SELECT COUNT(id) as total FROM comments_second WHERE comment_first_id = ?`
  const data1 = [ctx.params.targetId]
  const sql2 = `SELECT t1.id, t1.comment_first_id as target_id, t1.reply_content as content, t1.create_user, t2.username as create_user_name, t1.create_time, t1.terminal, t1.reply_user, t3.username as reply_user_name, t4.id as is_like, (SELECT COUNT(t5.id) FROM likes t5 WHERE t5.target_id = t1.id) as like_count FROM comments_second t1 LEFT JOIN users t2 ON t1.create_user = t2.id LEFT JOIN users t3 ON t1.reply_user = t3.id LEFT JOIN likes t4 ON (t1.id = t4.target_id AND t4.create_user = ?) WHERE t1.comment_first_id = ? ORDER BY t1.create_time LIMIT ?, ?`
  const data2 = [ctx.user.id, ...data1, pageNo, pageSize]
  const res: any = await execTrans([{ sql: sql1, data: data1 }, { sql: sql2, data: data2 }])
  const comemntList: CommentOptions[] = res[1]
  _handleCommentSecondList(comemntList, ctx.user.id)
  throw new Success({ total: res[0][0]['total'], data: comemntList });
}

// 处理一级评论列表
function _handleCommentFristList(data: CommentOptions[], userId: string) {
  data.forEach(item => {
    // 处理是否点赞
    if (item.is_like) item.is_like = '1'
    else item.is_like = '0'
    // 处理回复者
    item.reply_user = null
    item.reply_user_name = null
    // 处理是否为自己的评论
    if (item.create_user === userId) item.is_self = '1'
    else item.is_self = '0'
    // 添加子级
    item.children = []
  })
}

// 处理二级评论列表
function _handleCommentSecondList(data: CommentOptions[], userId: string) {
  data.forEach(item => {
    // 处理是否点赞
    if (item.is_like) item.is_like = '1'
    else item.is_like = '0'
    // 处理回复者
    if (item.create_user === item.reply_user) {
      item.reply_user = null
      item.reply_user_name = null
    }
    // 处理是否为自己的评论
    if (item.create_user === userId) item.is_self = '1'
    else item.is_self = '0'
    // 添加子级
    item.comment_count = 0
    item.children = []
  })
}
