/**
 * @description 收藏获取
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { execTrans, query } from '@/db'
import { Context } from 'koa'
import { CollectionOneParams, CollectionOptions, CollectionParams, CollectionReturn } from './interface'
import { validateRange } from '@/utils/validator'
import { getFileById } from '../files-info/get'

// 获取指定的一个收藏
export const doCollectionGetOne = async (ctx: Context) => {
  const params = {
    id: ctx._params.id,
    showUserInfo: ctx._params.showUserInfo || '1'
  }
  const data = await getCollectionOne(params)
  throw new Success({ data })
}

// 获取本用户的收藏列表
export const doCollectionGetListSelf = async (ctx: Context) => {
  const params = {
    userId: ctx._user.id,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    type: ctx._params.type,
    showUserInfo: ctx._params.showUserInfo || '0'
  }
  const data = await getCollectionList(params)
  throw new Success(data)
}

// 根据 userId 获取收藏列表
export const doCollectionGetList = async (ctx: Context) => {
  const params = {
    userId: ctx._params.userId,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    type: ctx._params.type,
    showUserInfo: ctx._params.showUserInfo || '0'
  }
  const data = await getCollectionList(params)
  throw new Success(data)
}

/*
 * 获取某个收藏
 */

export const getCollectionOne = async (params: CollectionOneParams): Promise<CollectionOptions | null> => {
  // 先获取类型
  const sql1 = 'SELECT t1.type FROM collections t1 WHERE t1.id = ?'
  const data = [params.id]
  const res1: any = await query(sql1, data)
  if (res1 && res1.length) {
    const type = res1[0].type
    const typeParams = _getCollectionType(type)
    // 处理创建者信息字段
    const userInfoField =
      params.showUserInfo === '1' ? ' t3.username AS create_user_name, t3.avatar AS create_user_avatar, ' : ''
    const sql2 = `SELECT t1.id, t1.target_id, t1.create_user, ${userInfoField} t1.type, t2.label AS type_label, ${typeParams.typeSql} t1.create_time, t1.terminal FROM collections t1 LEFT JOIN tags t2 ON t1.type = t2.code LEFT JOIN users t3 on t1.create_user = t3.id WHERE t1.id = ?`
    const res2: any = await query(sql2, data)
    if (res2 && res2.length) {
      await _handleCollectionData(res2, params.showUserInfo)
      return res2[0]
    }
  }
  return null
}

/**
 * 获取收藏列表
 */
export const getCollectionList = async (params: CollectionParams): Promise<CollectionReturn> => {
  // 处理收藏类型
  const type = await validateRange(
    {
      value: params.type,
      range: ['502', '503', '504', '505', '507'],
      default: '502,503,504,505,507'
    },
    true
  )
  const typeParams = _getCollectionType(type)
  const pageNo = (params.pageNo - 1) * params.pageSize
  // 处理创建者信息字段
  const userInfoField =
    params.showUserInfo === '1' ? ' t3.username AS create_user_name, t3.avatar AS create_user_avatar, ' : ''
  const sql1 = `SELECT COUNT(t1.id) AS total FROM collections t1 WHERE FIND_IN_SET(t1.create_user, ?) ${typeParams.typeWhere}`
  const data1 = [params.userId]
  const sql2 = `SELECT t1.id, t1.target_id, t1.create_user, ${userInfoField} t1.type, t2.label AS type_label, ${typeParams.typeSql} t1.create_time, t1.terminal FROM collections t1 LEFT JOIN tags t2 ON t1.type = t2.code LEFT JOIN users t3 ON t1.create_user = t3.id WHERE FIND_IN_SET(t1.create_user, ?) ${typeParams.typeWhere} ORDER BY t1.create_time DESC LIMIT ?, ?`
  const data2 = [...data1, pageNo, params.pageSize]
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  const collectionData = <CollectionOptions[]>res[1]
  await _handleCollectionData(collectionData, params.showUserInfo)
  return {
    total: res[0][0]['total'],
    data: collectionData
  }
}

// 获取收藏类型
function _getCollectionType(type: string) {
  const types: string[] = type.split(',')
  const typesTable: ObjectAny = {
    '502': 'questions',
    '503': 'sources',
    '504': 'novels',
    '505': 'articles',
    '507': 'novels_chapter'
  }
  let typeSql = ''
  const typeWhere = `AND FIND_IN_SET(t1.type, '${type}')`
  types.forEach((val, index) => {
    const t = typesTable[val]
    const ta = `tt${index + 1}`
    let key = 'title'
    if (val === '504') key = 'name'
    typeSql += ` (SELECT ${ta}.${key} FROM ${t} ${ta} WHERE ${ta}.id = t1.target_id AND t1.type = '${val}') AS title_${t}, `
  })
  return {
    typeSql,
    typeWhere
  }
}

async function _handleCollectionData(
  data: CollectionOptions[],
  showUserInfo?: any
): Promise<CollectionOptions[]> {
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i]
    switch (item.type) {
    case '502':
      item.title = item.title_questions
      break
    case '503':
      item.title = item.title_sources
      break
    case '504':
      item.title = item.title_novels
      break
    case '505':
      item.title = item.title_articles
      break
    case '507':
      item.title = item.title_novels_chapter
      break
    }
    delete item.title_questions
    delete item.title_sources
    delete item.title_novels
    delete item.title_articles
    delete item.title_novels_chapter
    if (showUserInfo === '1' && item.create_user_avatar) {
      item.create_user_avatar = await getFileById(item.create_user_avatar, item.create_user)
    }
  }
  return data
}
