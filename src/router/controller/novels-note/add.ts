/**
 * @description 笔记新增
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { execTrans } from '@/db'
import { Terminal } from '@/enums'
import { formatDate, getUuId } from '@/utils/tools'
import { validateRange } from '@/utils/validator'

/**
 * 小说新增
 */
export const doNovelNoteAdd = async (ctx: Context) => {
  const params = ctx._params
  const paramsData = await validateRange([{ value: params.isSecret, range: ['1', '0'], default: '1' }], true)
  const currentTime = formatDate(new Date())
  const sort: number = params.sort || 1
  const sql: string =
    'INSERT novels_note (id, title, content, classify, sort,is_secret, create_user, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  const id = getUuId()
  const data = [
    id,
    params.title,
    params.content,
    params.classify,
    sort,
    paramsData[0],
    ctx._user.id,
    currentTime,
    currentTime,
    Terminal[ctx._terminal],
    params.remarks
  ]
  const sqlData = [{ sql, data }]
  if (params.targetId) {
    const sql2 =
      'INSERT novels_note_link (id, status, note_id, target_id, target_type, share, create_time, terminal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    const data2 = [
      getUuId(),
      '1',
      id,
      params.targetId,
      params.targetType,
      params.targetShare,
      currentTime,
      Terminal[ctx._terminal]
    ]
    sqlData.push({
      sql: sql2,
      data: data2
    })
  }
  await execTrans(sqlData)
  throw new Success({ data: id })
}
