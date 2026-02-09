/**
 * @description: 路由统一注册
 * @author chen
 * @update 2021-08-06 16:09:23
 */

import Koa from 'koa'
import Router from 'koa-router'
import { sureIsArray, toPath } from '@/utils/tools'
import { RouteOptions } from './interface'
import { verifyRoute } from '@/lib/verify-auth'
import { logger } from '@/lib/logger'

const router = new Router()

/**
 * 定义固定的前缀字段
 */
export const symbolRoutePrefix: symbol = Symbol('routePrefix')

export class Route {
  // 存储修饰后的路由
  static __DecoratedRouters: Map<RouteOptions, Controller | Controller[]> = new Map()
  private router: Router
  private app: Koa

  constructor(app: Koa) {
    this.app = app
    this.router = router
  }

  // 加载路由文件
  loadApis() {
    require('./api/articles/index')
    require('./api/ciphers-code/index')
    require('./api/ciphers/index')
    require('./api/collections/index')
    require('./api/comments/index')
    require('./api/do-top/index')
    require('./api/files-info/index')
    require('./api/likes/index')
    require('./api/login-info/index')
    require('./api/menus/index')
    require('./api/novels-chapter/index')
    require('./api/note/index')
    require('./api/novels/index')
    require('./api/permissions/index')
    require('./api/questions/index')
    require('./api/roles-menus/index')
    require('./api/roles-permissions/index')
    require('./api/roles/index')
    require('./api/sources-link/index')
    require('./api/sources/index')
    require('./api/tags-custom/index')
    require('./api/tags/index')
    require('./api/users-roles/index')
    require('./api/users/index')
  }

  /**
   * 自动注册路由 初始化
   */
  init() {
    logger.info({ message: '路由注册 初始化' })
    // 加载 api 接口
    this.loadApis()

    logger.info({ message: '路由注册 添加白名单；匹配路由注册' })
    for (const [config, controller] of Route.__DecoratedRouters) {
      // 处理路由中间件方法
      const controllers: Controller[] = sureIsArray(controller)
      // 自定义路由中间件 自己调整中间件顺序
      const middleares: Controller[] = [
        verifyRoute // 权限校验
      ]
      controllers.unshift(...middleares)

      //  拼接路由集合
      const routePaths: string[] = []
      config.terminals.forEach((value) => {
        routePaths.push(toPath(value, config.target[symbolRoutePrefix], config.path))
      })
      // 不做校验的路由集合
      if (config.unless) {
        global._unlessPath.push(...routePaths)
      }

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
    logger.info({ message: '路由注册 完成' })
    // 处理不存在的路由
    this.app.use(this.router.allowedMethods())
  }
}
