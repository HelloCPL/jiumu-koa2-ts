/**
 * @description: 用户模块相关路由
 * @author chen
 * @update 2021-01-27 11:10:43
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import {
  doUserRegisterConvert,
  doUserUpdateBaseSelfConvert,
  doUserUpdateBaseConvert,
  doUserCheckPasswordConvert
} from '../../controller/users/convert'
import { doUserRegister } from '../../controller/users/register'
import { doUserLogin } from '../../controller/users/login'
import { doUserUpdateBaseSelf, doUserUpdateBase, doUserUpdateToken } from '../../controller/users/update'
import { doUserUpdatePhoneSelf, doUserUpdatePasswordSelf } from '../../controller/users/update-secret'
import { doUserGetSelf, doUserGetBase, doUserGetList } from '../../controller/users/get'
import { doUserExit } from '../../controller/users/exit'

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
  async doUserLogin(ctx: Context, next: Next) {
    await doUserLogin(ctx, next)
  }

  // 3 修改本用户基本信息
  @Request({
    path: 'update/base/self',
    methods: ['post', 'get']
  })
  @Convert(doUserUpdateBaseSelfConvert)
  async doUserUpdateBaseSelf(ctx: Context, next: Next) {
    await doUserUpdateBaseSelf(ctx, next)
  }

  // 4 修改本用户账号
  @Request({
    path: 'update/phone/self',
    methods: ['post']
  })
  @Required(['phone'])
  @Convert(doUserRegisterConvert)
  async doUserUpdatePhoneSelf(ctx: Context, next: Next) {
    await doUserUpdatePhoneSelf(ctx, next)
  }

  // 5 修改本用户密码
  @Request({
    path: 'update/password/self',
    methods: ['post']
  })
  @Required(['password', 'newPassword'])
  @Convert(doUserCheckPasswordConvert)
  async doUserUpdatePasswordSelf(ctx: Context, next: Next) {
    await doUserUpdatePasswordSelf(ctx, next)
  }

  // 6 修改指定用户基本信息
  @Request({
    path: 'update/base',
    methods: ['post', 'get']
  })
  @Required(['id'])
  @Convert(doUserUpdateBaseSelfConvert)
  @Convert(doUserUpdateBaseConvert)
  async doUserUpdateBase(ctx: Context, next: Next) {
    await doUserUpdateBase(ctx, next)
  }

  // 7 获取本用户信息
  @Request({
    path: 'get/self',
    methods: ['post', 'get']
  })
  async doUserGetSelf(ctx: Context, next: Next) {
    await doUserGetSelf(ctx, next)
  }

  // 8 获取指定用户基本信息
  @Request({
    path: 'get/base',
    methods: ['post', 'get']
  })
  @Required(['id'])
  async doUserGetBase(ctx: Context, next: Next) {
    await doUserGetBase(ctx, next)
  }

  // 9 获取用户列表基本信息
  @Request({
    path: 'get/list',
    methods: ['post', 'get']
  })
  async doUserGetList(ctx: Context, next: Next) {
    await doUserGetList(ctx, next)
  }

  // 10 更新token
  @Request({
    path: 'update/token',
    methods: ['post', 'get'],
    unless: true
  })
  async doUserUpdateToken(ctx: Context, next: Next) {
    await doUserUpdateToken(ctx, next)
  }

  // 11 退出登录
  @Request({
    path: 'exit',
    methods: ['post', 'get'],
  })
  async doUserExit(ctx: Context, next: Next) {
    await doUserExit(ctx, next)
  }
}
