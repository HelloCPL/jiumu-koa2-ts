/**
 * @description: 收藏管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import { doCollectionAddConvert, doCollectionDeleteConvert } from '@/router/controller/collections/convert'
import { doCollectionAdd } from '@/router/controller/collections/add'
import { doCollectionDelete } from '@/router/controller/collections/delete'
import { doCollectionGetListSelf, doCollectionGetList } from '@/router/controller/collections/get'

@Prefix('collection')
export default class API {
  // 1 新增收藏
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['targetId', 'type'])
  @Convert(doCollectionAddConvert)
  async doCollectionAdd(ctx: Context, next: Next) {
    await doCollectionAdd(ctx, next)
  }

  // 2 删除收藏
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['targetId'])
  @Convert(doCollectionDeleteConvert)
  async doCollectionDelete(ctx: Context, next: Next) {
    await doCollectionDelete(ctx, next)
  }

  // 3 获取本用户的收藏列表
  @Request({
    path: 'get/list/self',
    methods: ['get', 'post']
  })
  async doCollectionGetListSelf(ctx: Context, next: Next) {
    await doCollectionGetListSelf(ctx, next)
  }

  // 4 根据 userId 获取收藏列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post']
  })
  @Required(['userId'])
  async doCollectionGetList(ctx: Context, next: Next) {
    await doCollectionGetList(ctx, next)
  }
}
