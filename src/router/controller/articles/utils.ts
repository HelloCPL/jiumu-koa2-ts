import { isArray } from 'lodash'
import { getFileByData, getOriginFileById, getOriginFileByIds } from '../files-info/utils'
import { ArticleOptions } from './interface'
import { getOriginTagCustomByIds, getTagCustomByData } from '../tags-custom/utils'

/**
 * 处理博客文章数据
 */
export async function handleArticleOptions(
  datas: ArticleOptions | ArticleOptions[],
  userId: string,
  showUserInfo?: any
) {
  const files = await getFileByData(datas, ['cover_img', 'attachment', 'create_user_avatar'])
  const tagCustoms = await getTagCustomByData(datas, ['classify'], userId)
  const _handleList = async (data: ArticleOptions) => {
    // 处理封面图
    if (data.cover_img) data.cover_img = getOriginFileById(files, data.cover_img)
    // 处理附件
    if (data.attachment) data.attachment = getOriginFileByIds(files, data.attachment)
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
  if (isArray(datas)) {
    for (let i = 0, len = datas.length; i < len; i++) {
      await _handleList(datas[i])
    }
  } else {
    await _handleList(datas)
  }
}
