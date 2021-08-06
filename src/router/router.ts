/**
 * @description 路由注册装饰器 方法集合
 * @author chen
 * @update 2021-01-22 14:48:09
 *   Prefix // 路由前缀
 *   Request // 路由请求
 *   Required // 校验必传参数
 *   Convert // 添加自定义中间件方法
*/


import Koa from 'koa'
import { symbolRoutePrefix, Route } from './index';
import { ValidatorParameters } from '../utils/validator'
import { LinValidator } from '../lib/lin-validator'
import _ from 'lodash'
// import Logger from '../../utils/logger'
import { sureIsArray } from '../utils/tools'
// import { _getUserId } from '../utils/users'

























