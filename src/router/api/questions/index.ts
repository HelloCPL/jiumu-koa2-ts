/**
 * @description: 问答管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import { doQuestionUpdateConvert, doQuestionDeleteConvert } from '@/router/controller/questions/convert'
import { doQuestionAdd } from '@/router/controller/questions/add'
import { doQuestionUpdate } from '@/router/controller/questions/update'
import { doQuestionDelete } from '@/router/controller/questions/delete'
import { doQuestionGetOne, doQuestionGetList } from '@/router/controller/questions/get'

@Prefix('question')
export default class API {
  // 1 问答新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['title', 'content', 'isDraft'])
  async doQuestionAdd(ctx: Context, next: Next) {
    await doQuestionAdd(ctx, next)
  }

  // 2 问答修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doQuestionUpdateConvert)
  async doQuestionUpdate(ctx: Context, next: Next) {
    await doQuestionUpdate(ctx, next)
  }

  // 3 问答删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doQuestionDeleteConvert)
  async doQuestionDelete(ctx: Context, next: Next) {
    await doQuestionDelete(ctx, next)
  }

  // 4 获取指定的问答
  @Request({
    path: 'get/one',
    methods: ['get', 'post']
  })
  @Required(['id'])
  async doQuestionGetOne(ctx: Context, next: Next) {
    await doQuestionGetOne(ctx, next)
  }

  // 5 获取自己的问答列表
  @Request({
    path: 'get/list/self',
    methods: ['get', 'post']
  })
  async doQuestionGetListSelf(ctx: Context, next: Next) {
    ctx._params.userId = ctx._user.id
    await doQuestionGetList(ctx, next)
  }

  // 6 获取指定用户非草稿且公开的问答列表
  @Request({
    path: 'get/list/byuserid',
    methods: ['get', 'post']
  })
  @Required(['userId'])
  async doQuestionGetListByUserId(ctx: Context, next: Next) {
    ctx._params.isDraft = '0'
    ctx._params.isSecret = '0'
    await doQuestionGetList(ctx, next)
  }

  // 7 获取所有非草稿且公开问答列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post']
  })
  async doQuestionGetList(ctx: Context, next: Next) {
    ctx._params.userId = null
    ctx._params.classify = null
    ctx._params.isDraft = '0'
    ctx._params.isSecret = '0'
    await doQuestionGetList(ctx, next)
  }
}
