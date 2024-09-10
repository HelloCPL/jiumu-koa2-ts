import { isArray } from 'lodash'
import { NoteOptions, NoteParams } from './interface'
import { FileInfoOptions } from '../files-info/interface'
import { getFileByData, getOriginFileById } from '../files-info/utils'
import { getOriginTagCustomByIds, getTagCustomByData } from '../tags-custom/utils'

/**
 * 处理笔记数据
 * @param datas 原始数据
 * @param params.userId 用户 id
 * @param params.showUserInfo 是否展示用户信息
 * @param params.showTargetRelevance 是否展示与当前目标是否关联字段
 */
export async function handleNote(datas: NoteOptions | NoteOptions[], params: NoteParams) {
  let files: FileInfoOptions[] = []
  if (params.showUserInfo === '1') {
    files = await getFileByData(datas, ['create_user_avatar'])
  }
  const tagCustoms = await getTagCustomByData(datas, ['classify'], params.userId)
  const _handleList = async (data: NoteOptions) => {
    // 处理是否为自己发布
    if (data.create_user === params.userId) data.is_self = '1'
    else data.is_self = '0'
    // 处理自定义标签
    data.classify = getOriginTagCustomByIds(tagCustoms, data.classify)
    // 处理创建者头像
    if (params.showUserInfo === '1' && data.create_user_avatar) {
      data.create_user_avatar = getOriginFileById(files, data.create_user_avatar)
    }
    if (params.showTargetRelevance === '1') {
      data.is_target_relevance = data['is_target_relevance'] > 0 ? '1' : '0'
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
