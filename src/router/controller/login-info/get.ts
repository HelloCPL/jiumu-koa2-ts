/**
 * @description 登录记录模块获取
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { Context } from 'koa'
import { execTrans } from '@/db'
import { LoginInfoListReturn, LoginInfoListParams } from './interface'

// 获取登录记录
export const doLoginInfoGetList = async (ctx: Context) => {
  const params = {
    userId: <string>ctx._params.userId,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10
  }
  const data = await getLoginInfoList(params)
  throw new Success(data)
}

/**
 * 获取登录记录列表
 */
export const getLoginInfoList = async (params: LoginInfoListParams): Promise<LoginInfoListReturn> => {
  const pageNo = (params.pageNo - 1) * params.pageSize
  const sql1 = 'SELECT COUNT(id) AS total FROM login_info WHERE user_id = ?'
  const data1 = [params.userId]
  const sql2 =
    'SELECT t1.id, t1.user_id, t2.username, t1.user_agent, t1.ip, t1.create_time, t1.terminal FROM login_info t1 LEFT JOIN users t2 ON t1.user_id = t2.id WHERE user_id = ?  ORDER BY t1.create_time DESC LIMIT ?, ?'
  const data2 = [params.userId, pageNo, params.pageSize]
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  return {
    total: res[0][0]['total'],
    data: res[1]
  }
}
