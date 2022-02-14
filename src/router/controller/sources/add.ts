/**
 * @description 资源新增
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { execTrans } from "../../../db";
import { Terminal } from "../../../enums";
import { formatDate, getUuId } from "../../../utils/tools";
import { validateRange } from '../../../utils/validator'
import { SQLOptions } from "../../../db/interface";

/**
 * 资源新增
*/
export const doSourceAdd = async (ctx: Context, next: Next) => {
  const paramsData = await validateRange([
    { value: ctx.params.isSecret, range: ['1', '0'], default: '0' }
  ], true)
  const sort: number = ctx.params.sort || 1
  const currentTime = formatDate(new Date())
  const params = ctx.params
  const sql1: string = `INSERT sources (id, title, type, attachment, classify, is_secret, sort, create_user, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const data1 = [getUuId(), params.title, params.type, params.attachment, params.classify, paramsData[0], sort, ctx.user.id, currentTime, currentTime, Terminal[ctx.terminal], params.remarks]
  let sqlList: SQLOptions[] = [
    { sql: sql1, data: data1 }
  ]
  // 如果是 701 ，同步静态资源公开性
  if (params.type === '701') {
    const sql2: string = `UPDATE files_info SET is_secret = ? , update_time = ? WHERE create_user = ? AND FIND_IN_SET(id, ?)`
    const data2 = [paramsData[0], currentTime, ctx.user.id, params.attachment]
    sqlList.push({
      sql: sql2,
      data: data2,
      noThrow: true
    })
  }
  await execTrans(sqlList)
  throw new Success();
}
