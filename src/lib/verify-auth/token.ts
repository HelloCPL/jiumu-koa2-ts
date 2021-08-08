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

import { Context, Next } from 'koa'
import Config from '../../config'
import JWT from 'jsonwebtoken'
import { Base64 } from 'js-base64'
import { ExceptionOptions} from '../../utils/http-exception' 

interface TokenOptions extends ObjectAny {
  id: string,
  phone: string,
  terminal: string,
  'user-agent': string
}

/**
 * 生成 token
*/
export const gernerateToken = async (info: TokenOptions, validTime: number): Promise<string> => {

  const token: string = JWT.sign(info, Config.TOKEN.SECRET_KEY, { expiresIn: validTime })
  return 'Basic ' + Base64.encode(token + ':')
}

/**
 * 解析 token 信息
*/
export const analysisToken = async (ctx: Context, next: Next): Promise<ExceptionOptions> => {
  let tokenInfo: ExceptionOptions = {}

  return tokenInfo
}


















