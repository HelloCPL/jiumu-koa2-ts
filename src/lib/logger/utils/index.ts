// /**
//  * 日志类
//  */

// import { isString } from 'lodash'
// import { getCurrentTime } from '../../utils/date'
// import { CodeValue } from '../../enums'
// import log4js from 'log4js'
// import { Context } from 'koa'
// import { getErrorMsg } from '../../utils/tools'
// import { getIP } from '../../utils/mac'
// import { clearExpiredLogs } from './config'
// import { Log } from './config'

// interface ParamsOptions extends ObjectAny {
//   message?: string
//   data?: any
//   code?: CodeValue
//   error?: any
// }

// // 处理自定义日志信息数据
// function _handleParamsOptions(logText: string, options?: ParamsOptions): string {
//   clearExpiredLogs()
//   if (options && options.code) logText += `\n  [code]: ${options.code}`
//   if (options && options.message) logText += `\n  [message]: ${options.message}`
//   if (options && options.data) logText += `\n  [data]: ${getErrorMsg(options.data)}`
//   if (options && options.error) logText += `\n  [error]: ${getErrorMsg(options.error)}`
//   return logText
// }

// interface LoggerOptions {
//   request: (ctx: Context, options?: ParamsOptions) => void
//   response: (options: ParamsOptions, ctx?: Context) => void
//   error: (options: ParamsOptions | string, ctx?: Context) => void
//   info: (options: ParamsOptions | string, ctx?: Context) => void
// }

// export const getLogger = (name): LoggerOptions => {
//   const logger = log4js.getLogger(name)
//   return {
//     // 普通请求日志
//     request(ctx: Context, options?: ParamsOptions) {
//       const current = getCurrentTime('YYYY-MM-DD HH:mm:ss.SSS')
//       let logText: string = ''
//       logText += `\n\n[请求日志信息 ${current}] [id: ${ctx._requestCount}]`
//       logText += `\n  [requestStartTime]: ${ctx._requestStart},`
//       logText += `\n  [requestOriginalUrl]: ${ctx.originalUrl},`
//       logText += `\n  [requestIP]: ${getIP(ctx)},`
//       logText += `\n  [requestAPI]: ${ctx.url},`
//       logText += `\n  [requestMethod]: ${ctx.method},`
//       logText += `\n  [requestParameters]: ${getErrorMsg(ctx._data)}`
//       logText = _handleParamsOptions(logText, options)
//       logger.info(logText)
//     },
//     // 响应日志
//     response(options: ParamsOptions, ctx?: Context) {
//       const requestStart = ctx ? ctx._requestStart : global._requestStart || 0
//       const requestEnd = process.hrtime.bigint()
//       const costTime = requestEnd - requestStart
//       const current = getCurrentTime('YYYY-MM-DD HH:mm:ss.SSS')
//       let logText = ''
//       const requestCount = ctx ? ctx._requestCount : global._requestCount
//       logText += `\n\n[响应日志信息 ${current}] [id: ${requestCount}]`
//       logText += `\n  [responseEndTime]: ${requestEnd}`
//       logText += `\n  [totalTime]: ${Number(costTime) / 1e6}毫秒`
//       logText = _handleParamsOptions(logText, options)
//       logger.info(logText)
//     },

//     // 错误日志
//     error(options: ParamsOptions | string, ctx?: Context) {
//       const requestCount = ctx ? ctx._requestCount : global._requestCount
//       const msg = requestCount ? ` [id: ${requestCount}]` : ''
//       const current = getCurrentTime('YYYY-MM-DD HH:mm:ss.SSS')
//       let logText = ''
//       logText += `\n\n[!!!错误日志信息!!! ${current}]${msg}`
//       if (isString(options)) {
//         logText = _handleParamsOptions(logText, { message: options })
//       } else {
//         logText = _handleParamsOptions(logText, options)
//       }
//       console.error(logText)
//       logger.error(logText)
//     },

//     // 提示信息
//     info(options: ParamsOptions | string) {
//       const current = getCurrentTime('YYYY-MM-DD HH:mm:ss.SSS')
//       let logText = ''
//       logText += `\n\n[普通日志信息 ${current}]`
//       if (isString(options)) {
//         logText = _handleParamsOptions(logText, { message: options })
//       } else {
//         logText = _handleParamsOptions(logText, options)
//       }
//       logger.info(logText)
//     }
//   }
// }

// Log.init(['info', 'net'])
// const logger = getLogger('info')
// const loggerNet = getLogger('net')
// export { logger, loggerNet }
