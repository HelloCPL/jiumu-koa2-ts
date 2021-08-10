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

import { Context, Next } from 'koa'
import { analysisToken } from './token'
import { Code } from '../../enums'
import { ExceptionHttp } from '../../utils/http-exception'

/**
 * 拦截普通路由请求 token 权限
*/
export const verifyRoute = async (ctx: Context, next: Next) => {
  const url = _getFullPath(ctx.request.url)
  if (global.unlessPath.indexOf(url) === -1) {
    const tokenInfo = await analysisToken(ctx)
    if (tokenInfo.code === Code.success) {
      ctx.user = tokenInfo.data
      await next()
    } else throw new ExceptionHttp(tokenInfo)
  } else await next()
}
// 获取请求路径
function _getFullPath(path: string): string {
  let index = path.indexOf('?')
  if (index !== -1)
    path = path.substring(0, index)
  return path
}

/**
 * 拦截静态资源访问权限
*/
export const verifyStatic = async (ctx: Context, next: Next) => {

}














