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
  const href: string = ctx._params.href || '#'
  const sort: number = ctx._params.sort || 1
  const currentTime = formatDate(new Date())
  const sql: string = `INSERT permissions (id, code, label, href, sort, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const data = [getUuId(), ctx._params.code, ctx._params.label, href, sort, currentTime, currentTime, Terminal[ctx._terminal], ctx._params.remarks]
  await query(sql, data)
  throw new Success();
}
