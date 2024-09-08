/**
 * @description 路由注册装饰器 方法集合
 * @author chen
 * @update 2021-01-22 14:48:09
 *   Prefix // 路由前缀
 *   Request // 路由请求
 *   Required // 校验必传参数
 *   Convert // 添加自定义中间件方法
 */

import { Context, Next } from 'koa'
import { symbolRoutePrefix, Route } from './index'
import { ValidatorParameters, ValidatorOptions, generateRequiredParams } from '@/utils/validator'
import { isArray } from 'lodash'
import { sureIsArray } from '@/utils/tools'
import { RequestOptions, RouteOptions } from './interface'

/**
 * 用于追加路由前缀 类装饰器
 * @params prefix 路由前缀
 * @demo @Prefix('user')
 */
export const Prefix =
  (prefix: string): ClassDecorator =>
    (target: Function) => {
      target.prototype[symbolRoutePrefix] = prefix
    }

/**
 * 定义路由请求，并将该方法存入 Route.__DecoratedRouters 中 方法装饰器
 * @param option.path 请求路径
 * @param option.methods 请求方法集合
 * @param option.unless? 是否不拦截（即加入路由白名单）
 * @param option.terminals 兼容的终端集合，默认 ['pc', 'app', 'web', 'wechat']
 * @demo @Request({path: 'login', methods: ['post', 'get']})
 */
export const Request =
  (options: RequestOptions): MethodDecorator =>
    (target: ObjectAny, key: string | symbol, descriptor: PropertyDescriptor) => {
      if (!(isArray(options.terminals) && options.terminals.length))
        options.terminals = ['pc', 'app', 'web', 'wechat']
      Route.__DecoratedRouters.set(
      <RouteOptions>{
        target,
        ...options
      },
      target[key as string]
      )
      return descriptor
    }

/**
 * 校验路由请求必传参数 方法装饰器
 * @param params 参数列表，如需指定类型 用 &+类型 拼接成字符串，拼接的为数字则指定最小长度
 * @demo @Required(['id', 'age&isInt', 'type&isBoolean', 'name&isString', 'title&12'])
 */
export const Required =
  (params: string[]): MethodDecorator =>
    (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
      async function requiredParameter(ctx: Context, next: Next) {
        const newParams: ValidatorOptions[] = generateRequiredParams(params)
        await new ValidatorParameters(newParams).validate(ctx)
        await next()
      }
      target[key] = sureIsArray(target[key])
      target[key].splice(0, 0, requiredParameter)
      return descriptor
    }

/**
 * 添加自定义中间件方法 方法装饰器
 * @param middleare 中间件方法集合
 * @demo @convert(async function(ctx, next){await next()})
 */
export const Convert =
  (...middleware: Function[]): MethodDecorator =>
    (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
      target[key] = sureIsArray(target[key])
      target[key].splice(target[key].length - 1, 0, ...middleware)
      return descriptor
    }
