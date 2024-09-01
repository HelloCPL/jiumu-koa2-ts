/**
 * @description 口令新增
 * @author cpl
 * @create 2023-03-13 16:22:12
 */

import { query } from '@/db'
import { Terminal } from '@/enums'
import { encrypt } from '@/utils/crypto'
import { Success } from '@/utils/http-exception'
import { formatDate, getUuId } from '@/utils/tools'
import { Context } from 'koa'

/*
 * 口令新增
 */
export const doCipherAdd = async (ctx: Context) => {
  const sort: number = ctx._params.sort || 1
  const currentTime = formatDate(new Date())
  const params = ctx._params
  const sql: string = `
    INSERT ciphers 
      (id, title, account, cipher, type, classify, sort, create_user, create_time, update_time, terminal) 
    VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const id = getUuId()
  const account = encrypt(params.account)
  const cipher = encrypt(params.cipher)
  const data = [
    id,
    params.title,
    account,
    cipher,
    params.type,
    params.classify,
    sort,
    ctx._user.id,
    currentTime,
    currentTime,
    Terminal[ctx._terminal]
  ]
  await query(sql, data)
  throw new Success({ data: id })
}
