/**
 * 笔记章节获取相关
 */

import { Success } from '@/utils/http-exception'
import { Context } from 'koa'
import { NoteListParams, NoteListReturn, NoteOneParams, NoteOptions } from './interface'
import { execTrans, getSelectWhereKeyword, query } from '@/db'
import { handleNote } from './utils'

/**
 * 获取指定的某个笔记
 */
export const doNoteGetOne = async (ctx: Context) => {
  const data = await getNoteGetOne({
    id: ctx._params.id,
    userId: ctx._user.id,
    showUserInfo: ctx._params.showUserInfo || '1'
  })
  throw new Success({ data })
}

/**
 * 获取笔记列表
 */
export const doNoteGetList = async (ctx: Context) => {
  const data = await getNoteGetList({
    rootId: ctx._params.rootId,
    targetId: ctx._params.targetId,
    relevance: ctx._params.relevance,
    keyword: ctx._params.keyword,
    highlight: ctx._params.highlight || '0',
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    isSecret: ctx._params.isSecret,
    classify: ctx._params.classify,
    userId: ctx._user.id,
    showUserInfo: ctx._params.showUserInfo || '0'
  })
  throw new Success(data)
}

/**
 * 获取指定的某个笔记，返回对象或null
 */
export const getNoteGetOne = async (params: NoteOneParams): Promise<NoteOptions | null> => {
  // 处理创建者信息字段
  // 处理创建者信息字段
  const userInfoField =
    params.showUserInfo === '1' ? ' t2.username AS create_user_name, t2.avatar AS create_user_avatar, ' : ''
  const sql: string = `
      SELECT
        t1.id, t1.root_id, t1.target_id, t1.title, t1.content,
        t1.classify, t1.sort, t1.is_secret, t1.link_status, t1.create_user,
        ${userInfoField}
        t1.create_time, t1.update_time, t1.terminal, t1.remarks
      FROM notes t1
      LEFT JOIN users t2 ON t1.create_user = t2.id
      WHERE
        t1.id = ? AND 
        (t1.is_secret = 0 OR t1.create_user = ?)`
  const data = [params.id, params.userId]
  let res = await query(sql, data)
  res = res[0] || null
  if (res) {
    await handleNote(res, {
      userId: params.userId,
      showUserInfo: params.showUserInfo
    })
  }
  return res
}

export const getNoteGetList = async (options: NoteListParams): Promise<NoteListReturn> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  let whereSQL = ''
  const whereData = []
  // 处理 targetId 或 rootId
  if (options.targetId) {
    if (options.relevance === '1') {
      whereSQL = `
        WHERE 
          (
            t1.target_id = ? OR 
            (t1.id IN (SELECT t3.note_id FROM notes_link t3 WHERE t3.target_id = ?) AND t1.link_status = 1)
          )`
      whereData.push(options.targetId, options.targetId)
    } else {
      whereSQL = 'WHERE t1.target_id = ?'
      whereData.push(options.targetId)
    }
  } else {
    whereSQL = 'WHERE t1.root_id = ?'
    whereData.push(options.rootId)
  }
  if (options.isSecret === '1') {
    whereSQL += ' AND t1.is_secret = 1 AND t1.create_user = ? '
    whereData.push(options.userId)
  } else if (options.isSecret === '0') {
    whereSQL += ' AND t1.is_secret = 0 '
  } else {
    whereSQL += ' AND (t1.is_secret = 0 OR t1.create_user = ?) '
    whereData.push(options.userId)
  }
  if (options.classify) {
    whereSQL += ' AND t1.classify LIKE ? '
    whereData.push(`%${options.classify}%`)
  }
  // 处理keyword参数
  const keywordResult = getSelectWhereKeyword({
    valid: ['t1.title', 't1.content'],
    data: options,
    prefix: 'AND',
    isOrderKeyword: true
  })
  whereSQL += keywordResult.sql
  whereData.push(...keywordResult.data)
  // 处理排序规则语句
  const orderSql = `${keywordResult.orderSql} t1.sort, t1.update_time DESC`
  // 处理创建者信息字段
  const userInfoField =
    options.showUserInfo === '1' ? ' t2.username AS create_user_name, t2.avatar AS create_user_avatar, ' : ''
  const sql1: string = `SELECT COUNT(t1.id) AS total FROM notes t1 ${whereSQL}`
  const data1 = [...whereData]
  const sql2 = `
    SELECT 
      t1.id, t1.root_id, t1.target_id, t1.classify, t1.sort, 
      t1.is_secret, t1.link_status, t1.create_user, 
      ${userInfoField} 
      ${keywordResult.orderFields}
      t1.create_time, t1.update_time, t1.terminal, t1.remarks 
    FROM notes t1
    LEFT JOIN users t2 ON t1.create_user = t2.id 
    ${whereSQL} 
    ORDER BY ${orderSql} 
    LIMIT ?, ?`
  const data2 = [...whereData, pageNo, options.pageSize]
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  const noteList: NoteOptions[] = res[1]
  await handleNote(noteList, {
    userId: options.userId,
    showUserInfo: options.showUserInfo
  })
  return { total: res[0][0]['total'], data: noteList }
}
