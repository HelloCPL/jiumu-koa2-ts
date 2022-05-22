/**
 * @description 收藏获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { execTrans } from "../../../db";
import { Context, Next } from 'koa';
import { CollectionOptions, CollectionParams, CollectionReturn } from './interface'
import { validateRange } from '../../../utils/validator';

// 根据 userId 获取收藏列表
export const doCollectionGetListSelf = async (ctx: Context, next: Next) => {
  const params = {
    userId: ctx._user.id,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    type: ctx._params.type
  }
  const data = await getCollectionList(params)
  throw new Success(data);
}

// 根据 userId 获取收藏列表
export const doCollectionGetList = async (ctx: Context, next: Next) => {
  const params = {
    userId: ctx._params.userId,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    type: ctx._params.type
  }
  const data = await getCollectionList(params)
  throw new Success(data);
}


/**
 * 获取收藏列表
*/
export const getCollectionList = async (params: CollectionParams): Promise<CollectionReturn> => {
  const type = await validateRange({
    value: params.type,
    range: ['502', '503', '504', '505', '507'],
    default: '502,503,504,505,507'
  }, true)
  const typeParams = _getCollectionType(type)
  const pageNo = (params.pageNo - 1) * params.pageSize
  const sql1 = `SELECT COUNT(t1.id) AS total FROM collections t1 WHERE FIND_IN_SET(t1.create_user, ?) ${typeParams.typeWhere}`
  const data1 = [params.userId]
  const sql2 = `SELECT t1.id, t1.target_id, t1.create_user, t3.username AS create_user_name, t1.type, t2.label AS type_label, ${typeParams.typeSql} t1.create_time, t1.terminal FROM collections t1 LEFT JOIN tags t2 ON t1.type = t2.code LEFT JOIN users t3 ON t1.create_user = t3.id WHERE FIND_IN_SET(t1.create_user, ?) ${typeParams.typeWhere} ORDER BY t1.create_time DESC LIMIT ?, ?`
  const data2 = [...data1, pageNo, params.pageSize]
  const res: any = await execTrans([{ sql: sql1, data: data1 }, { sql: sql2, data: data2 }])
  let collectionData = <CollectionOptions[]>res[1]
  _handleCollectionData(collectionData)
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
    '507': 'novels_chapter',
  }
  let typeSql = ``
  let typeWhere = `AND FIND_IN_SET(t1.type, '${type}')`
  types.forEach((val, index) => {
    const t = typesTable[val]
    const ta = `tt${index + 1}`
    let key = 'title'
    if (val === '504') key = 'name'
    typeSql += ` (SELECT ${ta}.${key} FROM ${t} ${ta} WHERE ${ta}.id = t1.target_id AND t1.type = '${val}'  AND ${ta}.id) AS title_${t}, `
  })
  return {
    typeSql,
    typeWhere
  }
}

function _handleCollectionData(data: CollectionOptions[]): CollectionOptions[] {
  data.forEach(item => {
    switch (item.type) {
      case '502':
        item.title = item.title_questions
        break;
      case '503':
        item.title = item.title_sources
        break;
      case '504':
        item.title = item.title_novels
        break;
      case '505':
        item.title = item.title_articles
        break;
      case '507':
        item.title = item.title_novels_chapter
        break;
    }
    delete item.title_questions
    delete item.title_sources
    delete item.title_novels
    delete item.title_articles
    delete item.title_novels_chapter
  })
  return data
} 