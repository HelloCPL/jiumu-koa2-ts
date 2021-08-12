/**
 * @description: 角色-权限关联模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doRolePermissionAddExist, doRolePermissionDeleteExist } from '../../controller/roles-permissions/convert'
import { doRolePermissionAdd } from '../../controller/roles-permissions/add'
import { doRolePermissionDelete } from '../../controller/roles-permissions/delete'

@Prefix('role/permission')
export default class API {
  // 1 新增角色-权限关联
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['roleId', 'permissionId'])
  @Convert(doRolePermissionAddExist)
  async doRolePermissionAdd(ctx: Context, next: Next) {
    await doRolePermissionAdd(ctx, next)
  }

  // 2 删除角色-权限关联
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doRolePermissionDeleteExist)
  async doRolePermissionDelete(ctx: Context, next: Next) {
    await doRolePermissionDelete(ctx, next)
  }

  // 3 根据角色获取关联的权限
  @Request({
    path: 'get',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doRolePermissionDeleteExist)
  async doRolePermissionGet(ctx: Context, next: Next) {
    // await doRolePermissionGet(ctx, next)
  }
}








