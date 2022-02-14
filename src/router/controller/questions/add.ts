/**
 * @description 问答新增
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
 * 问答新增
*/
export const doQuestionAdd = async (ctx: Context, next: Next) => {
  const paramsData = await validateRange([
    { value: ctx.params.isDraft, range: ['1', '0'], default: '0' },
    { value: ctx.params.isSecret, range: ['1', '0'], default: '0' }
  ], true)
  const sort: number = ctx.params.sort || 1
  const currentTime = formatDate(new Date())
  const params = ctx.params
  const sql: string = `INSERT questions (id, title, content, classify, is_draft, is_secret, sort, create_user, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const data = [getUuId(), params.title, params.content, params.classify, paramsData[0], paramsData[1], sort, ctx.user.id, currentTime, currentTime, Terminal[ctx.terminal], params.remarks]
  await query(sql, data)
  throw new Success();
}
