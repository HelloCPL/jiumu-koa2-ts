/**
 * @description: 用户-角色关联模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doUserRoleAddExist, doUserRoleDeleteExist } from '../../controller/users-roles/convert'
import { doUserRoleAdd } from '../../controller/users-roles/add'
import { doUserRoleDelete } from '../../controller/users-roles/delete'
import { doUserRoleGetAllRole } from '../../controller/users-roles/get'


@Prefix('user/role')
export default class API {
  // 1 新增用户-角色关联
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['roleId', 'userId'])
  @Convert(doUserRoleAddExist)
  async doUserRoleAdd(ctx: Context, next: Next) {
    await doUserRoleAdd(ctx, next)
  }

  // 2 删除角色-权限关联
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doUserRoleDeleteExist)
  async doUserRoleDelete(ctx: Context, next: Next) {
    await doUserRoleDelete(ctx, next)
  }

  // 3 获取指定用户拥有的所有角色
  @Request({
    path: 'get/allrole',
    methods: ['get', 'post']
  })
  @Required(['userId'])
  async doUserRoleGetAllRole(ctx: Context, next: Next) {
    await doUserRoleGetAllRole(ctx, next)
  }

}






