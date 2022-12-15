/**
 * @description: 评论模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
 */

import { Context, Next } from 'koa'
import { Message } from '@/enums'
import { isExist } from '../convert'
import { validateRange } from '@/utils/validator'
import { ExceptionForbidden, ExceptionParameter } from '@/utils/http-exception'
import { isSuper } from '../convert'

/**
 * 新增时
 * 判断评论来源是否在系统资源来源标签500范围
 * 如果 type=501 判断 targetId 是否不存在
 */
export const doCommentAddConvert = async (ctx: Context, next: Next) => {
  // 判断评论来源是否在系统资源来源标签500范围
  await validateRange({
    value: ctx._params.type,
    range: '500',
    message: 'type参数必须为系统标签500范围'
  })
  if (ctx._params.type === '501') {
    const flag1 = await isExist({
      table: 'comments_first',
      where: [{ key: 'id', value: ctx._params.targetId }],
      noThrow: true
    })
    const flag2 = await isExist({
      table: 'comments_second',
      where: [{ key: 'id', value: ctx._params.targetId }],
      noThrow: true
    })
    if (!flag1 && !flag2) throw new ExceptionParameter({ message: Message.unexistComment })
  }
  await next()
}

/**
 * 删除指定某条评论时
 * 判断是否拥有管理员角色
 */
export const doCommentDeleteByIdConvert = async (ctx: Context, next: Next) => {
  // 判断是否管理员角色
  const flag = await isSuper(ctx._user.id)
  if (!flag) throw new ExceptionForbidden()
  await next()
}
