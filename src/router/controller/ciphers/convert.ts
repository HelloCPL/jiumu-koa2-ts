/**
 * @description 口令模块中间件
 * @author cpl
 * @create 2023-03-13 16:19:17
 */

import { query } from '@/db'
import { Message } from '@/enums'
import { ExceptionForbidden, ExceptionNotFound, ExceptionParameter } from '@/utils/http-exception'
import { validateRange } from '@/utils/validator'
import { Context, Next } from 'koa'
import { isExistCipherCode } from '../ciphers-code/convert'
import { isExist } from '../convert'

/**
 * 新增时
 * 判断 type 是否系统标签800范围
 * 判断 type=802 时个人秘钥code是否存在
 */
export const doCipherAddConvert = async (ctx: Context, next: Next) => {
  // 判断 type 是否系统标签300范围
  const type = ctx._params.type
  await validateRange({
    value: type,
    range: '800',
    message: 'type参数必须为系统标签800范围'
  })
  if (type === '802') {
    const flag = await isExistCipherCode(ctx)
    if (!flag)
      throw new ExceptionNotFound({
        message: `${Message.unexistCipherCode}，请添加个人秘钥后再操作`
      })
  }
  await next()
}

/**
 * 修改时
 * 判断口令是否不存在，且是否为自己的口令 使用 doCipherDeleteConvert
 * 若传 type 判断 type 是否系统标签800范围
 * 判断 type=802 时个人秘钥code是否存在
 */
export const doCipherUpdateConvert = async (ctx: Context, next: Next) => {
  // 判断 type 是否系统标签300范围
  const type = ctx._params.type
  if (ctx._params.hasOwnProperty('contentType')) {
    await validateRange({
      value: type,
      range: '800',
      message: 'type参数必须为系统标签800范围'
    })
  }
  // 判断 type=802 时个人秘钥code是否存在
  if (type === '802') {
    const flag = await isExistCipherCode(ctx)
    if (!flag)
      throw new ExceptionNotFound({
        message: `${Message.unexistCipherCode}，请添加个人秘钥后再操作`
      })
  }
  await next()
}

/**
 * 删除时
 * 判断口令是否不存在，且是否为自己的口令
 */
export const doCipherDeleteConvert = async (ctx: Context, next: Next) => {
  // 判断口令是否不存在
  const sql = 'SELECT id, create_user FROM ciphers WHERE id = ?'
  const res: any = await query(sql, ctx._params.id)
  if (!(res && res.length)) throw new ExceptionParameter({ message: Message.unexistCipher })
  // 且是否为自己的口令
  if (res[0]['create_user'] !== ctx._user.id) throw new ExceptionForbidden({ message: Message.forbidden })
  await next()
}
