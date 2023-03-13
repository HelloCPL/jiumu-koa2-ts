/**
 * @description 密码模块中间件
 * @author cpl
 * @create 2023-03-13 16:19:17
 */

import { validateRange } from '@/utils/validator'
import { Context, Next } from 'koa'

/**
 * 新增时
 * 判断 type 是否系统标签800范围
 */
export const doCipherAddConvert = async (ctx: Context, next: Next) => {
  // 判断 type 是否系统标签300范围
  await validateRange({
    value: ctx._params.type,
    range: '800',
    message: 'type参数必须为系统标签800范围'
  })
  await next()
}
