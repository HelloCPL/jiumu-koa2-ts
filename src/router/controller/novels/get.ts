/**
 * @description 小说获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query, execTrans } from "../../../db";
import { Context, Next } from 'koa';
import { NovelOptions, NovelListParams, NovelListReturn } from './interface'
import { getTagCustomByIds } from '../tags-custom/get'
import { getSelectWhereAsKeywordData, getSelectWhereData } from '../../../utils/handle-sql';
import _ from 'lodash';


// 获取指定的某个小说
export const doNovelGetOne = async (ctx: Context, next: Next) => {
  const data = await getNovelOne(ctx.params.id, ctx.user.id)
  throw new Success({ data });
}

// 获取自己的小说列表
export const doNovelGetListSelf = async (ctx: Context, next: Next) => {
  const params: NovelListParams = {
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
    keyword: ctx.params.keyword,
    userId: ctx.user.id,
    createUser: ctx.user.id,
  }
  if (ctx.params.hasOwnProperty('type')) params.type = ctx.params.type
  if (ctx.params.hasOwnProperty('isDraft')) params.isDraft = ctx.params.isDraft
  if (ctx.params.hasOwnProperty('isSecret')) params.isSecret = ctx.params.isSecret
  const data = await getNovelList(params)
}

/**
 * 获取指定的某个小说，返回对象或null
*/
export const getNovelOne = async (id: string, userId: string): Promise<NovelOptions | null> => {
  const sql: string = `SELECT t1.id, t1.name, t1.introduce, t1.classify, t1.type, t2.label AS type_label, t1.author, t1.is_secret, t1.is_draft, t1.create_user, t3.username AS create_user_name, t1.create_time, t1.update_time, t1.terminal, t1.remarks, t4.id AS is_like, (SELECT COUNT(t5.id) FROM likes t5 WHERE t5.target_id = t1.id) AS like_count, t6.id AS is_collection, (SELECT COUNT(t7.id) FROM collections t7 WHERE t7.target_id = t1.id) AS collection_count, (SELECT COUNT(t8.id) FROM comments_first t8 WHERE t8.target_id = t1.id) AS comment_count1, (SELECT COUNT(t9.id) FROM comments_second t9 WHERE t9.comment_first_target_id = t1.id) AS comment_count2 FROM novels t1 LEFT JOIN tags t2 ON t1.type = t2.code LEFT JOIN users t3 ON t1.create_user = t3.id LEFT JOIN likes t4 ON (t1.id = t4.target_id AND t4.create_user = ?) LEFT JOIN collections t6 ON t1.id = t6.target_id WHERE t1.id = ? AND (t1.is_secret = 0 OR (t1.is_secret = 1 AND t1.create_user = ?))`
  const data = [userId, id, userId]
  let res: any = await query(sql, data)
  res = res[0] || null
  if (res)
    await _handleNovel(res, userId)
  return res
}

/**
 * 获取小说列表，返回数组或[]
*/
export const getNovelList = async (options: NovelListParams): Promise<NovelListReturn> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  // 处理keyword参数
  const sqlParamsKeyword = getSelectWhereAsKeywordData({
    valid: ['t1.name', 't1.introduce', 't3.username'],
    data: options,
    prefix: 'AND'
  })
  // 处理普通where参数
  const sqlParams = getSelectWhereData({
    valid: ['t1.create_user', 't1.type', 't1.is_draft'],
    data: options,
    prefix: 'AND'
  })
  let whereSQL = ''
  let whereData: any[] = []
  if (options.hasOwnProperty('isSecret')) {
    if (options.isSecret == '1') {
      whereSQL = `WHERE (t1.is_secret = 1 AND t1.create_user = ?)`
      whereData.push(options.userId)
    } else {
      whereSQL = `WHERE t1.is_secret = 0`
    }
  } else {
    whereSQL = `WHERE (t1.is_secret = 0 OR (t1.is_secret = 1 AND t1.create_user = ?))`
    whereData.push(options.userId)
  }
  whereSQL += `${sqlParamsKeyword.sql}${sqlParams.sql}`
  whereData = [...whereData, ...sqlParamsKeyword.data, ...sqlParams.data]
  const sql1 = `SELECT COUNT(t1.id) AS total FROM novels t1 LEFT JOIN users t3 ON t1.create_user = t3.id ${whereSQL}`
  const data1 = [...whereData]
  const sql2 = `SELECT t1.id, t1.name, t1.introduce, t1.classify, t1.type, t2.label AS type_label, t1.author, t1.is_secret, t1.is_draft, t1.create_user, t3.username AS create_user_name, t1.create_time, t1.update_time, t1.terminal, t1.remarks, t4.id AS is_like, (SELECT COUNT(t5.id) FROM likes t5 WHERE t5.target_id = t1.id) AS like_count, t6.id AS is_collection, (SELECT COUNT(t7.id) FROM collections t7 WHERE t7.target_id = t1.id) AS collection_count, (SELECT COUNT(t8.id) FROM comments_first t8 WHERE t8.target_id = t1.id) AS comment_count1, (SELECT COUNT(t9.id) FROM comments_second t9 WHERE t9.comment_first_target_id = t1.id) AS comment_count2 FROM novels t1 LEFT JOIN tags t2 ON t1.type = t2.code LEFT JOIN users t3 ON t1.create_user = t3.id LEFT JOIN likes t4 ON (t1.id = t4.target_id AND t4.create_user = ?) LEFT JOIN collections t6 ON t1.id = t6.target_id ${whereSQL} ORDER BY like_count DESC, collection_count DESC, t1.update_time DESC LIMIT ?, ?`
  const data2 = [options.userId,  ...whereData, pageNo, options.pageSize]
  const res: any = await execTrans([{ sql: sql1, data: data1 }, { sql: sql2, data: data2 }])
  const novelList: NovelOptions[] = res[1]
  await _handleNovel(novelList, options.userId)
  throw new Success({ total: res[0][0]['total'], data: novelList });
}

// 处理小说数据
async function _handleNovel(datas: NovelOptions | NovelOptions[], userId: string) {
  const _handleList = async (data: NovelOptions) => {
    // 处理自定义标签
    if (data.classify)
      data.classify = await getTagCustomByIds(data.classify, data.create_user)
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
  }
  if (_.isArray(datas)) {
    for (let i = 0, len = datas.length; i < len; i++) {
      await _handleList(datas[i])
    }
  } else {
    await _handleList(datas)
  }
}