/**
 * @description 个人密码的秘钥code 模块中间件
 * @author cpl
 * @create 2023-03-13 17:47:58
 */

import { query } from '@/db'
import { Message } from '@/enums'
import { decrypt } from '@/utils/crypto'
import { ExceptionNotFound, ExceptionParameter } from '@/utils/http-exception'
import { Next } from 'koa'
import { Context } from 'vm'
import { isExist } from '../convert'

/**
 * 新增时
 * 判断是否已存在
 */
export const doCipherCodeAddConvert = async (ctx: Context, next: Next) => {
  // 判断是否已存在
  await isExist({
    table: 'ciphers_code',
    where: [{ key: 'create_user', value: ctx._user.id }],
    throwType: true,
    message: Message.existCipherCode
  })
  await next()
}

/**
 * 编辑时
 * 判断是否不存在
 * 验证 oldCode 是否一致
 * 验证新 code 是否与老的 code 一样
 */
export const doCipherCodeUpdateConvert = async (ctx: Context, next: Next) => {
  const sql: string = 'SELECT t1.id, t1.code FROM ciphers_code t1 WHERE t1.create_user = ?'
  const res: any = await query(sql, ctx._user.id)
  if (!res.length) {
    throw new ExceptionNotFound({
      message: Message.unexistCipherCode
    })
  }
  const oldCode = ctx._params.oldCode
  const code = ctx._params.code
  const _code = decrypt(res[0].code)
  if (oldCode !== _code) {
    throw new ExceptionParameter({
      message: `参数oldCode${Message.errorCipherCode}`
    })
  }
  if (code === _code) {
    throw new ExceptionParameter({
      message: '参数code新的秘钥不能与老的秘钥相同'
    })
  }
  await next()
}

/*
 * 校验个人秘钥code是否存在并返回
 */
export const isExistCipherCode = async (ctx: Context): Promise<string> => {
  let code = ''
  const sql: string = 'SELECT t1.id, t1.code FROM ciphers_code t1 WHERE t1.create_user = ?'
  const res: any = await query(sql, ctx._user.id)
  if (res && res.length) {
    code = decrypt(res[0].code)
  }
  return code
}
