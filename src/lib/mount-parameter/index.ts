/**
 * @description 挂载请求参数
 * @author chen
 * @update 2021-08-07 00:02:55
 */

import { Context, Next } from 'koa'
import { DataOptions } from './interface'
import { getTerminal } from '@/utils/tools'
import xss from '@/utils/xss'
import { isArray, isPlainObject, isString } from 'lodash'
import { logger } from '../logger'
import { CustomValidator } from '@/utils/validator'

/*
 * 初始化请求参数
 */
export const mountRequest = async (ctx: Context, next: Next) => {
  // 记录请求时间
  const cost = BigInt(2 * 1e6) // 中间消费时间
  global._requestStart = process.hrtime.bigint() - cost
  ctx._requestStart = global._requestStart
  // 记录请求次数
  global._requestCount++
  ctx._requestCount = global._requestCount
  logger.info({
    message: '处理请求参数挂载',
    requestCount: ctx._requestCount
  })
  const v: any = await new CustomValidator().validate(ctx, true)
  ctx._data = <DataOptions>v.__data__
  ctx._params = getParams(ctx)
  ctx._terminal = getTerminal(ctx)
  logger.request(ctx)
  // 请求上次请求的缓存结果
  global._results = {}
  await next()
}

/**
 * 根据请求自动获取参数
 * get delete 请求使用 ctx._data.query
 * post put 请求优先使用 ctx._data.body
 */
export const getParams = (ctx: Context): ObjectAny => {
  let params: ObjectAny = {}
  if (ctx.request.method === 'GET' || ctx.request.method === 'DELETE') params = ctx._data.query
  else if (ctx.request.method === 'POST' || ctx.request.method === 'PUT')
    params = { ...ctx._data.query, ...ctx._data.body }
  handleXSS(params)
  return params
}

// 递归对参数进行xss处理
function handleXSS(obj: any) {
  // 如果是对象
  if (isPlainObject(obj)) {
    for (const key in <ObjectAny>obj) {
      if (isString(obj[key])) {
        obj[key] = xss.process(obj[key])
      } else if (isPlainObject(obj[key]) || isArray(obj[key])) {
        handleXSS(obj[key])
      }
    }
  } else if (isArray(obj)) {
    for (let key = 0, len = obj.length; key < len; key++) {
      if (isString(obj[key])) {
        obj[key] = xss.process(obj[key])
      } else if (isPlainObject(obj[key]) || isArray(obj[key])) {
        handleXSS(obj[key])
      }
    }
  }
}
