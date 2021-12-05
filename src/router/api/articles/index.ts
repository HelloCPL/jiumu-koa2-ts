/**
 * @description: 博客文章管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doArticleAddConvert, doArticleUpdateConvert, doArticleDeleteConvert } from '../../controller/articles/convert'
import { doArticleAdd } from '../../controller/articles/add'
import { doArticleUpdate } from '../../controller/articles/update'
import { doArticleDelete } from '../../controller/articles/delete'
import { doArticleGetOne, doArticleGetList } from '../../controller/articles/get'


@Prefix('article')
export default class API {
  // 1 博客文章新增
  @Request({
    path: 'add',
    methods: ['get', 'post'],
  })
  @Required(['title', 'content', 'contentType', 'type', 'isDraft'])
  @Convert(doArticleAddConvert)
  async doArticleAdd(ctx: Context, next: Next) {
    await doArticleAdd(ctx, next)
  }

  // 2 博客文章修改
  @Request({
    path: 'update',
    methods: ['get', 'post'],
  })
  @Required(['id'])
  @Convert(doArticleUpdateConvert)
  async doArticleUpdate(ctx: Context, next: Next) {
    await doArticleUpdate(ctx, next)
  }

  // 3 博客文章删除
  @Request({
    path: 'delete',
    methods: ['get', 'post'],
  })
  @Required(['id'])
  @Convert(doArticleDeleteConvert)
  async doArticleDelete(ctx: Context, next: Next) {
    await doArticleDelete(ctx, next)
  }

  // 4 获取指定的博客文章
  @Request({
    path: 'get/one',
    methods: ['get', 'post'],
  })
  @Required(['id'])
  async doArticleGetOne(ctx: Context, next: Next) {
    await doArticleGetOne(ctx, next)
  }

  // 5 获取自己的博客文章列表
  @Request({
    path: 'get/list/self',
    methods: ['get', 'post'],
  })
  async doArticleGetListSelf(ctx: Context, next: Next) {
    ctx.params.userId = ctx.user.id
    await doArticleGetList(ctx, next)
  }

  // 6 获取指定用户非草稿的博客文章列表
  @Request({
    path: 'get/list/byuserid',
    methods: ['get', 'post'],
  })
  @Required(['userId'])
  async doArticleGetListByUserId(ctx: Context, next: Next) {
    ctx.params.isDraft = '0'
    await doArticleGetList(ctx, next)
  }

  // 7 获取所有非草稿的博客文章列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post'],
  })
  async doArticleGetList(ctx: Context, next: Next) {
    ctx.params.userId = null
    ctx.params.isDraft = '0'
    await doArticleGetList(ctx, next)
  }
}