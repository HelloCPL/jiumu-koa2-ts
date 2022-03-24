/**
 * @author chen
 * @description 笔记模块
 * @update 2022-03-20 15:20:36
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doNovelNoteAddConvert, doNovelNoteUpdateConvert, doNovelNoteDeleteConvert } from '../../controller/novels-note/convert'
import { doNovelNoteAdd } from '../../controller/novels-note/add'
import { doNovelNoteUpdate } from '../../controller/novels-note/update'
import { doNovelNoteDelete } from '../../controller/novels-note/delete'
import { doNovelNoteGetOne, doNovelNoteGetList } from '../../controller/novels-note/get'

@Prefix('novel-note')
export default class API {
  // 1 笔记新增
  @Request({
    path: 'add',
    methods: ['get', 'post'],
  })
  @Required(['targetIds', 'type', 'content'])
  @Convert(doNovelNoteAddConvert)
  async doNovelNoteAdd(ctx: Context, next: Next) {
    await doNovelNoteAdd(ctx, next)
  }

  // 2 笔记修改
  @Request({
    path: 'update',
    methods: ['get', 'post'],
  })
  @Required(['id'])
  @Convert(doNovelNoteUpdateConvert)
  async doNovelNoteUpdate(ctx: Context, next: Next) {
    await doNovelNoteUpdate(ctx, next)
  }

  // 3 笔记删除
  @Request({
    path: 'delete',
    methods: ['get', 'post'],
  })
  @Required(['id'])
  @Convert(doNovelNoteDeleteConvert)
  async doNovelNoteDelete(ctx: Context, next: Next) {
    await doNovelNoteDelete(ctx, next)
  }

  // 4 获取指定的某个笔记
  @Request({
    path: 'get/one',
    methods: ['get', 'post'],
  })
  @Required(['id'])
  async doNovelNoteGetOne(ctx: Context, next: Next) {
    await doNovelNoteGetOne(ctx, next)
  }

  // 5 获取指定目标所有的笔记列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post'],
  })
  @Required(['targetId&30'])
  async doNovelNoteGetList(ctx: Context, next: Next) {
    await doNovelNoteGetList(ctx, next)
  }
}