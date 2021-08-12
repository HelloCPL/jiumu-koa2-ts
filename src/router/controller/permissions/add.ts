/**
 * @description 权限新增
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Terminal } from "../../../enums";
import { formatDate, getUuId } from "../../../utils/tools";

/**
 * 权限新增
*/
export const doPermissionAdd = async (ctx: Context, next: Next) => {
  const parentCode: string = ctx.params.parentCode || '0'
  const href: string = ctx.params.href || '#'
  const sort: number = ctx.params.sort || 1
  const currentTime = formatDate(new Date())
  const sql: string = `INSERT permissions (id, parent_code, code, label, href, sort, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const data = [getUuId(), parentCode, ctx.params.code, ctx.params.label, href, sort, currentTime, currentTime, Terminal[ctx.terminal], ctx.params.remarks]
  await query(sql, data)
  throw new Success();
}