/**
 * @description 角色新增
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Terminal } from "../../../enums";
import { formatDate, getUuId } from "../../../utils/tools";

/**
 * 角色新增
*/
export const doRoleAdd = async (ctx: Context, next: Next) => {
  const sort: number = ctx.params.sort || 1
  const currentTime = formatDate(new Date())
  const sql: string = `INSERT roles (id, code, label, sort, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  const data = [getUuId(), ctx.params.code, ctx.params.label, sort, currentTime, currentTime, Terminal[ctx.terminal], ctx.params.remarks]
  await query(sql, data)
  throw new Success();
}
