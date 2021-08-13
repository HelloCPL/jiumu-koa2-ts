/**
 * @description 角色获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query, execTrans } from "../../../db";
import { Context, Next } from 'koa';
import { getSelectWhereAsKeywordData } from '../../../utils/handle-sql'

// 获取指定的某个角色
export const doRoleGetOne = async (ctx: Context, next: Next) => {
  const data = await getOne(ctx.params.id)
  throw new Success({ data });
}

// 获取角色列表
export const doRoleGetList = async (ctx: Context, next: Next) => {
  const parmas: ParamsOptions = {
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
    keyword: ctx.params.keyword
  }
  const data = await getList(parmas)
  // ...
  throw new Success(data);
}

/**
 * 获取指定的某个角色，返回对象或null
*/
export const getOne = async (id: string): Promise<ObjectAny | null> => {
  const sql: string = `SELECT * FROM roles WHERE code = ? OR id = ?`
  const data = [id, id]
  let res: any = await query(sql, data)
  res = res[0] || null
  return res
}

interface ParamsOptions {
  pageNo: number,
  pageSize: number,
  keyword?: string
}

interface ReturnOption {
  total: number,
  data: any[]
}

/**
 * 获取角色列表
*/
export const getList = async (params: ParamsOptions): Promise<ReturnOption> => {
  const pageNo = (params.pageNo - 1) * params.pageSize
  const sqlParams = getSelectWhereAsKeywordData({
    valid: ['label'],
    data: params
  }, 'OR', 'WHERE')
  const sql1 = `SELECT COUNT(id) as total FROM roles ${sqlParams.sql}`
  const data1 = [...sqlParams.data]
  const sql2 = `SELECT * FROM roles ${sqlParams.sql} ORDER BY sort, update_time DESC LIMIT ?, ?`
  const data2 = [...sqlParams.data, pageNo, params.pageSize]
  const res: any = await execTrans([{ sql: sql1, data: data1 }, { sql: sql2, data: data2 }])
  return {
    total: res[0][0]['total'],
    data: res[1]
  }
}