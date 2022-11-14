/**
 * @description: 连接数据库
 * @author chen
 * @update 2021-01-27 09:50:55
 * @list 方法集合说明
 *   query // 普通查询
 *   execTrans // 事务查询
 */

import MySQL, { Pool, PoolConnection } from 'mysql2'
import Async from 'async'
import { DATABASE } from '@/config'
import { ExceptionHttp } from '@/utils/http-exception'
import { SQLOptions, ErrorOptions } from './interface'
import { Message } from '@/enums'
import Logger from '@/lib/logger'

/**
 * 创建连接池
 */
const pool: Pool = MySQL.createPool({
  host: DATABASE.HOST,
  user: DATABASE.USER,
  password: DATABASE.PASSWORD,
  database: DATABASE.NAME,
  port: DATABASE.PORT,
  connectionLimit: DATABASE.CONNECTION_LIMIT,
})

/**
 * 普通查询
 * 参数 sql 查询语句；data? 查询数据 字符串或数据
 */
export function query(sql: string, data?: any, noThrow?: boolean) {
  return new Promise((resolve, reject) => {
    pool.query(sql, data, async (err, results: any) => {
      if (err) return _throwError(reject, { sql, data, err })
      // 新增或更新或删除数据失败抛出错误
      const sqlStr = sql.toUpperCase()
      if (
        (sqlStr.startsWith('INSERT') || sqlStr.startsWith('UPDATE') || sqlStr.startsWith('DELETE')) &&
        results.affectedRows == 0 &&
        !noThrow
      )
        return _throwError(reject, { message: Message.errorDoing, sql, data, err })
      // 记录日志
      Logger.query({ message: Message.success, sql, data })
      resolve(results)
    })
  })
}

/**
 * 事务查询 按顺序查询但不依赖上一条查询结果 返回对应查询语句数量的数组
 * 参数 sqlList 查询列表 [{sql, data}, ...]
 */
export function execTrans(sqlList: SQLOptions[]) {
  return new Promise((resolve, reject) => {
    // 连接数据库
    pool.getConnection((err, connection: PoolConnection) => {
      if (err) return _throwError(reject, { message: Message.dbConnect, err })
      // 开启事务
      connection.beginTransaction((err) => {
        if (err) return _throwError(reject, { message: Message.dbExecTrancStart, err })
        const params = _handleExceTransSQLParams(reject, connection, sqlList)
        // 串联执行多个异步
        Async.series(params, (err, results) => {
          if (err)
            return _handleExceTransRollback(reject, connection, {
              message: Message.dbExecTrancStart,
              err,
            })
          connection.commit((err) => {
            if (err)
              return _handleExceTransRollback(reject, connection, {
                message: Message.dbExecTrancPerform,
                err,
              })
            connection.release()
            // 记录日志
            Logger.query({ message: Message.success, data: sqlList })
            resolve(results)
          })
        })
      })
    })
  })
}

/**
 * 处理多条 SQL 语句查询
 */
function _handleExceTransSQLParams(reject: any, connection: PoolConnection, sqlList: SQLOptions[]) {
  let queryArr: any[] = []
  sqlList.forEach((item) => {
    // Logger.query(item.sql, item.data)
    let temp = function (cb: Function) {
      connection.query(item.sql, item.data, (err: any, results: any) => {
        if (err)
          _handleExceTransRollback(reject, connection, {
            err,
            sql: item.sql,
            data: item.data,
          })
        else {
          // 新增或更新或删除数据失败抛出错误
          const sqlStr = item.sql.toUpperCase()
          if (
            (sqlStr.startsWith('INSERT') || sqlStr.startsWith('UPDATE') || sqlStr.startsWith('DELETE')) &&
            results.affectedRows == 0 &&
            !item.noThrow
          )
            _handleExceTransRollback(reject, connection, {
              message: Message.errorDoing,
              sql: item.sql,
              data: item.data,
              err,
            })
          else cb(null, results)
        }
      })
    }
    queryArr.push(temp)
  })
  return queryArr
}

// 普通错误抛出异常
function _throwError(reject: any, errorMessage: ErrorOptions) {
  Logger.query({
    code: errorMessage.code,
    message: errorMessage.message || Message.dbSQL,
    sql: errorMessage.sql,
    data: errorMessage.data,
    error: errorMessage.err,
  })
  reject(
    new ExceptionHttp({
      message: errorMessage.message || Message.dbSQL,
      code: errorMessage.code,
      data: errorMessage.err,
    })
  )
}

// 事务查询发生错误时回滚并返回错误
function _handleExceTransRollback(reject: any, connection: PoolConnection, errorMessage: ErrorOptions) {
  connection.rollback(() => {
    Logger.query({
      code: errorMessage.code,
      message: errorMessage.message || Message.dbSQL,
      sql: errorMessage.sql,
      data: errorMessage.data,
      error: errorMessage.err,
    })
    connection.release()
    reject(
      new ExceptionHttp({
        message: errorMessage.message || Message.dbSQL,
        code: errorMessage.code,
        data: errorMessage.err,
      })
    )
  })
}
