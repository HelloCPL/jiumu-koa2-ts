/**
 * @description 挂载请求参数
 * @author chen
 * @update 2021-08-07 00:02:55
 */

import { Context, Next } from 'koa'
import { LinValidator } from '../lin-validator'
import { DataOptions } from './interface'
import { getTerminal } from '@/utils/tools'
import xss from '@/utils/xss'
import { isArray, isPlainObject, isString } from 'lodash'
import Logger from '../logger'

/*
 * 初始化请求参数
 */
export const mountRequest = async (ctx: Context, next: Next) => {
  Logger.info({ message: '处理参数挂载' })
  const v: any = await new LinValidator().validate(ctx)
  ctx._data = <DataOptions>v.data
  ctx._params = getParams(ctx)
  ctx._terminal = getTerminal(ctx)

  // 记录日志
  const cost = BigInt(2 * 1e6) // 中间消费时间
  global._requestStart = process.hrtime.bigint() - cost
  ctx._requestStart = global._requestStart
  global._requestCount++
  ctx._requestCount = global._requestCount
  global._results = {}
  Logger.request(ctx)
  await next()
}

/**
 * 挂载参数
 * 即 ctx._data 包含 {body query path header}
 */
export const mountParameter = async (ctx: Context, next: Next) => {
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
