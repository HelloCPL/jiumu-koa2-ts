/**
 * @description 点赞获取
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { execTrans, query } from '@/db'
import { Context } from 'koa'
import { LikeOneParams, LikeOptions, LikeParams, LikeReturn } from './interface'
import { getFileById } from '../files-info/get'

// 获取指定的一个点赞
export const doLikeGetOne = async (ctx: Context) => {
  const params = {
    id: ctx._params.id,
    showUserInfo: ctx._params.showUserInfo || '1'
  }
  const data = await getListOne(params)
  throw new Success({ data })
}

// 获取本用户的点赞列表
export const doLikeGetListSelf = async (ctx: Context) => {
  const params = {
    userId: ctx._user.id,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    showUserInfo: ctx._params.showUserInfo || '0'
  }
  const data = await getLikeList(params)
  throw new Success(data)
}

// 根据 userId 获取点赞列表
export const doLikeGetList = async (ctx: Context) => {
  const params = {
    userId: ctx._params.userId,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    showUserInfo: ctx._params.showUserInfo || '0'
  }
  const data = await getLikeList(params)
  throw new Success(data)
}

/*
 * 获取指定的一个点赞
 */
export const getListOne = async (params: LikeOneParams): Promise<LikeOptions | null> => {
  // 处理创建者信息字段
  const userInfoField =
    params.showUserInfo === '1' ? ' t3.username AS create_user_name, t3.avatar AS create_user_avatar, ' : ''
  const sql = `SELECT t1.id, t1.target_id, t1.create_user, ${userInfoField} t1.type, t2.label AS type_label, t1.create_time, t1.terminal FROM likes t1 LEFT JOIN tags t2 ON t1.type = t2.code LEFT JOIN users t3 ON t1.create_user = t3.id WHERE t1.id = ?`
  const data = [params.id]
  const res: any = await query(sql, data)
  if (res && res.length) {
    await _handleLike(res, params.showUserInfo)
    return res
  } else return null
}

/**
 * 获取点赞列表
 */
export const getLikeList = async (params: LikeParams): Promise<LikeReturn> => {
  // 处理创建者信息字段
  const userInfoField =
    params.showUserInfo === '1' ? ' t3.username AS create_user_name, t3.avatar AS create_user_avatar, ' : ''
  const pageNo = (params.pageNo - 1) * params.pageSize
  const sql1 = 'SELECT COUNT(id) AS total FROM likes WHERE FIND_IN_SET(create_user, ?)'
  const data1 = [params.userId]
  const sql2 = `SELECT t1.id, t1.target_id, t1.create_user, ${userInfoField} t1.type, t2.label AS type_label, t1.create_time, t1.terminal FROM likes t1 LEFT JOIN tags t2 ON t1.type = t2.code LEFT JOIN users t3 ON t1.create_user = t3.id WHERE FIND_IN_SET(t1.create_user, ?) ORDER BY t1.create_time DESC LIMIT ?, ?`
  const data2 = [...data1, pageNo, params.pageSize]
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  const likeList = <LikeOptions[]>res[1]
  await _handleLike(likeList, params.showUserInfo)
  return {
    total: res[0][0]['total'],
    data: likeList
  }
}

/*
 * 处理点赞列表
 */
const _handleLike = async (data: LikeOptions[], showUserInfo?: any) => {
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i]
    if (showUserInfo === '1' && item.create_user_avatar) {
      item.create_user_avatar = await getFileById({
        id: item.create_user_avatar,
        userId: item.create_user
      })
    }
  }
}
