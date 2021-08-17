/**
 * @description 点赞获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { execTrans } from "../../../db";
import { Context, Next } from 'koa';
import { LikeOptions, LikeParams, LikeReturn } from './interface'

// 根据 userId 获取点赞列表
export const doLikeGetListSelf = async (ctx: Context, next: Next) => {
  const params = {
    userId: ctx.user.id,
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
  }
  const data = await getLikeList(params)
  throw new Success(data);
}

// 根据 userId 获取点赞列表
export const doLikeGetList = async (ctx: Context, next: Next) => {
  const params = {
    userId: ctx.params.userId,
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
  }
  const data = await getLikeList(params)
  throw new Success(data);
}


/**
 * 获取角色列表
*/
export const getLikeList = async (params: LikeParams): Promise<LikeReturn> => {
  const pageNo = (params.pageNo - 1) * params.pageSize
  const sql1 = `SELECT COUNT(id) as total FROM likes WHERE FIND_IN_SET(create_user, ?)`
  const data1 = [params.userId]
  const sql2 = `SELECT t1.id, t1.target_id, t1.create_user, t3.username as create_user_name, t1.type, t2.label as type_label, t1.create_time, t1.terminal FROM likes t1 LEFT JOIN tags t2 ON t1.type = t2.code LEFT JOIN users t3 ON t1.create_user = t3.id WHERE FIND_IN_SET(t1.create_user, ?) ORDER BY t1.create_time DESC LIMIT ?, ?`
  const data2 = [...data1, pageNo, params.pageSize]
  const res: any = await execTrans([{ sql: sql1, data: data1 }, { sql: sql2, data: data2 }])
  return {
    total: res[0][0]['total'],
    data: <LikeOptions[]>res[1]
  }
}
