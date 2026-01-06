/**
 * @description: 权限管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import {
  doPermissionAddConvert,
  doPermissionUpdateConvert,
  doPermissionDeleteConvert
} from '@/router/controller/permissions/convert'
import { doPermissionAdd } from '@/router/controller/permissions/add'
import { doPermissionUpdate } from '@/router/controller/permissions/update'
import { doPermissionDelete } from '@/router/controller/permissions/delete'
import { doPermissionGetOne, doPermissionGetList } from '@/router/controller/permissions/get'
import { doRolePermissiongetAllPermissionByUserId } from '@/router/controller/roles-permissions/get'
import { doPermissionExport } from '@/router/controller/permissions/exports'
import { doPermissionImport } from '@/router/controller/permissions/imports'

@Prefix('permission')
export default class API {
  // 1 权限新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['code', 'label'])
  @Convert(doPermissionAddConvert)
  async doPermissionAdd(ctx: Context) {
    await doPermissionAdd(ctx)
  }

  // 2 权限修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doPermissionUpdateConvert)
  async doPermissionUpdate(ctx: Context) {
    await doPermissionUpdate(ctx)
  }

  // 3 权限删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doPermissionDeleteConvert)
  async doPermissionDelete(ctx: Context) {
    await doPermissionDelete(ctx)
  }

  // 4 获取指定的某个权限
  @Request({
    path: 'get/one',
    methods: ['get', 'post']
  })
  @Required(['id'])
  async doPermissionGetOne(ctx: Context) {
    await doPermissionGetOne(ctx)
  }

  // 5 获取我的所有权限列表
  @Request({
    path: 'get/all/self',
    methods: ['get', 'post']
  })
  async doPermissionGetAllSelf(ctx: Context) {
    ctx._params.userId = ctx._user.id
    await doRolePermissiongetAllPermissionByUserId(ctx)
  }

  // 6 获取权限列表
  @Request({
    path: 'get/list',
    methods: ['get', 'post']
  })
  async doPermissionGetList(ctx: Context) {
    await doPermissionGetList(ctx)
  }

  // 7 导出权限数据
  @Request({
    path: 'export',
    methods: ['get', 'post']
  })
  @Required(['ids'])
  async doPermissionExport(ctx: Context) {
    await doPermissionExport(ctx)
  }

  // 8 导入权限数据
  @Request({
    path: 'import',
    methods: ['post']
  })
  async doPermissionImport(ctx: Context) {
    await doPermissionImport(ctx)
  }
}
