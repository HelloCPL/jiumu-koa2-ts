/**
 * @description: 异常处理中间件
 * @author chen
 * @update 2021-01-20 10:22:18
 * @list 方法集合说明
 *   catchError // 全局捕捉异常集合
 */

import { Context } from 'koa'
import { ExceptionHttp, Success } from '../../utils/http-exception'
import { Code } from '../../enums'
// import Logger from '../../utils/logger'

// import CONFIG from '../../config/index'

/**
 * 全局捕捉异常集合
 */
export async function catchError(ctx: Context, next: any) {
  try {
    await next()
  } catch (error) {
    const isExceptionHttp = error instanceof ExceptionHttp
    // const isDev = CONFIG.ENV === 'dev'
    // if (isDev && !isExceptionHttp) 
    throwError(error, isExceptionHttp)
    ctx.status = Code.success
    if (isExceptionHttp) {
      let data = {
        code: error.code,
        message: error.message,
        data: error.data,
        total: error.total
      }
      if (error.code !== Code.locked)
        // Logger.response(ctx, data)
      ctx.body = data
    } else {
      let data = {
        code: Code.error,
        message: Code.error,
        data: null,
        total: 0
      }
      // Logger.response(ctx, data)
      ctx.body = data
    }
  }
}

// 打印捕捉的错误
function throwError(error: Error, isExceptionHttp: boolean) {
  let isSuccess = error instanceof Success
  if (isSuccess) return
  if (isExceptionHttp) {
    // Logger.error('已知错误', error, '已知错误')
  } else {
    // Logger.error('未知错误', error, '未知错误')
  }
}
