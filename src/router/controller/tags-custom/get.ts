/**
 * @description 标签获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query, execTrans } from "../../../db";
import { Context, Next } from 'koa';
import { TagCustomOptions, TagCustomListParams, TagCustomListReturn, TagCustomTypeOptions } from './interface'
import _ from 'lodash'
import { getSelectWhereData, getSelectWhereAsKeywordData, getOrderByKeyword } from '../../../utils/handle-sql';

// 获取我的指定一个或多个自定义标签
export const getTagCustomGetIdsSelf = async (ctx: Context, next: Next) => {
  const data = await doTagCustomByIds(ctx._params.ids, ctx._user.id)
  throw new Success({ data });
}

// 获取自定义标签类型列表
export const getTagCustomGetListType = async (ctx: Context, next: Next) => {
  const data = await doTagCustomListType(ctx._params.userId)
  throw new Success({ data });
}

// 获取自定义标签列表
export const getTagCustomGetList = async (ctx: Context, next: Next) => {
  let params: TagCustomListParams = {
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    createUser: ctx._params.userId,
    type: ctx._params.type,
    keyword: ctx._params.keyword
  }
  const data = await doTagCustomList(params)
  data.data.forEach(item => {
    item.isSelf = item.create_user === ctx._user.id ? '1' : '0'
    delete item.create_user
  })
  throw new Success(data);
}

/**
 * 获取指定用户的自定义标签，返回数组或[]
*/
export const getTagCustomByIds = async (ids: string, userId: string): Promise<TagCustomOptions[]> => {
  if (!ids) return []
  const sql: string = `SELECT t1.id, t1.label, t1.sort, t1.type, t1.create_time, t1.update_time, t1.terminal, t1.create_user, t2.username AS create_user_name FROM tags_custom t1 LEFT JOIN users t2 ON t1.create_user = t2.id WHERE FIND_IN_SET(t1.id, ?) AND t1.create_user = ?`
  const data = [ids, userId]
  let res: any = await query(sql, data)
  return res
}

// 获取指定用户/所有用户（即不指定）所有自定义标签类型列表
export const doTagCustomListType = async (userId?: string): Promise<TagCustomTypeOptions[]> => {
  let whereSQL = ''
  const data = []
  if (userId) {
    whereSQL = ` WHERE create_user = ? `
    data.push(userId)
  }
  const sql: string = `SELECT type, COUNT(id) AS total FROM tags_custom ${whereSQL}  GROUP BY type`
  const res = <TagCustomTypeOptions[]> await query(sql, data)
  return res.filter(item => item && item.type).sort((a, b) => b.total - a.total)
}

// 获取指定用户自定义标签列表，返回数组或
export const doTagCustomList = async (options: TagCustomListParams): Promise<TagCustomListReturn> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  // 处理筛选参数
  const sqlParams = getSelectWhereData({
    valid: ['t1.type', 't1.create_user'],
    data: options,
    prefix: 'WHERE'
  })
  // 处理搜索
  const prefix = sqlParams.sql ? 'AND' : 'WHERE'
  const sqlParamsKeyword = getSelectWhereAsKeywordData({
    valid: ['t1.label'],
    data: options,
    prefix
  })
  // 处理搜索排序
  const orderParams = getOrderByKeyword({
    valid: ['t1.label'],
    data: options,
  })
  const extraValid = options.createUser ? '' : 't1.create_user,'
  const sql1 = `SELECT COUNT(t1.id) AS total FROM tags_custom t1 ${sqlParams.sql} ${sqlParamsKeyword.sql}`
  const data1 = [...sqlParams.data, ...sqlParamsKeyword.data]
  const sql2 = `SELECT t1.id, ${orderParams.orderValid} t1.sort, t1.type, ${extraValid} t1.create_time, t1.update_time, t1.terminal, t1.create_user, t2.username AS create_user_name FROM tags_custom t1 LEFT JOIN users t2 ON t1.create_user = t2.id ${sqlParams.sql} ${sqlParamsKeyword.sql} ORDER BY ${orderParams.orderSql} t1.sort, t1.update_time DESC LIMIT ?, ?`
  const data2 = [...data1, pageNo, options.pageSize]
  const res: any = await execTrans([{ sql: sql1, data: data1 }, { sql: sql2, data: data2 }])
  return {
    total: res[0][0]['total'],
    data: res[1]
  }
}
