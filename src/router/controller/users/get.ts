/**
 * @description: 用户信息获取
 * @author chen
 * @update 2021-08-16 14:44:43
 */

import { Success } from '@/utils/http-exception'
import { query, execTrans, getSelectWhereKeyword } from '@/db'
import { Context } from 'koa'
import { UserOptions, UserListParams, UserListReturn } from './interface'
import { handleUser } from './utils'

// 获取本用户信息
export const doUserGetSelf = async (ctx: Context) => {
  const data = await getUserOne(ctx._user.id)
  throw new Success({ data })
}

// 获取指定用户基本信息
export const doUserGetBase = async (ctx: Context) => {
  const data = await getUserOne(ctx._params.id)
  throw new Success({ data })
}

// 获取用户列表基本信息
export const doUserGetList = async (ctx: Context) => {
  const params = {
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    keyword: ctx._params.keyword,
    highlight: ctx._params.highlight,
    simple: ctx._params.simple
  }
  const data = await getUserList(params)
  throw new Success(data)
}

/**
 * 获取指定的某个用户，返回对象或null
 */
export const getUserOne = async (id: string): Promise<UserOptions | null> => {
  const sql: string = `
    SELECT 
      t1.id, t1.phone, t1.username, t1.sex, t2.label AS sexLabel, 
      t1.birthday, t1.avatar, t1.professional, t1.address, t1.create_time, 
      t1.update_time, t1.terminal, t1.remarks 
    FROM users t1 
    LEFT JOIN tags t2 ON t1.sex = t2.code 
    WHERE t1.id = ?`
  const res: any = await query(sql, id)
  const userInfo: UserOptions = <UserOptions>res[0] || null
  if (userInfo) await handleUser(userInfo)
  return userInfo
}

/**
 * 获取用户列表基本信息，返回数组或[]
 */
export const getUserList = async (options: UserListParams): Promise<UserListReturn> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  // 处理搜索关键字
  const keywordResult = getSelectWhereKeyword({
    valid: ['t1.(phone)', 't1.username'],
    data: options,
    prefix: 'WHERE',
    isOrderKeyword: true
  })
  const sql1 = `SELECT COUNT(t1.id) AS total FROM users t1 ${keywordResult.sql}`
  const data1 = [...keywordResult.data]
  let sql2: string
  let data2: any[]
  if (options.simple === '1') {
    sql2 = `
      SELECT 
        t1.id, ${keywordResult.orderFields} t1.create_time, t1.update_time, t1.terminal 
      FROM users t1 
      ${keywordResult.sql} 
      ORDER BY ${keywordResult.orderSql} t1.update_time DESC 
      LIMIT ?, ?`
    data2 = [...keywordResult.data, pageNo, options.pageSize]
  } else {
    sql2 = `
      SELECT 
        t1.id, t1.sex, t2.label AS sexLabel, t1.birthday, 
        t1.avatar, t1.professional, t1.address, t1.create_time, 
        ${keywordResult.orderFields} 
        t1.update_time, t1.terminal, t1.remarks 
      FROM users t1 
      LEFT JOIN tags t2 ON t1.sex = t2.code 
      ${keywordResult.sql} 
      ORDER BY ${keywordResult.orderSql} t1.update_time DESC 
      LIMIT ?, ?`
    data2 = [...keywordResult.data, pageNo, options.pageSize]
  }
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  const targetData: UserOptions[] = <UserOptions[]>res[1]
  await handleUser(targetData, options.simple)
  return {
    total: res[0][0]['total'],
    data: targetData
  }
}
