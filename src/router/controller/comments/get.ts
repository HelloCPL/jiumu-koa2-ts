/**
 * @description 角色获取
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { execTrans, query } from '@/db'
import { Context } from 'koa'
import { CommentOptions } from './interface'
import { getSelectWhereData } from '@/utils/handle-sql'

// 获取一级评论列表
export const doCommentFirstGetList = async (ctx: Context) => {
  const sqlParams = getSelectWhereData({
    valid: ['t1.create_user:userId'],
    data: ctx._params,
    prefix: 'AND'
  })
  let pageNo = ctx._params.pageNo * 1 || 1
  const pageSize = ctx._params.pageSize * 1 || 10
  pageNo = (pageNo - 1) * pageSize
  const sql1 = `SELECT COUNT(t1.id) AS total FROM comments_first t1 WHERE t1.target_id = ? AND t1.type = ? ${sqlParams.sql}`
  const data1 = [ctx._params.targetId, ctx._params.type, ...sqlParams.data]
  const sql2 = `SELECT t1.id, t1.target_id, t1.type AS target_type t1.content, t1.create_user, t2.username AS create_user_name, t1.is_top, t1.create_time, t1.terminal, t3.id AS is_like, (SELECT COUNT(t4.id) FROM likes t4 WHERE t4.target_id = t1.id  AND t1.id) AS like_count, (SELECT COUNT(t5.id) FROM comments_second t5 WHERE t5.comment_first_id = t1.id  AND t1.id) AS comment_count FROM comments_first t1 LEFT JOIN users t2 ON t1.create_user = t2.id LEFT JOIN likes t3 ON (t1.id = t3.target_id AND t3.create_user = ?) WHERE t1.target_id = ?  AND t1.type = ? ${sqlParams.sql} ORDER BY t1.is_top DESC, like_count DESC, comment_count DESC, t1.create_time LIMIT ?, ?`
  const data2 = [ctx._user.id, ...data1, pageNo, pageSize]
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  const comemntList: CommentOptions[] = res[1]
  await _handleCommentList(comemntList, ctx._user.id, 1, ctx._params.type)
  throw new Success({ total: res[0][0]['total'], data: comemntList })
}

// 获取二级评论列表
export const doCommentSecondGetList = async (ctx: Context) => {
  let pageNo = ctx._params.pageNo * 1 || 1
  const pageSize = ctx._params.pageSize * 1 || 10
  pageNo = (pageNo - 1) * pageSize
  const sql1 = 'SELECT COUNT(id) AS total FROM comments_second WHERE comment_first_id = ?'
  const data1 = [ctx._params.targetId]
  const sql2 =
    'SELECT t1.id, t1.comment_first_id, t1.comment_first_target_id AS target_id, t6.type AS target_type, t1.reply_content AS content, t1.create_user, t2.username AS create_user_name, t1.is_top, t1.create_time, t1.terminal, t1.reply_user, t3.username AS reply_user_name, t4.id AS is_like, (SELECT COUNT(t5.id) FROM likes t5 WHERE t5.target_id = t1.id  AND t1.id) AS like_count FROM comments_second t1 LEFT JOIN users t2 ON t1.create_user = t2.id LEFT JOIN users t3 ON t1.reply_user = t3.id LEFT JOIN likes t4 ON (t1.id = t4.target_id AND t4.create_user = ?) LEFT JOIN comments_first t6 ON t1.comment_first_id = t6.id WHERE t1.comment_first_id = ? ORDER BY t1.is_top DESC, t1.create_time LIMIT ?, ?'
  const data2 = [ctx._user.id, ...data1, pageNo, pageSize]
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  const comemntList: CommentOptions[] = res[1]
  await _handleCommentList(comemntList, ctx._user.id, 2)
  throw new Success({ total: res[0][0]['total'], data: comemntList })
}

// 处理评论列表 flag 1 一级评论 2 二级评论
async function _handleCommentList(data: CommentOptions[], userId: string, flag: number, type?: string) {
  for (let i = 0, len = data.length; i < len; i++) {
    // 处理是否点赞
    if (data[i].is_like) data[i].is_like = '1'
    else data[i].is_like = '0'
    // 处理是否为自己的评论
    if (data[i].create_user === userId) data[i].is_self = '1'
    else data[i].is_self = '0'
    // 处理子级
    data[i].children = []
    // 处理回复者
    if (flag === 1 || (flag === 2 && data[i].create_user === data[i].reply_user)) {
      data[i].reply_user = null
      data[i].reply_user_name = null
    }
    // 处理子级数量
    if (flag === 2) data[i].comment_count = 0
    // 处理是否评论目标作者
    if (flag === 1)
      data[i].is_target_user = await _getTargetCreateUser(data[i].target_id, <string>type, data[i].create_user)
    else if (flag === 2)
      data[i].is_target_user = await _getTargetCreateUser(
        data[i].target_id,
        <string>data[i].target_type,
        data[i].create_user
      )
    data[i].flag = flag
  }
}

// 可置顶资源类型
const tList: ObjectAny = {
  '502': {
    table: 'questions',
    label: '问答来源'
  },
  '503': {
    table: 'sources',
    label: '资源文件来源'
  },
  '504': {
    table: 'novels',
    label: '连载来源'
  },
  '505': {
    table: 'articles',
    label: '博客文章来源'
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
