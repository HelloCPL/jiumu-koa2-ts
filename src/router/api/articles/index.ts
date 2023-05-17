/**
 * @description: 博客文章管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import {
  doArticleAddConvert,
  doArticleUpdateConvert,
  doArticleDeleteConvert
} from '@/router/controller/articles/convert'
import { doArticleAdd } from '@/router/controller/articles/add'
import { doArticleUpdate } from '@/router/controller/articles/update'
import { doArticleDelete } from '@/router/controller/articles/delete'
import { doArticleGetOne, doArticleGetList } from '@/router/controller/articles/get'

@Prefix('article')
export default class API {
  // 1 博客文章新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['title', 'content', 'contentType', 'type', 'isDraft'])
  @Convert(doArticleAddConvert)
  async doArticleAdd(ctx: Context) {
    await doArticleAdd(ctx)
  }

  // 2 博客文章修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doArticleDeleteConvert, doArticleUpdateConvert)
  async doArticleUpdate(ctx: Context) {
    await doArticleUpdate(ctx)
  }

  // 3 博客文章删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doArticleDeleteConvert)
  async doArticleDelete(ctx: Context) {
    await doArticleDelete(ctx)
  }

  // 4 获取指定的博客文章
  @Request({
    path: 'get/one',
    methods: ['get', 'post']
  })
  @Required(['id'])
  async doArticleGetOne(ctx: Context) {
    await doArticleGetOne(ctx)
  }

  // 5 获取自己的博客文章列表
  @Request({
    path: 'get/list/self',
    methods: ['get', 'post']
  })
  async doArticleGetListSelf(ctx: Context) {
    ctx._params.userId = ctx._user.id
    await doArticleGetList(ctx)
  }

  // 6 获取指定用户非草稿且公开的博客文章列表
  @Request({
    path: 'get/list/byuserid',
    methods: ['get', 'post']
  })
  @Required(['userId'])
  async doArticleGetListByUserId(ctx: Context) {
    ctx._params.isDraft = '0'
    ctx._params.isSecret = '0'
    await doArticleGetList(ctx)
  }

  // 7 获取所有非草稿且公开的博客文章列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post'],
    unless: true
  })
  async doArticleGetList(ctx: Context) {
    ctx._params.userId = null
    ctx._params.classify = null
    ctx._params.isDraft = '0'
    ctx._params.isSecret = '0'
    await doArticleGetList(ctx)
  }
}
