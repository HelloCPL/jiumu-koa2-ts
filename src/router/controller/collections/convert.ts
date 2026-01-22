/**
 * @description: 收藏模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
 */

import { Context, Next } from 'koa'
import { Message } from '@/enums'
import { isExist } from '../convert'

/**
 * 新增时
 * 判断收藏是否已存在
 */
export const doCollectionAddConvert = async (ctx: Context, next: Next) => {
  // 判断收藏是否已存在
  await isExist({
    table: 'collections',
    where: [
      { key: 'target_id', value: ctx._params.targetId },
      { key: 'create_user', value: ctx._user.id }
    ],
    throwType: true,
    message: Message.existCollection
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
      { key: 'target_id', value: ctx._params.targetId },
      { key: 'create_user', value: ctx._user.id }
    ],
    throwType: false,
    message: Message.unexistCollection
  })
  await next()
}
