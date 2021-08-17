/**
 * @description: 收藏模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
*/

import { Context, Next } from 'koa'
import { Message } from '../../../enums'
import { isExist } from '../convert'
import { validateRange } from '../../../utils/validator'

/**
 * 新增时 
 * 判断收藏是否已存在
 * 判断收藏来源是否在系统资源来源标签500范围
*/
export const doCollectionAddConvert = async (ctx: Context, next: Next) => {
  // 判断收藏是否已存在
  await isExist({
    table: 'collections',
    where: [
      { key: 'target_id', value: ctx.params.targetId },
      { key: 'create_user', value: ctx.user.id },
    ],
    throwType: true,
    message: Message.existCollection
  })
  // 判断收藏来源是否在系统资源来源标签500范围
  await validateRange({
    value: ctx.params.type,
    range: '500',
    message: 'type参数必须为系统标签500范围'
  })
  await next()
}

/**
 * 删除时 
 * 判断收藏是否不存在
*/
export const doCollectionDeleteConvert = async (ctx: Context, next: Next) => {
  // 判断收藏是否不存在
  await isExist({
    table: 'collections',
    where: [
      { key: 'target_id', value: ctx.params.targetId },
      { key: 'create_user', value: ctx.user.id },
    ],
    throwType: false,
    message: Message.unexistCollection
  })
  await next()
}
