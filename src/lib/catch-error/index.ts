/**
 * @description: 异常处理中间件
 * @author chen
 * @update 2021-01-20 10:22:18
 * @list 方法集合说明
 *   catchError // 全局捕捉异常集合
 */

import { Context, Next } from 'koa'
import { ExceptionHttp, ExceptionOptions } from '@/utils/http-exception'
import { Code, Message } from '@/enums'
import { logger, loggerError } from '../logger'

/**
 * 全局捕捉异常集合
 */
export async function catchError(ctx: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    const isExceptionHttp = error instanceof ExceptionHttp
    _saveLogger(ctx, error, isExceptionHttp)
    ctx.status = Code.success
    if (isExceptionHttp) {
      const { code, message, data, total } = error as ExceptionHttp
      ctx.body = { code, message, data, total }
    } else {
      const data: ExceptionOptions = {
        code: Code.error,
        message: Message.error,
        data: error,
        total: 0
      }
      ctx.body = data
    }
  }
}

// 记录响应日志
function _saveLogger(ctx: Context, error: any, isExceptionHttp: boolean) {
  if (isExceptionHttp) {
    logger.response({
      code: error.code,
      message: error.message,
      data: error.data,
      requestCount: ctx._requestCount,
      requestStart: ctx._requestStart
    })
  } else {
    loggerError.error({
      code: Code.error,
      message: Message.unknown,
      error: error,
      requestCount: ctx._requestCount
    })
  }
}
