/**
 * @description: 用户模块相关路由
 * @author chen
 * @update 2021-01-27 11:10:43
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doUserRegisterConvert, doUserLoginConvert } from '../../controller/users/convert'
import { doUserRegister } from '../../controller/users/register'
import { doUserLogin } from '../../controller/users/login'

@Prefix('user')
export default class API {
  // 1 用户注册
  @Request({
    path: 'register',
    methods: ['post'],
    unless: true
  })
  @Required(['phone', 'password'])
  @Convert(doUserRegisterConvert)
  async doUserRegister(ctx: Context, next: Next) {
    await doUserRegister(ctx, next)
  }

  // 2 用户登录
  @Request({
    path: 'login',
    methods: ['post'],
    unless: true
  })
  @Required(['phone', 'password'])
  @Convert(doUserLoginConvert)
  async doUserLogin(ctx: Context, next: Next) {
    await doUserLogin(ctx, next)
  }

  // 3 修改本用户基本信息
  // 4 修改本用户账号
  // 5 修改本用户密码
  // 6 修改指定用户基本信息
  // 7 获取本用户信息
  // 8 获取指定用户基本信息
  // 9 获取用户列表基本信息

  // 10 根据tokenRefresh更新token
  // 11 退出登录
}
