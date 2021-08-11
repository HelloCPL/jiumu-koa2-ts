/**
 * @description: 用户模块相关路由
 * @author chen
 * @update 2021-01-27 11:10:43
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doUserRegisterExist, doUserLoginNoExist } from '../../controller/users/convert'
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
  @Convert(doUserRegisterExist)
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
  @Convert(doUserLoginNoExist)
  async doUserLogin(ctx: Context, next: Next) {
    await doUserLogin(ctx, next)
  }
}
