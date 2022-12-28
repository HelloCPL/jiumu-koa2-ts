/**
 * @description 角色获取
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { execTrans, query } from '@/db'
import { Context } from 'koa'
import { CommentListParams, CommentOptions } from './interface'
// import { getSelectWhereData } from '@/utils/handle-sql'
import { getFileById } from '../files-info/get'

// 获取指定的某条评论
export const doCommentGetOne = async (ctx: Context) => {
  // 处理评论者信息字段
  const showUserInfo = ctx._params.showUserInfo || '1'
  const userInfoField =
    showUserInfo === '1' ? ' t2.username AS create_user_name, t2.avatar AS create_user_avatar, ' : ''
  const sql1 = 'SELECT t1.type FROM comments_first t1 WHERE t1.id = ?'
  const data = [ctx._params.id]
  const res1: any = await query(sql1, data)
  if (res1 && res1.length) {
    const type = res1[0].type
    const sql2 = `SELECT t1.id, t1.target_id, t1.type AS target_type, t7.label AS target_type_label, t1.content, t1.create_user, ${userInfoField} t1.is_top, t1.create_time, t1.terminal, t3.id AS is_like, (SELECT COUNT(t4.id) FROM likes t4 WHERE t4.target_id = t1.id  AND t1.id) AS like_count, (SELECT COUNT(t5.id) FROM comments_second t5 WHERE t5.comment_first_id = t1.id  AND t1.id) AS comment_count FROM comments_first t1 LEFT JOIN users t2 ON t1.create_user = t2.id LEFT JOIN likes t3 ON (t1.id = t3.target_id AND t3.create_user = ?) LEFT JOIN tags t7 ON (t1.type = t7.code) WHERE t1.id = ?`
    const data2 = [ctx._user.id, ctx._params.id]
    const res2: any = await query(sql2, data2)
    await _handleCommentList(res2, {
      userId: ctx._user.id,
      flag: 1,
      type,
      showUserInfo
    })
    throw new Success({ data: res2[0] })
  } else {
    const sql3 = 'SELECT t1.id FROM comments_second t1 WHERE t1.id = ?'
    const res3: any = await query(sql3, data)
    if (res3 && res3.length) {
      const type = '501'
      const replyUserInfoField =
        showUserInfo === '1' ? ' t3.username AS reply_user_name, t3.avatar AS reply_user_avatar, ' : ''
      const sql4 = `SELECT t1.id, t1.comment_first_id, t1.comment_first_target_id AS target_id, t6.type AS target_type, t1.reply_content AS content, t1.create_user, ${userInfoField} t1.is_top, t1.create_time, t1.terminal, t1.reply_user, ${replyUserInfoField} t4.id AS is_like, (SELECT COUNT(t5.id) FROM likes t5 WHERE t5.target_id = t1.id  AND t1.id) AS like_count FROM comments_second t1 LEFT JOIN users t2 ON t1.create_user = t2.id LEFT JOIN users t3 ON t1.reply_user = t3.id LEFT JOIN likes t4 ON (t1.id = t4.target_id AND t4.create_user = ?) LEFT JOIN comments_first t6 ON t1.comment_first_id = t6.id WHERE t1.id = ?`
      const data4 = [ctx._user.id, ctx._params.id]
      const res4: any = await query(sql4, data4)
      await _handleCommentList(res4, {
        userId: ctx._user.id,
        flag: 2,
        type,
        showUserInfo
      })
      throw new Success({ data: res4[0] })
    }
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
  const sql2 = `SELECT t1.id, t1.target_id, t1.type AS target_type, t7.label AS target_type_label, t1.content, t1.create_user, ${userInfoField} t1.is_top, t1.create_time, t1.terminal, t3.id AS is_like, (SELECT COUNT(t4.id) FROM likes t4 WHERE t4.target_id = t1.id  AND t1.id) AS like_count, (SELECT COUNT(t5.id) FROM comments_second t5 WHERE t5.comment_first_id = t1.id  AND t1.id) AS comment_count FROM comments_first t1 LEFT JOIN users t2 ON t1.create_user = t2.id LEFT JOIN likes t3 ON (t1.id = t3.target_id AND t3.create_user = ?) LEFT JOIN tags t7 ON (t1.type = t7.code) WHERE t1.target_id = ?  AND t1.type = ? ORDER BY t1.is_top DESC, like_count DESC, comment_count DESC, t1.create_time LIMIT ?, ?`
  const data2 = [ctx._user.id, ...data1, pageNo, pageSize]
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  const comemntList: CommentOptions[] = res[1]
  await _handleCommentList(comemntList, {
    userId: ctx._user.id,
    flag: 1,
    type: ctx._params.type,
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
  const sql2 = `SELECT t1.id, t1.comment_first_id, t1.comment_first_target_id AS target_id, t6.type AS target_type, t1.reply_content AS content, t1.create_user, ${userInfoField} t1.is_top, t1.create_time, t1.terminal, t1.reply_user, ${replyUserInfoField} t4.id AS is_like, (SELECT COUNT(t5.id) FROM likes t5 WHERE t5.target_id = t1.id  AND t1.id) AS like_count FROM comments_second t1 LEFT JOIN users t2 ON t1.create_user = t2.id LEFT JOIN users t3 ON t1.reply_user = t3.id LEFT JOIN likes t4 ON (t1.id = t4.target_id AND t4.create_user = ?) LEFT JOIN comments_first t6 ON t1.comment_first_id = t6.id WHERE t1.comment_first_id = ? ORDER BY t1.is_top DESC, t1.create_time LIMIT ?, ?`
  const data2 = [ctx._user.id, ...data1, pageNo, pageSize]
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  const comemntList: CommentOptions[] = res[1]
  await _handleCommentList(comemntList, { userId: ctx._user.id, flag: 2, showUserInfo })
  throw new Success({ total: res[0][0]['total'], data: comemntList })
}

// 处理评论列表 flag 1 一级评论 2 二级评论
async function _handleCommentList(data: CommentOptions[], params: CommentListParams) {
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i]
    // 处理是否点赞
    if (item.is_like) item.is_like = '1'
    else item.is_like = '0'
    // 处理是否为自己的评论
    if (item.create_user === params.userId) item.is_self = '1'
    else item.is_self = '0'
    // 处理子级
    item.children = []
    // 处理回复者
    if (params.flag === 1 || (params.flag === 2 && item.create_user === item.reply_user)) {
      item.reply_user = null
    }
    // 处理子级数量
    if (params.flag === 2) item.comment_count = 0
    // 处理是否评论目标作者
    if (params.flag === 1)
      item.is_target_user = await _getTargetCreateUser(item.target_id, <string>params.type, item.create_user)
    else if (params.flag === 2)
      item.is_target_user = await _getTargetCreateUser(
        item.target_id,
        <string>item.target_type,
        item.create_user
      )
    // 处理评论者或回复者头像
    if (params.showUserInfo === '1' && item.create_user_avatar)
      item.create_user_avatar = await getFileById(item.create_user_avatar, item.create_user)
    if (params.showUserInfo === '1' && item.reply_user && item.reply_user_avatar)
      item.reply_user_avatar = await getFileById(item.reply_user_avatar, item.reply_user)
    item.flag = params.flag
  }
}

// 可置顶资源类型
const tList: ObjectAny = {
  '502': {
    table: 'questions'
    // label: '问答来源'
  },
  '503': {
    table: 'sources'
    // label: '资源文件来源'
  },
  '504': {
    table: 'novels'
    // label: '连载来源'
  },
  '505': {
    table: 'articles'
    // label: '博客文章来源'
  }
}

// 获取评论目标的用户
async function _getTargetCreateUser(targetId: string, type: string, userId: string): Promise<string> {
  const t = tList[type]
  if (!t) return '0'
  const sql = `SELECT create_user FROM ${t.table} WHERE id = ?`
  const res: any = await query(sql, targetId)
  if (res && res.length && res[0]['create_user'] === userId) return '1'
  return '0'
}
