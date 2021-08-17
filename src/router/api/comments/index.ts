/**
 * @description: 评论管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doCommentAddConvert } from '../../controller/comments/convert'
import { doCommentFirstAdd, doCommentSecondAdd } from '../../controller/comments/add'
import { doCommentDeleteSelf, doCommentDeleteById } from '../../controller/comments/delete'
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
    if (ctx.params.type == '501') {
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
    await doCommentDeleteSelf(ctx, next)
  }

  // 3 删除指定某条评论，不管谁的评论均可删除
  @Request({
    path: 'delete/byid',
    methods: ['get', 'post'],
    terminals: ['pc']
  })
  @Required(['id'])
  async doCommentDeleteById(ctx: Context, next: Next) {
    await doCommentDeleteById(ctx, next)
  }

  // 4 获取评论列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post']
  })
  @Required(['targetId', 'type'])
  async doCommentGetList(ctx: Context, next: Next) {
    if (ctx.params.type == '501') {
      // 二级评论列表
      await doCommentSecondGetList(ctx, next)
    } else {
      // 一级评论列表
      await doCommentFirstGetList(ctx, next)
    }
  }

}
