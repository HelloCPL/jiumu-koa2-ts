/**
 * @description: 博客文章模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
 */

import { Context, Next } from 'koa'
import { Message } from '@/enums'
import { validateRange } from '@/utils/validator'
import { query } from '@/db'
import { ExceptionParameter, ExceptionForbidden } from '@/utils/http-exception'

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
      value: ctx._params.contentType,
      range: '400',
      message: 'contentType参数必须为系统标签400范围'
    },
    {
      value: ctx._params.type,
      range: '300',
      message: 'type参数必须为系统标签300范围'
    }
  ])
  await next()
}

/**
 * 修改时
 * 判断博客文章是否不存在，且是否为自己发布的博客文章
 * 若传 contentType 判断 contentType 是否系统标签400范围
 * 若传 type 判断 type 是否系统标签300范围
 * 若传 isDraft 判断 isDraft 是否 ['1', '0'] 范围
 * 若传 isSecret 判断 isSecret 是否 ['1', '0'] 范围
 * 若传 isTop 判断 isTop 是否 ['1', '0'] 范围
 */
export const doArticleUpdateConvert = async (ctx: Context, next: Next) => {
  // 判断博客文章是否不存在
  const sql = 'SELECT id, create_user FROM articles WHERE id = ?'
  const res: any = await query(sql, ctx._params.id)
  if (!(res && res.length)) throw new ExceptionParameter({ message: Message.unexistArticle })
  // 是否为自己发布的博客文章
  if (res[0]['create_user'] !== ctx._user.id) throw new ExceptionForbidden({ message: Message.forbidden })
  // 若传 contentType 判断 contentType 是否系统标签400范围
  if (ctx._params.hasOwnProperty('contentType')) {
    await validateRange({
      value: ctx._params.contentType,
      range: '400',
      message: 'contentType参数必须为系统标签400范围'
    })
  }
  // 若传 type 判断 type 是否系统标签300范围
  if (ctx._params.hasOwnProperty('type')) {
    await validateRange({
      value: ctx._params.type,
      range: '300',
      message: 'type参数必须为系统标签300范围'
    })
  }
  // 若传 isDraft 判断 isDraft 是否 ['1', '0'] 范围
  if (ctx._params.hasOwnProperty('isDraft')) {
    await validateRange({
      value: ctx._params.isDraft,
      range: ['1', '0'],
      message: "isDraft参数必须为['1', '0']范围"
    })
  }
  // 若传 isSecret 判断 isSecret 是否 ['1', '0'] 范围
  if (ctx._params.hasOwnProperty('isSecret')) {
    await validateRange({
      value: ctx._params.isSecret,
      range: ['1', '0'],
      message: "isSecret参数必须为['1', '0']范围"
    })
  }
  await next()
}

/**
 * 删除时
 * 判断博客文章是否不存在，且是否为自己发布的博客文章
 */
export const doArticleDeleteConvert = async (ctx: Context, next: Next) => {
  // 判断博客文章是否不存在
  const sql = 'SELECT id, create_user FROM articles WHERE id = ?'
  const res: any = await query(sql, ctx._params.id)
  if (!(res && res.length)) throw new ExceptionParameter({ message: Message.unexistArticle })
  // 是否为自己发布的博客文章
  if (res[0]['create_user'] !== ctx._user.id) throw new ExceptionForbidden({ message: Message.forbidden })
  await next()
}
