/**
 * @description: 用户模块相关路由
 * @author chen
 * @update 2021-01-27 11:10:43
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import {
  doUserRegisterConvert,
  doUserUpdateBaseSelfConvert,
  doUserUpdateBaseConvert,
  doUserCheckPasswordConvert
} from '@/router/controller/users/convert'
import { doUserRegister } from '@/router/controller/users/register'
import { doUserLogin } from '@/router/controller/users/login'
import { doUserUpdateBaseSelf, doUserUpdateBase, doUserUpdateToken } from '@/router/controller/users/update'
import { doUserUpdatePhoneSelf, doUserUpdatePasswordSelf } from '@/router/controller/users/update-secret'
import { doUserGetSelf, doUserGetBase, doUserGetList } from '@/router/controller/users/get'
import { doUserExit } from '@/router/controller/users/exit'

@Prefix('user')
export default class API {
  // 1 用户注册
  @Request({
    path: 'register',
    methods: ['post'],
    unless: true
  })
  @Required([
    { field: 'password', name: 'isLength', options: [{ min: 1, max: 64 }] },
    { field: 'phone', name: 'isMobilePhone', options: [{ locale: ['zh-CN', 'zh-TW', 'zh-HK'] }] }
  ])
  @Convert(doUserRegisterConvert)
  async doUserRegister(ctx: Context) {
    await doUserRegister(ctx)
  }

  // 2 用户登录
  @Request({
    path: 'login',
    methods: ['post'],
    unless: true
  })
  @Required(['phone', 'password'])
  async doUserLogin(ctx: Context) {
    await doUserLogin(ctx)
  }

  // 3 修改本用户基本信息
  @Request({
    path: 'update/base/self',
    methods: ['post', 'get']
  })
  @Required([
    { field: 'username', required: false, name: 'isLength', options: [{ max: 64 }] },
    { field: 'professional', required: false, name: 'isLength', options: [{ max: 255 }] },
    { field: 'address', required: false, name: 'isLength', options: [{ max: 255 }] },
    { field: 'remarks', required: false, name: 'isLength', options: [{ max: 255 }] }
  ])
  @Convert(doUserUpdateBaseSelfConvert, doUserUpdateBaseConvert)
  async doUserUpdateBaseSelf(ctx: Context) {
    await doUserUpdateBaseSelf(ctx)
  }

  // 4 修改本用户账号
  @Request({
    path: 'update/phone/self',
    methods: ['post']
  })
  @Required([{ field: 'phone', name: 'isMobilePhone', options: [{ locale: ['zh-CN', 'zh-TW', 'zh-HK'] }] }])
  @Convert(doUserRegisterConvert, doUserUpdateBaseConvert)
  async doUserUpdatePhoneSelf(ctx: Context) {
    await doUserUpdatePhoneSelf(ctx)
  }

  // 5 修改本用户密码
  @Request({
    path: 'update/password/self',
    methods: ['post']
  })
  @Required([
    { field: 'password', name: 'isLength', options: [{ min: 1, max: 64 }] },
    { field: 'newPassword', name: 'isLength', options: [{ min: 1, max: 64 }] }
  ])
  @Convert(doUserCheckPasswordConvert)
  async doUserUpdatePasswordSelf(ctx: Context) {
    await doUserUpdatePasswordSelf(ctx)
  }

  // 6 修改指定用户基本信息
  @Request({
    path: 'update/base',
    methods: ['post', 'get']
  })
  @Required([
    'id',
    { field: 'username', required: false, name: 'isLength', options: [{ max: 64 }] },
    { field: 'professional', required: false, name: 'isLength', options: [{ max: 255 }] },
    { field: 'address', required: false, name: 'isLength', options: [{ max: 255 }] },
    { field: 'remarks', required: false, name: 'isLength', options: [{ max: 255 }] }
  ])
  @Convert(doUserUpdateBaseSelfConvert)
  @Convert(doUserUpdateBaseConvert)
  async doUserUpdateBase(ctx: Context) {
    await doUserUpdateBase(ctx)
  }

  // 7 获取本用户信息
  @Request({
    path: 'get/self',
    methods: ['post', 'get']
  })
  async doUserGetSelf(ctx: Context) {
    await doUserGetSelf(ctx)
  }

  // 8 获取指定用户基本信息
  @Request({
    path: 'get/base',
    methods: ['post', 'get']
  })
  @Required(['id'])
  async doUserGetBase(ctx: Context) {
    await doUserGetBase(ctx)
  }

  // 9 获取用户列表基本信息
  @Request({
    path: 'get/list',
    methods: ['post', 'get']
  })
  @Required([
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doUserGetList(ctx: Context) {
    await doUserGetList(ctx)
  }

  // 10 更新token
  @Request({
    path: 'update/token',
    methods: ['post', 'get'],
    unless: true
  })
  async doUserUpdateToken(ctx: Context) {
    await doUserUpdateToken(ctx)
  }

  // 11 退出登录
  @Request({
    path: 'exit',
    methods: ['post', 'get'],
    unless: true
  })
  async doUserExit(ctx: Context) {
    await doUserExit(ctx)
  }
}
