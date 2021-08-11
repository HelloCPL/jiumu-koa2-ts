/**
 * @description: 标签管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doTagAddExist, doTagUpdateNoExist, doTagDeleteHasChild } from '../../controller/tags/convert'
import { doTagAdd } from '../../controller/tags/add'
import { doTagUpdate } from '../../controller/tags/update'
import { doTagDelete } from '../../controller/tags/delete'
import { doTagGetByCode, doTagGetByParentCode } from '../../controller/tags/get'

@Prefix('tag')
export default class API {
  // 1 标签新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['code', 'label'])
  @Convert(doTagAddExist)
  async doTagAdd(ctx: Context, next: Next) {
    await doTagAdd(ctx, next)
  }

  // 2 标签修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doTagUpdateNoExist)
  async doTagUpdate(ctx: Context, next: Next) {
    await doTagUpdate(ctx, next)
  }

  // 3 标签删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doTagDeleteHasChild)
  async doTagDelete(ctx: Context, next: Next) {
    await doTagDelete(ctx, next)
  }

  // 4 获取指定的某个标签
  @Request({
    path: 'get/byCode',
    methods: ['get', 'post']
  })
  @Required(['code'])
  async doTagGetByCode(ctx: Context, next: Next) {
    await doTagGetByCode(ctx, next)
  }

  // 5 获取某类标签
  @Request({
    path: 'get/byParentCode',
    methods: ['get', 'post']
  })
  @Required(['parentCode'])
  async doTagGetByParentCode(ctx: Context, next: Next) {
    await doTagGetByParentCode(ctx, next)
  }
}