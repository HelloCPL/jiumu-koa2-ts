/**
 * @description: 权限管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doPermissionAddExist, doPermissionUpdateNoExist, doPermissionDeleteHasChild } from '../../controller/permissions/convert'
import { doPermissionAdd } from '../../controller/permissions/add'
import { doPermissionUpdate } from '../../controller/permissions/update'
import { doPermissionDelete } from '../../controller/permissions/delete'
import { doPermissionGetOne, doPermissionGetByParentCode } from '../../controller/permissions/get'

@Prefix('permission')
export default class API {
  // 1 权限新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['code', 'label'])
  @Convert(doPermissionAddExist)
  async doPermissionAdd(ctx: Context, next: Next) {
    await doPermissionAdd(ctx, next)
  }

  // 2 权限修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doPermissionUpdateNoExist)
  async doPermissionUpdate(ctx: Context, next: Next) {
    await doPermissionUpdate(ctx, next)
  }

  // 3 权限删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doPermissionDeleteHasChild)
  async doPermissionDelete(ctx: Context, next: Next) {
    await doPermissionDelete(ctx, next)
  }

  // 4 获取指定的某个权限
  @Request({
    path: 'get/one',
    methods: ['get', 'post']
  })
  @Required(['id'])
  async doPermissionGetOne(ctx: Context, next: Next) {
    await doPermissionGetOne(ctx, next)
  }

  // 5 获取某类权限
  @Request({
    path: 'get/byparentcode',
    methods: ['get', 'post']
  })
  async doPermissionGetByParentCode(ctx: Context, next: Next) {
    await doPermissionGetByParentCode(ctx, next)
  }
}
