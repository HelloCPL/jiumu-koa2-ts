/**
 * @description: 资源模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
*/

import { Context, Next } from 'koa'
import { Message } from '../../../enums'
import { validateRange } from '../../../utils/validator'
import { query } from '../../../db';
import { ExceptionParameter, ExceptionForbidden } from '../../../utils/http-exception';


/**
 * 修改时 
 * 判断资源是否不存在，且是否为自己发布的资源
 * 若传 isSecret 判断 isSecret 是否 ['1', '0'] 范围
 * 若传 isTop 判断 isTop 是否 ['1', '0'] 范围
*/
export const doSourceUpdateConvert = async (ctx: Context, next: Next) => {
  // 判断资源是否不存在
  const sql = `SELECT id, create_user FROM sources WHERE id = ?`
  const res: any = await query(sql, ctx.params.id)
  if (!(res && res.length))
    throw new ExceptionParameter({ message: Message.unexistSource })
  // 是否为自己发布的资源
  if (res[0]['create_user'] !== ctx.user.id)
    throw new ExceptionForbidden({ message: Message.forbidden })
  // 若传 isSecret 判断 isSecret 是否 ['1', '0'] 范围
  if (ctx.params.hasOwnProperty('isSecret')) {
    await validateRange({
      value: ctx.params.isSecret,
      range: ['1', '0'],
      message: `isSecret参数必须为['1', '0']范围`
    })
  }
  // 若传 isTop 判断 isTop 是否 ['1', '0'] 范围
  if (ctx.params.hasOwnProperty('isTop')) {
    await validateRange({
      value: ctx.params.isTop,
      range: ['1', '0'],
      message: `isTop参数必须为['1', '0']范围`
    })
  }
  await next()
}

/**
 * 删除时 
 * 判断资源是否不存在，且是否为自己发布的资源
*/
export const doSourceDeleteConvert = async (ctx: Context, next: Next) => {
  // 判断资源是否不存在
  const sql = `SELECT id, create_user FROM sources WHERE id = ?`
  const res: any = await query(sql, ctx.params.id)
  if (!(res && res.length))
    throw new ExceptionParameter({ message: Message.unexistSource })
  // 是否为自己发布的资源
  if (res[0]['create_user'] !== ctx.user.id)
    throw new ExceptionForbidden({ message: Message.forbidden })
  await next()
}
