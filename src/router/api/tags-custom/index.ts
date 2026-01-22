/**
 * @description: 用户自定义标签管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import { doTagCustomAddConvert, doTagCustomUpdateConvert } from '@/router/controller/tags-custom/convert'
import { doTagCustomAdd } from '@/router/controller/tags-custom/add'
import { doTagCustomUpdate } from '@/router/controller/tags-custom/update'
import { doTagCustomDelete } from '@/router/controller/tags-custom/delete'
import {
  getTagCustomGetIdsSelf,
  getTagCustomGetListType,
  getTagCustomGetList
} from '@/router/controller/tags-custom/get'

@Prefix('tag/custom')
export default class API {
  // 1 用户自定义标签新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['label', { field: 'sort', required: false, name: 'isInt', options: [{ min: 1 }] }])
  @Convert(doTagCustomAddConvert)
  async doTagCustomAdd(ctx: Context) {
    await doTagCustomAdd(ctx)
  }

  // 2 用户自定义标签修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required(['id', { field: 'sort', required: false, name: 'isInt', options: [{ min: 1 }] }])
  @Convert(doTagCustomUpdateConvert)
  async doTagCustomUpdate(ctx: Context) {
    await doTagCustomUpdate(ctx)
  }

  // 3 用户自定义标签删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doTagCustomUpdateConvert)
  async doTagCustomDelete(ctx: Context) {
    await doTagCustomDelete(ctx)
  }

  // 4 获取我的指定一个或多个自定义标签
  @Request({
    path: 'get/byids/self',
    methods: ['get', 'post']
  })
  @Required(['ids'])
  async getTagCustomGetIdsSelf(ctx: Context) {
    await getTagCustomGetIdsSelf(ctx)
  }

  // 5 获取我的自定义标签类型列表
  @Request({
    path: 'get/list/type/self',
    methods: ['get', 'post']
  })
  async getTagCustomGetListTypeSelf(ctx: Context) {
    ctx._params.userId = ctx._user.id
    await getTagCustomGetListType(ctx)
  }

  // 6 获取我的自定义标签列表
  @Request({
    path: 'get/list/self',
    methods: ['get', 'post']
  })
  @Required([
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async getTagCustomGetListSelf(ctx: Context) {
    ctx._params.userId = ctx._user.id
    await getTagCustomGetList(ctx)
  }

  // 7 获取指定用户自定义标签类型列表
  @Request({
    path: 'get/list/type/byuserid',
    methods: ['get', 'post']
  })
  @Required([
    'userId',
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async getTagCustomGetListTypeByUserId(ctx: Context) {
    await getTagCustomGetListType(ctx)
  }

  // 8 获取指定用户自定义标签列表
  @Request({
    path: 'get/list/byuserid',
    methods: ['get', 'post']
  })
  @Required(['userId'])
  async getTagCustomGetListByUserId(ctx: Context) {
    await getTagCustomGetList(ctx)
  }

  // // 9 获取所有用户自定义标签类型列表
  // @Request({
  //   path: 'get/list/type',
  //   methods: ['get', 'post']
  // })
  // @Required([
  //   { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
  //   { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  // ])
  // async getTagCustomGetListType(ctx: Context) {
  //   ctx._params.userId = null
  //   await getTagCustomGetListType(ctx, )
  // }

  // 10 获取所有自定义标签列表
  // @Request({
  //   path: 'get/list',
  //   methods: ['get', 'post']
  // })
  // async getTagCustomGetList(ctx: Context) {
  //   ctx._params.userId = null
  //   ctx._params.type = null
  //   await getTagCustomGetList(ctx)
  // }
}
