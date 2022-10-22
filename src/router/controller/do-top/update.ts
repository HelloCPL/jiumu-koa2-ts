/**
 * @description 置顶/取消操作
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success, ExceptionForbidden, ExceptionParameter } from '../../../utils/http-exception'
import { query } from "../../../db";
import { CommentFindResult } from '../comments/interface'
import { _findCommentById } from '../comments/add'
import { Message } from "../../../enums";

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

/**
 * 问答、资源文件、小说、博客文章置顶/取消操作
*/
export const doTopUpdate = async (ctx: Context, next: Next) => {
  let t = tList[ctx._params.type]
  const sql: string = `UPDATE ${t.table} SET is_top = ? WHERE id = ?`
  const data = [ctx._params.isTop, ctx._params.id]
  await query(sql, data)
  throw new Success();
}

/**
 * 评论置顶/取消操作
*/
export const doTopUpdateComment = async (ctx: Context, next: Next) => {
  const commentInfo = <CommentFindResult>await _findCommentById(ctx._params.id)
  let sql = ''
  if (commentInfo.flag === 1) {
    sql = `UPDATE comments_first SET is_top = ? WHERE id = ? `
  } else if (commentInfo.flag === 2) {
    // 获取目标用户
    sql = `UPDATE comments_second SET is_top = ? WHERE id = ? `
  } else throw new ExceptionParameter({ message: Message.unexistComment })
  // 获取评论目标的用户
  const t = tList[commentInfo.comment_first_target_type]
  if (!t)
    throw new ExceptionForbidden()
  const sql2 = `SELECT create_user FROM ${t.table} WHERE id = ?`
  const res2: any = await query(sql2, commentInfo.comment_first_target_id)
  const flag = res2 && res2.length && res2[0]['create_user'] === ctx._user.id
  if (!flag)
    throw new ExceptionForbidden()
  // 置顶评论操作
  const data = [ctx._params.isTop, ctx._params.id]
  await query(sql, data)
  throw new Success();
}
