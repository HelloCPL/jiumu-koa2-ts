/**
 * @description 小说获取
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { execTrans } from '@/db'
import { Context } from 'koa'
import { NovelOptions, NovelListParams, NovelListReturn, NovelOneParams } from './interface'
import { getTagCustomByIds } from '../tags-custom/get'
import { getOrderByKeyword, getSelectWhereAsKeywordData, getSelectWhereData } from '@/utils/handle-sql'
import { getFileById } from '../files-info/get'
import { getWordNumber } from '@/utils/tools'
import { isArray } from 'lodash'

// 获取指定的某个小说
export const doNovelGetOne = async (ctx: Context) => {
  const data = await getNovelOne({
    id: ctx._params.id,
    userId: ctx._user.id,
    showUserInfo: ctx._params.showUserInfo || '1'
  })
  throw new Success({ data })
}

// 获取小说列表
export const doNovelGetList = async (ctx: Context) => {
  const params: NovelListParams = {
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    keyword: ctx._params.keyword,
    highlight: ctx._params.highlight,
    userId: ctx._user.id,
    createUser: ctx._params.userId,
    type: ctx._params.type,
    classify: ctx._params.classify,
    isDraft: ctx._params.isDraft,
    isSecret: ctx._params.isSecret,
    showUserInfo: ctx._params.showUserInfo || '0'
  }
  const data = await getNovelList(params)
  throw new Success(data)
}

/**
 * 获取指定的某个小说，返回对象或null
 */
export const getNovelOne = async (params: NovelOneParams): Promise<NovelOptions | null> => {
  // 处理子章节点赞总数
  const chapterLikeCount =
    '(SELECT COUNT(t5_1.id) FROM likes t5_1 WHERE t5_1.target_id IN (SELECT t5_2.id FROM novels_chapter t5_2 WHERE t5_2.novel_id = t1.id)) AS chapter_like_count,'
  // 处理子章节收藏总数
  const chapterCollectionCount =
    '(SELECT COUNT(t7_1.id) FROM collections t7_1 WHERE t7_1.target_id IN (SELECT t7_2.id FROM novels_chapter t7_2 WHERE t7_2.novel_id = t1.id)) AS chapter_collection_count,'
  // 处理子章节评论数
  const chapterCommentCount1 =
    '(SELECT COUNT(t8_1.id) FROM comments_first t8_1 WHERE t8_1.target_id IN (SELECT t8_2.id FROM novels_chapter t8_2 WHERE t8_2.novel_id = t1.id)) AS chapter_comment_count1,'
  const chapterCommentCount2 =
    '(SELECT COUNT(t9_1.id) FROM comments_second t9_1 WHERE t9_1.comment_first_target_id IN (SELECT t9_2.id FROM novels_chapter t9_2 WHERE t9_2.novel_id = t1.id)) AS chapter_comment_count2,'
  // 处理章节数
  const chapterCount =
    '(SELECT COUNT(t10.id) FROM novels_chapter t10 WHERE t10.novel_id = ? AND (t10.create_user = ? OR (t10.is_draft = 0 AND t10.is_secret = 0))) AS chapter_count'
  const chapterCountData = [params.id, params.userId]
  // 处理创建者信息字段
  const userInfoField =
    params.showUserInfo === '1' ? ' t3.username AS create_user_name, t3.avatar AS create_user_avatar, ' : ''
  const sql: string = `SELECT t1.id, t1.name, t1.introduce, t1.classify, t1.type, t2.label AS type_label, t1.author, t1.is_top, t1.is_secret, t1.is_draft, t1.sort, t1.create_user, ${userInfoField} t1.create_time, t1.update_time, t1.terminal, t1.remarks, t4.id AS is_like, (SELECT COUNT(t5.id) FROM likes t5 WHERE t5.target_id = t1.id) AS like_count, ${chapterLikeCount} t6.id AS is_collection, (SELECT COUNT(t7.id) FROM collections t7 WHERE t7.target_id = t1.id) AS collection_count, ${chapterCollectionCount} (SELECT COUNT(t8.id) FROM comments_first t8 WHERE t8.target_id = t1.id) AS comment_count1, ${chapterCommentCount1} (SELECT COUNT(t9.id) FROM comments_second t9 WHERE t9.comment_first_target_id = t1.id) AS comment_count2, ${chapterCommentCount2} ${chapterCount} FROM novels t1 LEFT JOIN tags t2 ON t1.type = t2.code LEFT JOIN users t3 ON t1.create_user = t3.id LEFT JOIN likes t4 ON (t1.id = t4.target_id AND t4.create_user = ?) LEFT JOIN collections t6 ON (t1.id = t6.target_id AND t6.create_user = ?) WHERE t1.id = ? AND (t1.is_secret = 0 OR (t1.is_secret = 1 AND t1.create_user = ?)) AND (t1.is_draft = 0 OR (t1.is_draft = 1 AND t1.create_user = ?))`
  const data = [...chapterCountData, params.userId, params.userId, params.id, params.userId, params.userId]
  const sql2 = 'SELECT update_time, content FROM novels_chapter WHERE novel_id = ?'
  const data2 = [params.id]
  const res: any = await execTrans([
    { sql, data },
    { sql: sql2, data: data2 }
  ])
  const novelInfo = res[0][0] || null
  if (novelInfo) {
    await _handleNovel(novelInfo, params.userId, params.showUserInfo)
    // 处理更新时间和总字数
    const chapterList = res[1] || []
    let updateTime = novelInfo.update_time
    let wordCount = 0
    chapterList.forEach((item: any) => {
      if (item.update_time > updateTime) updateTime = item.update_time
      wordCount += getWordNumber(item.content)
    })
    novelInfo.update_time = updateTime
    novelInfo.word_count = wordCount
  }
  return novelInfo
}

/**
 * 获取小说列表，返回数组或[]
 */
export const getNovelList = async (options: NovelListParams): Promise<NovelListReturn> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  // 处理keyword参数
  const sqlParamsKeyword = getSelectWhereAsKeywordData({
    valid: ['t1.name', 't1.(author)', 't3.(username)', 't1.introduce'],
    data: options,
    prefix: 'AND'
  })
  // 处理搜索排序
  const orderParams = getOrderByKeyword({
    valid: ['t1.name', 't1.author', '!t3.(username):createUserName', 't1.introduce'],
    data: options
  })

  // 处理普通where参数
  const sqlParams = getSelectWhereData({
    valid: ['t1.create_user', 't1.type', 't1.is_draft'],
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
    whereSQL = 'WHERE (t1.is_secret = 0 OR (t1.is_secret = 1 AND t1.create_user = ?))'
    whereData.push(options.userId)
  }
  if (options.classify) {
    whereSQL += ' AND t1.classify LIKE ? '
    whereData.push(`%${options.classify}%`)
  }
  whereSQL += `${sqlParamsKeyword.sql}${sqlParams.sql}`
  whereData = [...whereData, ...sqlParamsKeyword.data, ...sqlParams.data]
  // 处理排序规则语句
  let orderSql
  if (options.createUser) {
    // 指定用户排序
    orderSql = `${orderParams.orderSql} t1.sort, t1.update_time DESC`
  } else {
    // 指定用户排序
    orderSql = `${orderParams.orderSql} t1.is_top DESC, (like_count + chapter_like_count) DESC, (collection_count + chapter_collection_count) DESC, t1.update_time DESC`
  }
  // 处理创建者信息字段
  const userInfoField =
    options.showUserInfo === '1' ? ' t3.username AS create_user_name, t3.avatar AS create_user_avatar, ' : ''

  const sql1 = `SELECT COUNT(t1.id) AS total FROM novels t1 LEFT JOIN users t3 ON t1.create_user = t3.id ${whereSQL}`
  const data1 = [...whereData]
  const chapterLikeCount =
    '(SELECT COUNT(t5_1.id) FROM likes t5_1 WHERE t5_1.target_id IN (SELECT t5_2.id FROM novels_chapter t5_2 WHERE t5_2.novel_id = t1.id)) AS chapter_like_count,'
  const chapterCollectionCount =
    '(SELECT COUNT(t7_1.id) FROM collections t7_1 WHERE t7_1.target_id IN (SELECT t7_2.id FROM novels_chapter t7_2 WHERE t7_2.novel_id = t1.id)) AS chapter_collection_count,'
  const chapterCommentCount1 =
    '(SELECT COUNT(t8_1.id) FROM comments_first t8_1 WHERE t8_1.target_id IN (SELECT t8_2.id FROM novels_chapter t8_2 WHERE t8_2.novel_id = t1.id)) AS chapter_comment_count1,'
  const chapterCommentCount2 =
    '(SELECT COUNT(t9_1.id) FROM comments_second t9_1 WHERE t9_1.comment_first_target_id IN (SELECT t9_2.id FROM novels_chapter t9_2 WHERE t9_2.novel_id = t1.id)) AS chapter_comment_count2,'
  // 处理章节数
  const chapterCount =
    '(SELECT COUNT(t10.id) FROM novels_chapter t10 WHERE t10.novel_id = t1.id AND (t10.create_user = ? OR (t10.is_draft = 0 AND t10.is_secret = 0))) AS chapter_count'
  const chapterCountData = [options.userId]

  const sql2 = `SELECT t1.id, ${userInfoField} ${orderParams.orderValid} t1.classify, t1.type, t2.label AS type_label, t1.is_top, t1.sort, t1.is_secret, t1.is_draft, t1.create_user, t1.create_time, t1.update_time, t1.terminal, t1.remarks, t4.id AS is_like, (SELECT COUNT(t5.id) FROM likes t5 WHERE t5.target_id = t1.id) AS like_count, t6.id AS is_collection, ${chapterLikeCount} (SELECT COUNT(t7.id) FROM collections t7 WHERE t7.target_id = t1.id) AS collection_count, ${chapterCollectionCount} (SELECT COUNT(t8.id) FROM comments_first t8 WHERE t8.target_id = t1.id) AS comment_count1, ${chapterCommentCount1} (SELECT COUNT(t9.id) FROM comments_second t9 WHERE t9.comment_first_target_id = t1.id) AS comment_count2, ${chapterCommentCount2} ${chapterCount} FROM novels t1 LEFT JOIN tags t2 ON t1.type = t2.code LEFT JOIN users t3 ON t1.create_user = t3.id LEFT JOIN likes t4 ON (t1.id = t4.target_id AND t4.create_user = ?) LEFT JOIN collections t6 ON (t1.id = t6.target_id AND t6.create_user = ?) ${whereSQL} ORDER BY ${orderSql} LIMIT ?, ?`
  const data2 = [...chapterCountData, options.userId, options.userId, ...whereData, pageNo, options.pageSize]
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  const novelList: NovelOptions[] = res[1]
  await _handleNovel(novelList, options.userId, options.showUserInfo)
  return { total: res[0][0]['total'], data: novelList }
}

// 处理小说数据
async function _handleNovel(datas: NovelOptions | NovelOptions[], userId: string, showUserInfo?: any) {
  const _handleList = async (data: NovelOptions) => {
    // 处理自定义标签
    if (data.classify)
      data.classify = await getTagCustomByIds({
        ids: data.classify,
        userId: data.create_user
      })
    else data.classify = []
    // 处理是否为自己发布
    if (data.create_user === userId) data.is_self = '1'
    else data.is_self = '0'
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
    // 处理该小说下所有的章节评论总数
    data.chapter_comment_count = data.chapter_comment_count1 + data.chapter_comment_count2
    delete data.chapter_comment_count1
    delete data.chapter_comment_count2
    // 处理创建者头像
    if (showUserInfo === '1' && data.create_user_avatar) {
      data.create_user_avatar = await getFileById(data.create_user_avatar, data.create_user)
    }
  }
  if (isArray(datas)) {
    for (let i = 0, len = datas.length; i < len; i++) {
      await _handleList(datas[i])
    }
  } else {
    await _handleList(datas)
  }
}
