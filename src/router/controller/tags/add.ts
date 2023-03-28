/**
 * @description 标签新增
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'
import { Terminal } from '@/enums'
import { formatDate, getUuId } from '@/utils/tools'

/**
 * 标签新增
 */
export const doTagAdd = async (ctx: Context) => {
  const parentCode: number = ctx._params.parentCode || ''
  const sort: number = ctx._params.sort || 1
  const currentTime = formatDate(new Date())
  const sql: string =
    'INSERT tags (id, parent_code, code, label, sort, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  const id = getUuId()
  const data = [
    id,
    parentCode,
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
