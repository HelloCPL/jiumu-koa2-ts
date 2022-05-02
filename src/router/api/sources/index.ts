/**
 * @description: 资源管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doSourceAddConvert, doSourceUpdateConvert, doSourceDeleteConvert } from '../../controller/sources/convert'
import { doSourceAdd } from '../../controller/sources/add'
import { doSourceUpdate } from '../../controller/sources/update'
import { doSourceDelete } from '../../controller/sources/delete'
import { doSourceGetOne, doSourceGetList } from '../../controller/sources/get'

@Prefix('source')
export default class API {
  // 1 资源新增
  @Request({
    path: 'add',
    methods: ['get', 'post'],
  })
  @Required(['title', 'attachment', 'type'])
  @Convert(doSourceAddConvert)
  async doSourceAdd(ctx: Context, next: Next) {
    await doSourceAdd(ctx, next)
  }

  // 2 资源修改
  @Request({
    path: 'update',
    methods: ['get', 'post'],
  })
  @Required(['id'])
  @Convert(doSourceUpdateConvert)
  async doSourceUpdate(ctx: Context, next: Next) {
    await doSourceUpdate(ctx, next)
  }

  // 3 资源删除
  @Request({
    path: 'delete',
    methods: ['get', 'post'],
  })
  @Required(['id'])
  @Convert(doSourceDeleteConvert)
  async doSourceDelete(ctx: Context, next: Next) {
    await doSourceDelete(ctx, next)
  }

  // 4 获取指定的资源
  @Request({
    path: 'get/one',
    methods: ['get', 'post'],
  })
  @Required(['id'])
  async doSourceGetOne(ctx: Context, next: Next) {
    await doSourceGetOne(ctx, next)
  }

  // 5 获取自己的资源列表
  @Request({
    path: 'get/list/self',
    methods: ['get', 'post'],
  })
  async doSourceGetListSelf(ctx: Context, next: Next) {
    ctx._params.userId = ctx._user.id
    await doSourceGetList(ctx, next)
  }

  // 6 获取指定用户公开的资源列表
  @Request({
    path: 'get/list/byuserid',
    methods: ['get', 'post'],
  })
  @Required(['userId'])
  async doSourceGetListByUserId(ctx: Context, next: Next) {
    ctx._params.isSecret = '0'
    await doSourceGetList(ctx, next)
  }

  // 7 获取所有公开的问答列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post'],
  })
  async doSourceGetList(ctx: Context, next: Next) {
    ctx._params.userId = null
    ctx._params.isSecret = '0'
    await doSourceGetList(ctx, next)
  }

}
