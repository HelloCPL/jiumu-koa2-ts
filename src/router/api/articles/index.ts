/**
 * @description: 博客文章管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doArticleAddConvert } from '../../controller/articles/convert'
import { doArticleAdd } from '../../controller/articles/add'


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

}