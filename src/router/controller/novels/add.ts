/**
 * @description 小说新增
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
export const doNovelAdd = async (ctx: Context, next: Next) => {
  const paramsData = await validateRange([
    { value: ctx._params.isDraft, range: ['1', '0'], default: '0' },
    { value: ctx._params.isSecret, range: ['1', '0'], default: '0' }
  ], true)
  const currentTime = formatDate(new Date())
  const params = ctx._params
  const sql: string = `INSERT novels (id, name, introduce, classify, type, author, is_draft,is_secret,  create_user, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const data = [getUuId(), params.name, params.introduce, params.classify, params.type, params.author, paramsData[0], paramsData[1], ctx._user.id, currentTime, currentTime, Terminal[ctx._terminal], params.remarks]
  await query(sql, data)
  throw new Success();
}
