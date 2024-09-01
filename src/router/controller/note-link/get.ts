/**
 * @description 获取可共享关联的笔记列表
 * @author cpl
 * @create 2023-02-07 14:57:04
 */

import { execTrans, getSelectWhereKeyword } from '@/db'
import { Success } from '@/utils/http-exception'
import { Context } from 'koa'
import { NoteLinkOptions, NoteLinkParams, NoteLinkReturnOption } from './interface'
import { handleNote } from '../note/utils'

// 获取的相同根节点的其他目标节点的可关联笔记列表
export const doNoteLinkGetListByRootId = async (ctx: Context) => {
  const params: NoteLinkParams = {
    rootId: ctx._params.rootId,
    targetId: ctx._params.targetId,
    userId: ctx._user.id,
    keyword: ctx._params.keyword,
    highlight: ctx._params.highlight || '0',
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    isSecret: ctx._params.isSecret,
    classify: ctx._params.classify,
    showUserInfo: ctx._params.showUserInfo || '0'
  }
  const data = <NoteLinkReturnOption>await getNoteLinkGetListByRootId(params)
  throw new Success(data)
}

// 获取的相同根节点的其他目标节点的可关联笔记列表
const getNoteLinkGetListByRootId = async (options: NoteLinkParams): Promise<NoteLinkReturnOption> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  // 处理keyword参数
  const keywordResult = getSelectWhereKeyword({
    valid: ['t1.title', 't1.content'],
    data: options,
    prefix: 'AND',
    isOrderKeyword: true
  })
  let whereSQL = 'WHERE t1.root_id = ? AND t1.target_id != ? AND t1.link_status = 1'
  const whereData = [options.rootId, options.targetId]
  if (options.isSecret === '1') {
    whereSQL += ' AND (t1.is_secret = 1 AND t1.create_user ?) '
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
      t1.create_time, t1.update_time, t1.terminal, t1.remarks,
      (SELECT COUNT(t3.id) FROM notes_link t3 WHERE t1.id = t3.note_id AND t3.target_id = ?) AS is_target_relevance
    FROM notes t1
    LEFT JOIN users t2 ON t1.create_user = t2.id 
    ${whereSQL} 
    ORDER BY ${orderSql} 
    LIMIT ?, ?`
  const data2 = [options.targetId, ...whereData, pageNo, options.pageSize]
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  const noteList: NoteLinkOptions[] = res[1]
  await handleNote(noteList, {
    userId: options.userId,
    showTargetRelevance: '1',
    showUserInfo: options.showUserInfo
  })
  return {
    total: res[0][0]['total'],
    data: res[1]
  }
}
