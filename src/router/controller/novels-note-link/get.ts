/**
 * @description 获取可共享关联的笔记列表
 * @author cpl
 * @create 2023-02-07 14:57:04
 */

import { execTrans, query } from '@/db'
import { Success } from '@/utils/http-exception'
import { Context } from 'koa'
import { NovelNoteLinkOptions, NovelNoteLinkParams, NovelNoteLinkReturnOption } from './interface'
import { novelNoteLinkTypes } from './convert'

// 获取本用户的可共享关联的笔记列表
export const doNovelNoteLinkDeleteGetListSelf = async (ctx: Context) => {
  const params: NovelNoteLinkParams = {
    share: ctx._params.share,
    userId: ctx._user.id,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10
  }
  const data = <NovelNoteLinkReturnOption>await getNovelNoteLinkDeleteGetListSelf(params)
  throw new Success(data)
}

// 获取本用户的可共享关联的笔记列表
const getNovelNoteLinkDeleteGetListSelf = async (
  options: NovelNoteLinkParams
): Promise<NovelNoteLinkReturnOption> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  const sql1 =
    'SELECT COUNT(t1.id) AS total FROM novels_note_link t1 LEFT JOIN novels_note t2 ON t1.note_id = t2.id WHERE t1.share = ? AND t2.create_user = ?'
  const data1 = [options.share, options.userId]
  const sql2 =
    'SELECT t1.id, t1.create_time, t1.terminal, t2.id AS note_id, t2.title AS note_title, t1.target_id, t1.target_type, t3.label AS target_type_label FROM novels_note_link t1 LEFT JOIN novels_note t2 ON t1.note_id = t2.id LEFT JOIN tags t3 ON t1.target_type = t3.code WHERE t1.share = ? AND t2.create_user = ? ORDER BY t2.sort, t2.update_time DESC LIMIT ?, ?'
  const data2 = [options.share, options.userId, pageNo, options.pageSize]
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  await _handleNovelNoteList(res[1])
  return {
    total: res[0][0]['total'],
    data: res[1]
  }
}

const _handleNovelNoteList = async (datas: NovelNoteLinkOptions[]) => {
  if (!Array.isArray(datas)) return
  for (let i = 0, len = datas.length; i < len; i++) {
    const item = datas[i]
    const currentType = novelNoteLinkTypes[item.target_type]
    if (currentType) {
      const sql = `SELECT ${currentType.titleKey} AS title FROM ${currentType.table} WHERE id = ?`
      const data = [item.target_id]
      const res: any = await query(sql, data)
      if (res && res.length) {
        item.target_title = res[0].title
      } else item.target_title = ''
    }
  }
}
