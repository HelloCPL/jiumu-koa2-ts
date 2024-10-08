/**
 * @description 标签获取
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { query, execTrans, getSelectWhereFields, getSelectWhereKeyword } from '@/db'
import { Context } from 'koa'
import {
  TagCustomOptions,
  TagCustomListParams,
  TagCustomListReturn,
  TagCustomTypeOptions,
  TagCustomSelfParams
} from './interface'
import { handleTagCustom } from './utils'

// 获取我的指定一个或多个自定义标签
export const getTagCustomGetIdsSelf = async (ctx: Context) => {
  const data = await getTagCustomByIds({
    ids: ctx._params.ids,
    userId: ctx._user.id,
    showUserInfo: ctx._params.showUserInfo || '1'
  })
  throw new Success({ data })
}

// 获取自定义标签类型列表
export const getTagCustomGetListType = async (ctx: Context) => {
  const data = await doTagCustomListType(ctx._params.userId)
  throw new Success({ data })
}

// 获取自定义标签列表
export const getTagCustomGetList = async (ctx: Context) => {
  const params: TagCustomListParams = {
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    createUser: ctx._params.userId,
    userId: ctx._user.id,
    type: ctx._params.type,
    keyword: ctx._params.keyword,
    highlight: ctx._params.highlight,
    showUserInfo: ctx._params.showUserInfo || '0'
  }
  const data = await doTagCustomList(params)
  throw new Success(data)
}

/**
 * 获取指定用户的自定义标签，返回数组或[]
 */
export const getTagCustomByIds = async (params: TagCustomSelfParams): Promise<TagCustomOptions[]> => {
  if (!params.ids) return []
  // 处理创建者信息字段
  const userInfoField =
    params.showUserInfo === '1' ? ' t2.username AS create_user_name, t2.avatar AS create_user_avatar, ' : ''
  let secretSql = ''
  const secretData = []
  if (params.ignoreUserId !== '1') {
    secretSql = ' AND t1.create_user = ? '
    secretData.push(params.userId)
  }
  const sql: string = `
    SELECT 
      t1.id, t1.label, t1.sort, t1.type, t1.create_time, t1.update_time, t1.terminal, ${userInfoField} t1.create_user 
    FROM tags_custom t1 
    LEFT JOIN users t2 ON t1.create_user = t2.id 
    WHERE 
      FIND_IN_SET(t1.id, ?) 
      ${secretSql}`
  const data = [params.ids, ...secretData]
  const res = <TagCustomOptions[]>await query(sql, data)
  await handleTagCustom(res, {
    showUserInfo: params.showUserInfo
  })
  return res
}

// 获取指定用户/所有用户（即不指定）所有自定义标签类型列表
export const doTagCustomListType = async (userId?: string): Promise<TagCustomTypeOptions[]> => {
  let whereSQL = ''
  const data = []
  if (userId) {
    whereSQL = ' WHERE create_user = ? '
    data.push(userId)
  }
  const sql: string = `
    SELECT 
      type, COUNT(id) AS total 
    FROM tags_custom 
    ${whereSQL}  
    GROUP BY type`
  const res = <TagCustomTypeOptions[]>await query(sql, data)
  return res.filter((item) => item && item.type).sort((a, b) => b.total - a.total)
}

// 获取指定用户自定义标签列表，返回数组或
export const doTagCustomList = async (options: TagCustomListParams): Promise<TagCustomListReturn> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  // 处理筛选参数
  const fieldsResult = getSelectWhereFields({
    valid: ['t1.type', 't1.create_user'],
    data: options,
    prefix: 'WHERE'
  })
  // 处理搜索
  const prefix = fieldsResult.sql ? 'AND' : 'WHERE'
  const keywordResult = getSelectWhereKeyword({
    valid: ['t1.label'],
    data: options,
    prefix,
    isOrderKeyword: true
  })
  // 处理创建者信息字段
  const userInfoField =
    options.showUserInfo === '1' ? ' t2.username AS create_user_name, t2.avatar AS create_user_avatar, ' : ''
  const sql1 = `SELECT COUNT(t1.id) AS total FROM tags_custom t1 ${fieldsResult.sql} ${keywordResult.sql}`
  const data1 = [...fieldsResult.data, ...keywordResult.data]
  const sql2 = `
    SELECT 
      t1.id,  t1.sort, t1.type, t1.create_user, t1.create_time, 
      ${keywordResult.orderFields}
      ${userInfoField}
      t1.update_time, t1.terminal 
    FROM tags_custom t1 
    LEFT JOIN users t2 ON t1.create_user = t2.id 
    ${fieldsResult.sql} 
    ${keywordResult.sql} 
    ORDER BY ${keywordResult.orderSql} t1.sort, t1.update_time DESC 
    LIMIT ?, ?`
  const data2 = [...data1, pageNo, options.pageSize]
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  await handleTagCustom(<TagCustomOptions[]>res[1], {
    showUserInfo: options.showUserInfo,
    userId: options.userId
  })
  return {
    total: res[0][0]['total'],
    data: res[1]
  }
}
