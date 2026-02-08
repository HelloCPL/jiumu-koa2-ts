import { isArray } from 'lodash'
import { SourceLinkOptions } from './interface'
import { FileInfoOptions } from '../files-info/interface'
import { getFileByData, getOriginFileById } from '../files-info/utils'
import { sureIsArray } from '@/utils/tools'
import { getSourceLinkByIds } from './get'

/**
 * 处理资源链接数据
 * @param datas 原始数据
 * @param showUserInfo? 是否展示用户信息
 */
export async function handleSourceLink(
  datas: SourceLinkOptions | SourceLinkOptions[],
  showUserInfo?: BaseStatus
) {
  let files: FileInfoOptions[] = []
  if (showUserInfo === '1') {
    files = await getFileByData(datas, ['create_user_avatar'])
  }
  const coverImg1 = await getFileByData(datas, ['cover_img1'])

  const _handleList = async (data: SourceLinkOptions) => {
    data.cover_img1 = getOriginFileById(coverImg1, data.cover_img1)
    if (showUserInfo === '1' && data.create_user_avatar) {
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
 * 根据所给数据获取指定的所有资源链接
 * @param data 指定数据，对象或数组
 * @param keys 指定数据的 key 集合
 */
export async function getSourceLinkByData(
  data: ObjectAny | ObjectAny[],
  keys: string[] = ['id']
): Promise<SourceLinkOptions[]> {
  const arr = sureIsArray(data)
  const ids: string[] = []
  arr.forEach((row) => {
    keys.forEach((key) => {
      const val = row[key]
      if (val && ids.indexOf(val) === -1) ids.push(val)
    })
  })
  const files = await getSourceLinkByIds({
    ids: ids.join(','),
    ignoreUserId: '1'
  })
  return files
}

/**
 * 根据原始资源链接集合，返回指定的资源链接集合或 []
 * @param originFiles 原始资源链接集合
 * @param ids 资源链接 id 集合
 */
export function getOriginSourceLinkByIds(
  originSourceLinks: SourceLinkOptions[],
  ids: string
): SourceLinkOptions[] {
  if (!ids) return []
  return originSourceLinks.filter((row) => ids.indexOf(row.id) !== -1)
}
