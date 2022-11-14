/**
 * @description: 异常处理中间件
 * @author chen
 * @update 2021-01-20 10:22:18
 * @list 方法集合说明
 *   catchError // 全局捕捉异常集合
 */

import { Context, Next } from 'koa'
import { ExceptionHttp, ExceptionOptions } from '../../utils/http-exception'
import { Code, Message } from '../../enums'
import Logger from '../logger'

/**
 * 全局捕捉异常集合
 */
export async function catchError(ctx: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    const isExceptionHttp = error instanceof ExceptionHttp
    _saveLogger(error, isExceptionHttp)
    ctx.status = Code.success
    if (isExceptionHttp) {
      const data: ExceptionOptions = {
        code: error.code,
        message: error.message,
        data: error.data,
        total: error.total,
      }
      ctx.body = data
    } else {
      const data: ExceptionOptions = {
        code: Code.error,
        message: Message.error,
        data: error,
        total: 0,
      }
      ctx.body = data
    }
  }
}

// 记录响应日志
function _saveLogger(error: any, isExceptionHttp: boolean) {
  if (isExceptionHttp) {
    Logger.response({
      code: error.code,
      message: error.message,
      data: error.data,
    })
  } else {
    Logger.error({
      code: Code.error,
      message: '未知错误',
      error: error,
    })
  }
}
