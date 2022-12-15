/**
 * @description 数据库连接接口
 * @author chen
 * @update 2021-08-09 21:47:29
 */

import { CodeValue } from '@/enums'
import { ExceptionOptions } from '@/utils/http-exception'

export interface ErrorOptions extends ExceptionOptions {
  err?: any
  sql?: string
  data?: any
  code?: CodeValue
}

// 事务查询接口
export interface SQLOptions {
  sql: string
  data?: any[] | string
  noThrow?: boolean
}

// redis参数接口
export interface RedisOptions {
  key: string
  value: any
}
