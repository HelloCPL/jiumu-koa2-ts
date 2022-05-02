/**
 * @description 笔记新增
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Terminal } from "../../../enums";
import { formatDate, getUuId } from "../../../utils/tools";
import { validateRange } from '../../../utils/validator'

/**
 * 小说新增
*/
export const doNovelNoteAdd = async (ctx: Context, next: Next) => {
  const paramsData = await validateRange([
    { value: ctx._params.isSecret, range: ['1', '0'], default: '1' }
  ], true)
  const currentTime = formatDate(new Date())
  const params = ctx._params
  const sort: number = ctx._params.sort || 1
  const sql: string = `INSERT novels_note (id, target_ids, type, title, content, classify, sort,is_secret, create_user, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const data = [getUuId(), params.targetIds, params.type, params.title, params.content, params.classify, sort, paramsData[0], ctx._user.id, currentTime, currentTime, Terminal[ctx._terminal], params.remarks]
  await query(sql, data)
  throw new Success();
}