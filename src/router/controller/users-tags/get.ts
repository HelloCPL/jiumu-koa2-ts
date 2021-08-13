/**
 * @description 获取指定用户拥有的所有特殊标签
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Context, Next } from 'koa';
import _ from 'lodash'

// 获取指定用户拥有的所有特殊标签
export const doUserTagGetAllTag = async (ctx: Context, next: Next) => {
  const data = await GetAllTagByUserId(ctx.params.userId)
  throw new Success({ data });
}

interface AllTagOptions extends ObjectAny {
  id: string,
  code: string,
  label: string,
  parent_code: string,
  sort?: number
}

/**
 * 获取指定用户拥有的所有特殊标签，返回数据或[]
*/
export const GetAllTagByUserId = async (userId: string): Promise<AllTagOptions[]> => {
  // 先获取关联的所有特殊标签
  const sql: string = `SELECT * FROM users_tags WHERE user_id = ?`
  let res: any = await query(sql, userId)
  let data: AllTagOptions[] = []
  if (res && res.length) {
    // 去重
    res = _.uniqBy(res, 'tag_code')
    res = _.map(res, item => item.tag_code)
    const tagCodes = _.join(res)
    const sql2: string = `SELECT * FROM tags WHERE FIND_IN_SET(code, ?)`
    data = <AllTagOptions[]>await query(sql2, tagCodes)
  }
  return data
}