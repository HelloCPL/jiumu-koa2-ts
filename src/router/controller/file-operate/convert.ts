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
 * 文件删除时判断是否包含非本人上传的文件
*/
export const doFileDeleteIsPower = async (ctx: Context, next: Next) => {
  const sql = `SELECT id  FROM files_info t WHERE FIND_IN_SET(id, ?) and t.create_user != ?`
  const data = [ctx.params.ids, ctx.user.id]
  const res: any = await query(sql, data)
  if (res && res.length) {
    const illegal = res.map((item: any) => item.id).join(',')
    throw new ExceptionParameter({ message: (Message.forbidden + `，无法删除 ${illegal}`) })
  }
  await next()
}
