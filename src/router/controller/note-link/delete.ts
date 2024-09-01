/**
 * @description 笔记关联模块删除
 * @author cpl
 * @create 2023-02-07 14:37:12
 */

import { query } from '@/db'
import { Success } from '@/utils/http-exception'
import { Context } from 'koa'

/*
 * 笔记关联删除
 */
export const doNoteLinkDelete = async (ctx: Context) => {
  const sql = 'DELETE FROM notes_link WHERE id = ?'
  const data = [ctx._params.id]
  await query(sql, data)
  throw new Success()
}
