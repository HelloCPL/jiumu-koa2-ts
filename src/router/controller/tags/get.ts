/**
 * @description 标签获取
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { query } from '@/db'
import { Context } from 'koa'
import { TagOptions, TagListOptions, TagListReturnOptions } from './interface'
import { getAllTagByUserId } from '../users-tags/get'
import { getTree } from '@/utils/tools'

// 获取指定的某个标签
export const doTagGetByCode = async (ctx: Context) => {
  const data = await getTagByCode(ctx._params.code)
  throw new Success({ data })
}

// 获取我的所有标签
export const doTagGetAllSelf = async (ctx: Context) => {
  const data = <TagListReturnOptions>await getAllTagByUserId({
    userId: ctx._user.id,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10
  })
  throw new Success(data.data ? data : { data })
}

// 获取某类标签
export const doTagGetByParentCode = async (ctx: Context) => {
  const parentCode = ctx._params.parentCode || ''
  let userId = ''
  if (parentCode === '8888' && ctx._params.userId) userId = ctx._params.userId
  const data = await getTagByParentCode(parentCode, userId)
  throw new Success({ data })
}

/**
 * 获取指定的某个标签，返回对象或null
 */
export const getTagByCode = async (code: string): Promise<TagOptions | null> => {
  const sql: string = `
    SELECT 
      t1.id, t1.parent_code, t2.label AS parent_label, t1.code, t1.label, 
      t1.sort, t1.configurable, t1.create_time, t1.update_time, t1.terminal, t1.remarks 
    FROM tags t1 
    LEFT JOIN tags t2 ON t1.parent_code = t2.code 
    WHERE t1.code = ? OR t1.id = ?`
  const data = [code, code]
  let res: any = await query(sql, data)
  res = res[0] || null
  return res
}

/**
 * 获取某类标签，返回数组或[]
 */
export const getTagByParentCode = async (parentCode: string, userId?: string): Promise<TagListOptions[]> => {
  if (global._results._tags && global._results._tags.length) {
    return <TagListOptions[]>getTree({
      data: global._results._tags,
      parentCode
    })
  } else {
    const data: any[] = []
    // 是否与指定用户关联
    let sqlStr = ''
    let sqlLeft = ''
    if (userId) {
      sqlStr = 't3.id AS checked_user_id,'
      sqlLeft = 'LEFT JOIN users_tags t3 ON (t3.user_id = ? AND t3.tag_code = t1.code)'
      data.push(userId)
    }
    const sql = `
      SELECT 
        t1.id, t1.parent_code, t2.label as parent_label, t1.code, t1.label, 
        ${sqlStr} 
        t1.sort, t1.configurable, t1.create_time, t1.update_time, t1.terminal, t1.remarks  
      FROM tags t1 
      LEFT JOIN tags t2 ON t1.parent_code = t2.code 
      ${sqlLeft}`
    const res: TagOptions[] = <TagOptions[]>await query(sql, data)
    // 若与指定用户关联
    if (userId) {
      res.forEach((item) => {
        if (item.checked_user_id) item.checked_user_id = '1'
        else item.checked_user_id = '0'
      })
    }
    global._results._tags = [...res]
    return <TagListOptions[]>getTree({
      data: global._results._tags,
      parentCode
    })
  }
}
