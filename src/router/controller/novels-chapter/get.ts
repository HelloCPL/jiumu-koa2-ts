/**
 * @description 小说章节获取
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { query, execTrans } from '@/db'
import { Context } from 'koa'
import {
  NovelChapterOptions,
  NovelChapterListParams,
  NovelChapterListReturn,
  NovelChapterOneParams,
  handleNovalChapterParams
} from './interface'
import _ from 'lodash'
import { getFileById } from '../files-info/get'

// 获取指定的某个小说章节
export const doNovelChapterGetOne = async (ctx: Context) => {
  const data = await getNovelChapterGetOne({
    id: ctx._params.id,
    userId: ctx._user.id,
    showUserInfo: ctx._params.showUserInfo || '0'
  })
  throw new Success({ data })
}

// 获取指定小说所有的章节列表
export const doNovelChapterGetList = async (ctx: Context) => {
  const params: NovelChapterListParams = {
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    novelId: ctx._params.novelId,
    userId: ctx._user.id,
    isDraft: ctx._params.isDraft,
    isSecret: ctx._params.isSecret,
    isConcise: ctx._params.isConcise || '0',
    showUserInfo: ctx._params.showUserInfo || '0'
  }
  const data = await getNovelChapterGetList(params)
  throw new Success(data)
}

/**
 * 获取指定的某个小说章节，返回对象或null
 */
export const getNovelChapterGetOne = async (
  params: NovelChapterOneParams
): Promise<NovelChapterOptions | null> => {
  // 获取条件
  const conditional =
    '((t1.is_secret = 0 AND t2.is_secret = 0 AND t1.is_draft = 0 AND t2.is_draft = 0) OR t1.create_user = ?)'
  // 处理创建者信息字段
  const userInfoField =
    params.showUserInfo === '1' ? ' t3.username AS create_user_name, t3.avatar AS create_user_avatar, ' : ''
  const sql: string = `SELECT t1.id, t1.novel_id, t2.name AS novel_name, t2.author AS novel_author, t1.title, t1.content, t1.sort, t1.is_secret AS secret1, t2.is_secret AS secret2, t1.is_draft, t1.create_user, ${userInfoField} t1.create_time, t1.update_time, t1.terminal, t1.remarks, t4.id AS is_like, (SELECT COUNT(t5.id) FROM likes t5 WHERE t5.target_id = t1.id) AS like_count, t6.id AS is_collection, (SELECT COUNT(t7.id) FROM collections t7 WHERE t7.target_id = t1.id) AS collection_count, (SELECT COUNT(t8.id) FROM comments_first t8 WHERE t8.target_id = t1.id) AS comment_count1, (SELECT COUNT(t9.id) FROM comments_second t9 WHERE t9.comment_first_target_id = t1.id) AS comment_count2 FROM novels_chapter t1 LEFT JOIN novels t2 ON t1.novel_id = t2.id LEFT JOIN users t3 ON t1.create_user = t3.id LEFT JOIN likes t4 ON (t1.id = t4.target_id AND t4.create_user = ?) LEFT JOIN collections t6 ON (t1.id = t6.target_id AND t6.create_user = ?) WHERE t1.id = ? AND ${conditional}`
  const data = [params.userId, params.userId, params.id, params.userId]
  let res: any = await query(sql, data)
  res = res[0] || null
  if (res)
    await _handleNovelChapter(res, {
      userId: params.userId,
      showUserInfo: params.showUserInfo
    })
  return res
}

export const getNovelChapterGetList = async (
  options: NovelChapterListParams
): Promise<NovelChapterListReturn> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  let whereSQL = ''
  const whereData: any[] = []
  // 处理isSecret参数
  if (options.isSecret === '1') {
    whereSQL = ' WHERE ((t1.is_secret = 1 OR t2.is_secret = 1) AND t1.create_user = ?) '
    whereData.push(options.userId)
  } else if (options.isSecret === '0') {
    whereSQL = ' WHERE (t1.is_secret = 0 AND t2.is_secret = 0) '
  } else {
    whereSQL = ' WHERE ((t1.is_secret = 0 AND t2.is_secret = 0) OR t1.create_user = ?) '
    whereData.push(options.userId)
  }
  // 处理isDraft参数
  if (options.isDraft === '1') {
    whereSQL += ' AND (t1.is_draft = 1 AND t1.create_user = ?) '
    whereData.push(options.userId)
  } else if (options.isDraft === '0') {
    whereSQL += ' AND t1.is_draft = 0 '
  } else {
    whereSQL += ' AND (t1.is_draft = 0 OR t1.create_user = ?) '
    whereData.push(options.userId)
  }
  whereSQL += ' AND t1.novel_id = ? AND (t2.is_draft = 0 OR t2.create_user = ?) '
  whereData.push(options.novelId, options.userId)

  const sql1 = `SELECT COUNT(t1.id) AS total FROM novels_chapter t1 LEFT JOIN novels t2 ON t1.novel_id = t2.id ${whereSQL} `
  const data1 = [...whereData]
  let sql2 = ''
  let data2 = []
  if (options.isConcise === '1') {
    sql2 = `SELECT t1.id, t1.title, t1.sort, t1.is_secret AS secret1, t2.is_secret AS secret2, t1.is_draft, t1.create_user, t1.create_time, t1.update_time, t1.terminal, t1.remarks FROM novels_chapter t1 LEFT JOIN novels t2 ON t1.novel_id = t2.id ${whereSQL} ORDER BY t1.sort LIMIT ?, ?`
    data2 = [...whereData, pageNo, options.pageSize]
  } else {
    // 处理创建者信息字段
    const userInfoField =
      options.showUserInfo === '1'
        ? ' t3.username AS create_user_name, t3.avatar AS create_user_avatar, '
        : ''
    sql2 = `SELECT t1.id, t1.novel_id, t2.name AS novel_name, t2.author AS novel_author, t1.title, t1.sort, t1.is_secret AS secret1, t2.is_secret AS secret2, t1.is_draft, t1.create_user, ${userInfoField} t1.create_time, t1.update_time, t1.terminal, t1.remarks, t4.id AS is_like, (SELECT COUNT(t5.id) FROM likes t5 WHERE t5.target_id = t1.id) AS like_count, t6.id AS is_collection, (SELECT COUNT(t7.id) FROM collections t7 WHERE t7.target_id = t1.id) AS collection_count, (SELECT COUNT(t8.id) FROM comments_first t8 WHERE t8.target_id = t1.id) AS comment_count1, (SELECT COUNT(t9.id) FROM comments_second t9 WHERE t9.comment_first_target_id = t1.id) AS comment_count2 FROM novels_chapter t1 LEFT JOIN novels t2 ON t1.novel_id = t2.id LEFT JOIN users t3 ON t1.create_user = t3.id LEFT JOIN likes t4 ON (t1.id = t4.target_id AND t4.create_user = ?) LEFT JOIN collections t6 ON (t1.id = t6.target_id AND t6.create_user = ?) ${whereSQL} ORDER BY t1.sort LIMIT ?, ?`
    data2 = [options.userId, options.userId, ...whereData, pageNo, options.pageSize]
  }
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  const novelChapterList: NovelChapterOptions[] = res[1]
  await _handleNovelChapter(novelChapterList, {
    userId: options.userId,
    showUserInfo: options.showUserInfo,
    isConcise: options.isConcise
  })
  return { total: res[0][0]['total'], data: novelChapterList }
}

// 处理小说数据
async function _handleNovelChapter(
  datas: NovelChapterOptions | NovelChapterOptions[],
  params: handleNovalChapterParams
) {
  const _handleList = async (data: NovelChapterOptions) => {
    // 处理是否为自己发布
    if (data.create_user === params.userId) data.is_self = '1'
    else data.is_self = '0'
    // 处理是否公开状态
    if (data.secret1 === '0' && data.secret2 === '0') data.is_secret = '0'
    else data.is_secret = '1'
    delete data.secret1
    delete data.secret2
    if (params.isConcise !== '1') {
      // 处理是否点赞
      if (data.is_like) data.is_like = '1'
      else data.is_like = '0'
      if (data.is_collection) data.is_collection = '1'
      // 处理是否收藏
      else data.is_collection = '0'
      // 处理评论总数
      data.comment_count = data.comment_count1 + data.comment_count2
      delete data.comment_count1
      delete data.comment_count2
      // 处理创建者头像
      if (params.showUserInfo === '1' && data.create_user_avatar) {
        data.create_user_avatar = await getFileById(data.create_user_avatar, data.create_user)
      }
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
