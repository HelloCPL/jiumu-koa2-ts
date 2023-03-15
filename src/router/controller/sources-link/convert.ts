/**
 * @describe: 资源的外部资源信息模块中间件
 * @author: cpl
 * @create: 2023-02-19 14:45:57
 */

import { query } from '@/db'
import { Message } from '@/enums'
import { ExceptionForbidden, ExceptionParameter } from '@/utils/http-exception'
import { Context, Next } from 'koa'
import validator from 'validator'

/**
 * 修改时
 * 判断资源的外部资源信息是否不存在，且是否为自己发布的资源 使用 doSourceLinkDeleteConvert
 * 如果外部链接为真，判断是否为URL
 */
export const doSourceLinkUpdateConvert = async (ctx: Context, next: Next) => {
  // 如果外部链接为真，判断是否为URL
  if (ctx._params.hasOwnProperty('link')) {
    if (!validator.isURL(ctx._params.link)) {
      throw new ExceptionParameter({ message: 'link参数必须为URL格式' })
    }
  }
  await next()
}

/**
 * 删除时
 * 判断资源的外部资源信息是否不存在，且是否为自己发布的资源
 */
export const doSourceLinkDeleteConvert = async (ctx: Context, next: Next) => {
  // 判断资源是否不存在
  const sql = 'SELECT id, create_user FROM sources_link WHERE id = ?'
  const res: any = await query(sql, ctx._params.id)
  if (!(res && res.length)) throw new ExceptionParameter({ message: Message.unexistSourceLink })
  // 是否为自己发布的资源
  if (res[0]['create_user'] !== ctx._user.id) throw new ExceptionForbidden({ message: Message.forbidden })
  await next()
}
