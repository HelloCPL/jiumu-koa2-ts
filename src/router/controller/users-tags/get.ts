/**
 * @description 获取用户-特殊标签关联数据
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '../../../utils/http-exception'
import { execTrans } from '../../../db'
import { Context, Next } from 'koa'
import _ from 'lodash'
import { UserListReturn, UserOptions } from '../users/interface'
import { TagListReturnOptions } from '../tags/interface'
import { UserTagByTagCodeParams, UserTagByUserIdParams } from './interface'
import { getFileById } from '../files-info/get'

// 获取指定用户关联的所有特殊标签
export const doUserTagGetAllTagByUserId = async (ctx: Context, next: Next) => {
  const data = await getAllTagByUserId({
    userId: ctx.params.userId,
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
  })
  throw new Success(data)
}

// 获取指定特殊标签关联的所有用户
export const doUserTagGetAllUserByTagCode = async (ctx: Context, next: Next) => {
  const data = await getAllUserByTagCode({
    tagCode: ctx.params.tagCode,
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
  })
  throw new Success(data)
}

/**
 * 根据 userId/userIds 获取所有关联的特殊标签列表，返回数据或[]
 */
export const getAllTagByUserId = async (options: UserTagByUserIdParams): Promise<TagListReturnOptions> => {
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  let whereSQL = ''
  let whereData: any[] = []
  if (options.userId) {
    whereSQL = 't1.user_id = ?'
    whereData.push(options.userId)
  } else if (options.userIds) {
    whereSQL = 'FIND_IN_SET(t1.user_id, ?)'
    whereData.push(options.userIds)
  }
  const sql1 = `SELECT COUNT(t1.id) AS total FROM users_tags t1 WHERE ${whereSQL}`
  const sql2 = `SELECT t2.id, t2.parent_code, t3.label as parent_label, t2.code, t2.label, t2.sort, t2.create_time, t2.update_time, t2.terminal, t2.remarks FROM users_tags t1 LEFT JOIN tags t2 ON t1.tag_code = t2.code LEFT JOIN tags t3 ON t2.parent_code = t3.code WHERE ${whereSQL} ORDER BY t2.sort, t2.update_time DESC LIMIT ?, ?`
  const res: any = await execTrans([
    { sql: sql1, data: [...whereData] },
    { sql: sql2, data: [...whereData, pageNo, options.pageSize] },
  ])
  return {
    total: res[0][0]['total'],
    data: res[1],
  }
}

/**
 * 根据 tagCode/tagCodes 获取所有关联的用户列表，返回数据或[]
 */
export const getAllUserByTagCode = async (options: UserTagByTagCodeParams): Promise<UserListReturn> => {
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  let whereSQL = ''
  let whereData: any[] = []
  if (options.tagCode) {
    whereSQL = `t1.tag_code = ?`
    whereData.push(options.tagCode)
  } else if (options.tagCodes) {
    whereSQL = 'FIND_IN_SET(t1.tag_code, ?)'
    whereData.push(options.tagCodes)
  }
  const sql1 = `SELECT COUNT(t1.id) AS total FROM users_tags t1 WHERE ${whereSQL}`
  const sql2 = `SELECT t2.id, t2.phone, t2.username, t2.sex, t3.label as sex_label, t2.birthday, t2.avatar, t2.professional, t2.address, t2.create_time, t2.update_time, t2.terminal, t2.remarks FROM users_tags t1 LEFT JOIN users t2 ON t1.user_id = t2.id LEFT JOIN tags t3 ON t2.sex = t3.code  WHERE ${whereSQL} ORDER BY t2.update_time DESC LIMIT ?, ?`
  const res: any = await execTrans([
    { sql: sql1, data: [...whereData] },
    { sql: sql2, data: [...whereData, pageNo, options.pageSize] },
  ])
  let userData = <UserOptions[]>res[1]
  for (let i = 0, len = userData.length; i < len; i++) {
    userData[i]['avatar'] = await getFileById(userData[i]['avatar'], userData[i]['id'])
  }
  return {
    total: res[0][0]['total'],
    data: userData,
  }
}
