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
  const sql: string = `SELECT id, label, sort, type, create_time, update_time, terminal FROM tags_custom WHERE FIND_IN_SET(id, ?) AND create_user = ?`
  const data = [ids, userId]
  let res: any = await query(sql, data)
  return res
}

// 获取指定用户自定义标签列表，返回数组或
export const getTagCustomList = async (options: TagCustomListParams): Promise<TagCustomListReturn> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  // 处理筛选参数
  const sqlParams = getSelectWhereData({
    valid: ['type', 'create_user:userId'],
    data: options,
    prefix: 'WHERE'
  })
  // 处理搜索
  const prefix = sqlParams.sql ? 'AND' : 'WHERE'
  const sqlParamsKeyword = getSelectWhereAsKeywordData({
    valid: ['label'],
    data: options,
    prefix
  })
  // 处理搜索排序
  const orderParams = getOrderByKeyword({
    valid: ['label'],
    data: options,
  })
  const extraValid = options.userId ? '' : 'create_user,'
  const sql1 = `SELECT COUNT(id) as total FROM tags_custom ${sqlParams.sql} ${sqlParamsKeyword.sql}`
  const data1 = [...sqlParams.data, ...sqlParamsKeyword.data]
  const sql2 = `SELECT id, ${orderParams.orderValid} sort, type, ${extraValid} create_time, update_time, terminal FROM tags_custom ${sqlParams.sql} ${sqlParamsKeyword.sql} ORDER BY ${orderParams.orderSql} sort, update_time DESC LIMIT ?, ?`
  const data2 = [...data1, pageNo, options.pageSize]
  const res: any = await execTrans([{ sql: sql1, data: data1 }, { sql: sql2, data: data2 }])
  return {
    total: res[0][0]['total'],
    data: res[1]
  }
}
