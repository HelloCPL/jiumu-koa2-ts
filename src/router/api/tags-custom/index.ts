/**
 * @description: 用户自定义标签管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doTagCustomAddConvert, doTagCustomUpdateConvert } from '../../controller/tags-custom/convert'
import { doTagCustomAdd } from '../../controller/tags-custom/add'
import { doTagCustomUpdate } from '../../controller/tags-custom/update'
import { doTagCustomDelete } from '../../controller/tags-custom/delete'
import { doTagCustomGetIds, doTagCustomGetList } from '../../controller/tags-custom/get'

@Prefix('tag/custom')
export default class API {
  // 1 用户自定义标签新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['label'])
  @Convert(doTagCustomAddConvert)
  async doTagCustomAdd(ctx: Context, next: Next) {
    await doTagCustomAdd(ctx, next)
  }

  // 2 用户自定义标签修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doTagCustomUpdateConvert)
  async doTagCustomUpdate(ctx: Context, next: Next) {
    await doTagCustomUpdate(ctx, next)
  }

  // 3 用户自定义标签删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doTagCustomUpdateConvert)
  async doTagCustomDelete(ctx: Context, next: Next) {
    await doTagCustomDelete(ctx, next)
  }

  // 4 获取指定用户自定义标签
  @Request({
    path: 'get/byids',
    methods: ['get', 'post']
  })
  @Required(['ids'])
  async doTagCustomGetIds(ctx: Context, next: Next) {
    await doTagCustomGetIds(ctx, next)
  }

  // 5 获取指定用户自定义标签列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post']
  })
  async doTagCustomGetList(ctx: Context, next: Next) {
    await doTagCustomGetList(ctx, next)
  }
}