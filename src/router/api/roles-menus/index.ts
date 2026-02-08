/**
 * @description: 角色-菜单关联模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import { doRoleMenuAddConvert, doRoleMenuDeleteConvert } from '@/router/controller/roles-menus/convert'
import { doRoleMenuAdd } from '@/router/controller/roles-menus/add'
import { doRoleMenuDelete } from '@/router/controller/roles-menus/delete'
import {
  doRoleMenugetAllMenuByRoleId,
  doRoleMenuGetAllRoleByMenuId,
  doRoleMenugetAllMenuByUserId,
  doRoleMenuGetAllUserByMenuId
} from '@/router/controller/roles-menus/get'

@Prefix('role-menu')
export default class API {
  // 1 新增角色-菜单关联
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['roleId', 'menuId'])
  @Convert(doRoleMenuAddConvert)
  async doRoleMenuAdd(ctx: Context) {
    await doRoleMenuAdd(ctx)
  }

  // 2 删除角色-菜单关联
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Convert(doRoleMenuDeleteConvert)
  async doRoleMenuDelete(ctx: Context) {
    await doRoleMenuDelete(ctx)
  }

  // 3 获取指定角色关联的所有菜单
  @Request({
    path: 'get/allmenu/byroleid',
    methods: ['get', 'post']
  })
  @Required([
    'roleId',
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doRoleMenugetAllMenuByRoleId(ctx: Context) {
    await doRoleMenugetAllMenuByRoleId(ctx)
  }

  // 4 获取指定菜单关联的所有角色
  @Request({
    path: 'get/allrole/bymenuid',
    methods: ['get', 'post']
  })
  @Required([
    'menuId',
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doRoleMenuGetAllRoleByMenuId(ctx: Context) {
    await doRoleMenuGetAllRoleByMenuId(ctx)
  }

  // 5 获取指定用户关联的所有菜单
  @Request({
    path: 'get/allmenu/byuserid',
    methods: ['get', 'post']
  })
  @Required([
    'userId',
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doRoleMenugetAllMenuByUserId(ctx: Context) {
    await doRoleMenugetAllMenuByUserId(ctx)
  }

  // 6 获取指定菜单关联的所有用户
  @Request({
    path: 'get/alluser/bymenuid',
    methods: ['get', 'post']
  })
  @Required([
    'menuId',
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doRoleMenuGetAllUserByMenuId(ctx: Context) {
    await doRoleMenuGetAllUserByMenuId(ctx)
  }
}
