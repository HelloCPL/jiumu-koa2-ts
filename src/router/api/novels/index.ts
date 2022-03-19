/**
 * @description: 小说管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doNovelAddConvert, doNovelUpdateConvert, doNovelDeleteConvert } from '../../controller/novels/convert'
import { doNovelAdd } from '../../controller/novels/add'
import { doNovelUpdate } from '../../controller/novels/update'
import { doNovelDelete } from '../../controller/novels/delete'
import { doNovelGetOne, doNovelGetList } from '../../controller/novels/get'

@Prefix('novel')
export default class API {
  // 1 小说新增
  @Request({
    path: 'add',
    methods: ['get', 'post'],
  })
  @Required(['name', 'introduce', 'author', 'isDraft'])
  @Convert(doNovelAddConvert)
  async doNovelAdd(ctx: Context, next: Next) {
    await doNovelAdd(ctx, next)
  }

  // 2 小说编辑
  @Request({
    path: 'update',
    methods: ['get', 'post'],
  })
  @Required(['id'])
  @Convert(doNovelUpdateConvert)
  async doNovelUpdate(ctx: Context, next: Next) {
    await doNovelUpdate(ctx, next)
  }

  // 3 小说删除
  @Request({
    path: 'delete',
    methods: ['get', 'post'],
  })
  @Required(['id'])
  @Convert(doNovelDeleteConvert)
  async doNovelDelete(ctx: Context, next: Next) {
    await doNovelDelete(ctx, next)
  }

  // 4 获取指定的小说
  @Request({
    path: 'get/one',
    methods: ['get', 'post'],
  })
  @Required(['id'])
  async doNovelGetOne(ctx: Context, next: Next) {
    await doNovelGetOne(ctx, next)
  }

  // 5 获取自己的小说列表
  @Request({
    path: 'get/list/self',
    methods: ['get', 'post'],
  })
  async doNovelGetListSelf(ctx: Context, next: Next) {
    ctx.params.userId = ctx.user.id
    await doNovelGetList(ctx, next)
  }

  // 6 获取指定用户所有非草稿且公开的小说列表
  @Request({
    path: 'get/list/byuserid',
    methods: ['get', 'post'],
  })
  @Required(['userId'])
  async doNovelGetListByUserId(ctx: Context, next: Next) {
    ctx.params.isDraft = '0'
    ctx.params.isSecret = '0'
    await doNovelGetList(ctx, next)
  }

  // 7 获取所有的非草稿且公开小说列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post'],
  })
  async doNovelGetList(ctx: Context, next: Next) {
    ctx.params.userId = null
    ctx.params.isDraft = '0'
    ctx.params.isSecret = '0'
    await doNovelGetList(ctx, next)
  }
}
