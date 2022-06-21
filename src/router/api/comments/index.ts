/**
 * @description: 评论管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doCommentAddConvert, doCommentDeleteByIdConvert } from '../../controller/comments/convert'
import { doCommentFirstAdd, doCommentSecondAdd } from '../../controller/comments/add'
import { doCommentDeleteById } from '../../controller/comments/delete'
import { doCommentFirstGetList, doCommentSecondGetList } from '../../controller/comments/get'

@Prefix('comment')
export default class API {
  // 1 评论新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['targetId', 'content', 'type'])
  @Convert(doCommentAddConvert)
  async doCommentAdd(ctx: Context, next: Next) {
    if (ctx._params.type == '501') {
      // 新增第二级别评论
      await doCommentSecondAdd(ctx, next)
    } else {
      // 新增第一级别评论
      await doCommentFirstAdd(ctx, next)
    }
  }

  // 2 删除自己的某条评论
  @Request({
    path: 'delete/self',
    methods: ['get', 'post']
  })
  @Required(['id'])
  async doCommentDeleteSelf(ctx: Context, next: Next) {
    ctx._params.userId = ctx._user.id
    await doCommentDeleteById(ctx, next)
  }

  // 3 删除指定某条评论，不管谁的评论均可删除
  @Request({
    path: 'delete/byid',
    methods: ['get', 'post'],
    terminals: ['pc']
  })
  @Required(['id'])
  @Convert(doCommentDeleteByIdConvert)
  async doCommentDeleteById(ctx: Context, next: Next) {
    ctx._params.userId = null
    await doCommentDeleteById(ctx, next)
  }

  // 4 获取评论列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post']
  })
  @Required(['targetId', 'type'])
  async doCommentGetList(ctx: Context, next: Next) {
    if (ctx._params.targetId === 'answer')
      ctx._params.targetId = null
    ctx._params.userId = null
    if (ctx._params.type == '501') {
      // 二级评论列表
      await doCommentSecondGetList(ctx, next)
    } else {
      // 一级评论列表
      await doCommentFirstGetList(ctx, next)
    }
  }

  // 5 获取我的问答列表
  // @Request({
  //   path: 'get/answer/list/self',
  //   methods: ['get', 'post']
  // })
  // async doCommentGetAnswerListSelf(ctx: Context, next: Next) {
  //   // 一级评论列表
  //   ctx._params.targetId = 'answer'
  //   ctx._params.userId = ctx._user.id
  //   ctx._params.type = '502'
  //   await doCommentFirstGetList(ctx, next)
  // }

  // 6 获取所有的问答列表
  // @Request({
  //   path: 'get/answer/list',
  //   methods: ['get', 'post']
  // })
  // async doCommentGetAnswerList(ctx: Context, next: Next) {
  //   ctx._params.targetId = 'answer'
  //   ctx._params.userId = null
  //   ctx._params.type = '502'
  //   // 一级评论列表
  //   await doCommentFirstGetList(ctx, next)
  // }

}
