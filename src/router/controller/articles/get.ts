/**
 * @description 博客文章获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query, execTrans } from "../../../db";
import { Context, Next } from 'koa';
import { ArticleOptions, ArticleListParams, ArticleListReturn } from './interface'
import { getFileById, getFileByIds } from '../files-info/get'
import { getTagCustomByIds } from '../tags-custom/get'
import { getSelectWhereAsKeywordData, getSelectWhereData } from '../../../utils/handle-sql';
import _ from 'lodash';


// 获取指定的某个博客文章
export const doArticleGetOne = async (ctx: Context, next: Next) => {
  const data = await getArticleOne(ctx.params.id, ctx.user.id)
  throw new Success({ data });
}

// 获取自己的博客文章列表
export const doArticleGetListSelf = async (ctx: Context, next: Next) => {
  const params: ArticleListParams = {
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
    keyword: ctx.params.keyword,
    userId: ctx.user.id,
    createUser: ctx.user.id,
  }
  if (ctx.params.hasOwnProperty('type')) params.type = ctx.params.type
  if (ctx.params.hasOwnProperty('isDraft')) params.isDraft = ctx.params.isDraft
  if (ctx.params.hasOwnProperty('isSecret')) params.isSecret = ctx.params.isSecret
  const data = await getArticleList(params)
  throw new Success(data);
}

// 获取所有博客文章列表
export const doArticleGetList = async (ctx: Context, next: Next) => {
  const params: ArticleListParams = {
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
    keyword: ctx.params.keyword,
    userId: ctx.user.id,
  }
  if (ctx.params.hasOwnProperty('type')) params.type = ctx.params.type
  if (ctx.params.hasOwnProperty('isDraft')) params.isDraft = ctx.params.isDraft
  if (ctx.params.hasOwnProperty('isSecret')) params.isSecret = ctx.params.isSecret
  const data = await getArticleList(params)
  throw new Success(data);
}

/**
 * 获取指定的某个博客文章，返回对象或null
*/
export const getArticleOne = async (id: string, userId: string): Promise<ArticleOptions | null> => {
  const sql: string = `SELECT t1.id, t1.title, t1.content, t1.content_type, t2.label as content_type_label, t1.cover_img, t1.attachment, t1.type, t3.label as type_label, t1.classify, t1.is_draft, t1.is_secret, t1.is_top, t1.sort, t1.create_user, t4.username as create_user_name, t1.create_time, t1.update_time, t1.terminal, t1.remarks, t5.id as is_like, (SELECT COUNT(t6.id) FROM likes t6 WHERE t6.target_id = t1.id) as like_count, t7.id as is_collection, (SELECT COUNT(id) FROM collections t8 WHERE t8.target_id = t1.id) as collection_count, (SELECT COUNT(t9.id) FROM comments_first t9 WHERE t9.target_id = t1.id) as comment_count1, (SELECT COUNT(t10.id) FROM comments_second t10 WHERE t10.comment_first_target_id = t1.id) as comment_count2 FROM articles t1 LEFT JOIN tags t2 ON t1.content_type = t2.code LEFT JOIN tags t3 ON t1.type = t3.code LEFT JOIN users t4 ON t1.create_user = t4.id LEFT JOIN likes t5 ON (t1.id = t5.target_id AND t5.create_user = ?) LEFT JOIN collections t7 ON (t1.id = t7.target_id AND t7.create_user = ?)  WHERE t1.id = ?`
  const data = [userId, userId, id]
  let res: any = await query(sql, data)
  res = res[0] || null
  if (res)
    await _handleArticle(res, userId)
  return res
}

/**
 * 获取自己的博客文章列表，返回数组或[]
*/
export const getArticleList = async (options: ArticleListParams): Promise<ArticleListReturn> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  // 处理keyword参数
  const sqlParamsKeyword = getSelectWhereAsKeywordData({
    valid: ['t1.title', 't1.content', 't4.username'],
    data: options
  }, 'OR')
  // 处理普通where参数
  const sqlParams = getSelectWhereData({
    valid: ['t1.create_user', 't1.type', 't1.is_draft', 't1.is_secret'],
    data: options
  }, 'AND')
  let whereSQL = ''
  if (sqlParamsKeyword.sql)
    whereSQL = `${sqlParamsKeyword.sql}`
  if (sqlParams.sql) whereSQL += ` ${whereSQL ? 'AND' : ''} ${sqlParams.sql}`
  const whereData = [...sqlParamsKeyword.data, ...sqlParams.data]
  if (whereData.length) whereSQL = ` WHERE ${whereSQL}`
  const sql1 = `SELECT COUNT(t1.id) as total FROM articles t1 LEFT JOIN users t4 ON t1.create_user = t4.id ${whereSQL}`
  const data1 = [...whereData]
  const sql2 = `SELECT t1.id, t1.title, t1.content, t1.content_type, t2.label as content_type_label, t1.cover_img, t1.attachment, t1.type, t3.label as type_label, t1.classify, t1.is_draft, t1.is_secret, t1.is_top, t1.sort, t1.create_user, t4.username as create_user_name, t1.create_time, t1.update_time, t1.terminal, t1.remarks, t5.id as is_like, (SELECT COUNT(t6.id) FROM likes t6 WHERE t6.target_id = t1.id) as like_count, t7.id as is_collection, (SELECT COUNT(id) FROM collections t8 WHERE t8.target_id = t1.id) as collection_count, (SELECT COUNT(t9.id) FROM comments_first t9 WHERE t9.target_id = t1.id) as comment_count1, (SELECT COUNT(t10.id) FROM comments_second t10 WHERE t10.comment_first_target_id = t1.id) as comment_count2 FROM articles t1 LEFT JOIN tags t2 ON t1.content_type = t2.code LEFT JOIN tags t3 ON t1.type = t3.code LEFT JOIN users t4 ON t1.create_user = t4.id LEFT JOIN likes t5 ON (t1.id = t5.target_id AND t5.create_user = ?) LEFT JOIN collections t7 ON (t1.id = t7.target_id AND t7.create_user = ?) ${whereSQL} ORDER BY t1.is_top DESC, t1.sort, like_count DESC, collection_count DESC, t1.update_time DESC LIMIT ?, ?`
  const data2 = [options.userId, options.userId, ...whereData, pageNo, options.pageSize]
  const res: any = await execTrans([{ sql: sql1, data: data1 }, { sql: sql2, data: data2 }])
  const articleList: ArticleOptions[] = res[1]
  await _handleArticle(articleList, options.userId)
  throw new Success({ total: res[0][0]['total'], data: articleList });
}

// 处理博客文章数据
async function _handleArticle(datas: ArticleOptions | ArticleOptions[], userId: string) {
  const _handleList = async (data: ArticleOptions) => {
    // 处理封面图
    if (data.cover_img)
      data.cover_img = await getFileById(data.cover_img, data.create_user)
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

