/**
 * @description 问答获取
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { query, execTrans, getSelectWhereFields, getSelectWhereKeyword } from '@/db'
import { Context } from 'koa'
import { QuestionOptions, QuestionListParams, QuestionListReturn, QuestionOneParams } from './interface'
import { handleQuestion } from './utils'

// 获取指定的某个问答
export const doQuestionGetOne = async (ctx: Context) => {
  const data = await getQuestionOne({
    id: ctx._params.id,
    userId: ctx._user.id,
    showUserInfo: ctx._params.showUserInfo || '1'
  })
  throw new Success({ data })
}

// 获取所有问答列表
export const doQuestionGetList = async (ctx: Context) => {
  const params: QuestionListParams = {
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    keyword: ctx._params.keyword,
    highlight: ctx._params.highlight,
    userId: ctx._user.id,
    classify: ctx._params.classify,
    createUser: ctx._params.userId,
    isDraft: ctx._params.isDraft,
    isSecret: ctx._params.isSecret,
    showUserInfo: ctx._params.showUserInfo || '0'
  }
  const data = await getQuestionList(params)
  throw new Success(data)
}

/**
 * 获取指定的某个问答，返回对象或null
 */
export const getQuestionOne = async (params: QuestionOneParams): Promise<QuestionOptions | null> => {
  // 处理创建者信息字段
  const userInfoField =
    params.showUserInfo === '1' ? ' t2.username AS create_user_name, t2.avatar AS create_user_avatar, ' : ''
  const sql: string = `
    SELECT 
      t1.id, t1.title, t1.content, t1.classify, t1.is_draft, 
      t1.is_secret, t1.is_top, t1.sort, t1.create_user, t1.create_time, 
      t1.update_time, t1.terminal, t1.remarks, t3.id AS is_like, t5.id AS is_collection,  
      ${userInfoField} 
      (SELECT COUNT(t4.id) FROM likes t4 WHERE t4.target_id = t1.id) AS like_count, 
      (SELECT COUNT(t6.id) FROM collections t6 WHERE t6.target_id = t1.id) AS collection_count, 
      (SELECT COUNT(t7.id) FROM comments_first t7 WHERE t7.target_id = t1.id) AS comment_count1, 
      (SELECT COUNT(t8.id) FROM comments_second t8 WHERE t8.comment_first_target_id = t1.id) AS comment_count2 
    FROM questions t1 
    LEFT JOIN users t2 ON t1.create_user = t2.id 
    LEFT JOIN likes t3 ON (t1.id = t3.target_id AND t3.create_user = ?) 
    LEFT JOIN collections t5 ON (t1.id = t5.target_id AND t5.create_user = ?)  
    WHERE 
      t1.id = ? AND 
      (t1.is_secret = 0 OR (t1.is_secret = 1 AND t1.create_user = ?)) AND 
      (t1.is_draft = 0 OR (t1.is_draft = 1 AND t1.create_user = ?))`
  const data = [params.userId, params.userId, params.id, params.userId, params.userId]
  let res: any = await query(sql, data)
  res = res[0] || null
  if (res) await handleQuestion(res, params.userId, params.showUserInfo)
  return res
}

/**
 * 获取问答列表，返回数组或[]
 */
export const getQuestionList = async (options: QuestionListParams): Promise<QuestionListReturn> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  // 处理keyword参数
  const keywordResult = getSelectWhereKeyword({
    valid: ['@t4.(username):createUserName', 't1.title'],
    data: options,
    prefix: 'AND',
    isOrderKeyword: true
  })
  // 处理普通where参数
  const fieldsResult = getSelectWhereFields({
    valid: ['t1.create_user', 't1.is_draft'],
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
  whereSQL += `${keywordResult.sql}${fieldsResult.sql}`
  whereData = [...whereData, ...keywordResult.data, ...fieldsResult.data]
  // 处理排序规则语句
  let orderSql
  if (options.createUser) {
    // 指定用户排序
    orderSql = `${keywordResult.orderSql} t1.sort, t1.update_time DESC`
  } else {
    // 所有排序
    orderSql = `${keywordResult.orderSql} t1.is_top DESC, like_count DESC,   collection_count DESC, t1.update_time DESC`
  }
  // 处理创建者信息字段
  const userInfoField =
    options.showUserInfo === '1' ? ' t4.username AS create_user_name, t4.avatar AS create_user_avatar, ' : ''
  const sql1 = `SELECT COUNT(t1.id) AS total FROM questions t1 LEFT JOIN users t4 ON t1.create_user = t4.id ${whereSQL}`
  const data1 = [...whereData]
  const sql2 = `
    SELECT 
      t1.id, t1.content, t1.classify, t1.is_draft, t1.is_secret, 
      t1.is_top, t1.sort, t1.create_user, t1.create_time, t1.update_time, 
      t1.terminal, t1.remarks, t5.id AS is_like, t7.id AS is_collection, 
      ${userInfoField} ${keywordResult.orderFields} 
      (SELECT COUNT(t6.id) FROM likes t6 WHERE t6.target_id = t1.id) AS like_count, 
      (SELECT COUNT(t8.id) FROM collections t8 WHERE t8.target_id = t1.id) AS collection_count, 
      (SELECT COUNT(t9.id) FROM comments_first t9 WHERE t9.target_id = t1.id) AS comment_count1, 
      (SELECT COUNT(t10.id) FROM comments_second t10 WHERE t10.comment_first_target_id = t1.id) AS comment_count2 
    FROM questions t1 
    LEFT JOIN users t4 ON t1.create_user = t4.id 
    LEFT JOIN likes t5 ON (t1.id = t5.target_id AND t5.create_user = ?) 
    LEFT JOIN collections t7 ON (t1.id = t7.target_id AND t7.create_user = ?) 
    ${whereSQL} 
    ORDER BY ${orderSql}  
    LIMIT ?, ?`
  const data2 = [options.userId, options.userId, ...whereData, pageNo, options.pageSize]
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  const questionList: QuestionOptions[] = res[1]
  await handleQuestion(questionList, options.userId, options.showUserInfo)
  throw new Success({ total: res[0][0]['total'], data: questionList })
}
