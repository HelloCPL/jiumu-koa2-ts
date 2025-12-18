/**
 * @description 秘钥code新增
 * @author cpl
 * @create 2023-03-14 10:09:32
 */

import { query } from '@/db'
import { Terminal } from '@/enums'
import { encrypt } from '@/utils/crypto'
import { Success } from '@/utils/http-exception'
import { formatDate, getUuId } from '@/utils/tools'
import { Context } from 'koa'

/*
 * 秘钥code新增
 */
export const doCipherCodeAdd = async (ctx: Context) => {
  const currentTime = formatDate(new Date())
  const params = ctx._params
  const code = encrypt(params.code)
  const sql: string = `
    INSERT ciphers_code 
      (id, code, create_user, create_time, update_time, terminal) 
    VALUES 
      (?, ?, ?, ?, ?, ?)`
  const id = getUuId()
  const data = [id, code, ctx._user.id, currentTime, currentTime, Terminal[ctx._terminal]]
  await query(sql, data)
  throw new Success({ data: null })
}
