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
 * 新增时
 * 判断 type 是否系统标签300范围
*/
export const doSourceAddConvert = async (ctx: Context, next: Next) => {
  await validateRange({
    value: ctx._params.type,
    range: '700',
    message: 'type参数必须为系统标签700范围'
  })
  await next()
}

/**
 * 修改时 
 * 判断资源是否不存在，且是否为自己发布的资源
 * 若传 isSecret 判断 isSecret 是否 ['1', '0'] 范围
 * 若传 type 判断type是否系统标签700范围
*/
export const doSourceUpdateConvert = async (ctx: Context, next: Next) => {
  // 判断资源是否不存在
  const sql = `SELECT id, create_user, type FROM sources WHERE id = ?`
  const res: any = await query(sql, ctx._params.id)
  if (!(res && res.length))
    throw new ExceptionParameter({ message: Message.unexistSource })
  ctx._params._type = ctx._params.type || res[0]['type']
  // 是否为自己发布的资源
  if (res[0]['create_user'] !== ctx._user.id)
    throw new ExceptionForbidden({ message: Message.forbidden })
  // 若传 isSecret 判断 isSecret 是否 ['1', '0'] 范围
  if (ctx._params.hasOwnProperty('isSecret')) {
    await validateRange({
      value: ctx._params.isSecret,
      range: ['1', '0'],
      message: `isSecret参数必须为['1', '0']范围`
    })
  }
  // 若传 type 判断type是否系统标签700范围
  if (ctx._params.hasOwnProperty('type')) {
    await validateRange({
      value: ctx._params.type,
      range: '700',
      message: 'type参数必须为系统标签700范围'
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
  const res: any = await query(sql, ctx._params.id)
  if (!(res && res.length))
    throw new ExceptionParameter({ message: Message.unexistSource })
  // 是否为自己发布的资源
  if (res[0]['create_user'] !== ctx._user.id)
    throw new ExceptionForbidden({ message: Message.forbidden })
  await next()
}
