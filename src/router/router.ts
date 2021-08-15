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
import { symbolRoutePrefix, Route } from './index';
import { ValidatorParameters, ValidatorOptions } from '../utils/validator'
import _ from 'lodash'
// import Logger from '../../utils/logger'
import { sureIsArray } from '../utils/tools'
// import { _getUserId } from '../utils/users'
import { RequestOptions, RouteOptions } from './interface'
import { MessageParameter, Message } from '../enums'
import Config from '../config'

/**
 * @author chen
 * @params prefix 路由前缀
 * 如 @Prefix('user')
 * @description 用于追加路由前缀 类装饰器
 * @update 2021-01-22 16:25:57
*/
export const Prefix = (prefix: string): ClassDecorator => (target: any) => {
  target.prototype[symbolRoutePrefix] = prefix
}

/**
 * @author chen
 * @params options {path 路径 methods 请求方法 unless 是否不拦截}
 * 如 @Request({path: 'login', methods: ['post', 'get']})
 * @description 路由请求 方法装饰器
 * @update 2021-01-22 16:25:57
*/
export const Request = (options: RequestOptions): MethodDecorator => (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
  if (!(_.isArray(options.terminals) && options.terminals.length))
    options.terminals = ['pc', 'app', 'web', 'wechat']
  Route.__DecoratedRouters.set(<RouteOptions>{
    target,
    ...options
  }, target[key])
  return descriptor
}

/**
 * @author chen
 * @params params 必传参数列表，如需指定类型，用 &+类型 拼接成字符串
 * 如 @Required(['id', 'age&isInt', 'type&isBoolean'])
 * @description 校验必传参数 方法装饰器
 * @update 2021-01-22 16:25:57
*/
export const Required = (params: string[]): MethodDecorator => (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
  target[key] = sureIsArray(target[key])
  target[key].splice(0, 0, middleware)
  return descriptor
  async function middleware(ctx: Context, next: Next) {
    const newParams: ValidatorOptions[] = _handleRequiredParams(params)
    await new ValidatorParameters(newParams).validate(ctx)
    await next()
  }
}
// 校验必传参数
function _handleRequiredParams(params: string[]): ValidatorOptions[] {
  let data: ValidatorOptions[] = []
  params.forEach(item => {
    if (item) {
      let i: number = item.indexOf('&')
      let key: string
      let rule: string
      if (i !== -1) {
        key = item.substring(0, i)
        rule = item.substring(i + 1)
      } else {
        key = item
        rule = 'isLength'
      }
      data.push({
        key,
        // @ts-ignore 
        rules: [rule, MessageParameter[rule] || Message.parameter]
      })
    }
  })
  return data
}

/**
 * @author chen
 * @params middleware 中间件方法
 * @description 添加自定义中间件方法 方法装饰器
 * 如 @convert(async function(ctx, next){await next()})
 * @update 2021-01-23 15:09:34
*/
export const Convert = (middleware: Function): MethodDecorator => (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
  target[key] = sureIsArray(target[key])
  target[key].splice(target[key].length - 1, 0, middleware)
  return descriptor
}
