/**
 * @author chen
 * @description 小说章节中间件
 * @update 2021-10-28 10:55:36
*/

import { Context, Next } from 'koa'
import { Message } from '../../../enums'
import {isExist} from '../convert'
import { validateRange } from '../../../utils/validator'

/**
 * 新增时
 * 判断小说id是否不存在
*/
export const doNovelChapterAddConvert = async (ctx: Context, next: Next) => {
  // 判断小说id是否不存在
  await isExist({
    table: 'novels',
    where: [
      { key: 'id', value: ctx.params.novelId },
    ],
    throwType: false,
    message: Message.existLike
  })
}
