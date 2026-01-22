/**
 * @description: 角色-权限关联模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import {
  doRolePermissionAddConvert,
  doRolePermissionDeleteConvert
} from '@/router/controller/roles-permissions/convert'
import { doRolePermissionAdd } from '@/router/controller/roles-permissions/add'
import { doRolePermissionDelete } from '@/router/controller/roles-permissions/delete'
import {
  doRolePermissiongetAllPermissionByRoleId,
  doRolePermissionGetAllRoleByPermissionId,
  doRolePermissiongetAllPermissionByUserId,
  doRolePermissionGetAllUserByPermissionId
} from '@/router/controller/roles-permissions/get'

@Prefix('role-permission')
export default class API {
  // 1 新增角色-权限关联
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['roleId', 'permissionId'])
  @Convert(doRolePermissionAddConvert)
  async doRolePermissionAdd(ctx: Context) {
    await doRolePermissionAdd(ctx)
  }

  // 2 删除角色-权限关联
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Convert(doRolePermissionDeleteConvert)
  async doRolePermissionDelete(ctx: Context) {
    await doRolePermissionDelete(ctx)
  }

  // 3 获取指定角色关联的所有权限
  @Request({
    path: 'get/allpermission/byroleid',
    methods: ['get', 'post']
  })
  @Required([
    'roleId',
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doRolePermissiongetAllPermissionByRoleId(ctx: Context) {
    await doRolePermissiongetAllPermissionByRoleId(ctx)
  }

  // 4 获取指定权限关联的所有角色
  @Request({
    path: 'get/allrole/bypermissionid',
    methods: ['get', 'post']
  })
  @Required([
    'permissionId',
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doRolePermissionGetAllRoleByPermissionId(ctx: Context) {
    await doRolePermissionGetAllRoleByPermissionId(ctx)
  }

  // 5 获取指定用户关联的所有权限
  @Request({
    path: 'get/allpermission/byuserid',
    methods: ['get', 'post']
  })
  @Required([
    'userId',
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doRolePermissiongetAllPermissionByUserId(ctx: Context) {
    await doRolePermissiongetAllPermissionByUserId(ctx)
  }

  // 6 获取指定权限关联的所有用户
  @Request({
    path: 'get/alluser/bypermissionid',
    methods: ['get', 'post']
  })
  @Required([
    'permissionId',
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doRolePermissionGetAllUserByPermissionId(ctx: Context) {
    await doRolePermissionGetAllUserByPermissionId(ctx)
  }
}
