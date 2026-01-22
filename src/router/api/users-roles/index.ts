/**
 * @description: 用户-角色关联模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import { doUserRoleAddConvert, doUserRoleDeleteConvert } from '@/router/controller/users-roles/convert'
import { doUserRoleAdd } from '@/router/controller/users-roles/add'
import { doUserRoleDelete } from '@/router/controller/users-roles/delete'
import {
  doUserRoleGetAllRoleByUserId,
  doUserRoleGetAllUserByRoleId
} from '@/router/controller/users-roles/get'

@Prefix('user-role')
export default class API {
  // 1 新增用户-角色关联
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['roleId', 'userId'])
  @Convert(doUserRoleAddConvert)
  async doUserRoleAdd(ctx: Context) {
    await doUserRoleAdd(ctx)
  }

  // 2 删除角色-权限关联
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Convert(doUserRoleDeleteConvert)
  async doUserRoleDelete(ctx: Context) {
    await doUserRoleDelete(ctx)
  }

  // 3 获取指定用户关联的所有角色
  @Request({
    path: 'get/allrole/byuserid',
    methods: ['get', 'post']
  })
  @Required([
    'userId',
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doUserRoleGetAllRoleByUserId(ctx: Context) {
    await doUserRoleGetAllRoleByUserId(ctx)
  }

  // 4 获取指定角色关联的所有用户
  @Request({
    path: 'get/alluser/byroleid',
    methods: ['get', 'post']
  })
  @Required([
    'roleId',
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doUserRoleGetAllUserByRoleId(ctx: Context) {
    await doUserRoleGetAllUserByRoleId(ctx)
  }
}
