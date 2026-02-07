/**
 * @description 查找指定小说的最大章节排序号
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { query } from '@/db'
import { Context } from 'koa'

// 查找指定小说的最大章节排序号
export const doNovelChapterGetMaxSort = async (ctx: Context) => {
  const sql = `
  SELECT 
    MAX(t1.sort) AS max_sort 
  FROM novels_chapter t1 
  WHERE t1.novel_id = ?`
  const data = [ctx._params.novelId]
  const res = await query(sql, data)
  let maxSort = 0
  if (res.length && res[0].max_sort) {
    maxSort = res[0].max_sort
  }

  throw new Success({ data: maxSort })
}
