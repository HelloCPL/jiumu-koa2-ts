/**
 * @author chen
 * @description 笔记模块
 * @update 2022-03-20 15:20:36
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import {
  doNovelNoteAddConvert,
  doNovelNoteUpdateConvert,
  doNovelNoteDeleteConvert
} from '@/router/controller/novels-note/convert'
import { doNovelNoteAdd } from '@/router/controller/novels-note/add'
import { doNovelNoteUpdate } from '@/router/controller/novels-note/update'
import { doNovelNoteDelete } from '@/router/controller/novels-note/delete'
import { getNovelNoteGetOne, doNovelNoteGetList } from '@/router/controller/novels-note/get'

@Prefix('novel-note')
export default class API {
  // 1 笔记新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['target', 'content'])
  @Convert(doNovelNoteAddConvert)
  async doNovelNoteAdd(ctx: Context) {
    await doNovelNoteAdd(ctx)
  }

  // 2 笔记修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doNovelNoteUpdateConvert)
  async doNovelNoteUpdate(ctx: Context) {
    await doNovelNoteUpdate(ctx)
  }

  // 3 笔记删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doNovelNoteDeleteConvert)
  async doNovelNoteDelete(ctx: Context) {
    await doNovelNoteDelete(ctx)
  }

  // 4 获取指定的某个笔记
  @Request({
    path: 'get/one',
    methods: ['get', 'post']
  })
  @Required(['id'])
  async getNovelNoteGetOne(ctx: Context) {
    await getNovelNoteGetOne(ctx)
  }

  // 5 获取指定目标所有的笔记列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post']
  })
  @Required(['targetId&30'])
  async doNovelNoteGetList(ctx: Context) {
    console.log(ctx)
    console.log(ctx.data)
    console.log(ctx._params)
    await doNovelNoteGetList(ctx)
  }
}
