/**
 * @description 获取用户-特殊标签关联数据
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { execTrans, query } from '@/db'
import { Context } from 'koa'
import { UserListReturn, UserOptions } from '../users/interface'
import { TagListReturnOptions, TagOptions } from '../tags/interface'
import { UserTagByTagCodeParams, UserTagByUserIdParams } from './interface'
import { getFileById } from '../files-info/get'

// 获取指定用户关联的所有特殊标签
export const doUserTagGetAllTagByUserId = async (ctx: Context) => {
  const data = <TagListReturnOptions>await getAllTagByUserId({
    userId: ctx._params.userId,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10
  })
  throw new Success(data)
}

// 获取指定特殊标签关联的所有用户
export const doUserTagGetAllUserByTagCode = async (ctx: Context) => {
  const data = await getAllUserByTagCode({
    tagCode: ctx._params.tagCode,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    simple: ctx._params.simple || '1'
  })
  throw new Success(data)
}

/**
 * 根据 userId 获取所有关联的特殊标签列表，返回数据或[]
 */
export const getAllTagByUserId = async (
  options: UserTagByUserIdParams
): Promise<TagListReturnOptions | TagOptions[]> => {
  if (options.all) {
    const sql =
      'SELECT t2.id, t2.parent_code, t3.label as parent_label, t2.code, t2.label, t2.sort, t2.configurable, t2.create_time, t2.update_time, t2.terminal, t2.remarks FROM users_tags t1 LEFT JOIN tags t2 ON t1.tag_code = t2.code LEFT JOIN tags t3 ON t2.parent_code = t3.code WHERE t1.user_id = ? ORDER BY t2.sort, t2.update_time DESC'
    const data = [options.userId]
    const res: TagOptions[] = <TagOptions[]>await query(sql, data)
    return res
  } else {
    options.pageNo = options.pageNo || 1
    options.pageSize = options.pageSize || 10
    const pageNo = (options.pageNo - 1) * options.pageSize
    const sql1 = 'SELECT COUNT(t1.id) AS total FROM users_tags t1 WHERE t1.user_id = ?'
    const sql2 =
      'SELECT t1.id As relevance_id, t2.id, t2.parent_code, t3.label as parent_label, t2.code, t2.label, t2.sort, t2.configurable, t2.create_time, t2.update_time, t2.terminal, t2.remarks FROM users_tags t1 LEFT JOIN tags t2 ON t1.tag_code = t2.code LEFT JOIN tags t3 ON t2.parent_code = t3.code WHERE t1.user_id = ? ORDER BY t2.sort, t2.update_time DESC LIMIT ?, ?'
    const res: any = await execTrans([
      { sql: sql1, data: [options.userId] },
      { sql: sql2, data: [options.userId, pageNo, options.pageSize] }
    ])
    return {
      total: res[0][0]['total'],
      data: res[1]
    }
  }
}

/**
 * 根据 tagCode 获取所有关联的用户列表，返回数据或[]
 */
export const getAllUserByTagCode = async (options: UserTagByTagCodeParams): Promise<UserListReturn> => {
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  const sql1 = 'SELECT COUNT(t1.id) AS total FROM users_tags t1 WHERE t1.tag_code = ?'
  let sql2: string
  if (options.simple === '1') {
    sql2 =
      'SELECT t1.id As relevance_id, t2.id, t2.phone, t2.username, t2.create_time, t2.update_time, t2.terminal FROM users_tags t1 LEFT JOIN users t2 ON t1.user_id = t2.id   WHERE t1.tag_code = ? ORDER BY t2.update_time DESC LIMIT ?, ?'
  } else {
    sql2 =
      'SELECT t1.id As relevance_id, t2.id, t2.phone, t2.username, t2.sex, t3.label as sex_label, t2.birthday, t2.avatar, t2.professional, t2.address, t2.create_time, t2.update_time, t2.terminal, t2.remarks FROM users_tags t1 LEFT JOIN users t2 ON t1.user_id = t2.id LEFT JOIN tags t3 ON t2.sex = t3.code  WHERE t1.tag_code = ? ORDER BY t2.update_time DESC LIMIT ?, ?'
  }
  const res: any = await execTrans([
    { sql: sql1, data: [options.tagCode] },
    { sql: sql2, data: [options.tagCode, pageNo, options.pageSize] }
  ])
  const userData = <UserOptions[]>res[1]
  if (options.simple !== '1')
    for (let i = 0, len = userData.length; i < len; i++) {
      userData[i]['avatar'] = await getFileById(userData[i]['avatar'], userData[i]['id'])
    }
  return {
    total: res[0][0]['total'],
    data: userData
  }
}
