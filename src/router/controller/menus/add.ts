/**
 * @description 菜单新增
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Terminal } from "../../../enums";
import { formatDate, getUuId } from "../../../utils/tools";

/**
 * 菜单新增
*/
export const doMenuAdd = async (ctx: Context, next: Next) => {
  const parentCode: number = ctx.params.parentCode || ''
  const sort: number = ctx.params.sort || 1
  const currentTime = formatDate(new Date())
  const sql: string = `INSERT menus (id, parent_code, code, label, sort, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const data = [getUuId(), parentCode, ctx.params.code, ctx.params.label, sort, currentTime, currentTime, Terminal[ctx.terminal], ctx.params.remarks]
  await query(sql, data)
  throw new Success();
}
