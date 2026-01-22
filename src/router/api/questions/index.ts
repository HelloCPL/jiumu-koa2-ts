/**
 * @description: 问答管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import { doQuestionDeleteConvert } from '@/router/controller/questions/convert'
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
  @Required([
    'title',
    'content',
    { field: 'isDraft', name: 'isIn', options: [['0', '1']] },
    { field: 'isSecret', required: false, name: 'isIn', options: [['0', '1']] },
    { field: 'sort', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doQuestionAdd(ctx: Context) {
    await doQuestionAdd(ctx)
  }

  // 2 问答修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required([
    'id',
    { field: 'isDraft', required: false, name: 'isIn', options: [['0', '1']] },
    { field: 'isSecret', required: false, name: 'isIn', options: [['0', '1']] },
    { field: 'sort', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  @Convert(doQuestionDeleteConvert)
  async doQuestionUpdate(ctx: Context) {
    await doQuestionUpdate(ctx)
  }

  // 3 问答删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doQuestionDeleteConvert)
  async doQuestionDelete(ctx: Context) {
    await doQuestionDelete(ctx)
  }

  // 4 获取指定的问答
  @Request({
    path: 'get/one',
    methods: ['get', 'post'],
    unless: true
  })
  @Required(['id'])
  async doQuestionGetOne(ctx: Context) {
    await doQuestionGetOne(ctx)
  }

  // 5 获取自己的问答列表
  @Request({
    path: 'get/list/self',
    methods: ['get', 'post']
  })
  async doQuestionGetListSelf(ctx: Context) {
    ctx._params.userId = ctx._user.id
    await doQuestionGetList(ctx)
  }

  // 6 获取指定用户非草稿且公开的问答列表
  @Request({
    path: 'get/list/byuserid',
    methods: ['get', 'post'],
    unless: true
  })
  @Required(['userId'])
  async doQuestionGetListByUserId(ctx: Context) {
    ctx._params.isDraft = '0'
    ctx._params.isSecret = '0'
    await doQuestionGetList(ctx)
  }

  // 7 获取所有非草稿且公开问答列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post'],
    unless: true
  })
  async doQuestionGetList(ctx: Context) {
    ctx._params.userId = null
    ctx._params.classify = null
    ctx._params.isDraft = '0'
    ctx._params.isSecret = '0'
    await doQuestionGetList(ctx)
  }
}
