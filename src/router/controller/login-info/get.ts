/**
 * @description 登录记录模块获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { Context, Next } from 'koa';
import { query } from "../../../db";

// 获取指定的某个菜单
export const doLoginInfoGetList = async (ctx: Context, next: Next) => {
  console.log(ctx.data);

  throw new Success({ data: ctx.data });
}