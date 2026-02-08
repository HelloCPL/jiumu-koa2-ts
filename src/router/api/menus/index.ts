/**
 * @description: 菜单管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import { doMenuAddConvert, doMenuUpdateConvert, doMenuDeleteConvert } from '@/router/controller/menus/convert'
import { doMenuAdd } from '@/router/controller/menus/add'
import { doMenuUpdate } from '@/router/controller/menus/update'
import { doMenuDelete } from '@/router/controller/menus/delete'
import { doMenuGetOne, doMenuGetByParentCode } from '@/router/controller/menus/get'
import { doRoleMenugetAllMenuByUserId } from '@/router/controller/roles-menus/get'
import { doMenuExport } from '@/router/controller/menus/exports'
import { doMenuImport } from '@/router/controller/menus/imports'

@Prefix('menu')
export default class API {
  // 1 菜单新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required([
    'code',
    { field: 'label', name: 'isLength', options: [{ min: 1, max: 64 }] },
    { field: 'sort', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'remarks', required: false, name: 'isLength', options: [{ max: 255 }] }
  ])
  @Convert(doMenuAddConvert)
  async doMenuAdd(ctx: Context) {
    await doMenuAdd(ctx)
  }

  // 2 菜单修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required([
    'id',
    { field: 'label', required: false, name: 'isLength', options: [{ min: 1, max: 64 }] },
    { field: 'sort', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'remarks', required: false, name: 'isLength', options: [{ max: 255 }] }
  ])
  @Convert(doMenuUpdateConvert)
  async doMenuUpdate(ctx: Context) {
    await doMenuUpdate(ctx)
  }

  // 3 菜单删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doMenuDeleteConvert)
  async doMenuDelete(ctx: Context) {
    await doMenuDelete(ctx)
  }

  // 4 获取指定的某个菜单
  @Request({
    path: 'get/one',
    methods: ['get', 'post']
  })
  @Required(['id'])
  async doMenuGetOne(ctx: Context) {
    await doMenuGetOne(ctx)
  }

  // 5 获取我的所有菜单
  @Request({
    path: 'get/all/self',
    methods: ['get', 'post']
  })
  @Required([
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doMenuGetAllSelf(ctx: Context) {
    ctx._params.userId = ctx._user.id
    await doRoleMenugetAllMenuByUserId(ctx)
  }

  // 6 获取某类菜单
  @Request({
    path: 'get/byparentcode',
    methods: ['get', 'post']
  })
  async doMenuGetByParentCode(ctx: Context) {
    await doMenuGetByParentCode(ctx)
  }

  // 7 导出菜单数据
  @Request({
    path: 'export',
    methods: ['get', 'post']
  })
  @Required(['ids'])
  async doMenuExport(ctx: Context) {
    await doMenuExport(ctx)
  }

  // 8 导入菜单数据
  @Request({
    path: 'import',
    methods: ['post']
  })
  async doMenuImport(ctx: Context) {
    await doMenuImport(ctx)
  }
}
