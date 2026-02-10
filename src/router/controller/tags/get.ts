/**
 * @description 标签获取
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { query } from '@/db'
import { Context } from 'koa'
import { TagOptions, TagListOptions } from './interface'
import { getTree } from '@/utils/tools'
import { useTagCache } from './cache'

// 获取指定的某个标签
export const doTagGetByCode = async (ctx: Context) => {
  const data = await getTagByCode(ctx._params.code)
  throw new Success({ data })
}

// 获取某类标签
export const doTagGetByParentCode = async (ctx: Context) => {
  const data = await getTagByParentCode(ctx._params.parentCode || '')
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
export const getTagByParentCode = async (parentCode: string): Promise<TagListOptions[]> => {
  let tags: any = null
  const { getTagListCacheData, setTagListCacheData } = useTagCache()
  const cacheData = getTagListCacheData()
  if (cacheData) {
    tags = cacheData
  } else {
    const data: any[] = []
    const sql = `
      SELECT 
        t1.id, t1.parent_code, t2.label as parent_label, t1.code, t1.label, 
        t1.sort, t1.configurable, t1.create_time, t1.update_time, t1.terminal, t1.remarks  
      FROM tags t1 
      LEFT JOIN tags t2 ON t1.parent_code = t2.code`
    tags = (await query(sql, data)) as TagOptions[]
    setTagListCacheData(tags)
  }
  return getTree({
    data: tags,
    parentCode
  }) as TagListOptions[]
}
