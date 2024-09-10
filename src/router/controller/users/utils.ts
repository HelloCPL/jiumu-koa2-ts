import { Context } from 'koa'
import { DoubleTokenParams, DoubleTokenReturn, UserOptions } from './interface'
import { TOKEN } from '@/config'
import { gernerateToken } from './token'
import { FileInfoOptions } from '../files-info/interface'
import { getFileByData, getOriginFileById } from '../files-info/utils'
import { isArray } from 'lodash'

/**
 * 生成双token
 * @param ctx 上下文
 * @param options.userId 用户id
 * @param options.phone 用户账号
 */
export const handleDoubleToken = async (
  ctx: Context,
  options: DoubleTokenParams
): Promise<DoubleTokenReturn> => {
  const tokenParams = {
    id: options.userId,
    phone: options.phone,
    validTime: TOKEN.VALID_TIME,
    key: 'token'
  }
  const token = await gernerateToken(ctx, tokenParams)
  // 生成刷新 token
  const tokenRefreshParams = {
    id: options.userId,
    phone: options.phone,
    validTime: TOKEN.REFRESH_VALID_TIME,
    key: 'token_refresh'
  }
  const tokenRefresh = await gernerateToken(ctx, tokenRefreshParams)
  return { token, tokenRefresh }
}

/**
 * 处理用户数据
 * @param datas 原始数据
 * @param simple 是否展示简洁的用户信息
 */
export async function handleUser(datas: UserOptions | UserOptions[], simple?: BaseStatus) {
  let files: FileInfoOptions[] = []
  if (simple !== '1') {
    files = await getFileByData(datas, ['avatar'])
  }
  const _handleList = async (data: UserOptions) => {
    // 处理创建者头像
    if (simple !== '1' && data.avatar) {
      data.avatar = getOriginFileById(files, data.avatar)
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
