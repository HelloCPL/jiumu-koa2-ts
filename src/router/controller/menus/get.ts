/**
 * @description 菜单获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { isExistHasChildren } from '../convert'
import { Context, Next } from 'koa';
import { MenuOptions, MenuListOptions, MenuCustomOptions } from './interface'
import { getAllMenuByRoleId } from '../roles-menus/get'
import { getAllRoleByUserId } from '../users-roles/get'
// import { getAllPermissionByRoleId } from '../roles-permissions/get'
import _ from 'lodash'

// 获取指定的某个菜单
export const doMenuGetOne = async (ctx: Context, next: Next) => {
  const data = await getMenuOne(ctx.params.id)
  throw new Success({ data });
}

// 获取某类菜单
export const doMenuGetByParentCode = async (ctx: Context, next: Next) => {
  const parentCode = ctx.params.parentCode || ''
  let data: MenuListOptions[] = await getMenuByParentCode(parentCode)
  if (ctx.params.userId) {
    // 若传 userId 增加`checked` 字段，表示是否与该用户关联
    const userRoleList = await getAllRoleByUserId({ userId: ctx.params.userId })
    const roleIds = _.join(_.map(userRoleList, item => item.id))
    const roleMenuList = await getAllMenuByRoleId({ roleIds: roleIds })
    const roleMenuIds = _.map(roleMenuList, item => item.id)
    _handleRoleMenu(data, roleMenuIds)
  } else if (ctx.params.roleId) {
    // 若传 roleId 增加`checked` 字段，表示是否与该角色关联
    const roleMenuList = await getAllMenuByRoleId({ roleId: ctx.params.roleId })
    const roleMenuIds = _.map(roleMenuList, item => item.id)
    _handleRoleMenu(data, roleMenuIds)
  }
  throw new Success({ data })
}


/**
 * 获取指定的某个菜单，返回对象或null
*/
export const getMenuOne = async (id: string): Promise<MenuOptions | null> => {
  const sql: string = `SELECT t1.id, t1.parent_code, t2.label as parent_label, t1.code, t1.label, t1.sort, t1.create_time, t1.update_time, t1.remarks FROM menus t1 LEFT JOIN menus t2 ON t1.parent_code = t2.code WHERE t1.code = ? OR t1.id = ?`
  const data = [id, id]
  let res: any = await query(sql, data)
  res = res[0] || null
  return res
}

/**
 * 获取某类菜单，返回数组或[]
*/
export const getMenuByParentCode = async (parentCode: string): Promise<MenuListOptions[]> => {
  let data: MenuCustomOptions[] = [{ code: parentCode, children: [] }]
  const _handleGetData = async (arr: MenuCustomOptions[]) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      const hasChildren = <boolean>await isExistHasChildren({
        table: 'menus',
        where: { key: 'code', value: arr[i].code },
        noThrow: true
      })
      if (hasChildren) {
        const sql = `SELECT t1.id, t1.parent_code, t2.label as parent_label, t1.code, t1.label, t1.sort, t1.create_time, t1.update_time, t1.remarks FROM menus t1 LEFT JOIN menus t2 ON t1.parent_code = t2.code WHERE t1.parent_code = ?`
        const res: MenuListOptions[] = <MenuListOptions[]>await query(sql, arr[i].code)
        arr[i].children = res
        await _handleGetData(arr[i].children)
      } else
        arr[i].children = []
    }
  }
  // 递归查询
  await _handleGetData(data)
  // @ts-ignore
  const targetData: MenuListOptions[] = data[0].children
  return targetData
}

// 处理权限是否与角色/菜单关联
function _handleRoleMenu(data: MenuListOptions[], targetData: string[]) {
  const _handleList = (arr: MenuListOptions[]) => {
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
