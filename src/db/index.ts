/**
 * @description: 连接数据库
 * @author chen
 * @update 2021-01-27 09:50:55
 * @list 方法集合说明
 *   query // 普通查询
 *   execTrans // 事务查询
*/

import MySQL from 'mysql2'
import Async from 'async'
import Config from '../config/index'
const DATABASE = Config.DATABASE
// import Logger from '../utils/logs'
import {ExceptionHttp} from '../utils/http-exception'

/**
 * 创建连接词
*/
const pool = MySQL.createPool({
  host: DATABASE.HOST,
  user: DATABASE.USER,
  password: DATABASE.PASSWORD,
  database: DATABASE.NAME,
  port: DATABASE.PORT,
  connectionLimit: DATABASE.CONNECTION_LIMIT
})

interface SQLOptions {
  sql: string,
  data?: any [] | string
}

/**
 * 普通查询
 * 参数 sql 查询语句；data? 查询数据 字符串或数据
*/
export function query(sql: string, data?: any) {
  return new Promise((resolve, reject) => {
    // Logger.query(sql, data)
    pool.query(sql, data, async (err, results) => {
      if (err)
        return throwError(reject, '服务器发生错误：数据库查询语句出错', null, sql, data)
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
    pool.getConnection((err, connection) => {
      if (err)
        return throwError(reject, '服务器发生错误：创建数据库连接失败', err)
      connection.beginTransaction(err => {
        if (err)
          return throwError(reject, '服务器发生错误：事务开启失败', err)
        const params = handleExceTransSQLParams(reject, connection, sqlList)
        // 串联执行多个异步
        Async.series(params, (err, results) => {
          if (err)
            return handleExceTransRoolback(reject, connection, err, '服务器发生错误：事务执行失败')
          connection.commit(err => {
            if (err)
              return handleExceTransRoolback(reject, connection, err, '服务器发生错误：事务执行失败')
            connection.release()
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
function handleExceTransSQLParams(reject: any, connection: any, sqlList: SQLOptions[]) {
  let queryArr: any[] = []
  sqlList.forEach(item => {
    // Logger.query(item.sql, item.data)
    let temp = function (cb: Function) {
      connection.query(item.sql, item.data, (err: any, results: any) => {
        if (err) {
          handleExceTransRoolback(reject, connection, err, '服务器发生错误：数据库查询语句出错', item)
        }
        else cb(null, results)
      })
    }
    queryArr.push(temp)
  })
  return queryArr
}

// 普通错误抛出异常
function throwError(reject: any, message: string, err?: any, ...args: any[]) {
  // Logger.error(message, ...args)
  reject(new ExceptionHttp({
    message,
    data: err
  }))
}

// 事务查询发生错误时回滚并返回错误
function handleExceTransRoolback(reject: any, connection: any, err: any, message: string, ...args: any[]) {
  connection.roolback(() => {
    // Logger.error(message, ...args)
    connection.release()
    reject(new ExceptionHttp({
      message,
      data: err
    }))
  })
}
