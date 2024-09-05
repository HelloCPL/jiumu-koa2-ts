import { countWordCharactersAndWords } from '@/utils/tools'
import { handleNovalChapterParams, NovelChapterOptions } from './interface'
import { isArray } from 'lodash'
import { FileInfoOptions } from '../files-info/interface'
import { getFileByData, getOriginFileById } from '../files-info/utils'

/**
 * 处理小说数据
 */
export async function handleNovelChapter(
  datas: NovelChapterOptions | NovelChapterOptions[],
  params: handleNovalChapterParams
) {
  let files: FileInfoOptions[] = []
  if (params.showUserInfo === '1') {
    files = await getFileByData(datas, ['create_user_avatar'])
  }
  const _handleList = async (data: NovelChapterOptions) => {
    // 处理是否为自己发布
    if (data.create_user === params.userId) data.is_self = '1'
    else data.is_self = '0'
    // 处理是否公开状态
    if (data.secret1 === '0' && data.secret2 === '0') data.is_secret = '0'
    else data.is_secret = '1'
    delete data.secret1
    delete data.secret2
    if (params.isConcise !== '1') {
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
      if (params.showUserInfo === '1' && data.create_user_avatar) {
        data.create_user_avatar = getOriginFileById(files, data.create_user_avatar)
      }
      // 处理字数
      data.word_count = countWordCharactersAndWords(data.content).wordCount
    }
    if (!params.showContent) delete data.content
  }
  if (isArray(datas)) {
    for (let i = 0, len = datas.length; i < len; i++) {
      await _handleList(datas[i])
    }
  } else {
    await _handleList(datas)
  }
}
