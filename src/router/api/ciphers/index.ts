/**
 * @description 密码模块
 * @author cpl
 * @create 2023-03-13 15:33:21
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import { doCipherAddConvert } from '@/router/controller/ciphers/convert'
import { doCipherAdd } from '@/router/controller/ciphers/add'

@Prefix('cipher')
export default class API {
  // 1 密码新增
  @Request({
    path: 'add',
    methods: ['post']
  })
  @Required(['title', 'account', 'cipher', 'type'])
  @Convert(doCipherAddConvert)
  async doCipherAdd(ctx: Context) {
    await doCipherAdd(ctx)
  }
}
