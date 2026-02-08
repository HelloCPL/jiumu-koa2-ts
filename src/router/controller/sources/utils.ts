import { SourceOptions } from './interface'
import { FileInfoOptions } from '../files-info/interface'
import { getFileByData, getOriginFileById, getOriginFileByIds } from '../files-info/utils'
import { getOriginTagCustomByIds, getTagCustomByData } from '../tags-custom/utils'
import { sureIsArray } from '@/utils/tools'
import { getOriginSourceLinkByIds, getSourceLinkByData } from '../sources-link/utils'

/**
 * 处理资源数据
 * @param datas 原始数据
 * @param userId 用户 id
 * @param showUserInfo? 是否展示用户信息
 */
export async function handleSource(
  arr: SourceOptions | SourceOptions[],
  userId: string,
  showUserInfo?: BaseStatus
) {
  const datas = sureIsArray(arr)
  let files: FileInfoOptions[] = []
  if (showUserInfo === '1') {
    files = await await getFileByData(datas, ['create_user_avatar'])
  }
  const attachment701 = await await getFileByData(
    datas.filter((item) => item.type === '701'),
    ['attachment']
  )
  const sourceLinks = await getSourceLinkByData(
    datas.filter((item) => item.type !== '701'),
    ['attachment']
  )
  const tagCustoms = await getTagCustomByData(datas, ['classify'], userId)
  const _handleList = async (data: SourceOptions) => {
    // 处理附件
    if (data.attachment) {
      if (data.type === '701') {
        data.attachment = getOriginFileByIds(attachment701, data.attachment)
      } else {
        data.attachment = getOriginSourceLinkByIds(sourceLinks, data.attachment)
      }
    }

    // 处理自定义标签
    data.classify = getOriginTagCustomByIds(tagCustoms, data.classify)
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
    // 处理创建者头像
    if (showUserInfo === '1' && data.create_user_avatar) {
      data.create_user_avatar = getOriginFileById(files, data.create_user_avatar)
    }
  }
  for (let i = 0, len = datas.length; i < len; i++) {
    await _handleList(datas[i])
  }
}
