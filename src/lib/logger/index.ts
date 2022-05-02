/**
 * @description: 日志记录中间件
 * @author chen
 * @update 2021-08-11 10:18:40
*/

import log4js from 'log4js'
import logConfig from './config'
import _ from 'lodash'
import { Context } from 'koa'
import { IS_PRINT_LOG } from '../../config'
import { ParamsOptions, QueryParamsOptions, LoggerOptions } from './interface'
import { getIP } from '../../utils/tools'

// 加载配置文件
log4js.configure(logConfig)

// 调用预先定义的日志名称
const infoLogger = log4js.getLogger('infoLogger')

const formatLogger: LoggerOptions = {
  // 普通请求日志
  request(ctx: Context, options?: ParamsOptions) {
    let logText: string = ''
    logText += `\n\n---------- 接口请求开始 ${global.requestCount} ----------`
    logText += `\n\n[请求日志信息]`
    logText += `\n  [requestStartTime]: ${global.requestStart},`
    logText += `\n  [requestOriginalUrl]: ${ctx.originalUrl},`
    logText += `\n  [requestIP]: ${getIP(ctx)},`
    if (ctx._user)
      logText += `\n  [requestUser]: ${_getDataToString(ctx._user)},`
    logText += `\n  [requestAPI]: ${ctx.url},`
    logText += `\n  [requestMethod]: ${ctx.method},`
    logText += `\n  [requestParameters]: ${_getDataToString(ctx._data)}`
    logText = _handleParamsOptions(logText, options)
    if (IS_PRINT_LOG) console.log(logText);
    infoLogger.info(logText)
  },

  // 响应日志
  response(options: ParamsOptions) {
    global.requestEnd = process.hrtime.bigint()
    let costTime = global.requestEnd - global.requestStart
    let logText = ''
    logText += `\n\n[响应日志信息]`
    logText += `\n  [responseEndTime]: ${global.requestEnd}`
    logText += `\n  [totalTime]: ${Number(costTime) / 1e6}毫秒`
    logText = _handleParamsOptions(logText, options)
    logText += `\n\n---------- 接口响应结束 ${global.requestCount} ----------`
    if (IS_PRINT_LOG) console.log(logText);
    infoLogger.info(logText)
  },

  // 数据库查询日志
  query(options: QueryParamsOptions) {
    let logText = ''
    logText += `\n\n[数据库查询日志信息]`
    logText = _handleParamsOptions(logText, options)
    if (IS_PRINT_LOG) console.log(logText);
    infoLogger.info(logText)
  },

  // 错误日志
  error(options: ParamsOptions) {
    let logText = ''
    logText += `\n\n!!!!!!!!!! 错误日志信息开始 ${global.requestCount} !!!!!!!!!!`
    logText = _handleParamsOptions(logText, options)
    logText += `\n!!!!!!!!!! 错误日志信息结束 ${global.requestCount} !!!!!!!!!!`
    console.log(options.error);
    console.log(logText);
    infoLogger.info(logText)
  }
}

export default formatLogger

// 处理自定义日志信息数据
function _handleParamsOptions(logText: string, options?: ParamsOptions | QueryParamsOptions): string {
  if (options && options.code)
    logText += `\n  [code]: ${options.code}`
  if (options && options.message)
    logText += `\n  [message]: ${options.message}`
  if (options && options.sql)
    logText += `\n  [sql]: ${_getDataToString(options.sql)}`
  if (options && options.data)
    logText += `\n  [data]: ${_getDataToString(options.data)}`
  if (options && options.error)
    logText += `\n  [error]: ${_getDataToString(options.error)}`
  return logText
}

// 转为字符串
function _getDataToString(data: any) {
  try {
    if (_.isObject(data)) return JSON.stringify(data)
    return data
  } catch (error) {
    return data
  }
}










