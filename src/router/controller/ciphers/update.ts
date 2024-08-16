/**
 * @description 口令修改
 * @author cpl
 * @create 2023-03-14 14:50:04
 */

import { query, getUpdateFields } from '@/db'
import { encrypt } from '@/utils/crypto'
import { Success } from '@/utils/http-exception'
import { formatDate } from '@/utils/tools'
import { Context } from 'koa'

/*
 * 口令修改
 */
export const doCipherUpdate = async (ctx: Context) => {
  const params = ctx._params
  params.updateTime = formatDate(new Date())
  if (params.account) params.account = encrypt(params.account)
  if (params.cipher) params.cipher = encrypt(params.cipher)
  const fieldsResult = getUpdateFields({
    valid: ['title', 'account', 'cipher', 'type', 'classify', 'sort', 'update_time'],
    data: params
  })
  const sql: string = `UPDATE ciphers SET ${fieldsResult.sql} WHERE id = ?`
  const data = [...fieldsResult.data, params.id]
  await query(sql, data)
  throw new Success()
}
