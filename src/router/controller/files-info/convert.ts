/**
 * @description: 文件操作中间件拦截
 * @author chen
 * @update 2021-08-10 17:45:01
*/

import { Context, Next } from 'koa'
import { query } from "../../../db"
import { ExceptionParameter } from "../../../utils/http-exception"
import { Message } from "../../../enums"

/**
 * 获取时
 * 判断文件是否不存在
 * 如果为私密文件，判断是否为本人上传
*/
export const doFileGetOneConvert = async (ctx: Context, next: Next) => {
  // 判断是否包含非本人上传的文件
  const sql = `SELECT id, is_secret, create_user FROM files_info WHERE id =  ?`
  const res: any = await query(sql, ctx.params.id)
  // 判断文件是否不存在
  if (!(res && res.length))
    throw new ExceptionParameter({ message: Message.notFound })
  // 如果为私密文件，判断是否为本人上传
  if (res[0]['is_secret'] == '1' && res[0]['create_user'] !== ctx.user.id)
    throw new ExceptionParameter({ message: Message.lockedAuth })
  await next()
}

/**
 * 删除时
 * 判断是否包含非本人上传的文件，如果有返回非本人上传的ids
*/
export const doFileDeleteConvert = async (ctx: Context, next: Next) => {
  // 判断是否包含非本人上传的文件
  const sql = `SELECT id  FROM files_info t WHERE FIND_IN_SET(id, ?) and t.create_user != ?`
  const data = [ctx.params.ids, ctx.user.id]
  const res: any = await query(sql, data)
  if (res && res.length) {
    const illegal = res.map((item: any) => item.id).join(',')
    throw new ExceptionParameter({ message: (Message.forbidden + `，无法删除 ${illegal}`) })
  }
  await next()
}
