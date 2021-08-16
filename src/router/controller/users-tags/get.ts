/**
 * @description 获取用户-特殊标签关联数据
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Context, Next } from 'koa';
import _ from 'lodash'
import { UserOptions } from '../users/interface'
import { TagOptions } from '../tags/interface'
import { UserTagOptions, UserTagByTagCodeParams, UserTagByUserIdParams } from './interface'
import { getFileById } from '../files-info/get'

// 获取指定用户关联的所有特殊标签
export const doUserTagGetAllTagByUserId = async (ctx: Context, next: Next) => {
  const data = await getAllTagByUserId({userId: ctx.params.userId})
  throw new Success({ data });
}

// 获取指定特殊标签关联的所有用户
export const doUserTagGetAllUserByTagCode = async (ctx: Context, next: Next) => {
  const data = await getAllUserByTagCode({tagCode: ctx.params.tagCode})
  throw new Success({ data });
}


/**
 * 根据 userId/userIds 获取所有关联的特殊标签列表，返回数据或[]
*/
export const getAllTagByUserId = async (options: UserTagByUserIdParams): Promise<TagOptions[]> => {
  let sql = `SELECT * FROM users_tags WHERE `
  let data: any[] = []
  if (options.userId) {
    sql += 'user_id = ?'
    data.push(options.userId)
  } else if (options.userIds) {
    sql += 'FIND_IN_SET(user_id, ?)'
    data.push(options.userIds)
  } else return []
  // 先获取指定用户关联的所有特殊标签
  let res: UserTagOptions[] = <UserTagOptions[]>await query(sql, data)
  let targetData: TagOptions[] = []
  if (res && res.length) {
    // 去重
    res = _.uniqBy(res, 'tag_code')
    // 获取关联的特殊标签列表
    const tagCodes: string = _.join(_.map(res, item => item.tag_code))
    const sql2: string = `SELECT * FROM tags WHERE FIND_IN_SET(code, ?) ORDER BY sort, update_time DESC`
    targetData = <TagOptions[]>await query(sql2, tagCodes)
  }
  return targetData
}

/**
 * 根据 tagCode/tagCodes 获取所有关联的用户列表，返回数据或[]
*/
export const getAllUserByTagCode = async (options: UserTagByTagCodeParams): Promise<UserOptions[]> => {
  let sql = `SELECT * FROM users_tags WHERE `
  let data: any[] = []
  if (options.tagCode) {
    sql += 'tag_code = ?'
    data.push(options.tagCode)
  } else if (options.tagCodes) {
    sql += 'FIND_IN_SET(tag_code, ?)'
    data.push(options.tagCodes)
  } else return []
  // 先获取指定特殊标签关联的所有用户
  let res: UserTagOptions[] = <UserTagOptions[]>await query(sql, data)
  let targetData: UserOptions[] = []
  if (res && res.length) {
    // 去重
    res = _.uniqBy(res, 'user_id')
    // 获取关联的用户列表
    const UserIds: string = _.join(_.map(res, item => item.user_id))
    const sql2: string = `SELECT t1.id, t1.phone, t1.username, t1.sex, t2.label as sexLabel, t1.birthday, t1.avatar, t1.professional, t1.address, t1.create_time, t1.update_time, t1.terminal, t1.remarks FROM users t1 LEFT JOIN tags t2 ON t1.sex = t2.code  WHERE FIND_IN_SET(t1.id, ?) ORDER BY t1.update_time DESC`
    targetData = <UserOptions[]>await query(sql2, UserIds)
    for (let i = 0, len = targetData.length; i < len; i++) {
      targetData[i]['avatar'] = await getFileById(targetData[i]['avatar'], targetData[i]['id'])
    }
  }
  return targetData
}
