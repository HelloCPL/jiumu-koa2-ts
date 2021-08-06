/**
 * @description: 路由统一注册
 * @author chen
 * @update 2021-08-06 16:09:23
*/

import Koa from 'koa'
import Router from 'koa-router'
import path from 'path'
import glob from 'glob'
// import { TokenAuth } from '../token-auth'
import { sureIsArray, toPath } from '../utils/tools'
import { RouteOptions } from './interface'

const router = new Router()

/**
 * 定义固定的前缀字段
*/
export const symbolRoutePrefix: symbol = Symbol("routePrefix");

export class Route {
  // 存储修饰后的路由
  static __DecoratedRouters: Map<RouteOptions, Function | Function[]> = new Map()
  private router: Router
  private app: Koa

  constructor(app: Koa) {
    this.app = app
    this.router = router
  }

  /**
   * 自动注册路由 初始化
  */
 init() {

 }
}
