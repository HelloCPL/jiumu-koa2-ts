/**
 * @description 笔记章节获取
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { query, execTrans } from '@/db'
import { Context } from 'koa'
import {
  NovelNoteOptions,
  NovelNoteListParams,
  NovelNoteListReturn,
  NovelNoteTargetOptions,
  NovelNoteOneParams,
  NoteChapterParams
} from './interface'
import _ from 'lodash'
import { getTagCustomByIds } from '../tags-custom/get'
import { getSelectWhereAsKeywordData, getOrderByKeyword, getSelectWhereData } from '@/utils/handle-sql'
import { getFileById } from '../files-info/get'
import { novelNoteLinkTypes } from '../novels-note-link/convert'

// 获取指定的某个笔记
export const getNovelNoteGetOne = async (ctx: Context) => {
  const data = await doNovelNoteGetOne({
    id: ctx._params.id,
    userId: ctx._user.id,
    showUserInfo: ctx._params.showUserInfo || '1'
  })
  throw new Success({ data })
}

// 获取指定目标所有的笔记列表
export const doNovelNoteGetList = async (ctx: Context) => {
  const params: NovelNoteListParams = {
    targetId: ctx._params.targetId,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    keyword: ctx._params.keyword,
    highlight: ctx._params.highlight,
    userId: ctx._user.id,
    isSecret: ctx._params.isSecret,
    classify: ctx._params.classify,
    showUserInfo: ctx._params.showUserInfo || '0'
  }
  const data = await getNovelNoteGetList(params)
  throw new Success(data)
}

/**
 * 获取指定的某个笔记，返回对象或null
 */
export const doNovelNoteGetOne = async (params: NovelNoteOneParams): Promise<NovelNoteOptions | null> => {
  // 处理创建者信息字段
  const userInfoField =
    params.showUserInfo === '1' ? ' t3.username AS create_user_name, t3.avatar AS create_user_avatar, ' : ''
  const sql: string = `SELECT t1.id, t1.title, t1.content, t1.classify, t1.sort, t1.is_secret, t1.create_user, ${userInfoField} t1.create_time, t1.update_time, t1.terminal, t1.remarks FROM novels_note t1 LEFT JOIN users t3 ON t1.create_user = t3.id  WHERE t1.id = ? AND (t1.is_secret = 0 OR t1.create_user = ?)`
  const data = [params.id, params.userId]
  let res: any = await query(sql, data)
  res = res[0] || null
  if (res)
    await _handleNoteChapter(<NovelNoteOptions>res, {
      userId: params.userId,
      showUserInfo: params.showUserInfo
    })
  return res
}

export const getNovelNoteGetList = async (options: NovelNoteListParams): Promise<NovelNoteListReturn> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  // 处理keyword参数
  const sqlParamsKeyword = getSelectWhereAsKeywordData({
    valid: ['t1.title', 't1.content'],
    data: options,
    prefix: 'AND'
  })
  // 处理搜索排序
  const orderParams = getOrderByKeyword({
    valid: ['t1.title', 't1.content'],
    data: options
  })
  // 处理普通where参数
  const sqlParams = getSelectWhereData({
    valid: ['t1.is_secret'],
    data: options,
    prefix: 'AND'
  })
  let whereSQL = ''
  let whereData: any[] = []
  if (options.isSecret === '1') {
    whereSQL = 'WHERE (t1.is_secret = 1 AND t1.create_user = ?)'
    whereData.push(options.userId)
  } else if (options.isSecret === '0') {
    whereSQL = 'WHERE t1.is_secret = 0'
  } else {
    whereSQL = 'WHERE (t1.is_secret = 0 OR t1.create_user = ?)'
    whereData.push(options.userId)
  }
  if (options.classify) {
    whereSQL += ' AND t1.classify LIKE ? '
    whereData.push(`%${options.classify}%`)
  }
  whereSQL += `${sqlParamsKeyword.sql}${sqlParams.sql} AND t2.target_id = ? AND t2.status = ? `
  whereData = [...whereData, ...sqlParamsKeyword.data, ...sqlParams.data, options.targetId, '1']
  // 处理排序规则语句
  const orderSql = `${orderParams.orderSql} t1.sort, t1.update_time DESC`
  // 处理创建者信息字段
  const userInfoField =
    options.showUserInfo === '1' ? ' t3.username AS create_user_name, t3.avatar AS create_user_avatar, ' : ''
  const sql1: string = `SELECT COUNT(t1.id) AS total FROM novels_note_link t2 LEFT JOIN novels_note t1 ON t2.note_id = t1.id ${whereSQL}`
  const data1 = [...whereData]
  const sql2 = `SELECT t1.id, ${orderParams.orderValid} t1.classify, t1.sort, t1.is_secret, t1.create_user, ${userInfoField} t1.create_time, t1.update_time, t1.terminal, t1.remarks FROM novels_note_link t2 LEFT JOIN novels_note t1 ON t2.note_id = t1.id LEFT JOIN users t3 ON t1.create_user = t3.id ${whereSQL} ORDER BY ${orderSql} LIMIT ?, ?`
  const data2 = [...whereData, pageNo, options.pageSize]
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  const novelNoteList: NovelNoteOptions[] = res[1]
  await _handleNoteChapter(novelNoteList, {
    userId: options.userId,
    targetId: options.targetId,
    showUserInfo: options.showUserInfo
  })
  return { total: res[0][0]['total'], data: novelNoteList }
}

// 处理小说数据
async function _handleNoteChapter(datas: NovelNoteOptions | NovelNoteOptions[], params: NoteChapterParams) {
  const _handleList = async (data: NovelNoteOptions) => {
    // 处理是否为自己发布
    if (data.create_user === params.userId) data.is_self = '1'
    else data.is_self = '0'
    // 处理自定义标签
    if (data.classify)
      data.classify = await getTagCustomByIds({
        ids: data.classify,
        userId: data.create_user
      })
    else data.classify = []
    // 处理创建者头像
    if (params.showUserInfo === '1' && data.create_user_avatar) {
      data.create_user_avatar = await getFileById(data.create_user_avatar, data.create_user)
    }
    // 处理目标集合
    const sql =
      'SELECT t1.target_id AS id, t1.target_type AS type, t2.label AS type_label FROM novels_note_link t1 LEFT JOIN tags t2 ON t1.target_type = t2.code WHERE t1.note_id = ? AND t1.status = ?'
    const res: any = await query(sql, [data.id, '1'])
    if (Array.isArray(res) && res.length) {
      data.target = await _handleGetTargetIds(res)
    } else {
      data.target = []
    }
  }
  if (_.isArray(datas)) {
    for (let i = 0, len = datas.length; i < len; i++) {
      await _handleList(datas[i])
    }
  } else {
    await _handleList(datas)
  }
}

// 获取目标信息
async function _handleGetTargetIds(target: NovelNoteTargetOptions[]): Promise<NovelNoteTargetOptions[]> {
  const arr: NovelNoteTargetOptions[] = []
  for (let i = 0, len = target.length; i < len; i++) {
    const item = target[i]
    const currentType = novelNoteLinkTypes[item.type]
    if (currentType) {
      const sql = `SELECT ${currentType.titleKey} AS title FROM ${currentType.table} WHERE id = ?`
      const data = [item.id]
      const res: any = await query(sql, data)
      if (res && res.length) {
        const obj = {
          ...item,
          title: res[0].title
        }
        arr.push(obj)
      }
    }
  }
  return arr
}
