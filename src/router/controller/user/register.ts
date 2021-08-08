/**
 * @description 用户注册方法
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import {gernerateToken} from '../../../lib/verify-auth/token'
import Config from '../../../config'

/**
 * 用户注册
*/
export const doUserRegister = async (ctx: Context, next: Next) => {
  console.log(123);
  console.log(ctx.data);
  console.log(ctx.params);
  console.log(ctx);
  let params = {
    id: 'sqwewq',
    phone: '123123',
    terminal: 'pc',
    'user-agent': <string>ctx.request.header['user-agent']
  }
  const token = await gernerateToken(params, Config.TOKEN.VALID_TIME)
  const tokenRefresh = await gernerateToken(params, Config.TOKEN.REFRESH_VALID_TIME)
  throw new Success({ message: '注册成功', data: { token, tokenRefresh}})
}