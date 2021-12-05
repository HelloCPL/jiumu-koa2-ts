/**
 * @description 置顶/取消操作
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success, ExceptionForbidden } from '../../../utils/http-exception'
import { query } from "../../../db";
import { CommentFindResult } from '../comments/interface'
import { _findCommentById } from '../comments/add'

// 可置顶资源类型
const tList: ObjectAny = {
  '502': 'comments_first',
  '503': 'sources',
  '504': 'novels',
  '505': 'articles'
}

/**
 * 问答、资源文件、小说、博客文章置顶/取消操作
*/
export const doTopUpdate = async (ctx: Context, next: Next) => {
  let t = tList[ctx.params.type]
  let sqlParams = ''
  if (ctx.params.type === '502')
    sqlParams = 'AND type = 502'
  const sql: string = `UPDATE ${t} SET is_top = ? WHERE id = ? ${sqlParams}`
  const data = [ctx.params.isTop, ctx.params.id]
  await query(sql, data)
  throw new Success();
}

/**
 * 评论置顶/取消操作
*/
export const doTopUpdateComment = async (ctx: Context, next: Next) => {
  const commentInfo = <CommentFindResult>await _findCommentById(ctx.params.id)
  let sql = ''
  let sql1 = ''
  if (commentInfo.flag === 1) {
    sql1 = `SELECT type, target_id FROM comments_first WHERE id = ?`
    sql = `UPDATE comments_first SET is_top = ? WHERE id = ? `
  }
  if (commentInfo.flag === 2) {
    // 获取目标用户
    sql1 = `SELECT t2.type, t2.target_id FROM comments_second t1 LEFT JOIN comments_first t2 ON t1.comment_first_id = t2.id WHERE t1.id = ?`
    sql = `UPDATE comments_second SET is_top = ? WHERE id = ? `
  }
  // 获取评论目标的用户
  const res: any = await query(sql1, ctx.params.id)
  const type = res[0]['type']
  if (!type || type === '502')
    throw new ExceptionForbidden()
  const t = tList[type]
  const sql2 = `SELECT create_user FROM ${t} WHERE id = ?`
  const res2: any = await query(sql2, res[0]['target_id'])
  const flag = res2 && res2[0]['create_user'] === ctx.user.id
  if (!flag)
    throw new ExceptionForbidden()
  const data = [ctx.params.isTop, ctx.params.id]
  await query(sql, data)
  throw new Success();
}
