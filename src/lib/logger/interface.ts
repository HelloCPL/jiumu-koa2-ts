/**
 * @description: 日志接口
 * @author chen
 * @update 2021-08-12 10:52:40
 */

import { Context } from 'koa'
import { CodeValue } from '@/enums'

// 日志参数接口
export interface ParamsOptions extends ObjectAny {
  message?: string
  data?: any
  code?: CodeValue
  error?: any
}

export interface QueryParamsOptions extends ParamsOptions {
  sql?: string
}

// 日志方法接口
export interface LoggerOptions {
  request: (ctx: Context, options?: ParamsOptions) => void
  response: (options: ParamsOptions, ctx?: Context) => void
  query: (options: QueryParamsOptions) => void
  error: (options: ParamsOptions, ctx?: Context) => void
  info: (options: ParamsOptions, isLog?: boolean) => void
}
