/**
 * @description: 问答管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doQuestionUpdateConvert, doQuestionDeleteConvert } from '../../controller/questions/convert'
import { doQuestionAdd } from '../../controller/questions/add'
import { doQuestionUpdate } from '../../controller/questions/update'
import { doQuestionDelete } from '../../controller/questions/delete'
import { doQuestionGetOne, doQuestionGetList } from '../../controller/questions/get'


@Prefix('question')
export default class API {
  // 1 问答新增
  @Request({
    path: 'add',
    methods: ['get', 'post'],
  })
  @Required(['title', 'content', 'isDraft'])
  async doQuestionAdd(ctx: Context, next: Next) {
    await doQuestionAdd(ctx, next)
  }

  // 2 问答修改
  @Request({
    path: 'update',
    methods: ['get', 'post'],
  })
  @Required(['id'])
  @Convert(doQuestionUpdateConvert)
  async doQuestionUpdate(ctx: Context, next: Next) {
    await doQuestionUpdate(ctx, next)
  }

  // 3 问答删除
  @Request({
    path: 'delete',
    methods: ['get', 'post'],
  })
  @Required(['id'])
  @Convert(doQuestionDeleteConvert)
  async doQuestionDelete(ctx: Context, next: Next) {
    await doQuestionDelete(ctx, next)
  }

  // 4 获取指定的问答
  @Request({
    path: 'get/one',
    methods: ['get', 'post'],
  })
  @Required(['id'])
  async doQuestionGetOne(ctx: Context, next: Next) {
    await doQuestionGetOne(ctx, next)
  }

  // 5 获取自己的问答列表
  @Request({
    path: 'get/list/self',
    methods: ['get', 'post'],
  })
  async doQuestionGetListSelf(ctx: Context, next: Next) {
    ctx.params.userId = ctx.user.id
    await doQuestionGetList(ctx, next)
  }

  // 6 获取指定用户非草稿的问答列表
  @Request({
    path: 'get/list/byuserid',
    methods: ['get', 'post'],
  })
  @Required(['userId'])
  async doQuestionGetListByUserId(ctx: Context, next: Next) {
    ctx.params.isDraft = '0'
    await doQuestionGetList(ctx, next)
  }

  // 7 获取所有问答列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post'],
  })
  async doQuestionGetList(ctx: Context, next: Next) {
    ctx.params.userId = null
    ctx.params.isDraft = '0'
    await doQuestionGetList(ctx, next)
  }
}


