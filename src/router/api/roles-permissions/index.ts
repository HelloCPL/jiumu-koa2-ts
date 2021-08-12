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
import { doRolePermissionGetAllPermission } from '../../controller/roles-permissions/get'

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

  // 3 获取指定角色拥有的所有权限，多个角色用逗号隔开
  @Request({
    path: 'get/allpermission',
    methods: ['get', 'post']
  })
  @Required(['roleIds'])
  async doRolePermissionGetAllPermission(ctx: Context, next: Next) {
    await doRolePermissionGetAllPermission(ctx, next)
  }
}

