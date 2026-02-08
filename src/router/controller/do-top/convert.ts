/**
 * @description: 置顶操作模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
 */

import { Context, Next } from 'koa'
import { ExceptionForbidden } from '@/utils/http-exception'
import { isSuper } from '../convert'
import { Message } from '@/enums'

/**
 * 置顶操作时
 * 判断是否拥有管理员角色
 */
export const doTopUpdateConvert = async (ctx: Context, next: Next) => {
  // 判断是否管理员角色
  const flag = await isSuper(ctx._user.id)
  if (!flag) throw new ExceptionForbidden({ message: Message.forbiddenSuper })
  await next()
}
