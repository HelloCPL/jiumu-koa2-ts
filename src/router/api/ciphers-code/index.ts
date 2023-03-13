/**
 * @description 个人密码的秘钥code 模块
 * @author cpl
 * @create 2023-03-13 17:00:55
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import { doCipherCodeAddConvert } from '@/router/controller/ciphers-code/convert'

@Prefix('cipher-code')
export default class API {
  // 1 秘钥code新增
  @Request({
    path: 'add',
    methods: ['post']
  })
  @Required(['code'])
  @Convert(doCipherCodeAddConvert)
  async doCipherCodeAdd(ctx: Context) {
    // await doCipherCodeAdd(ctx)
  }

  // 2 秘钥code修改
  @Request({
    path: 'update',
    methods: ['post']
  })
  @Required(['id', 'code'])
  // @Convert(doCipherCodeUpdateConvert)
  async doCipherCodeUpdate(ctx: Context) {
    // await doCipherCodeUpdate(ctx)
  }

  // 3 查看秘钥code是否存在
  @Request({
    path: 'check',
    methods: ['post']
  })
  async doCipherCodeCheck(ctx: Context) {
    // await doCipherCodeCheck(ctx)
  }
}
