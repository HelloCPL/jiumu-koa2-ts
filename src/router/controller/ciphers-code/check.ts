/**
 * @description 查看秘钥code是否存在
 * @author cpl
 * @create 2023-03-14 11:05:46
 */

import { query } from '@/db'
import { decrypt } from '@/utils/crypto'
import { Success } from '@/utils/http-exception'
import { Context } from 'koa'
import { isExistCipherCode } from './convert'

/*
 * 查看个人秘钥code是否存在
 */
export const doCipherCodeExistSelf = async (ctx: Context) => {
  const code = await isExistCipherCode(ctx)
  throw new Success({ data: !!code })
}

/*
 * 校验个人秘钥code是否正确
 */
export const doCipherCodeCheckSelf = async (ctx: Context) => {
  const sql = 'SELECT t1.code FROM ciphers_code t1 WHERE t1.create_user = ?'
  const res: any = await query(sql, ctx._user.id)
  if (res && res.length) {
    const code = decrypt(res[0].code)
    if (ctx._params.code === code) {
      throw new Success({ data: true })
    }
  }
  throw new Success({ data: false })
}
