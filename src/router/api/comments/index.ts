/**
 * @description: 评论管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import { doCommentAddConvert, doCommentDeleteByIdConvert } from '@/router/controller/comments/convert'
import { doCommentFirstAdd, doCommentSecondAdd } from '@/router/controller/comments/add'
import { doCommentDeleteById } from '@/router/controller/comments/delete'
import {
  doCommentGetOne,
  doCommentFirstGetList,
  doCommentSecondGetList
} from '@/router/controller/comments/get'

@Prefix('comment')
export default class API {
  // 1 评论新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['targetId', 'content', 'type'])
  @Convert(doCommentAddConvert)
  async doCommentAdd(ctx: Context) {
    if (ctx._params.type === '501') {
      // 新增第二级别评论
      await doCommentSecondAdd(ctx)
    } else {
      // 新增第一级别评论
      await doCommentFirstAdd(ctx)
    }
  }

  // 2 删除自己的某条评论
  @Request({
    path: 'delete/self',
    methods: ['get', 'post']
  })
  @Required(['id'])
  async doCommentDeleteSelf(ctx: Context) {
    ctx._params.userId = ctx._user.id
    await doCommentDeleteById(ctx)
  }

  // 3 删除指定某条评论，不管谁的评论均可删除
  @Request({
    path: 'delete/byid',
    methods: ['get', 'post'],
    terminals: ['pc']
  })
  @Required(['id'])
  @Convert(doCommentDeleteByIdConvert)
  async doCommentDeleteById(ctx: Context) {
    ctx._params.userId = null
    await doCommentDeleteById(ctx)
  }

  // 4 获取指定的某条评论
  @Request({
    path: 'get/one',
    methods: ['get', 'post']
  })
  @Required(['id'])
  async doCommentGetOne(ctx: Context) {
    await doCommentGetOne(ctx)
  }

  // 5 获取评论列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post']
  })
  @Required(['targetId', 'type'])
  async doCommentGetList(ctx: Context) {
    if (ctx._params.type === '501') {
      // 二级评论列表
      await doCommentSecondGetList(ctx)
    } else {
      // 一级评论列表
      await doCommentFirstGetList(ctx)
    }
  }
}
