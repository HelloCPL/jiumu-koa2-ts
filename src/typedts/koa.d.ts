/**
 * @description 对 koa ctx 追加参数
 * @author chen
 * @update 2021-01-22 15:06:16
*/

import Koa from 'koa'
import compose from 'koa-compose'
import { DataOptions } from '../lib/mount-parameter/interface'
import { TokenOptions } from '../router/controller/users/interface'
import { TerminalType } from '../enums'

declare module 'koa' {
  interface Context {
    _data: DataOptions, // 包含不同传参方法的访问参数
    _params: ObjectAny, // 自动根据请求方式获取的访问参数
    _terminal: TerminalType, // 访问终端
    _user: TokenOptions, // 根据token解析的用户信息
  }
}