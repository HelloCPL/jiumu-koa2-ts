/**
 * @description 用户自定义标签模块中间件
 * @author chen
 * @update 2021-08-07 15:12:57
*/

import { Context, Next } from 'koa'
import { Message } from '../../../enums'
import { isExist } from '../convert'
import { query } from '../../../db';
import { ExceptionParameter, ExceptionForbidden } from '../../../utils/http-exception';

/**
 * 新增时 
 * 判断 label create_user 是否已存在
*/
export const doTagCustomAddConvert = async (ctx: Context, next: Next) => {
  //  判断 label create_user 是否已存在
  await isExist({
    table: 'tags_custom',
    where: [
      { key: 'label', value: ctx._params.label },
      { key: 'create_user', value: ctx._user.id },
    ],
    throwType: true,
    message: Message.existTag
  })
  await next()
}

/**
 * 修改时 
 * 判断自定义标签是否不存在
 * 判断是否为用户本人创建的自定义标签
*/
export const doTagCustomUpdateConvert = async (ctx: Context, next: Next) => {
  //  判断自定义标签是否不存在
  const sql = `SELECT id, create_user FROM tags_custom WHERE id = ?`
  const res: any = await query(sql, ctx._params.id)
  if (!(res && res.length))
    throw new ExceptionParameter({ message: Message.unexistTag })
  // 判断是否为用户本人创建的自定义标签
  if (res[0]['create_user'] !== ctx._user.id)
    throw new ExceptionForbidden({ message: Message.forbidden })
  await next()
}
