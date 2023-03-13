/**
 * @description 个人密码的秘钥code 模块中间件
 * @author cpl
 * @create 2023-03-13 17:47:58
 */

import { Message } from '@/enums'
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
