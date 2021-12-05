/**
 * @description: 标签管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doTagAddConvert, doTagUpdateConvert, doTagDeleteConvert } from '../../controller/tags/convert'
import { doTagAdd } from '../../controller/tags/add'
import { doTagUpdate } from '../../controller/tags/update'
import { doTagDelete } from '../../controller/tags/delete'
import { doTagGetByCode, doTagGetAllSelf, doTagGetByParentCode } from '../../controller/tags/get'

@Prefix('tag')
export default class API {
  // 1 标签新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['code', 'label'])
  @Convert(doTagAddConvert)
  async doTagAdd(ctx: Context, next: Next) {
    await doTagAdd(ctx, next)
  }

  // 2 标签修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doTagUpdateConvert)
  async doTagUpdate(ctx: Context, next: Next) {
    await doTagUpdate(ctx, next)
  }

  // 3 标签删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doTagDeleteConvert)
  async doTagDelete(ctx: Context, next: Next) {
    await doTagDelete(ctx, next)
  }

  // 4 获取指定的某个标签
  @Request({
    path: 'get/bycode',
    methods: ['get', 'post']
  })
  @Required(['code'])
  async doTagGetByCode(ctx: Context, next: Next) {
    await doTagGetByCode(ctx, next)
  }

  // 5 获取我的所有标签
  @Request({
    path: 'get/all/self',
    methods: ['get', 'post']
  })
  async doTagGetAllSelf(ctx: Context, next: Next) {
    await doTagGetAllSelf(ctx, next)
  }

  // 6 获取某类标签
  @Request({
    path: 'get/byparentcode',
    methods: ['get', 'post']
  })
  async doTagGetByParentCode(ctx: Context, next: Next) {
    await doTagGetByParentCode(ctx, next)
  }
}
