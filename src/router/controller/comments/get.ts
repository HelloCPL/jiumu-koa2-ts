/**
 * @description 角色获取
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { execTrans, query } from '@/db'
import { Context } from 'koa'
import { CommentFindResult, CommentOptions } from './interface'
import { findCommentById } from './add'
import { handleCommentList } from './utils'

// 获取指定的某条评论
export const doCommentGetOne = async (ctx: Context) => {
  const commentInfo = <CommentFindResult>await findCommentById(ctx._params.id)
  // 处理评论者信息字段
  const showUserInfo = ctx._params.showUserInfo || '1'
  const userInfoField =
    showUserInfo === '1' ? ' t2.username AS create_user_name, t2.avatar AS create_user_avatar, ' : ''
  if (commentInfo.flag === 1) {
    const sql2 = `
      SELECT 
        t1.id, t1.target_id, t1.type AS target_type, t7.label AS target_type_label, t1.content, 
        t1.create_user,  t1.is_top, t1.create_time, t1.terminal, t3.id AS is_like, 
        ${userInfoField}
        (SELECT COUNT(t4.id) FROM likes t4 WHERE t4.target_id = t1.id) AS like_count, 
        (SELECT COUNT(t5.id) FROM comments_second t5 WHERE t5.comment_first_id = t1.id) AS comment_count 
      FROM comments_first t1 
      LEFT JOIN users t2 ON t1.create_user = t2.id 
      LEFT JOIN likes t3 ON (t1.id = t3.target_id AND t3.create_user = ?) 
      LEFT JOIN tags t7 ON (t1.type = t7.code) 
      WHERE t1.id = ?`
    const data2 = [ctx._user.id, ctx._params.id]
    const res2: any = await query(sql2, data2)
    await handleCommentList(res2, {
      userId: ctx._user.id,
      flag: 1,
      showUserInfo
    })
    throw new Success({ data: res2[0] })
  } else if (commentInfo.flag === 2) {
    const replyUserInfoField =
      showUserInfo === '1' ? ' t3.username AS reply_user_name, t3.avatar AS reply_user_avatar, ' : ''
    const sql4 = `
      SELECT 
        t1.id, t1.comment_first_id, t1.comment_first_target_id AS target_id, t6.type AS target_type, t1.reply_content AS content, 
        t1.create_user, t1.is_top, t1.create_time, t1.terminal, t1.reply_user, t4.id AS is_like, 
        ${userInfoField} 
        ${replyUserInfoField} 
        (SELECT COUNT(t5.id) FROM likes t5 WHERE t5.target_id = t1.id) AS like_count 
      FROM comments_second t1 
      LEFT JOIN users t2 ON t1.create_user = t2.id 
      LEFT JOIN users t3 ON t1.reply_user = t3.id 
      LEFT JOIN likes t4 ON (t1.id = t4.target_id AND t4.create_user = ?) 
      LEFT JOIN comments_first t6 ON t1.comment_first_id = t6.id 
      WHERE t1.id = ?`
    const data4 = [ctx._user.id, ctx._params.id]
    const res4: any = await query(sql4, data4)
    await handleCommentList(res4, {
      userId: ctx._user.id,
      flag: 2,
      showUserInfo
    })
    throw new Success({ data: res4[0] })
  }
  throw new Success()
}

// 获取一级评论列表
export const doCommentFirstGetList = async (ctx: Context) => {
  let pageNo = ctx._params.pageNo * 1 || 1
  const pageSize = ctx._params.pageSize * 1 || 10
  pageNo = (pageNo - 1) * pageSize
  // 处理评论者信息字段
  const showUserInfo = ctx._params.showUserInfo || '1'
  const userInfoField =
    showUserInfo === '1' ? ' t2.username AS create_user_name, t2.avatar AS create_user_avatar, ' : ''
  const sql1 = 'SELECT COUNT(t1.id) AS total FROM comments_first t1 WHERE t1.target_id = ? AND t1.type = ?'
  const data1 = [ctx._params.targetId, ctx._params.type]
  const sql2 = `
    SELECT 
      t1.id, t1.target_id, t1.type AS target_type, t7.label AS target_type_label, t1.content, 
      t1.create_user, t1.is_top, t1.create_time, t1.terminal, t3.id AS is_like, 
      ${userInfoField} 
      (SELECT COUNT(t4.id) FROM likes t4 WHERE t4.target_id = t1.id) AS like_count, 
      (SELECT COUNT(t5.id) FROM comments_second t5 WHERE t5.comment_first_id = t1.id) AS comment_count 
    FROM comments_first t1 
    LEFT JOIN users t2 ON t1.create_user = t2.id 
    LEFT JOIN likes t3 ON (t1.id = t3.target_id AND t3.create_user = ?) 
    LEFT JOIN tags t7 ON (t1.type = t7.code) 
    WHERE 
      t1.target_id = ?  AND 
      t1.type = ? 
    ORDER BY t1.is_top DESC, comment_count DESC, like_count DESC, t1.create_time 
    LIMIT ?, ?`
  const data2 = [ctx._user.id, ...data1, pageNo, pageSize]
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  const comemntList: CommentOptions[] = res[1]
  await handleCommentList(comemntList, {
    userId: ctx._user.id,
    flag: 1,
    showUserInfo
  })
  throw new Success({ total: res[0][0]['total'], data: comemntList })
}

// 获取二级评论列表
export const doCommentSecondGetList = async (ctx: Context) => {
  let pageNo = ctx._params.pageNo * 1 || 1
  const pageSize = ctx._params.pageSize * 1 || 10
  pageNo = (pageNo - 1) * pageSize
  // 处理评论者信息字段
  const showUserInfo = ctx._params.showUserInfo || '1'
  const userInfoField =
    showUserInfo === '1' ? ' t2.username AS create_user_name, t2.avatar AS create_user_avatar, ' : ''
  const replyUserInfoField =
    showUserInfo === '1' ? ' t3.username AS reply_user_name, t3.avatar AS reply_user_avatar, ' : ''
  const sql1 = 'SELECT COUNT(id) AS total FROM comments_second WHERE comment_first_id = ?'
  const data1 = [ctx._params.targetId]
  const sql2 = `
    SELECT 
      t1.id, t1.comment_first_id, t1.comment_first_target_id AS target_id, t6.type AS target_type, t1.reply_content AS content, 
      t1.create_user, t1.is_top, t1.create_time, t1.terminal, t1.reply_user, t4.id AS is_like, 
      ${userInfoField} 
      ${replyUserInfoField} 
      (SELECT COUNT(t5.id) FROM likes t5 WHERE t5.target_id = t1.id) AS like_count 
    FROM comments_second t1 
    LEFT JOIN users t2 ON t1.create_user = t2.id 
    LEFT JOIN users t3 ON t1.reply_user = t3.id 
    LEFT JOIN likes t4 ON (t1.id = t4.target_id AND t4.create_user = ?) 
    LEFT JOIN comments_first t6 ON t1.comment_first_id = t6.id 
    WHERE t1.comment_first_id = ? 
    ORDER BY t1.is_top DESC, t1.create_time 
    LIMIT ?, ?`
  const data2 = [ctx._user.id, ...data1, pageNo, pageSize]
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  const comemntList: CommentOptions[] = res[1]
  await handleCommentList(comemntList, { userId: ctx._user.id, flag: 2, showUserInfo })
  throw new Success({ total: res[0][0]['total'], data: comemntList })
}
