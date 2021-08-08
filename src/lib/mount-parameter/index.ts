/**
 * @description 挂载请求参数
 * @author chen
 * @update 2021-08-07 00:02:55
*/

import { Context, Next } from 'koa'
import { LinValidator } from '../lin-validator'
import { DataOptions } from './/interface'
// import Logger from '../../utils/logger'

/**
 * 挂载参数
 * 即 ctx.data 包含 {body query path header}
*/
export const mountParameter = async (ctx: Context, next: Next) => {
  const v: any = await new LinValidator().validate(ctx)
  ctx.data = <DataOptions>v.data
  ctx.params = getParams(ctx)
  // 记录日志
  global.requestCount++
  global.requestStart = process.hrtime.bigint()
  // Logger.request(ctx)
  await next()
}

/**
 * 根据请求自动获取参数
 * get delete 请求使用 ctx.data.query
 * post put 请求优先使用 ctx.data.body
*/
export const getParams = (ctx: Context): ObjectAny => {
  let params: ObjectAny = {}
  if (ctx.request.method === 'GET' || ctx.request.method === 'DELETE')
    params = ctx.data.query
  else if (ctx.request.method === 'POST' || ctx.request.method === 'PUT')
    params = { ...ctx.data.query, ...ctx.data.body }
  return params
}

