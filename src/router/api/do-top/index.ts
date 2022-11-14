/**
 * @author chen
 * @description 置顶操作
 * @update 2021-12-05 14:53:56
 */

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import { doTopUpdateConvert } from '@/router/controller/do-top/convert'
import { doTopUpdate, doTopUpdateComment } from '@/router/controller/do-top/update'

@Prefix('top')
export default class API {
  // 1 问答、资源文件、小说、博客文章置顶操作
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['id', 'type'])
  @Convert(doTopUpdateConvert)
  async doTopUpdate(ctx: Context, next: Next) {
    ctx._params.isTop = '1'
    await doTopUpdate(ctx, next)
  }

  // 2 问答、资源文件、小说、博客文章取消置顶操作
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id', 'type'])
  @Convert(doTopUpdateConvert)
  async doTopUpdate2(ctx: Context, next: Next) {
    ctx._params.isTop = '0'
    await doTopUpdate(ctx, next)
  }

  // 3 评论置顶操作
  @Request({
    path: 'comment/add',
    methods: ['get', 'post']
  })
  @Required(['id'])
  async doTopUpdateComment(ctx: Context, next: Next) {
    ctx._params.isTop = '1'
    await doTopUpdateComment(ctx, next)
  }

  // 4 评论取消置顶操作
  @Request({
    path: 'comment/delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  async doTopUpdateComment2(ctx: Context, next: Next) {
    ctx._params.isTop = '0'
    await doTopUpdateComment(ctx, next)
  }
}
