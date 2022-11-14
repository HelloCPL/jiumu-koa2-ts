/**
 * @description: 登录记录模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context, Next } from 'koa'
import { Prefix, Request, Required } from '@/router/router'
import { doLoginInfoGetList } from '@/router/controller/login-info/get'

@Prefix('login/info')
export default class API {
  // 1 获取登录记录
  @Request({
    path: 'get/list',
    methods: ['get', 'post']
  })
  @Required(['userId'])
  async doLoginInfoGetList(ctx: Context, next: Next) {
    await doLoginInfoGetList(ctx, next)
  }
}
