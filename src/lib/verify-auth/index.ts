/**
 * @description 权限校验
 * @author chen
 * @update 2021-01-21 14:23:03
 * @list 方法集合说明
 *   TokenAuth // token拦截中间件
 *   TokenVerify // 普通路由校验方法
 *   TokenGernerate // 生成 token
 *   getTokenKey // 获取token保存的key
*/

import {Context, Next} from 'koa'

export const TokenAuth =  async (ctx: Context, next: Next) => {
  console.log('----- TokenAuth ----');
  console.log(ctx.data);
  console.log(global.unlessPath);
  console.log(ctx);
  await next()
}

/**
 * 拦截普通路由请求 token 权限
*/
export const verifyRoute = async (ctx: Context, next: Next) => {
  await next()
}

/**
 * 拦截静态资源访问权限
*/
export const verifyStatic = async (ctx: Context, next: Next) => {

}














