/**
 * @description 数据库连接接口
 * @author chen
 * @update 2021-08-09 21:47:29
*/

import { ExceptionOptions } from '../utils/http-exception'

export interface ErrorOptions extends ExceptionOptions {
  err?: any,
  sql?: string,
  data?: any,
  code?: number
}

// 事务查询接口
export interface SQLOptions {
  sql: string,
  data?: any[] | string,
  noThrow?: boolean
}