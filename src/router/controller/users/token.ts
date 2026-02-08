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
import { ENV, TOKEN, IS_VERIFY_TOKEN_BY_REDIS, IS_ALLOW_MULTIPLE_LOGIN, PUBLIC_PATH } from '@/config'
import JWT from 'jsonwebtoken'
import { Base64 } from 'js-base64'
import BasicAuth from 'basic-auth'
import { ExceptionOptions } from '@/utils/http-exception'
import { Message, Code } from '@/enums'
import { clientDel, clientSet, clientGet } from '@/db/redis'
import dayjs from 'dayjs'
import { TokenOptions, TokenParamsOptions, TokenSaveParamsOptions } from './interface'
import { query } from '@/db'

/**
 * 生成 token
 */
export const gernerateToken = async (ctx: Context, info: TokenParamsOptions): Promise<string> => {
  const userAgent = ctx.request.header['user-agent'] || ''
  const payload: TokenOptions = {
    id: info.id,
    phone: info.phone,
    terminal: ctx._terminal,
    'user-agent': userAgent
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
 * @param ctx 上下文
 * @param key? 指定 key ，'token' | 'token_refresh' 默认 'token'
 * @returns 返回解析后的数据结构
 */
export const analysisToken = async (ctx: Context, key: string = 'token'): Promise<ExceptionOptions> => {
  const tokenOrigin = BasicAuth(ctx.req)
  if (!tokenOrigin?.name) {
    return { message: Message.noToken, code: Code.forbidden }
  }
  // 解析 token 信息
  const token = tokenOrigin.name
  const tokenInfo: TokenOptions = <TokenOptions>JWT.decode(token)
  try {
    // redis在线校验token信息
    if (IS_VERIFY_TOKEN_BY_REDIS) {
      // 获取redis同步的token信息
      const tokenKey = _getTokenKey({
        id: tokenInfo.id,
        terminal: tokenInfo.terminal,
        'user-agent': tokenInfo['user-agent'],
        key
      })
      const tokenRedis: any = await clientGet(tokenKey)
      const tokenRedisInfo: TokenOptions = <TokenOptions>JWT.decode(tokenRedis)
      // 校验用户信息是否一致
      if (
        !tokenRedis ||
        !tokenRedisInfo ||
        tokenInfo.phone !== tokenRedisInfo.phone ||
        tokenInfo.id !== tokenRedisInfo.id
      ) {
        return { message: Message.authLogin, code: Code.authLogin }
      }
      // 校验登录设备、请求路径与终端的信息是否一致，其中开发环境不校验设备（浏览器调试）
      const userAgent = ctx.request.header['user-agent'] || ''
      if (ctx._terminal !== tokenInfo.terminal || (userAgent !== tokenInfo['user-agent'] && ENV !== 'dev')) {
        return { message: Message.errorDevice, code: Code.authLogin }
      }
      // 校验token的登录设备信息与redis缓存的登录设备信息是否一致
      if (tokenInfo['user-agent'] !== tokenRedisInfo['user-agent']) {
        return { message: Message.errorLogin, code: Code.authLogin }
      }
    } else if (!tokenInfo.id) {
      return { message: Message.forbidden, code: Code.forbidden }
    } else {
      // mysql校验token用户是否合法
      const sql = 'SELECT id FROM users where id = ?'
      const res: any = await query(sql, tokenInfo.id)
      if (!res.length) {
        return { message: Message.authLogin, code: Code.authLogin }
      }
    }
  } catch (e) {
    // iat 开始有效时间
    if (key === 'token' && tokenInfo && tokenInfo.iat) {
      const currentDateValue = dayjs().unix()
      const iat = tokenInfo.iat + TOKEN.REFRESH_VALID_TIME
      if (currentDateValue < iat) return { message: Message.authRefresh, code: Code.authRefresh }
    }
    return { message: Message.authLogin, code: Code.authLogin }
  }
  return { message: Message.success, code: Code.success, data: tokenInfo }
}

// 获取保存 token 的 key
export function _getTokenKey(info: TokenSaveParamsOptions): string {
  if (IS_ALLOW_MULTIPLE_LOGIN) {
    return `${info.id}_${PUBLIC_PATH}_${info.terminal}_${info['user-agent']}_${info.key}`
  }
  return `${info.id}_${PUBLIC_PATH}_${info.terminal}_${info.key}`
}

/*
 * 获取 token 里包含的信息并返回
 * @param token 原始的 token 字符串
 * @returns 返回 token 解析后包含的信息
 */
export function getTokenInfo(token: string): TokenOptions | null {
  if (!token) return null
  let tokenStr = token
  if (tokenStr.startsWith('Basic ')) {
    const encodedStr = tokenStr.substring(6)
    const decodedStr = Base64.decode(encodedStr)
    // 移除末尾的冒号
    tokenStr = decodedStr.endsWith(':') ? decodedStr.slice(0, -1) : decodedStr
  }
  try {
    return JWT.verify(tokenStr, TOKEN.SECRET_KEY) as TokenOptions
  } catch (e) {
    return null
  }
}
