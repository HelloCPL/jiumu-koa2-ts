/**
 * @description 小说章节新增
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Terminal } from "../../../enums";
import { formatDate, getUuId } from "../../../utils/tools";

/**
 * 小说章节新增
*/
export const doNovelChapterAdd = async (ctx: Context, next: Next) => {
  const sql: string = `INSERT novels_chapter (id, novel_id, title, content, sort, is_secret, is_draft, create_user, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  let currentTime = formatDate(new Date())
  const data = [getUuId(), ctx.params.novelId, ctx.params.title, ctx.params.content, ctx.params.sort, ctx.params.isSecret, ctx.params.isDraft, ctx.user.id, currentTime, currentTime, Terminal[ctx.terminal], ctx.params.remarks]
  await query(sql, data)
  throw new Success();
}