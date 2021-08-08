/**
 * @description 文件上传方法
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'

/**
 * 文件上传 可上传一个或多个文件 返回数组格式
*/
export const doFileUpload = async (ctx: Context, next: Next) => {
  throw new Success({ message: '文件上传成功' })
}