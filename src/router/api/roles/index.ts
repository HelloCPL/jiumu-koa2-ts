/**
 * @description: 角色管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doRoleAddConvert, doRoleUpdateConvert, doRoleDeleteConvert } from '../../controller/roles/convert'
import { doRoleAdd } from '../../controller/roles/add'
import { doRoleUpdate } from '../../controller/roles/update'
import { doRoleDelete } from '../../controller/roles/delete'
import { doRoleGetOne, doRoleGetAllSelf, doRoleGetList } from '../../controller/roles/get'

@Prefix('role')
export default class API {
  // 1 角色新增
  @Request({
    path: 'add',
    methods: ['get', 'post'],
  })
  @Required(['code', 'label'])
  @Convert(doRoleAddConvert)
  async doRoleAdd(ctx: Context, next: Next) {
    await doRoleAdd(ctx, next)
  }

  // 2 角色修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doRoleUpdateConvert)
  async doRoleUpdate(ctx: Context, next: Next) {
    await doRoleUpdate(ctx, next)
  }

  // 3 角色删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doRoleDeleteConvert)
  async doRoleDelete(ctx: Context, next: Next) {
    await doRoleDelete(ctx, next)
  }

  // 4 获取指定的某个角色
  @Request({
    path: 'get/one',
    methods: ['get', 'post']
  })
  @Required(['id'])
  async doRoleGetOne(ctx: Context, next: Next) {
    await doRoleGetOne(ctx, next)
  }

  // 5 我的所有角色
  @Request({
    path: 'get/all/self',
    methods: ['get', 'post']
  })
  async doRoleGetAllSelf(ctx: Context, next: Next) {
    await doRoleGetAllSelf(ctx, next)
  }

  // 6 获取所有角色
  @Request({
    path: 'get/list',
    methods: ['get', 'post']
  })
  async doRoleGetList(ctx: Context, next: Next) {
    await doRoleGetList(ctx, next)
  }
}
