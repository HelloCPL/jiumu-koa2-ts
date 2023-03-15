/**
 * @description 口令模块
 * @author cpl
 * @create 2023-03-13 15:33:21
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import {
  doCipherAddConvert,
  doCipherDeleteConvert,
  doCipherUpdateConvert
} from '@/router/controller/ciphers/convert'
import { doCipherAdd } from '@/router/controller/ciphers/add'
import { doCipherUpdate } from '@/router/controller/ciphers/update'
import { doCipherDelete } from '@/router/controller/ciphers/delete'
import { doCipherGetListSelf, doCipherGetOneSelf } from '@/router/controller/ciphers/get'

@Prefix('cipher')
export default class API {
  // 1 口令新增
  @Request({
    path: 'add',
    methods: ['post']
  })
  @Required(['title', 'account', 'cipher', 'type'])
  @Convert(doCipherAddConvert)
  async doCipherAdd(ctx: Context) {
    await doCipherAdd(ctx)
  }

  // 2 口令修改
  @Request({
    path: 'update',
    methods: ['post']
  })
  @Required(['id'])
  @Convert(doCipherDeleteConvert, doCipherUpdateConvert)
  async doCipherUpdate(ctx: Context) {
    await doCipherUpdate(ctx)
  }

  // 3 口令删除
  @Request({
    path: 'delete',
    methods: ['post']
  })
  @Required(['id'])
  @Convert(doCipherDeleteConvert)
  async doCipherDelete(ctx: Context) {
    await doCipherDelete(ctx)
  }

  // 4 获取本人的某个口令
  @Request({
    path: 'get/one/self',
    methods: ['post']
  })
  @Required(['id'])
  async doCipherGetOneSelf(ctx: Context) {
    await doCipherGetOneSelf(ctx)
  }

  // 5 获取本人的口令列表
  @Request({
    path: 'get/list/self',
    methods: ['post']
  })
  async doCipherGetListSelf(ctx: Context) {
    await doCipherGetListSelf(ctx)
  }
}
