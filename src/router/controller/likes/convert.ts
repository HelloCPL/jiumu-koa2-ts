/**
 * @description: 点赞模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
*/

import { Context, Next } from 'koa'
import { Message } from '../../../enums'
import { isExist } from '../convert'
import { validateRange } from '../../../utils/validator'

/**
 * 新增时 
 * 判断点赞是否已存在
 * 判断点赞来源是否在系统资源来源标签500范围
*/
export const doLikeAddConvert = async (ctx: Context, next: Next) => {
  // 判断点赞是否已存在
  await isExist({
    table: 'likes',
    where: [
      { key: 'target_id', value: ctx._params.targetId },
      { key: 'create_user', value: ctx._user.id },
    ],
    throwType: true,
    message: Message.existLike
  })
  // 判断点赞来源是否在系统资源来源标签500范围
  await validateRange({
    value: ctx._params.type,
    range: '500',
    message: 'type参数必须为系统标签500范围'
  })
  await next()
}

/**
 * 删除时 
 * 判断点赞是否不存在
*/
export const doLikeDeleteConvert = async (ctx: Context, next: Next) => {
  // 判断点赞是否不存在
  await isExist({
    table: 'likes',
    where: [
      { key: 'target_id', value: ctx._params.targetId },
      { key: 'create_user', value: ctx._user.id },
    ],
    throwType: false,
    message: Message.unexistLike
  })
  await next()
}
