/**
 * @description 文件删除方法
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'

/**
 * 文件删除 传 ids 可删除多个 用逗号隔开
*/
export const doFileDelete = async (ctx: Context, next: Next) => {
  throw new Success({ message: '文件删除成功' })
}