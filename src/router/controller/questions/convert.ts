/**
 * @description: 问答模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
 */

import { Context, Next } from 'koa'
import { Message } from '@/enums'
import { validateRange } from '@/utils/validator'
import { query } from '@/db'
import { ExceptionParameter, ExceptionForbidden } from '@/utils/http-exception'

/**
 * 修改时
 * 判断问答是否不存在，且是否为自己发布的问答
 * 若传 isDraft 判断 isDraft 是否 ['1', '0'] 范围
 * 若传 isSecret 判断 isSecret 是否 ['1', '0'] 范围
 */
export const doQuestionUpdateConvert = async (ctx: Context, next: Next) => {
  // 判断问答是否不存在
  const sql = 'SELECT id, create_user FROM questions WHERE id = ?'
  const res: any = await query(sql, ctx._params.id)
  if (!(res && res.length)) throw new ExceptionParameter({ message: Message.unexistQuestion })
  // 是否为自己发布的问答
  if (res[0]['create_user'] !== ctx._user.id) throw new ExceptionForbidden({ message: Message.forbidden })
  // 若传 isDraft 判断 isDraft 是否 ['1', '0'] 范围
  if (ctx._params.hasOwnProperty('isDraft')) {
    await validateRange({
      value: ctx._params.isDraft,
      range: ['1', '0'],
      message: 'isDraft参数必须为[\'1\', \'0\']范围'
    })
  }
  // 若传 isSecret 判断 isSecret 是否 ['1', '0'] 范围
  if (ctx._params.hasOwnProperty('isSecret')) {
    await validateRange({
      value: ctx._params.isSecret,
      range: ['1', '0'],
      message: 'isSecret参数必须为[\'1\', \'0\']范围'
    })
  }
  await next()
}

/**
 * 删除时
 * 判断问答是否不存在，且是否为自己发布的问答
 */
export const doQuestionDeleteConvert = async (ctx: Context, next: Next) => {
  // 判断问答是否不存在
  const sql = 'SELECT id, create_user FROM questions WHERE id = ?'
  const res: any = await query(sql, ctx._params.id)
  if (!(res && res.length)) throw new ExceptionParameter({ message: Message.unexistQuestion })
  // 是否为自己发布的问答
  if (res[0]['create_user'] !== ctx._user.id) throw new ExceptionForbidden({ message: Message.forbidden })
  await next()
}
