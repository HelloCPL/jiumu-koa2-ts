/**
 * @description: 路由统一注册
 * @author chen
 * @update 2021-08-06 16:09:23
 */

import Koa from 'koa'
import Router from 'koa-router'
import path from 'path'
import glob from 'glob'
import { sureIsArray, toPath } from '../utils/tools'
import { RouteOptions } from './interface'
import { mountParameter } from '../lib/mount-parameter'
import { verifyRoute } from '../lib/verify-auth'

const router = new Router()

/**
 * 定义固定的前缀字段
 */
export const symbolRoutePrefix: symbol = Symbol('routePrefix')

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
    // 加载 api 接口
    glob.sync(path.join(__dirname, './api/**/*.js')).forEach((item) => {
      require(item)
    })
    for (let [config, controller] of Route.__DecoratedRouters) {
      // 处理路由中间件方法
      let controllers: Function[] = sureIsArray(controller)
      // 自定义路由中间件 自己调整中间件顺序
      const middleares: Function[] = [
        mountParameter, // 挂载参数处理
        verifyRoute, // 权限校验
      ]
      controllers.unshift(...middleares)

      //  拼接路由集合
      const routePaths: string[] = []
      config.terminals.forEach((value) => {
        routePaths.push(toPath(value, config.target[symbolRoutePrefix], config.path))
      })
      // 不做校验的路由集合
      if (config.unless) global.unlessPath.push(...routePaths)

      // 匹配路由
      controllers.forEach((_controller) => {
        routePaths.forEach((path) => {
          config.methods.forEach((method) => {
            // @ts-ignore
            this.router[method](path, _controller)
          })
        })
      })
    }

    // 组装匹配好的路由

    this.app.use(this.router.routes())
    // 处理不存在的路由
    this.app.use(this.router.allowedMethods())
  }
}
