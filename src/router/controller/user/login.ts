/**
 * @description 用户登录方法
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import {analysisToken} from '../../../lib/verify-auth/token'

/**
 * 用户登录
*/
export const doUserLogin = async (ctx: Context, next: Next) => {
  // const a = await analysisToken(ctx)
  throw new Success({ message: '登录成功' })
}