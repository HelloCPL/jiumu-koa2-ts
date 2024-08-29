import { isArray } from 'lodash'
import { TagCustomHandleParams, TagCustomOptions } from './interface'
import { getFileByData, getOriginFileById } from '../files-info/utils'
import { sureIsArray } from '@/utils/tools'
import { getTagCustomByIds } from './get'
import { FileInfoOptions } from '../files-info/interface'

/**
 * 处理自定义标签数据
 */
export async function handleTagCustom(datas: TagCustomOptions[], params: TagCustomHandleParams) {
  let files: FileInfoOptions[] = []
  if (params.showUserInfo === '1') {
    files = await getFileByData(datas, ['create_user_avatar'])
  }
  const _handleList = async (data: TagCustomOptions) => {
    // 处理是否为自己发布
    if (params.userId) {
      if (data.create_user === params.userId) data.is_self = '1'
      else data.is_self = '0'
    }
    // 处理创建者头像
    if (params.showUserInfo === '1' && data.create_user_avatar) {
      data.create_user_avatar = getOriginFileById(files, data.create_user_avatar)
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

/**
 * 根据所给数据获取指定的所有自定义标签数据
 * @param data 指定数据，对象或数组
 * @param keys 指定数据的 key 集合
 */
export async function getTagCustomByData(
  data: ObjectAny | ObjectAny[],
  keys: string[] = ['classify'],
  userId?: string
): Promise<TagCustomOptions[]> {
  const arr = sureIsArray(data)
  const ids: string[] = []
  arr.forEach((row) => {
    keys.forEach((key) => {
      const val = row[key]
      if (val && ids.indexOf(val) === -1) ids.push(val)
    })
  })
  const tagCustoms = await getTagCustomByIds({
    ids: ids.join(','),
    ignoreUserId: '1',
    userId
  })
  return tagCustoms
}

/**
 * 根据原始自定义标签数据集合，返回指定的文件集合或 []
 * @param originFiles 原始自定义标签数据集合
 * @param ids 自定义标签数据 id 集合
 */
export function getOriginTagCustomByIds(originFiles: TagCustomOptions[], ids: string): TagCustomOptions[] {
  if (!ids) return []
  return originFiles.filter((row) => ids.indexOf(row.id) !== -1)
}
