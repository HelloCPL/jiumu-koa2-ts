/**
 * @description: 用户-特殊标签关联模块中间件
 * @author chen
 * @update 2021-08-11 14:12:49
*/


import { Context, Next } from 'koa'
import { Message } from '../../../enums'
import { validateRange } from '../../../utils/validator'
import { isExist } from '../convert'

/**
 * 新增时 
 * 判断用户是否不存在
 * 判断特殊标签是否不存在
 * 判断用户-特殊标签关联是否已存在
*/
export const doUserTagAddConvert = async (ctx: Context, next: Next) => {
  // 判断用户是否不存在
  await isExist({
    table: 'users',
    where: [{ key: 'id', value: ctx.params.userId }],
    throwType: false,
    message: Message.unexistUser
  })
  // 判断特殊标签是否不存在
  await validateRange({
    value: ctx.params.tagCode,
    range: '8888',
    message: 'tagCode参数必须为特殊标签8888范围'
  })
  // 判断用户-特殊标签关联是否已存在
  await isExist({
    table: 'users_tags',
    where: [
      { key: 'tag_code', value: ctx.params.tagCode },
      { key: 'user_id', value: ctx.params.userId },
    ],
    throwType: true,
    message: Message.existUserTag
  })
  await next()
}

/**
 * 删除时 
 * 判断用户-特殊标签关联是否不存在
*/
export async function doUserTagDeleteConvert(ctx: Context, next: Next) {
  // 判断用户-特殊标签关联是否不存在
  await isExist({
    table: 'users_tags',
    where: [{ key: 'id', value: ctx.params.id }],
    throwType: false,
    message: Message.unexistUserTag
  })
  await next()
}

/**
 * 根据指定特殊标签获取关联的所有用户时
 * 判断特殊标签是否不存在
*/
export async function doUserTagGetAllUserByTagCodeConvert(ctx: Context, next: Next) {
  // 判断特殊标签是否不存在
  await validateRange({
    value: ctx.params.tagCode,
    range: '8888',
    message: 'tagCode参数必须为特殊标签8888范围'
  })
  await next()
}
