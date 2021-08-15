/**
 * @description 权限获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { isExistHasChildren } from '../convert'
import { Context, Next } from 'koa';
import { PermissionOptions, PermissionListOptions, PermissionCustomOptions } from './interface'
import { getAllRoleByUserId } from '../users-roles/get'
import { getAllPermissionByRoleId } from '../roles-permissions/get'
import _ from 'lodash'

// 获取指定的某个权限
export const doPermissionGetOne = async (ctx: Context, next: Next) => {
  const data = await getPermissionOne(ctx.params.id)
  throw new Success({ data });
}

// 获取某类权限
export const doPermissionGetByParentCode = async (ctx: Context, next: Next) => {
  const parentCode = ctx.params.parentCode || ''
  let data: PermissionListOptions[] = await getPermissionByParentCode(parentCode)
  if (ctx.params.userId) {
    // 若传 userId 增加`checked` 字段，表示是否与该用户关联
    const userRoleList = await getAllRoleByUserId({ userId: ctx.params.userId })
    const roleIds = _.join(_.map(userRoleList, item => item.id))
    const rolePermissionList = await getAllPermissionByRoleId({ roleIds: roleIds })
    const rolePermissionIds = _.map(rolePermissionList, item => item.id)
    _handleRolePermission(data, rolePermissionIds)
  } else if (ctx.params.roleId) {
    // 若传 roleId 增加`checked` 字段，表示是否与该角色关联
    const rolePermissionList = await getAllPermissionByRoleId({ roleId: ctx.params.roleId })
    const rolePermissionIds = _.map(rolePermissionList, item => item.id)
    _handleRolePermission(data, rolePermissionIds)
  }
  throw new Success({ data })
}


/**
 * 获取指定的某个权限，返回对象或null
*/
export const getPermissionOne = async (id: string): Promise<PermissionOptions | null> => {
  const sql: string = `SELECT * FROM permissions WHERE code = ? OR id = ?`
  const data = [id, id]
  let res: any = await query(sql, data)
  res = res[0] || null
  return res
}

/**
 * 获取某类权限，返回数组或[]
*/
export const getPermissionByParentCode = async (parentCode: string): Promise<PermissionListOptions[]> => {
  let data: PermissionCustomOptions[] = [{ code: parentCode, children: [] }]
  const _handleGetData = async (arr: PermissionCustomOptions[]) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      const hasChildren = <boolean>await isExistHasChildren({
        table: 'permissions',
        where: { key: 'code', value: arr[i].code },
        noThrow: true
      })
      if (hasChildren) {
        const sql = `SELECT * FROM permissions WHERE parent_code = ? ORDER BY sort, update_time DESC`
        const res: PermissionCustomOptions[] = <PermissionCustomOptions[]>await query(sql, arr[i].code)
        arr[i].children = res
        await _handleGetData(arr[i].children)
      } else
        arr[i].children = []
    }
  }
  // 递归查询
  await _handleGetData(data)
  // @ts-ignore
  const targetData: PermissionListOptions[] = data[0].children
  return targetData
}

// 处理权限是否与角色/权限关联
function _handleRolePermission(data: PermissionListOptions[], targetData: string[]) {
  const _handleList = (arr: PermissionListOptions[]) => {
    arr.forEach(item => {
      if (targetData.indexOf(item.id) === -1)
        item.checked = false
      else item.checked = true
      if (item.children && item.children.length)
        _handleList(item.children)
    })
  }
  _handleList(data)
}
