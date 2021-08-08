/**
 * @description 对 koa ctx 追加参数
 * @author chen
 * @update 2021-01-22 15:06:16
*/

import Koa from 'koa'
import compose from 'koa-compose'
import { DataOptions } from '../lib/mount-parameter/interface'

declare module 'koa' {
  interface Context {
    data: DataOptions, // 包含不同传参方法的访问参数
    params: ObjectAny, // 自动根据请求获取的访问参数
    terminal: string | undefined, // 访问终端
  }
}