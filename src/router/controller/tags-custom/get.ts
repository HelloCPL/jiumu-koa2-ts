/**
 * @description 标签获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query, execTrans } from "../../../db";
import { Context, Next } from 'koa';
import { TagCustomOptions, TagCustomListParams, TagCustomListReturn } from './interface'
import _ from 'lodash'
import { getSelectWhereData, getSelectWhereAsKeywordData, getOrderByKeyword } from '../../../utils/handle-sql';

// 获取我的指定一个或多个自定义标签
export const doTagCustomGetIdsSelf = async (ctx: Context, next: Next) => {
  const data = await getTagCustomByIds(ctx.params.ids, ctx.user.id)
  throw new Success({ data });
}

// 获取我的自定义标签列表
export const doTagCustomGetListSelf = async (ctx: Context, next: Next) => {
  let params: TagCustomListParams = {
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
    userId: ctx.user.id,
    type: ctx.params.type,
    keyword: ctx.params.keyword
  }
  const data = await getTagCustomList(params)
  throw new Success(data);
}

// 获取所有自定义标签列表
export const doTagCustomGetList = async (ctx: Context, next: Next) => {
  let params: TagCustomListParams = {
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
    type: ctx.params.type,
    keyword: ctx.params.keyword
  }
  const data = await getTagCustomList(params)
  data.data.forEach(item => {
    item.isSelf = item.create_user === ctx.user.id ? '1' : '0'
    delete item.create_user
  })
  throw new Success(data);
}

/**
 * 获取指定用户的自定义标签，返回数组或[]
*/
export const getTagCustomByIds = async (ids: string, userId: string): Promise<TagCustomOptions[]> => {
  const sql: string = `SELECT t1.id, t1.label, t1.sort, t1.type, t1.create_time, t1.update_time, t1.terminal, t1.create_user, t2.username AS create_user_name FROM tags_custom t1 LEFT JOIN users t2 ON t1.create_user = t2.id WHERE FIND_IN_SET(t1.id, ?) AND t1.create_user = ?`
  const data = [ids, userId]
  let res: any = await query(sql, data)
  return res
}

// 获取指定用户自定义标签列表，返回数组或
export const getTagCustomList = async (options: TagCustomListParams): Promise<TagCustomListReturn> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  // 处理筛选参数
  const sqlParams = getSelectWhereData({
    valid: ['t1.type', 't1.create_user:userId'],
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
  const extraValid = options.userId ? '' : 't1.create_user,'
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
