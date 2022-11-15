/**
 * @description: 收藏管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context } from 'koa'
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
  async doCollectionAdd(ctx: Context) {
    await doCollectionAdd(ctx)
  }

  // 2 删除收藏
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['targetId'])
  @Convert(doCollectionDeleteConvert)
  async doCollectionDelete(ctx: Context) {
    await doCollectionDelete(ctx)
  }

  // 3 获取本用户的收藏列表
  @Request({
    path: 'get/list/self',
    methods: ['get', 'post']
  })
  async doCollectionGetListSelf(ctx: Context) {
    await doCollectionGetListSelf(ctx)
  }

  // 4 根据 userId 获取收藏列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post']
  })
  @Required(['userId'])
  async doCollectionGetList(ctx: Context) {
    await doCollectionGetList(ctx)
  }
}
