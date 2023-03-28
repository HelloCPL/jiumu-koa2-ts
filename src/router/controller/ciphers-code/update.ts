/**
 * @description 秘钥code修改
 * @author cpl
 * @create 2023-03-14 10:24:22
 */

import { query } from '@/db'
import { encrypt } from '@/utils/crypto'
import { getUpdateSetData } from '@/utils/handle-sql'
import { Success } from '@/utils/http-exception'
import { formatDate } from '@/utils/tools'
import { Context } from 'koa'

/**
 * 秘钥code修改
 */
export const doCipherCodeUpdate = async (ctx: Context) => {
  ctx._params.updateTime = formatDate(new Date())
  ctx._params.code = encrypt(ctx._params.code)
  const sqlParams = getUpdateSetData({
    valid: ['code', 'update_time'],
    data: ctx._params
  })
  const sql: string = `UPDATE ciphers_code SET ${sqlParams.sql} WHERE create_user = ?`
  const data = [...sqlParams.data, ctx._user.id]
  await query(sql, data)
  throw new Success()
}
