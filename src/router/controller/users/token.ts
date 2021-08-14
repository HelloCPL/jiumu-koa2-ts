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
import Config from '../../../config'
import JWT from 'jsonwebtoken'
import { Base64 } from 'js-base64'
import BasicAuth from 'basic-auth'
import { ExceptionOptions } from '../../../utils/http-exception'
import { Message, Code } from '../../../enums'
import { clientDel, clientSet, clientGet } from '../../../db/redis'
import dayjs from 'dayjs'
import { TokenOptions, TokenParamsOptions, TokenSaveParamsOptions } from './interface'

/**
 * 生成 token
*/
export const gernerateToken = async (ctx: Context, info: TokenParamsOptions): Promise<string> => {
  const payload: TokenOptions = {
    id: info.id,
    phone: info.phone,
    terminal: ctx.terminal,
    'user-agent': <string>ctx.request.header['user-agent']
  }
  const token: string = JWT.sign(payload, Config.TOKEN.SECRET_KEY, { expiresIn: info.validTime })
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
    // 校验 token 是否有效
    const tokenVerify: TokenOptions = <TokenOptions>JWT.verify(token, Config.TOKEN.SECRET_KEY)
    // 校验 Headers.Authorization 和 redis 保存的信息是否一致
    const tokenKey = _getTokenKey({
      id: tokenVerify.id,
      terminal: tokenVerify.terminal,
      'user-agent': tokenVerify['user-agent'],
      key
    })
    let tokenRedis: any = await clientGet(tokenKey)
    let tokenRedisInfo: TokenOptions = <TokenOptions>JWT.decode(tokenRedis)
    if (!tokenRedis || !tokenRedisInfo || tokenVerify.phone !== tokenRedisInfo.phone)
      return { message: Message.authLogin, code: Code.authLogin }
    // 校验登录设备、请求路径与终端的信息是否一致
    if (ctx.terminal !== tokenVerify.terminal || ctx.request.header['user-agent'] !== tokenVerify['user-agent'])
      return { message: Message.errorDevice, code: Code.forbidden }
    // 校验是否允许多平台登录
    if (tokenVerify['user-agent'] !== tokenRedisInfo['user-agent'] || token !== tokenRedis) {
      if (Config.ALLOW_MULTIPLE)
        return { message: Message.authLogin, code: Code.authLogin }
      else
        return { message: Message.errorLogin, code: Code.forbidden }
    }
  } catch (e) {
    // iat 开始有效时间
    if (key === 'token' && tokenInfo && tokenInfo.iat) {
      const currentDateValue = dayjs().unix()
      const iat = tokenInfo.iat + Config.TOKEN.REFRESH_VALID_TIME
      if (currentDateValue < iat)
        return { message: Message.authRefresh, code: Code.authRefresh }
    }
    return { message: Message.authLogin, code: Code.authLogin }
  }
  return { message: Message.success, code: Code.success, data: tokenInfo }
}

// 获取保存 token 的 key 
function _getTokenKey(info: TokenSaveParamsOptions): string {
  if (Config.ALLOW_MULTIPLE)
    return `${info.id}_${info.terminal}_${info['user-agent']}_${info.key}`
  else
    return `${info.id}_${info.terminal}_${info.key}`
}
