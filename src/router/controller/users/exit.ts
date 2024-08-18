/**
 * @description: 用户退出
 * @author chen
 * @update 2021-08-16 17:41:36
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { _getTokenKey, getTokenInfo } from './token'
import { clientDel } from '@/db/redis'
import { Message } from '@/enums'

/**
 * 修改本用户基本信息
 */
export const doUserExit = async (ctx: Context) => {
  let tokenInfo = getTokenInfo(<string>ctx.req.headers.authorization)
  if (!tokenInfo) tokenInfo = getTokenInfo(ctx._params.tokenRefresh)
  if (tokenInfo) {
    const tokenKey = _getTokenKey({
      id: tokenInfo.id,
      terminal: ctx._terminal,
      'user-agent': tokenInfo['user-agent'],
      key: 'token'
    })
    const tokenRefreshKey = _getTokenKey({
      id: tokenInfo.id,
      terminal: ctx._terminal,
      'user-agent': tokenInfo['user-agent'],
      key: 'token_refresh'
    })
    await clientDel(tokenKey)
    await clientDel(tokenRefreshKey)
  }
  throw new Success({ message: Message.exit })
}
