/**
 * @author chen
 * @description 笔记模块中间件
 * @update 2022-03-20 15:25:20
*/

import { Context, Next } from 'koa'
import { Message } from '../../../enums'
import { validateRange } from '../../../utils/validator'
import { query } from '../../../db';
import { ExceptionParameter, ExceptionForbidden } from '../../../utils/http-exception';
import { isExist } from '../convert'

/**
 * 新增时
 * 判断 type 是否系统标签500范围
*/
export const doNovelNoteAddConvert = async (ctx: Context, next: Next) => {
  // 判断 type 是否系统标签500范围
  if (ctx._params.hasOwnProperty('type')) {
    await validateRange({
      value: ctx._params.type,
      range: ['502', '503', '504', '505', '507'],
      message: `type参数必须为['502', '503', '504', '505', '507']范围`
    })
  }
  await next()
}

/**
 * 修改时
 * 判断笔记是否不存在，且是否为自己发布的笔记
 * 若类型为真 判断 type 是否系统标签500范围
 * 若传 isSecret 判断 isSecret 是否 ['1', '0'] 范围
*/
export const doNovelNoteUpdateConvert = async (ctx: Context, next: Next) => {
  // 判断笔记是否不存在
  const sql = `SELECT id, create_user FROM novels_note WHERE id = ?`
  const res: any = await query(sql, ctx._params.id)
  if (!(res && res.length))
    throw new ExceptionParameter({ message: Message.unexistNovelNote })
  // 是否为自己发布的笔记
  if (res[0]['create_user'] !== ctx._user.id)
    throw new ExceptionForbidden({ message: Message.forbidden })
  // 如果笔记类型为真 判断 type 是否系统标签500范围
  if (ctx._params.hasOwnProperty('type')) {
    await validateRange({
      value: ctx._params.type,
      range: ['502', '503', '504', '505', '507'],
      message: `type参数必须为['502', '503', '504', '505', '507']范围`
    })
  }
  // 若传 isSecret 判断 isSecret 是否 ['1', '0'] 范围
  if (ctx._params.hasOwnProperty('isSecret')) {
    await validateRange({
      value: ctx._params.isSecret,
      range: ['1', '0'],
      message: `isSecret参数必须为['1', '0']范围`
    })
  }
  await next()
}

/**
 * 删除时
 * 判断笔记是否不存在
 * 是否为自己发布的笔记
*/
export const doNovelNoteDeleteConvert = async (ctx: Context, next: Next) => {
  // 判断笔记是否不存在
  const sql = `SELECT id, create_user FROM novels_note WHERE id = ?`
  const res: any = await query(sql, ctx._params.id)
  if (!(res && res.length))
    throw new ExceptionParameter({ message: Message.unexistNovelNote })
  // 是否为自己发布的笔记
  if (res[0]['create_user'] !== ctx._user.id)
    throw new ExceptionForbidden({ message: Message.forbidden })
  await next()
}
