/**
 * @description: 标签管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import { doTagAddConvert, doTagUpdateConvert, doTagDeleteConvert } from '@/router/controller/tags/convert'
import { doTagAdd } from '@/router/controller/tags/add'
import { doTagUpdate } from '@/router/controller/tags/update'
import { doTagDelete } from '@/router/controller/tags/delete'
import { doTagGetByCode, doTagGetAllSelf, doTagGetByParentCode } from '@/router/controller/tags/get'
import { doTagExport } from '@/router/controller/tags/exports'
import { doTagImport } from '@/router/controller/tags/imports'

@Prefix('tag')
export default class API {
  // 1 标签新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['code', 'label'])
  @Convert(doTagAddConvert)
  async doTagAdd(ctx: Context) {
    await doTagAdd(ctx)
  }

  // 2 标签修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doTagUpdateConvert)
  async doTagUpdate(ctx: Context) {
    await doTagUpdate(ctx)
  }

  // 3 标签删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doTagDeleteConvert)
  async doTagDelete(ctx: Context) {
    await doTagDelete(ctx)
  }

  // 4 获取指定的某个标签
  @Request({
    path: 'get/bycode',
    methods: ['get', 'post']
  })
  @Required(['code'])
  async doTagGetByCode(ctx: Context) {
    await doTagGetByCode(ctx)
  }

  // 5 获取我的所有标签
  @Request({
    path: 'get/all/self',
    methods: ['get', 'post']
  })
  async doTagGetAllSelf(ctx: Context) {
    await doTagGetAllSelf(ctx)
  }

  // 6 获取某类标签
  @Request({
    path: 'get/byparentcode',
    methods: ['get', 'post']
  })
  async doTagGetByParentCode(ctx: Context) {
    await doTagGetByParentCode(ctx)
  }

  // 7 导出标签数据
  @Request({
    path: 'export',
    methods: ['get', 'post']
  })
  @Required(['ids'])
  async doTagExport(ctx: Context) {
    await doTagExport(ctx)
  }

  // 8 导入标签数据
  @Request({
    path: 'import',
    methods: ['post']
  })
  async doTagImport(ctx: Context) {
    await doTagImport(ctx)
  }
}
