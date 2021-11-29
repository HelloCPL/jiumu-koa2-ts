/**
 * @author chen
 * @description 小说章节模块
 * @update 2021-10-28 10:46:36
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doNovelChapterAddConvert } from '../../controller/novels-chapter/convert'
import { doNovelChapterAdd } from '../../controller/novels-chapter/add'

@Prefix('novel-chapter')
export default class {
  // 1. 新增章节
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['novelId', 'title', 'content', 'sort'])
  @Convert(doNovelChapterAddConvert)
  async doNovelChapterAdd(ctx: Context, next: Next) {
    await doNovelChapterAdd(ctx, next)
  }
}

