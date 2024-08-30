import { query } from '@/db'
import { CommentListParams, CommentOptions } from './interface'
import { getFileByData, getOriginFileById } from '../files-info/utils'
import { FileInfoOptions } from '../files-info/interface'
import { getTopSourcesType } from '../do-top/utils'

/**
 * 获取评论目标的用户
 */
async function getTargetCreateUser(targetId: string, type: string): Promise<string> {
  const source = getTopSourcesType(type)
  if (!source) return '0'
  const sql = `SELECT create_user FROM ${source.table} WHERE id = ?`
  const res: any = await query(sql, targetId)
  if (res && res.length && res[0]['create_user']) return res[0]['create_user']
  return ''
}

/**
 * 处理评论列表 flag 1 一级评论 2 二级评论
 */
export async function handleCommentList(data: CommentOptions[], params: CommentListParams) {
  let files: FileInfoOptions[] = []
  if (params.showUserInfo === '1') {
    files = await getFileByData(data, ['reply_user_avatar', 'create_user_avatar'])
  }
  // 处理是否评论目标的作者（顶级目标）
  // let targetUser = ''
  if (params.flag === 1) {
    // targetUser = getTargetCreateUser()
  } else if (params.flag === 2 && data.length) {
  }

  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i]
    // 处理是否点赞
    if (item.is_like) item.is_like = '1'
    else item.is_like = '0'
    // 处理是否为自己的评论
    if (item.create_user === params.userId) item.is_self = '1'
    else item.is_self = '0'
    // 处理子级
    item.children = []
    // 处理回复者
    if (params.flag === 1 || (params.flag === 2 && item.create_user === item.reply_user)) {
      item.reply_user = null
      item.reply_user_name = null
      item.reply_user_avatar = null
    }
    // 处理子级数量
    if (params.flag === 2) item.comment_count = 0
    // 处理是否评论目标作者
    // if (params.flag === 1)
    //   item.is_target_user = await getTargetCreateUser(item.target_id, <string>params.type, item.create_user)
    // else if (params.flag === 2)
    //   item.is_target_user = await getTargetCreateUser(
    //     item.target_id,
    //     <string>item.target_type,
    //     item.create_user
    //   )
    // 处理评论者或回复者头像
    if (params.showUserInfo === '1' && item.create_user_avatar)
      item.create_user_avatar = getOriginFileById(files, item.create_user_avatar)
    if (params.showUserInfo === '1' && item.reply_user && item.reply_user_avatar)
      item.reply_user_avatar = getOriginFileById(files, item.reply_user_avatar)
    item.flag = params.flag
  }
}
