/**
 * @description 资源获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query, execTrans } from "../../../db";
import { Context, Next } from 'koa';
import { SourceOptions, SourceListParams, SourceListReturn } from './interface'
import { getFileById, getFileByIds } from '../files-info/get'
import { getTagCustomByIds } from '../tags-custom/get'
import { getSelectWhereAsKeywordData, getSelectWhereData } from '../../../utils/handle-sql';
import _ from 'lodash';

// 获取指定的某个资源
export const doSourceGetOne = async (ctx: Context, next: Next) => {
  const data = await getSourceOne(ctx.params.id, ctx.user.id)
  throw new Success({ data });
}

// 获取自己的问答列表
export const doSourceGetListSelf = async (ctx: Context, next: Next) => {
  const params: SourceListParams = {
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
    keyword: ctx.params.keyword,
    userId: ctx.user.id,
    createUser: ctx.user.id,
  }
  if (ctx.params.hasOwnProperty('isSecret')) params.isSecret = ctx.params.isSecret
  const data = await getSourceList(params)
  throw new Success(data);
}

// 获取问答列表
export const doSourceGetList = async (ctx: Context, next: Next) => {
  const params: SourceListParams = {
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
    keyword: ctx.params.keyword,
    userId: ctx.user.id,
  }
  if (ctx.params.hasOwnProperty('userId')) params.createUser = ctx.params.userId
  if (ctx.params.hasOwnProperty('isSecret')) params.isSecret = ctx.params.isSecret
  const data = await getSourceList(params)
  throw new Success(data);
}

/**
 * 获取指定的某个资源，返回对象或null
*/
export const getSourceOne = async (id: string, userId: string): Promise<SourceOptions | null> => {
  const sql: string = `SELECT t1.id, t1.title, t1.attachment, t1.classify, t1.is_secret, t1.is_top, t1.sort, t1.create_user, t2.username as create_user_name, t1.create_time, t1.update_time, t1.terminal, t1.remarks, t3.id as is_like, (SELECT COUNT(t4.id) FROM likes t4 WHERE t4.target_id = t1.id) as like_count, t5.id as is_collection, (SELECT COUNT(t6.id) FROM collections t6 WHERE t6.target_id = t1.id) as collection_count, (SELECT COUNT(t7.id) FROM comments_first t7 WHERE t7.target_id = t1.id) as comment_count1, (SELECT COUNT(t8.id) FROM comments_second t8 WHERE t8.comment_first_target_id = t1.id) as comment_count2 FROM sources t1 LEFT JOIN users t2 ON t1.create_user = t2.id LEFT JOIN likes t3 ON (t1.id = t3.target_id AND t3.create_user = ?) LEFT JOIN collections t5 ON (t1.id = t5.target_id AND t5.create_user = ?)  WHERE t1.id = ? AND (t1.is_secret = 0 OR (t1.is_secret = 1 AND t1.create_user = ?))`
  const data = [userId, userId, id, userId]
  let res: any = await query(sql, data)
  res = res[0] || null
  if (res)
    await _handleSource(res, userId)
  return res
}

/**
 * 获取自己的问答列表，返回数组或[]
*/
export const getSourceList = async (options: SourceListParams): Promise<SourceListReturn> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  // 处理keyword参数
  const sqlParamsKeyword = getSelectWhereAsKeywordData({
    valid: ['t1.title', 't4.username'],
    data: options
  }, 'OR', 'AND')
  // 处理普通where参数
  const sqlParams = getSelectWhereData({
    valid: ['t1.create_user'],
    data: options
  }, 'AND', 'AND')
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
  const sql1 = `SELECT COUNT(t1.id) as total FROM sources t1 LEFT JOIN users t4 ON t1.create_user = t4.id ${whereSQL}`
  const data1 = [...whereData]
  const sql2 = `SELECT t1.id, t1.title, t1.classify, t1.is_secret, t1.is_top, t1.sort, t1.create_user, t4.username as create_user_name, t1.create_time, t1.update_time, t1.terminal, t1.remarks, t5.id as is_like, (SELECT COUNT(t6.id) FROM likes t6 WHERE t6.target_id = t1.id) as like_count, t7.id as is_collection, (SELECT COUNT(t8.id) FROM collections t8 WHERE t8.target_id = t1.id) as collection_count, (SELECT COUNT(t9.id) FROM comments_first t9 WHERE t9.target_id = t1.id) as comment_count1, (SELECT COUNT(t10.id) FROM comments_second t10 WHERE t10.comment_first_target_id = t1.id) as comment_count2 FROM sources t1 LEFT JOIN users t4 ON t1.create_user = t4.id LEFT JOIN likes t5 ON (t1.id = t5.target_id AND t5.create_user = ?) LEFT JOIN collections t7 ON (t1.id = t7.target_id AND t7.create_user = ?) ${whereSQL} ORDER BY t1.is_top DESC, t1.sort, like_count DESC, collection_count DESC, t1.update_time DESC LIMIT ?, ?`
  const data2 = [options.userId, options.userId, ...whereData, pageNo, options.pageSize]
  const res: any = await execTrans([{ sql: sql1, data: data1 }, { sql: sql2, data: data2 }])
  const sourceList: SourceOptions[] = res[1]
  await _handleSource(sourceList, options.userId)
  throw new Success({ total: res[0][0]['total'], data: sourceList });
}

// 处理资源数据
async function _handleSource(datas: SourceOptions | SourceOptions[], userId: string) {
  const _handleList = async (data: SourceOptions) => {
    // 处理附件
    if (data.attachment)
      data.attachment = await getFileByIds(data.attachment, data.create_user)
    // 处理自定义标签
    if (data.classify)
      data.classify = await getTagCustomByIds(data.classify, data.create_user)
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



