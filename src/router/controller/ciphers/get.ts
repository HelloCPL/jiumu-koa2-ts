/**
 * @description 口令获取
 * @author cpl
 * @create 2023-03-14 15:43:24
 */

import { execTrans, query, getSelectWhereFields, getSelectWhereKeyword } from '@/db'
import { Success } from '@/utils/http-exception'
import { Context } from 'koa'
import { CipherListParams, CipherListReturn, CipherOneParams, CipherOptions } from './interface'
import { handleCipher } from './utils'

// 获取本人的某个口令
export const doCipherGetOneSelf = async (ctx: Context) => {
  const params = {
    id: ctx._params.id,
    userId: ctx._user.id
  }
  const data = await getCipherGetOneSelf(params)
  throw new Success({ data })
}

// 获取本人的口令列表
export const doCipherGetListSelf = async (ctx: Context) => {
  const params: CipherListParams = {
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    keyword: ctx._params.keyword,
    userId: ctx._user.id,
    type: ctx._params.type,
    classify: ctx._params.classify,
    highlight: ctx._params.highlight
  }
  const data = await getCipherGetList(params)
  throw new Success(data)
}

/*
 * 获取本人的某个口令，返回对象或null
 */
export const getCipherGetOneSelf = async (params: CipherOneParams): Promise<CipherOptions | null> => {
  const sql: string = `
    SELECT 
      t1.id, t1.title, t1.account, t1.cipher, t1.type, t2.label AS type_label, t1.classify, t1.sort, t1.create_user, t1.create_time, t1.update_time, t1.terminal 
    FROM ciphers t1 
    LEFT JOIN tags t2 ON t1.type = t2.code 
    WHERE t1.id = ? AND t1.create_user = ?`
  const data = [params.id, params.userId]
  let res: any = await query(sql, data)
  res = res[0] || null
  if (res) await handleCipher(res, params.userId)
  return res
}

/*
 * 获取本人的口令列表
 */
export const getCipherGetList = async (options: CipherListParams): Promise<CipherListReturn> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  // 处理keyword参数
  const keywordResult = getSelectWhereKeyword({
    valid: ['t1.title'],
    data: options,
    prefix: 'AND',
    isOrderKeyword: true
  })
  // 处理普通where参数
  const fieldsResult = getSelectWhereFields({
    valid: ['t1.type'],
    data: options,
    prefix: 'AND'
  })
  // 处理查询语句
  let whereSQL = ''
  let whereData: any[] = []
  whereSQL = 'WHERE t1.create_user = ?'
  whereData.push(options.userId)
  if (options.classify) {
    whereSQL += ' AND t1.classify LIKE ? '
    whereData.push(`%${options.classify}%`)
  }
  whereSQL += `${keywordResult.sql}${fieldsResult.sql}`
  whereData = [...whereData, ...keywordResult.data, ...fieldsResult.data]

  const sql1 = `SELECT COUNT(t1.id) AS total FROM ciphers t1 ${whereSQL}`
  const data1 = [...whereData]
  const sql2 = `
    SELECT 
      t1.id, t1.account, t1.cipher, t1.type, t2.label AS type_label, 
      ${keywordResult.orderFields}
      t1.classify, t1.sort, t1.create_user, t1.create_time, t1.update_time, t1.terminal 
      FROM ciphers t1 
      LEFT JOIN tags t2 ON t1.type = t2.code 
      ${whereSQL} 
      ORDER BY ${keywordResult.orderSql} t1.sort, t1.update_time DESC 
      LIMIT ?, ?`
  const data2 = [...whereData, pageNo, options.pageSize]
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  const cipherList: CipherOptions[] = res[1]
  await handleCipher(cipherList, options.userId)
  return { total: res[0][0]['total'], data: cipherList }
}
