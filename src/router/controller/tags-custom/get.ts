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
import { getSelectWhereData } from '../../../utils/handle-sql';

// 获取指定用户自定义标签
export const doTagCustomGetIds = async (ctx: Context, next: Next) => {
  const data = await getTagCustomByIds(ctx.params.ids, ctx.user.id)
  throw new Success({ data });
}

// 获取指定用户自定义标签列表
export const doTagCustomGetList = async (ctx: Context, next: Next) => {
  let params: TagCustomListParams = {
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
    userId: ctx.user.id
  }
  if (ctx.params.type)
    params.type = ctx.params.type
  const data = await getTagCustomList(params)
  throw new Success(data);
}

/**
 * 获取指定用户自定义标签，返回数组或[]
*/
export const getTagCustomByIds = async (ids: string, userId: string): Promise<TagCustomOptions[]> => {
  const sql: string = `SELECT id, label, sort, create_time, update_time, terminal FROM tags_custom WHERE FIND_IN_SET(id, ?) AND create_user = ?`
  const data = [ids, userId]
  let res: any = await query(sql, data)
  return res
}

// 获取指定用户自定义标签列表，返回数组或
export const getTagCustomList = async (options: TagCustomListParams): Promise<TagCustomListReturn> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  const sqlParams = getSelectWhereData({
    valid: ['type'],
    data: options
  }, 'AND', 'AND')
  const sql1 = `SELECT COUNT(id) as total FROM tags_custom WHERE create_user = ? ${sqlParams.sql}`
  const data1 = [options.userId, ...sqlParams.data]
  const sql2 = `SELECT id, label, sort, create_time, update_time, terminal FROM tags_custom WHERE create_user = ? ${sqlParams.sql} ORDER BY sort LIMIT ?, ?`
  const data2 = [...data1, pageNo, options.pageSize]
  const res: any = await execTrans([{ sql: sql1, data: data1 }, { sql: sql2, data: data2 }])
  return {
    total: res[0][0]['total'],
    data: res[1]
  }
}