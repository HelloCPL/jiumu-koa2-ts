/**
 * @description: 置顶操作模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
 */

import { Context, Next } from 'koa'
import { validateRange } from '../../../utils/validator'
import { ExceptionForbidden } from '../../../utils/http-exception'
import { isSuper } from '../convert';

/**
 * 置顶操作时
 * 判断 type 是否系统标签500范围
 * 判断是否拥有管理员角色
 */
export const doTopUpdateConvert = async (ctx: Context, next: Next) => {
  // 判断 type 是否系统标签500范围
  await validateRange([
    {
      value: ctx._params.type,
      range: ['502', '503', '504', '505'],
      message: 'type参数必须为系统标签500范围',
    },
  ])
  // 判断是否管理员角色
  let flag = await isSuper(ctx._user.id)
  if (!flag) throw new ExceptionForbidden()
  await next()
}
