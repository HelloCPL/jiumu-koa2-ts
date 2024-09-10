/**
 * @description 获取用户-特殊标签关联数据
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { execTrans } from '@/db'
import { Context } from 'koa'
import { UserListReturn, UserOptions } from '../users/interface'
import { TagListReturnOptions, TagOptions } from '../tags/interface'
import { UserTagByTagCodeParams, UserTagByUserIdParams } from './interface'
import { handleUser } from '../roles-menus/utils'

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
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  const sql1 = `
    SELECT 
      COUNT(t1.id) AS total 
    FROM tags t1 
    WHERE 
      t1.code IN (
        SELECT t4.tag_code FROM users_tags t4
        WHERE t4.user_id = ?
      )`
  const sql2 = `
    SELECT 
      t3.id As relevance_id, t1.id, t1.parent_code, t2.label as parent_label, 
      t1.code, t1.label, t1.sort, t1.configurable, t1.create_time, 
      t1.update_time, t1.terminal, t1.remarks 
    FROM tags t1 
    LEFT JOIN tags t2 ON t1.parent_code = t2.code 
    LEFT JOIN users_tags t3 ON (t3.tag_code = t1.code AND t3.user_id = ?)
    WHERE 
      t1.code IN (
        SELECT t4.tag_code FROM users_tags t4
        WHERE t4.user_id = ?
      )
    ORDER BY t1.sort, t1.update_time DESC 
    LIMIT ?, ?`
  const res: any = await execTrans([
    { sql: sql1, data: [options.userId] },
    { sql: sql2, data: [options.userId, options.userId, pageNo, options.pageSize] }
  ])
  return {
    total: res[0][0]['total'],
    data: res[1]
  }
}

/**
 * 根据 tagCode 获取所有关联的用户列表，返回数据或[]
 */
export const getAllUserByTagCode = async (options: UserTagByTagCodeParams): Promise<UserListReturn> => {
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  const sql1 = `
    SELECT 
      COUNT(t1.id) AS total 
    FROM users t1 
    WHERE 
      t1.id IN (
        SELECT t4.user_id FROM users_tags t4
        WHERE t4.tag_code = ?
      )`
  let sql2: string
  if (options.simple === '1') {
    sql2 = `
      SELECT 
        t3.id As relevance_id, t1.id, t1.phone, t1.username,  
        t1.create_time, t1.update_time, t1.terminal 
      FROM users t1 
      LEFT JOIN tags t2 ON t1.sex = t2.code  
      LEFT JOIN users_tags t3 ON (t3.user_id = t1.id AND t3.tag_code = ?)
      WHERE 
        t1.id IN (
          SELECT t4.user_id FROM users_tags t4
          WHERE t4.tag_code = ?
        )
      ORDER BY t1.update_time DESC 
      LIMIT ?, ?`
  } else {
    sql2 = `
      SELECT 
        t3.id As relevance_id, t1.id, t1.phone, t1.username, t1.sex, 
        t2.label as sex_label, t1.birthday, t1.avatar, t1.professional, t1.address, 
        t1.create_time, t1.update_time, t1.terminal, t1.remarks 
      FROM users t1 
      LEFT JOIN tags t2 ON t1.sex = t2.code  
      LEFT JOIN users_tags t3 ON (t3.user_id = t1.id AND t3.tag_code = ?)
      WHERE 
        t1.id IN (
          SELECT t4.user_id FROM users_tags t4
          WHERE t4.tag_code = ?
        )
      ORDER BY t1.update_time DESC 
      LIMIT ?, ?`
  }
  const res: any = await execTrans([
    { sql: sql1, data: [options.tagCode] },
    { sql: sql2, data: [options.tagCode, options.tagCode, pageNo, options.pageSize] }
  ])
  const userData = <UserOptions[]>res[1]
  await handleUser(userData, options.simple)
  return {
    total: res[0][0]['total'],
    data: userData
  }
}
