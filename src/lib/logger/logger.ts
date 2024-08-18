import { CodeValue } from '@/enums'
import { getCurrentTime, getIP, isObject2, toStringify } from '@/utils/tools'
import { Context } from 'koa'
import log4js from 'log4js'
import { clearExpiredLogs } from './config'
import { IS_PRINT_LOG } from '@/config'
import { isObject, isString } from 'lodash'

const getErrorMsg = (data: any) => {
  if (isObject2(data) || isObject(data)) return toStringify(data)
  return data
}

interface LoggerOption extends ObjectAny {
  message?: string
  data?: any
  code?: CodeValue
  error?: any
  requestCount?: number // 第几次请求
}

interface LoggerOptionResponse extends LoggerOption {
  requestStart: number // 请求开始时间，仅对 response 有效
}

interface LoggerOptionQuery extends LoggerOption {
  sql?: string
}

interface LoggerOptions {
  request: (ctx: Context) => void
  response: (options: LoggerOptionResponse) => void
  query: (options: LoggerOptionQuery | string) => void
  error: (options: LoggerOptionQuery | string) => void
  info: (options: LoggerOption | string, isLog?: boolean) => void
}

/**
 * 获取日志实例
 */
export const getLogger = (name: string): LoggerOptions => {
  const logger = log4js.getLogger(name)

  /**
   * 普通请求日志
   * @param ctx  上下文
   */
  const request = (ctx: Context) => {
    const current = getCurrentTime('YYYY-MM-DD HH:mm:ss.SSS')
    let logText: string = ''
    logText += `\n\n[请求日志信息 ${current}] [id: ${ctx._requestCount}]`
    logText += `\n  [requestStartTime]: ${ctx._requestStart},`
    logText += `\n  [requestOriginalUrl]: ${ctx.originalUrl},`
    logText += `\n  [requestIP]: ${getIP(ctx)},`
    if (ctx._user) {
      logText += `\n  [requestUser]: ${getErrorMsg(ctx._user)},`
    }
    logText += `\n  [requestAPI]: ${ctx.url},`
    logText += `\n  [requestMethod]: ${ctx.method},`
    logText += `\n  [requestParameters]: ${getErrorMsg({ ...ctx._data, header: undefined })}`
    logText += `\n  [requestHeaders]: ${getErrorMsg(ctx._data.header)}`
    logText = handleLogText(logText)
    if (IS_PRINT_LOG) console.log(logText)
    logger.info(logText)
  }

  /**
   * 响应日志
   * @param options 日志对象
   * @param ctx? 上下文
   */
  const response = (options: LoggerOptionResponse) => {
    const requestStart = options.requestStart || global._requestStart || 0
    const requestEnd = process.hrtime.bigint()
    const costTime = requestEnd - requestStart
    const current = getCurrentTime('YYYY-MM-DD HH:mm:ss.SSS')
    const requestCountId = getRequestCountId(options)
    let logText = ''
    logText += `\n\n[响应日志信息 ${current}]${requestCountId}`
    logText += `\n  [responseEndTime]: ${requestEnd}`
    logText += `\n  [totalTime]: ${Number(costTime) / 1e6}毫秒`
    logText = handleLogText(logText, options)
    if (IS_PRINT_LOG) console.log(logText)
    logger.info(logText)
  }

  /**
   * 数据库查询日志
   * @param options 日志对象
   */
  const query = (options: LoggerOptionQuery | string) => {
    const current = getCurrentTime('YYYY-MM-DD HH:mm:ss.SSS')
    const requestCountId = getRequestCountId(options)
    let logText = ''
    logText += `\n\n[数据库查询日志信息 ${current}]${requestCountId}`
    if (isString(options)) {
      logText = handleLogText(logText, { message: options })
    } else {
      logText = handleLogText(logText, options)
    }
    if (IS_PRINT_LOG) console.log(logText)
    logger.info(logText)
  }

  /**
   * 错误日志
   * @param options 日志对象或字符串
   * @param ctx? 上下文
   */
  const error = (options: LoggerOptionQuery | string) => {
    const current = getCurrentTime('YYYY-MM-DD HH:mm:ss.SSS')
    const requestCountId = getRequestCountId(options)
    let logText = ''
    logText += `\n\n[!!!错误日志信息!!! ${current}]${requestCountId}`
    if (isString(options)) {
      logText = handleLogText(logText, { message: options })
    } else {
      logText = handleLogText(logText, options)
    }
    console.error(logText)
    logger.error(logText)
  }

  /**
   * 提示信息日志
   * @param options 日志对象或字符串
   * @param ctx? 上下文
   */
  const info = (options: LoggerOption | string, isLog?: boolean) => {
    const current = getCurrentTime('YYYY-MM-DD HH:mm:ss.SSS')
    const requestCountId = getRequestCountId(options)
    let logText = ''
    logText += `\n\n[普通日志信息 ${current}]${requestCountId}`
    if (isString(options)) {
      logText = handleLogText(logText, { message: options })
    } else {
      logText = handleLogText(logText, options)
    }
    if (isLog) {
      console.log(logText)
    }
    logger.info(logText)
  }

  return {
    request,
    response,
    query,
    error,
    info
  }
}

/**
 * 处理日志数据结构
 */
function handleLogText(logText: string, options?: LoggerOption): string {
  clearExpiredLogs()
  if (options && options.code) logText += `\n  [code]: ${options.code}`
  if (options && options.message) logText += `\n  [message]: ${options.message}`
  if (options && options.sql) logText += `\n  [sql]: ${getErrorMsg(options.sql)}`
  if (options && options.data) logText += `\n  [data]: ${getErrorMsg(options.data)}`
  if (options && options.error) logText += `\n  [error]: ${getErrorMsg(options.error)}`
  return logText
}

/**
 * 获取第几次请求文本
 */
function getRequestCountId(options: LoggerOption | string) {
  let id = 0
  if (!isString(options) && options.requestCount) {
    id = options.requestCount
  }
  return id ? ` [id: ${id}]` : ''
}
