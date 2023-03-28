/**
 * @description 口令删除
 * @author cpl
 * @create 2023-03-14 15:38:58
 */

import { query } from '@/db'
import { Success } from '@/utils/http-exception'
import { Context } from 'koa'

/*
 * 口令删除
 */
export const doCipherDelete = async (ctx: Context) => {
  const sql: string = 'DELETE FROM ciphers WHERE id = ?'
  await query(sql, ctx._params.id)
  throw new Success()
}
