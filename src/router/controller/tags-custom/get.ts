/**
 * @description 标签获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query, execTrans } from "../../../db";
import { Context, Next } from 'koa';
import { TagCustomOptions } from './interface'
import _ from 'lodash'


// 获取指定用户自定义标签
export const doTagCustomGetIds = async (ctx: Context, next: Next) => {
  const data = await getTagCustomByIds(ctx.user.id, ctx.params.ids)
  throw new Success({ data });
}

// 获取指定用户自定义标签
export const doTagCustomGetList = async (ctx: Context, next: Next) => {
  let pageNo = ctx.params.pageNo * 1 || 1
  const pageSize = ctx.params.pageSize * 1 || 10
  pageNo = (pageNo - 1) * pageSize
  const sql1 = `SELECT COUNT(id) as total FROM tags_custom WHERE create_user = ?`
  const data1 = [ctx.user.id]
  const sql2 = `SELECT id, label, sort, create_time, update_time, terminal FROM tags_custom WHERE create_user = ? ORDER BY sort LIMIT ?, ?`
  const data2 = [...data1, pageNo, pageSize]
  const res: any = await execTrans([{ sql: sql1, data: data1 }, { sql: sql2, data: data2 }])
  throw new Success({ total: res[0][0]['total'], data: res[1] });
}

/**
 * 获取指定用户自定义标签，返回数组或[]
*/
export const getTagCustomByIds = async (userId: string, ids: string): Promise<TagCustomOptions[]> => {
  const sql: string = `SELECT id, label, sort, create_time, update_time, terminal FROM tags_custom WHERE FIND_IN_SET(id, ?) AND create_user = ?`
  const data = [ids, userId]
  let res: any = await query(sql, data)
  return res
}
