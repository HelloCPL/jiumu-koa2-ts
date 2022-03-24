/**
 * @description 笔记章节获取
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '../../../utils/http-exception'
import { query, execTrans } from '../../../db'
import { Context, Next } from 'koa'
import { NovelNoteOptions, TargetIdsParams, NovelNoteListParams, NovelNoteListReturn } from './interface'
import _ from 'lodash'
import { getTagCustomByIds } from '../tags-custom/get';
import { getSelectWhereAsKeywordData, getOrderByKeyword, getSelectWhereData } from '../../../utils/handle-sql';

// 可做笔记资源类型
const tList: ObjectAny = {
  '502': 'comments_first',
  '503': 'sources',
  '504': 'novels',
  '505': 'articles',
  '507': 'novels_chapter',
}

// 获取指定的某个笔记
export const doNovelNoteGetOne = async (ctx: Context, next: Next) => {
  const data = await getNovelNoteGetOne(ctx.params.id, ctx.user.id)
  throw new Success({ data })
}

// 获取指定目标所有的笔记列表
export const doNovelNoteGetList = async (ctx: Context, next: Next) => {
  const params: NovelNoteListParams = {
    targetId: ctx.params.targetId,
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
    keyword: ctx.params.keyword,
    userId: ctx.user.id,
    isSecret: ctx.params.isSecret,
  }
  const data = await getNovelNoteGetList(params)
  throw new Success(data)
}

/**
 * 获取指定的某个笔记，返回对象或null
 */
export const getNovelNoteGetOne = async (id: string, userId: string): Promise<NovelNoteOptions | null> => {
  const sql: string = `SELECT t1.id, t1.target_ids, t1.type, t2.label AS type_label, t1.title, t1.content, t1.classify, t1.sort, t1.is_secret, t1.create_user, t3.username AS create_user_name, t1.create_time, t1.update_time, t1.terminal, t1.remarks FROM novels_note t1 LEFT JOIN tags t2 ON t1.type = t2.code LEFT JOIN users t3 ON t1.create_user = t3.id  WHERE t1.id = ? AND (t1.is_secret = 0 OR (t1.is_secret = 1 AND t1.create_user = ?))`
  const data = [id, userId]
  let res: any = await query(sql, data)
  res = res[0] || null
  if (res) await _handleNoteChapter(res, userId)
  return res
}

export const getNovelNoteGetList = async (options: NovelNoteListParams): Promise<NovelNoteListReturn> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  // 处理keyword参数
  const sqlParamsKeyword = getSelectWhereAsKeywordData({
    valid: ['t1.title', 't1.content'],
    data: options,
    prefix: 'AND',
  })
  // 处理搜索排序
  const orderParams = getOrderByKeyword({
    valid: ['t1.title', 't1.content'],
    data: options,
  })
  // 处理普通where参数
  const sqlParams = getSelectWhereData({
    valid: ['t1.is_secret'],
    data: options,
    prefix: 'AND',
  })
  let whereSQL = ''
  let whereData: any[] = []
  if (options.isSecret === '1') {
    whereSQL = `WHERE (t1.is_secret = 1 AND t1.create_user = ?)`
    whereData.push(options.userId)
  } else if (options.isSecret === '0') {
    whereSQL = `WHERE t1.is_secret = 0`
  } else {
    whereSQL = `WHERE (t1.is_secret = 0 OR (t1.is_secret = 1 AND t1.create_user = ?))`
    whereData.push(options.userId)
  }
  whereSQL += `${sqlParamsKeyword.sql}${sqlParams.sql} AND t1.target_ids like ?`
  whereData = [...whereData, ...sqlParamsKeyword.data, ...sqlParams.data, `%${options.targetId}%`]
  // 处理排序规则语句
  const orderSql = `${orderParams.orderSql} t1.sort, t1.update_time DESC`
  const sql1: string = `SELECT COUNT(t1.id) AS total FROM novels_note t1 ${whereSQL}`
  const data1 = [...whereData]
  const sql2 = `SELECT t1.id, t1.target_ids, t1.type, t2.label AS type_label, t1.title, t1.content, t1.classify, t1.sort, t1.is_secret, t1.create_user, t3.username AS create_user_name, t1.create_time, t1.update_time, t1.terminal, t1.remarks FROM novels_note t1 LEFT JOIN tags t2 ON t1.type = t2.code LEFT JOIN users t3 ON t1.create_user = t3.id ${whereSQL} ORDER BY ${orderSql} LIMIT ?, ?`
  const data2 = [...whereData, pageNo, options.pageSize]
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  const novelNoteList: NovelNoteOptions[] = res[1]
  await _handleNoteChapter(novelNoteList, options.userId)
  return { total: res[0][0]['total'], data: novelNoteList }
}

// 处理小说数据
async function _handleNoteChapter(datas: NovelNoteOptions | NovelNoteOptions[], userId: string) {
  const _handleList = async (data: NovelNoteOptions) => {
    // 处理是否为自己发布
    if (data.create_user === userId) data.is_self = '1'
    else data.is_self = '0'
    // 处理自定义标签
    if (data.classify)
      data.classify = await getTagCustomByIds(data.classify, data.create_user)
    else data.classify = []
    // 处理目标集合
    if (data.target_ids)
      data.target_ids = await _handleGetTargetIds({
        ids: data.target_ids,
        type: data.type,
        userId
      })
    else data.target_ids = []
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
async function _handleGetTargetIds(options: TargetIdsParams): Promise<any[]> {
  let t = tList[options.type]
  let valid = 't1.title'
  if (options.type === '502') {
    valid = 't1.content AS title'
  } else if (options.type === '504') {
    valid = 't1.name AS title'
  }
  let sql: string = `SELECT t1.id, ${valid} FROM ${t} t1 WHERE FIND_IN_SET(t1.id, ?) AND t1.create_user = ?`
  const data = [options.ids, options.userId]
  // @ts-ignore
  const res: any[] = await query(sql, data)
  return res
}