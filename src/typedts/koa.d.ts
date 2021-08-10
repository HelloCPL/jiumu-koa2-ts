/**
 * @description 对 koa ctx 追加参数
 * @author chen
 * @update 2021-01-22 15:06:16
*/

import Koa from 'koa'
import compose from 'koa-compose'
import { DataOptions } from '../lib/mount-parameter/interface'
import {TokenOptions} from '../lib/verify-auth/token'

declare module 'koa' {
  interface Context {
    data: DataOptions, // 包含不同传参方法的访问参数
    params: ObjectAny, // 自动根据请求获取的访问参数
    terminal: string, // 访问终端
    user: TokenOptions, // 根据token解析的用户信息
  }
}