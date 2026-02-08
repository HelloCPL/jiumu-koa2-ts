/**
 * @description 小说新增
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'
import { Terminal } from '@/enums'
import { formatDate, getUuId } from '@/utils/tools'

/**
 * 小说新增
 */
export const doNovelAdd = async (ctx: Context) => {
  const sort: number = ctx._params.sort || 1
  const currentTime = formatDate(new Date())
  const params = ctx._params
  const sql: string = `
    INSERT novels 
       (id, name, introduce, classify, type, author, is_draft, is_secret, sort, create_user, create_time, update_time, terminal, remarks) 
    VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const id = getUuId()
  const data = [
    id,
    params.name,
    params.introduce,
    params.classify,
    params.type,
    params.author,
    params.isDraft,
    params.isSecret,
    sort,
    ctx._user.id,
    currentTime,
    currentTime,
    Terminal[ctx._terminal],
    params.remarks
  ]
  await query(sql, data)
  throw new Success({ data: id })
}
