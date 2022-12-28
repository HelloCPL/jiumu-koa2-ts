/**
 * @description 角色新增
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'
import { Terminal } from '@/enums'
import { formatDate, getUuId } from '@/utils/tools'

/**
 * 角色新增
 */
export const doRoleAdd = async (ctx: Context) => {
  const sort: number = ctx._params.sort || 1
  const currentTime = formatDate(new Date())
  const sql: string =
    'INSERT roles (id, code, label, sort, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  const id = getUuId()
  const data = [
    id,
    ctx._params.code,
    ctx._params.label,
    sort,
    currentTime,
    currentTime,
    Terminal[ctx._terminal],
    ctx._params.remarks
  ]
  await query(sql, data)
  throw new Success({ data: id })
}
