/**
 * @description: 小说管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import {
  doNovelAddConvert,
  doNovelUpdateConvert,
  doNovelDeleteConvert
} from '@/router/controller/novels/convert'
import { doNovelAdd } from '@/router/controller/novels/add'
import { doNovelUpdate } from '@/router/controller/novels/update'
import { doNovelDelete } from '@/router/controller/novels/delete'
import { doNovelGetOne, doNovelGetList } from '@/router/controller/novels/get'

@Prefix('novel')
export default class API {
  // 1 小说新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required([
    'name',
    'introduce',
    'author',
    'type',
    { field: 'isDraft', name: 'isIn', options: [['0', '1']] },
    { field: 'isSecret', required: false, name: 'isIn', options: [['0', '1']] },
    { field: 'sort', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  @Convert(doNovelAddConvert)
  async doNovelAdd(ctx: Context) {
    await doNovelAdd(ctx)
  }

  // 2 小说编辑
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required([
    'id',
    { field: 'isDraft', required: false, name: 'isIn', options: [['0', '1']] },
    { field: 'isSecret', required: false, name: 'isIn', options: [['0', '1']] },
    { field: 'sort', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  @Convert(doNovelUpdateConvert)
  async doNovelUpdate(ctx: Context) {
    await doNovelUpdate(ctx)
  }

  // 3 小说删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doNovelDeleteConvert)
  async doNovelDelete(ctx: Context) {
    await doNovelDelete(ctx)
  }

  // 4 获取指定的小说
  @Request({
    path: 'get/one',
    methods: ['get', 'post'],
    unless: true
  })
  @Required(['id'])
  async doNovelGetOne(ctx: Context) {
    await doNovelGetOne(ctx)
  }

  // 5 获取自己的小说列表
  @Request({
    path: 'get/list/self',
    methods: ['get', 'post']
  })
  @Required([
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doNovelGetListSelf(ctx: Context) {
    ctx._params.userId = ctx._user.id
    await doNovelGetList(ctx)
  }

  // 6 获取指定用户所有非草稿且公开的小说列表
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
  async doNovelGetListByUserId(ctx: Context) {
    ctx._params.isDraft = '0'
    ctx._params.isSecret = '0'
    await doNovelGetList(ctx)
  }

  // 7 获取所有的非草稿且公开小说列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post'],
    unless: true
  })
  @Required([
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doNovelGetList(ctx: Context) {
    ctx._params.userId = null
    ctx._params.classify = null
    ctx._params.isDraft = '0'
    ctx._params.isSecret = '0'
    await doNovelGetList(ctx)
  }
}
