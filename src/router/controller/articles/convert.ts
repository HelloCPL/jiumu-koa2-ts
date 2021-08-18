/**
 * @description: 博客文章模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
*/

import { Context, Next } from 'koa'
import { Message } from '../../../enums'
import { isExist } from '../convert'
import { validateRange } from '../../../utils/validator'

/**
 * 新增时 
 * 判断 contentType 是否系统标签400范围
 * 判断 type 是否系统标签300范围
*/
export const doArticleAddConvert = async (ctx: Context, next: Next) => {
  // 判断 contentType 是否系统标签400范围
  // 判断 type 是否系统标签300范围
  await validateRange([
    {
      value: ctx.params.contentType,
      range: '400',
      message: 'contentType参数必须为系统标签400范围'
    },
    {
      value: ctx.params.type,
      range: '300',
      message: 'type参数必须为系统标签300范围'
    }
  ])
  await next()
}

