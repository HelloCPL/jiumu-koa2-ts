/**
 * @author chen
 * @description 小说章节模块
 * @update 2021-10-28 10:46:36
 */

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import {
  doNovelChapterAddConvert,
  doNovelChapterUpdateConvert,
  doNovelChapterDeleteConvert
} from '@/router/controller/novels-chapter/convert'
import { doNovelChapterAdd } from '@/router/controller/novels-chapter/add'
import { doNovelChapterUpdate } from '@/router/controller/novels-chapter/update'
import { doNovelChapterDelete } from '@/router/controller/novels-chapter/delete'
import { doNovelChapterGetOne, doNovelChapterGetList } from '@/router/controller/novels-chapter/get'

@Prefix('novel-chapter')
export default class API {
  // 1. 新增章节
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['novelId', 'title', 'content', 'sort', 'isDraft'])
  @Convert(doNovelChapterAddConvert)
  async doNovelChapterAdd(ctx: Context, next: Next) {
    await doNovelChapterAdd(ctx, next)
  }

  // 2. 章节修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doNovelChapterUpdateConvert)
  async doNovelChapterUpdate(ctx: Context, next: Next) {
    await doNovelChapterUpdate(ctx, next)
  }

  // 3. 章节删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doNovelChapterDeleteConvert)
  async doNovelChapterDelete(ctx: Context, next: Next) {
    await doNovelChapterDelete(ctx, next)
  }

  // 4. 获取指定的小说章节
  @Request({
    path: 'get/one',
    methods: ['get', 'post']
  })
  @Required(['id'])
  async doNovelChapterGetOne(ctx: Context, next: Next) {
    await doNovelChapterGetOne(ctx, next)
  }

  // 5. 获取指定小说所有的章节列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post']
  })
  @Required(['novelId'])
  async doNovelChapterGetList(ctx: Context, next: Next) {
    await doNovelChapterGetList(ctx, next)
  }
}
