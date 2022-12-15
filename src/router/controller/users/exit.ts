/**
 * @description: 用户退出
 * @author chen
 * @update 2021-08-16 17:41:36
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { _getTokenKey } from './token'
import { clientDel } from '@/db/redis'
import { Message } from '@/enums'

/**
 * 修改本用户基本信息
 */
export const doUserExit = async (ctx: Context) => {
  const tokenKey = _getTokenKey({
    id: ctx._user.id,
    terminal: ctx._terminal,
    'user-agent': ctx._user['user-agent'],
    key: 'token'
  })
  const tokenRefreshKey = _getTokenKey({
    id: ctx._user.id,
    terminal: ctx._terminal,
    'user-agent': ctx._user['user-agent'],
    key: 'token_refresh'
  })
  await clientDel(tokenKey)
  await clientDel(tokenRefreshKey)
  throw new Success({ message: Message.exit })
}
