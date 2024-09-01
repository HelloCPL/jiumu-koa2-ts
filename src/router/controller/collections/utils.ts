import { FileInfoOptions } from '../files-info/interface'
import { getFileByData, getOriginFileById } from '../files-info/utils'
import { CollectionOptions } from './interface'

/**
 * 获取收藏类型
 * @param type 资源类型
 */
export function getCollectionType(type: string) {
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

/**
 * 处理收藏数据
 * @param data 原始数据
 * @param showUserInfo 是否展示用户信息
 */
export async function handleCollectionData(
  data: CollectionOptions[],
  showUserInfo?: any
): Promise<CollectionOptions[]> {
  let files: FileInfoOptions[] = []
  if (showUserInfo === '1') {
    files = await getFileByData(data, ['create_user_avatar'])
  }
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
      item.create_user_avatar = getOriginFileById(files, item.create_user_avatar)
    }
  }
  return data
}
