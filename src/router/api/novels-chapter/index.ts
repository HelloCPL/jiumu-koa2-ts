/**
 * @author chen
 * @description 小说章节模块
 * @update 2021-10-28 10:46:36
 */

import { Context } from 'koa'
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
import { doNovelChapterGetMaxSort } from '@/router/controller/novels-chapter/max-sort'

@Prefix('novel-chapter')
export default class API {
  // 1. 新增章节
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required([
    'novelId',
    { field: 'title', name: 'isLength', options: [{ min: 1, max: 64 }] },
    'content',
    { field: 'isDraft', name: 'isIn', options: [['0', '1']] },
    { field: 'sort', name: 'isInt', options: [{ min: 1 }] },
    { field: 'isSecret', required: false, name: 'isIn', options: [['0', '1']] },
    { field: 'remarks', required: false, name: 'isLength', options: [{ max: 255 }] }
  ])
  @Convert(doNovelChapterAddConvert)
  async doNovelChapterAdd(ctx: Context) {
    await doNovelChapterAdd(ctx)
  }

  // 2. 章节修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required([
    'id',
    { field: 'title', required: false, name: 'isLength', options: [{ min: 1, max: 64 }] },
    { field: 'isDraft', required: false, name: 'isIn', options: [['0', '1']] },
    { field: 'isSecret', required: false, name: 'isIn', options: [['0', '1']] },
    { field: 'sort', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'remarks', required: false, name: 'isLength', options: [{ max: 255 }] }
  ])
  @Convert(doNovelChapterUpdateConvert)
  async doNovelChapterUpdate(ctx: Context) {
    await doNovelChapterUpdate(ctx)
  }

  // 3. 章节删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doNovelChapterDeleteConvert)
  async doNovelChapterDelete(ctx: Context) {
    await doNovelChapterDelete(ctx)
  }

  // 4. 获取指定的小说章节
  @Request({
    path: 'get/one',
    methods: ['get', 'post'],
    unless: true
  })
  @Required(['id'])
  async doNovelChapterGetOne(ctx: Context) {
    await doNovelChapterGetOne(ctx)
  }

  // 5. 获取指定小说所有的章节列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post'],
    unless: true
  })
  @Required([
    'novelId',
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doNovelChapterGetList(ctx: Context) {
    await doNovelChapterGetList(ctx)
  }

  // 6. 查找指定小说的最大章节排序号
  @Request({
    path: 'get/max-sort',
    methods: ['get', 'post']
  })
  @Required(['novelId'])
  async doNovelChapterGetListMaxSort(ctx: Context) {
    await doNovelChapterGetMaxSort(ctx)
  }
}
