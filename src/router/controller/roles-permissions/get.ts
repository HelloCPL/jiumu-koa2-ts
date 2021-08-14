/**
 * @description 获取角色-权限关联数据
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Context, Next } from 'koa';
import _ from 'lodash'
import { PermissionOptions } from '../permissions/interface'
import { RoleOptions } from '../roles/interface'
import { RolePermissionOptions, RolePermissionByRoleIdParams, RolePermissionByPermissionIdParams } from './interface'

// 获取指定角色关联的所有权限
export const doRolePermissiongetAllPermissionByRoleId = async (ctx: Context, next: Next) => {
  const data = await getAllPermissionByRoleId({ roleId: ctx.params.roleId })
  throw new Success({ data });
}

// 获取指定权限关联的所有角色
export const doRolePermissionGetAllRoleByPermissionId = async (ctx: Context, next: Next) => {
  const data = await getAllRoleByPermissionId({permissionId: ctx.params.permissionId})
  throw new Success({ data });
}


/**
 * 根据 roleId/roleIds 获取所有关联的权限列表，返回数组或[]
*/
export const getAllPermissionByRoleId = async (options: RolePermissionByRoleIdParams): Promise<PermissionOptions[]> => {
  let sql = `SELECT * FROM roles_permissions WHERE `
  let data: any[] = []
  if (options.roleId) {
    sql += 'role_id = ?'
    data.push(options.roleId)
  } else if (options.roleIds) {
    sql += 'FIND_IN_SET(role_id, ?)'
    data.push(options.roleIds)
  } else return []
  // 先获取指定角色关联的所有权限
  let res: RolePermissionOptions[] = <RolePermissionOptions[]>await query(sql, data)
  let targetData: PermissionOptions[] = []
  if (res && res.length) {
    // 去重
    res = _.uniqBy(res, 'permission_id')
    // 获取关联的权限列表
    const permissionIds: string = _.join(_.map(res, item => item.permission_id))
    const sql2: string = `SELECT * FROM permissions WHERE FIND_IN_SET(id, ?) ORDER BY sort, update_time DESC`
    targetData = <PermissionOptions[]>await query(sql2, permissionIds)
  }
  return targetData
}

/**
 * 根据 permissionId/permissionIds 获取所有关联的角色列表，返回数组或[]
*/
export const getAllRoleByPermissionId = async (options: RolePermissionByPermissionIdParams): Promise<RoleOptions[]> => {
  let sql = `SELECT * FROM roles_permissions WHERE `
  let data: any[] = []
  if (options.permissionId) {
    sql += 'permission_id = ?'
    data.push(options.permissionId)
  } else if (options.permissionIds) {
    sql += 'FIND_IN_SET(permission_id, ?)'
    data.push(options.permissionIds)
  } else return []
  // 先获取指定权限关联的所有角色
  let res: RolePermissionOptions[] = <RolePermissionOptions[]>await query(sql, data)
  let targetData: RoleOptions[] = []
  if (res && res.length) {
    // 去重
    res = _.uniqBy(res, 'role_id')
    // 获取关联的角色列表
    const roleIds: string = _.join(_.map(res, item => item.role_id))
    const sql2: string = `SELECT * FROM roles WHERE FIND_IN_SET(id, ?) ORDER BY sort, update_time DESC`
    targetData = <RoleOptions[]>await query(sql2, roleIds)
  }
  return targetData
}
