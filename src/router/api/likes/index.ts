/**
 * @description: 点赞管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doLikeAddConvert, doLikeDeleteConvert } from '../../controller/likes/convert'
import { doLikeAdd } from '../../controller/likes/add'
import { doLikeDelete } from '../../controller/likes/delete'
import { doLikeGetListSelf, doLikeGetList } from '../../controller/likes/get'

@Prefix('like')
export default class API {
  // 1 新增点赞
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['targetId', 'type'])
  @Convert(doLikeAddConvert)
  async doLieAdd(ctx: Context, next: Next) {
    await doLikeAdd(ctx, next)
  }

  // 2 删除点赞
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['targetId'])
  @Convert(doLikeDeleteConvert)
  async doLikeDelete(ctx: Context, next: Next) {
    await doLikeDelete(ctx, next)
  }

  // 3 获取本用户的点赞列表
  @Request({
    path: 'get/list/self',
    methods: ['get', 'post']
  })
  async doLikeGetListSelf(ctx: Context, next: Next) {
    await doLikeGetListSelf(ctx, next)
  }

  // 4 根据 userId 获取点赞列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post']
  })
  @Required(['userId'])
  async doLikeGetList(ctx: Context, next: Next) {
    await doLikeGetList(ctx, next)
  }

}

