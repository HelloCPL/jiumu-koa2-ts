/**
 * @description: 资源管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import {
  doSourceAddConvert,
  doSourceUpdateConvert,
  doSourceDeleteConvert
} from '@/router/controller/sources/convert'
import { doSourceAdd } from '@/router/controller/sources/add'
import { doSourceUpdate } from '@/router/controller/sources/update'
import { doSourceDelete } from '@/router/controller/sources/delete'
import { doSourceGetOne, doSourceGetList } from '@/router/controller/sources/get'

@Prefix('source')
export default class API {
  // 1 资源新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required([
    'title',
    'attachment',
    'type',
    { field: 'isSecret', required: false, name: 'isIn', options: [['0', '1']] },
    { field: 'sort', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  @Convert(doSourceAddConvert)
  async doSourceAdd(ctx: Context) {
    await doSourceAdd(ctx)
  }

  // 2 资源修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required([
    'id',
    { field: 'isSecret', required: false, name: 'isIn', options: [['0', '1']] },
    { field: 'sort', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  @Convert(doSourceUpdateConvert)
  async doSourceUpdate(ctx: Context) {
    await doSourceUpdate(ctx)
  }

  // 3 资源删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doSourceDeleteConvert)
  async doSourceDelete(ctx: Context) {
    await doSourceDelete(ctx)
  }

  // 4 获取指定的资源
  @Request({
    path: 'get/one',
    methods: ['get', 'post'],
    unless: true
  })
  @Required(['id'])
  async doSourceGetOne(ctx: Context) {
    await doSourceGetOne(ctx)
  }

  // 5 获取自己的资源列表
  @Request({
    path: 'get/list/self',
    methods: ['get', 'post']
  })
  @Required([
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doSourceGetListSelf(ctx: Context) {
    ctx._params.userId = ctx._user.id
    await doSourceGetList(ctx)
  }

  // 6 获取指定用户公开的资源列表
  @Request({
    path: 'get/list/byuserid',
    methods: ['get', 'post'],
    unless: true
  })
  @Required([
    'userId',
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doSourceGetListByUserId(ctx: Context) {
    ctx._params.isSecret = '0'
    await doSourceGetList(ctx)
  }

  // 7 获取所有公开的问答列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post'],
    unless: true
  })
  @Required([
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doSourceGetList(ctx: Context) {
    ctx._params.userId = null
    ctx._params.classify = null
    ctx._params.isSecret = '0'
    await doSourceGetList(ctx)
  }
}
