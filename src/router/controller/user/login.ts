/**
 * @description 用户登录方法
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'

/**
 * 用户登录
*/
export const doUserLogin = async (ctx: Context, next: Next) => {
  throw new Success({ message: '登录成功' })
}