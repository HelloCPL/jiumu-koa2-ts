/**
 * @description: 角色-权限关联模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doRolePermissionAddConvert, doRolePermissionDeleteConvert } from '../../controller/roles-permissions/convert'
import { doRolePermissionAdd } from '../../controller/roles-permissions/add'
import { doRolePermissionDelete } from '../../controller/roles-permissions/delete'
import { doRolePermissiongetAllPermissionByRoleId, doRolePermissionGetAllRoleByPermissionId } from '../../controller/roles-permissions/get'

@Prefix('role-permission')
export default class API {
  // 1 新增角色-权限关联
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['roleId', 'permissionId'])
  @Convert(doRolePermissionAddConvert)
  async doRolePermissionAdd(ctx: Context, next: Next) {
    await doRolePermissionAdd(ctx, next)
  }

  // 2 删除角色-权限关联
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doRolePermissionDeleteConvert)
  async doRolePermissionDelete(ctx: Context, next: Next) {
    await doRolePermissionDelete(ctx, next)
  }

  // 3 获取指定角色关联的所有权限
  @Request({
    path: 'get/allpermission/byroleid',
    methods: ['get', 'post']
  })
  @Required(['roleId'])
  async doRolePermissiongetAllPermissionByRoleId(ctx: Context, next: Next) {
    await doRolePermissiongetAllPermissionByRoleId(ctx, next)
  }

  // 4 获取指定权限关联的所有角色
  @Request({
    path: 'get/allrole/bypermissionid',
    methods: ['get', 'post']
  })
  @Required(['permissionId'])
  async doRolePermissionGetAllRoleByPermissionId(ctx: Context, next: Next) {
    await doRolePermissionGetAllRoleByPermissionId(ctx, next)
  }
}
