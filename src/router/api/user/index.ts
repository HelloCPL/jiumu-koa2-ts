/**
 * @description: 用户模块相关路由
 * @author chen
 * @update 2021-01-27 11:10:43
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doUserRegisterIsExist } from '../../controller/user/convert'
import { doUserRegister } from '../../controller/user/register'
import { doUserLogin } from '../../controller/user/login'


@Prefix('user')
export default class User {
  // 1 用户注册
  @Request({
    path: 'register',
    methods: ['post', 'get', 'put', 'delete'],
    unless: true
  })
  @Required(['phone', 'password'])
  @Convert(doUserRegisterIsExist)
  async doUserRegister(ctx: Context, next: Next) {
    await doUserRegister(ctx, next)
  }

  // 2 用户登录
  @Request({
    path: 'login',
    methods: ['post', 'get'],
    // unless: false 
  })
  @Required(['phone', 'password'])
  // @Convert(doUserRegisterIsExist)
  async doUserLogin(ctx: Context, next: Next) {
    await doUserLogin(ctx, next)
  }
}
