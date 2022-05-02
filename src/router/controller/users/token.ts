/**
 * @description 生成或解析 token
 * @author chen
 * @update 2021-01-21 14:23:03
 * @list 方法集合说明
 *   TokenAuth // token拦截中间件
 *   TokenVerify // 普通路由校验方法
 *   TokenGernerate // 生成 token
 *   getTokenKey // 获取token保存的key
*/

import { Context } from 'koa'
import { TOKEN, IS_VERIFY_TOKEN_BY_REDIS, IS_ALLOW_MULTIPLE_LOGIN } from '../../../config'
import JWT from 'jsonwebtoken'
import { Base64 } from 'js-base64'
import BasicAuth from 'basic-auth'
import { ExceptionOptions } from '../../../utils/http-exception'
import { Message, Code } from '../../../enums'
import { clientDel, clientSet, clientGet } from '../../../db/redis'
import dayjs from 'dayjs'
import { TokenOptions, TokenParamsOptions, TokenSaveParamsOptions } from './interface'
import { getIP } from '../../../utils/tools';
import { query } from '../../../db';

/**
 * 生成 token
*/
export const gernerateToken = async (ctx: Context, info: TokenParamsOptions): Promise<string> => {
  let uuid = <string>ctx.request.header['user-agent'] + '&&' + getIP(ctx)
  const payload: TokenOptions = {
    id: info.id,
    phone: info.phone,
    terminal: ctx._terminal,
    'user-agent': uuid
  }
  const token: string = JWT.sign(payload, TOKEN.SECRET_KEY, { expiresIn: info.validTime })
  // 保存到 redis 
  const tokenKey = _getTokenKey({
    id: payload.id,
    terminal: payload.terminal,
    'user-agent': payload['user-agent'],
    key: info.key
  })
  await clientDel(tokenKey)
  await clientSet(tokenKey, token)
  return 'Basic ' + Base64.encode(token + ':')
}

/**
 * 解析 token 信息
*/
export const analysisToken = async (ctx: Context, key: string = 'token'): Promise<ExceptionOptions> => {
  const tokenOrigin = BasicAuth(ctx.req)
  if (!tokenOrigin || !tokenOrigin.name)
    return { message: Message.noToken, code: Code.forbidden }
  // 解析 token 信息
  const token = tokenOrigin.name
  const tokenInfo: TokenOptions = <TokenOptions>JWT.decode(token)
  try {
    // 校验 token 是否有效 并获取解析后的信息
    const tokenVerify: TokenOptions = <TokenOptions>JWT.verify(token, TOKEN.SECRET_KEY)
    if (IS_VERIFY_TOKEN_BY_REDIS) {
      // redis在线校验token信息

      // 获取redis同步的token信息
      const tokenKey = _getTokenKey({
        id: tokenVerify.id,
        terminal: tokenVerify.terminal,
        'user-agent': tokenVerify['user-agent'],
        key
      })
      let tokenRedis: any = await clientGet(tokenKey)
      let tokenRedisInfo: TokenOptions = <TokenOptions>JWT.decode(tokenRedis)
      // 校验用户信息是否一致
      if (!tokenRedis || !tokenRedisInfo || tokenVerify.phone !== tokenRedisInfo.phone || tokenVerify.id !== tokenRedisInfo.id)
        return { message: Message.authLogin, code: Code.authLogin }
      // 校验登录设备、请求路径与终端的信息是否一致
      let uuid = <string>ctx.request.header['user-agent'] + '&&' + getIP(ctx)
      if (ctx._terminal !== tokenVerify.terminal || uuid !== tokenVerify['user-agent'])
        return { message: Message.errorDevice, code: Code.forbidden }
      // 校验是否允许多平台登录
      if (tokenVerify['user-agent'] !== tokenRedisInfo['user-agent'] || token !== tokenRedis) {
        if (IS_ALLOW_MULTIPLE_LOGIN)
          return { message: Message.errorDevice, code: Code.forbidden }
        else
          return { message: Message.errorLogin, code: Code.forbidden }
      }
    } else if (!tokenVerify.id) {
      return { message: Message.forbidden, code: Code.forbidden }
    } else {
      // mysql校验token用户是否合法
      const sql = `SELECT id FROM users where id = ?`
      const res: any = await query(sql, tokenVerify.id)
      if (!res.length) {
        return { message: Message.authLogin, code: Code.authLogin }
      }
    }
  } catch (e) {
    // iat 开始有效时间
    if (key === 'token' && tokenInfo && tokenInfo.iat) {
      const currentDateValue = dayjs().unix()
      const iat = tokenInfo.iat + TOKEN.REFRESH_VALID_TIME
      if (currentDateValue < iat)
        return { message: Message.authRefresh, code: Code.authRefresh }
    }
    return { message: Message.authLogin, code: Code.authLogin }
  }
  return { message: Message.success, code: Code.success, data: tokenInfo }
}

// 获取保存 token 的 key 
export function _getTokenKey(info: TokenSaveParamsOptions): string {
  if (IS_ALLOW_MULTIPLE_LOGIN)
    return `${info.id}_${info.terminal}_${info['user-agent']}_${info.key}`
  else
    return `${info.id}_${info.terminal}_${info.key}`
}
