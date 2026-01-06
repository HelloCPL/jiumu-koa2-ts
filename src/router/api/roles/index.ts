/**
 * @description: 角色管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import { doRoleAddConvert, doRoleUpdateConvert, doRoleDeleteConvert } from '@/router/controller/roles/convert'
import { doRoleAdd } from '@/router/controller/roles/add'
import { doRoleUpdate } from '@/router/controller/roles/update'
import { doRoleDelete } from '@/router/controller/roles/delete'
import { doRoleGetOne, doRoleGetAllSelf, doRoleGetList } from '@/router/controller/roles/get'
import { doRoleExport } from '@/router/controller/roles/exports'
import { doRoleImport } from '@/router/controller/roles/imports'

@Prefix('role')
export default class API {
  // 1 角色新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['code', 'label'])
  @Convert(doRoleAddConvert)
  async doRoleAdd(ctx: Context) {
    await doRoleAdd(ctx)
  }

  // 2 角色修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doRoleUpdateConvert)
  async doRoleUpdate(ctx: Context) {
    await doRoleUpdate(ctx)
  }

  // 3 角色删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doRoleDeleteConvert)
  async doRoleDelete(ctx: Context) {
    await doRoleDelete(ctx)
  }

  // 4 获取指定的某个角色
  @Request({
    path: 'get/one',
    methods: ['get', 'post']
  })
  @Required(['id'])
  async doRoleGetOne(ctx: Context) {
    await doRoleGetOne(ctx)
  }

  // 5 我的角色列表
  @Request({
    path: 'get/list/self',
    methods: ['get', 'post']
  })
  async doRoleGetAllSelf(ctx: Context) {
    await doRoleGetAllSelf(ctx)
  }

  // 6 获取所有角色
  @Request({
    path: 'get/list',
    methods: ['get', 'post']
  })
  async doRoleGetList(ctx: Context) {
    await doRoleGetList(ctx)
  }

  // 7 导出角色数据
  @Request({
    path: 'export',
    methods: ['get', 'post']
  })
  @Required(['ids'])
  async doRoleExport(ctx: Context) {
    await doRoleExport(ctx)
  }

  // 8 导入角色数据
  @Request({
    path: 'import',
    methods: ['post']
  })
  async doRoleImport(ctx: Context) {
    await doRoleImport(ctx)
  }
}
