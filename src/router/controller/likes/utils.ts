import { FileInfoOptions } from '../files-info/interface'
import { getFileByData, getOriginFileById } from '../files-info/utils'
import { LikeOptions } from './interface'

/**
 * 处理点赞列表
 * @param data 原始数据
 * @param showUserInfo 是否展示用户信息
 */
export const handleLike = async (data: LikeOptions[], showUserInfo?: any) => {
  let files: FileInfoOptions[] = []
  if (showUserInfo === '1') {
    files = await getFileByData(data, ['create_user_avatar'])
  }
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i]
    if (showUserInfo === '1' && item.create_user_avatar) {
      item.create_user_avatar = getOriginFileById(files, item.reply_user_avatar)
    }
  }
}
