/**
 * @description: 点赞管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import { doLikeAddConvert, doLikeDeleteConvert } from '@/router/controller/likes/convert'
import { doLikeAdd } from '@/router/controller/likes/add'
import { doLikeDelete } from '@/router/controller/likes/delete'
import { doLikeGetOne, doLikeGetListSelf, doLikeGetList } from '@/router/controller/likes/get'

@Prefix('like')
export default class API {
  // 1 新增点赞
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['targetId', 'type'])
  @Convert(doLikeAddConvert)
  async doLieAdd(ctx: Context) {
    await doLikeAdd(ctx)
  }

  // 2 删除点赞
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['targetId'])
  @Convert(doLikeDeleteConvert)
  async doLikeDelete(ctx: Context) {
    await doLikeDelete(ctx)
  }

  // 3 获取指定的一个点赞
  @Request({
    path: 'get/one',
    methods: ['get', 'post']
  })
  @Required(['id'])
  async doLikeGetOne(ctx: Context) {
    await doLikeGetOne(ctx)
  }

  // 4 获取本用户的点赞列表
  @Request({
    path: 'get/list/self',
    methods: ['get', 'post']
  })
  async doLikeGetListSelf(ctx: Context) {
    await doLikeGetListSelf(ctx)
  }

  // 5 根据 userId 获取点赞列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post']
  })
  @Required(['userId'])
  async doLikeGetList(ctx: Context) {
    await doLikeGetList(ctx)
  }
}
