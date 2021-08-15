/**
 * @description: 角色-菜单关联模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doRoleMenuAddConvert, doRoleMenuDeleteConvert } from '../../controller/roles-menus/convert'
import { doRoleMenuAdd } from '../../controller/roles-menus/add'
import { doRoleMenuDelete } from '../../controller/roles-menus/delete'
import { doRoleMenugetAllMenuByRoleId, doRoleMenuGetAllRoleByMenuId } from '../../controller/roles-menus/get'


@Prefix('role-menu')
export default class API {
  // 1 新增角色-菜单关联
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['roleId', 'menuId'])
  @Convert(doRoleMenuAddConvert)
  async doRoleMenuAdd(ctx: Context, next: Next) {
    await doRoleMenuAdd(ctx, next)
  }

  // 2 删除角色-菜单关联
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doRoleMenuDeleteConvert)
  async doRoleMenuDelete(ctx: Context, next: Next) {
    await doRoleMenuDelete(ctx, next)
  }

  // 3 获取指定角色关联的所有菜单
  @Request({
    path: 'get/allmenu/byroleid',
    methods: ['get', 'post']
  })
  @Required(['roleId'])
  async doRoleMenugetAllMenuByRoleId(ctx: Context, next: Next) {
    await doRoleMenugetAllMenuByRoleId(ctx, next)
  }

  // 4 获取指定菜单关联的所有角色
  @Request({
    path: 'get/allrole/bymenuid',
    methods: ['get', 'post']
  })
  @Required(['menuId'])
  async doRoleMenuGetAllRoleByMenuId(ctx: Context, next: Next) {
    await doRoleMenuGetAllRoleByMenuId(ctx, next)
  }
}
