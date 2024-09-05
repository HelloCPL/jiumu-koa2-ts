import { isArray } from 'lodash'
import { getFileById } from '../files-info/get'
import { getTagCustomByIds } from '../tags-custom/get'
import { NovelOptions } from './interface'
import { FileInfoOptions } from '../files-info/interface'
import { getFileByData, getOriginFileById } from '../files-info/utils'
import { getOriginTagCustomByIds, getTagCustomByData } from '../tags-custom/utils'

/**
 * 处理小说数据
 * @param datas 原始数据
 * @param userId 用户 id
 * @param showUserInfo 是否展示用户信息
 */
export async function handleNovel(
  datas: NovelOptions | NovelOptions[],
  userId: string,
  showUserInfo?: BaseStatus
) {
  let files: FileInfoOptions[] = []
  if (showUserInfo === '1') {
    files = await getFileByData(datas, ['create_user_avatar'])
  }
  const tagCustoms = await getTagCustomByData(datas, ['classify'], userId)
  const _handleList = async (data: NovelOptions) => {
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
    // 处理该小说下所有的章节评论总数
    data.chapter_comment_count = data.chapter_comment_count1 + data.chapter_comment_count2
    delete data.chapter_comment_count1
    delete data.chapter_comment_count2
    // 处理创建者头像
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
