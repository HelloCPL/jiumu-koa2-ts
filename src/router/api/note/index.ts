/**
 * @author chen
 * @description 笔记模块
 * @update 2022-03-20 15:20:36
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import { doNoteDeleteConvert } from '@/router/controller/note/convert'
import { doNoteAdd } from '@/router/controller/note/add'
import { doNoteUpdate } from '@/router/controller/note/update'
import { doNoteDelete } from '@/router/controller/note/delete'
import { doNoteGetList, doNoteGetOne } from '@/router/controller/note/get'

@Prefix('note')
export default class API {
  // 1 笔记新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required([
    'content',
    { field: 'title', name: 'isLength', options: [{ min: 1, max: 64 }] },
    { field: 'rootId', name: 'isLength', options: [{ min: 32 }] },
    { field: 'targetId', name: 'isLength', options: [{ min: 32 }] },
    { field: 'isSecret', required: false, name: 'isIn', options: [['0', '1']] },
    { field: 'sort', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'remarks', required: false, name: 'isLength', options: [{ max: 255 }] }
  ])
  async doNoteAdd(ctx: Context) {
    await doNoteAdd(ctx)
  }

  // 2 笔记修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required([
    'id',
    { field: 'title', required: false, name: 'isLength', options: [{ min: 1, max: 64 }] },
    { field: 'targetId', required: false, name: 'isLength', options: [{ min: 32 }] },
    { field: 'isSecret', required: false, name: 'isIn', options: [['0', '1']] },
    { field: 'sort', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'remarks', required: false, name: 'isLength', options: [{ max: 255 }] }
  ])
  async doNoteUpdate(ctx: Context) {
    await doNoteUpdate(ctx)
  }

  // 3 笔记删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doNoteDeleteConvert)
  async doNoteDelete(ctx: Context) {
    await doNoteDelete(ctx)
  }

  // 4 获取指定的某个笔记
  @Request({
    path: 'get/one',
    methods: ['get', 'post']
  })
  @Required(['id'])
  async doNoteGetOne(ctx: Context) {
    await doNoteGetOne(ctx)
  }

  // 5 获取指定目标所有的笔记列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post']
  })
  @Required([
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doNoteGetList(ctx: Context) {
    await doNoteGetList(ctx)
  }
}
