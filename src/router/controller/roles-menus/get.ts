/**
 * @description 获取角色-菜单关联数据
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '../../../utils/http-exception'
import { execTrans, query } from '../../../db'
import { Context, Next } from 'koa'
import _ from 'lodash'
import { MenuOptions, MenuListOptions, MenuReturnOptions, MenuCustomOptions } from '../menus/interface'
import { RoleOptions } from '../roles/interface'
import { RoleMenuOptions, RoleMenuByRoleIdParams, RoleMenuByMenuIdParams, RoleMenuByRoleIdReturn } from './interface'
import { getAllRoleByUserId, getAllUserByRoleId } from '../users-roles/get'
import { isExistHasChildren } from '../convert'

// 获取指定角色关联的所有菜单
export const doRoleMenugetAllMenuByRoleId = async (ctx: Context, next: Next) => {
  const data = await getAllMenuByRoleId(
    { roleId: ctx.params.roleId, pageNo: ctx.params.pageNo * 1 || 1, pageSize: ctx.params.pageSize * 1 || 10 },
    ctx.params.isTree
  )
  throw new Success(data)
}

// 获取指定菜单关联的所有角色
export const doRoleMenuGetAllRoleByMenuId = async (ctx: Context, next: Next) => {
  const data = await getAllRoleByMenuId({ menuId: ctx.params.menuId })
  throw new Success({ data })
}

// 获取指定用户关联的所有菜单
export const doRoleMenugetAllMenuByUserId = async (ctx: Context, next: Next) => {
  // const userList = await getAllRoleByUserId({ userId: ctx.params.userId })
  // const roleIds = _.join(_.map(userList.data, item => item.id))
  // const data = await getAllMenuByRoleId({ roleIds: roleIds }, true)
  // throw new Success({ data });
}

// 获取指定菜单关联的所有用户
export const doRoleMenuGetAllUserByMenuId = async (ctx: Context, next: Next) => {
  const roleList = await getAllRoleByMenuId({ menuId: ctx.params.menuId })
  const roleIds = await _.join(_.map(roleList, (item) => item.id))
  const data = await getAllUserByRoleId({ roleIds: roleIds })
  throw new Success({ data })
}

/**
 * 根据 roleId/roleIds 获取所有关联的菜单列表，返回数组或[]
 * 参数 isTree 菜单是否为树结构
 */
export const getAllMenuByRoleId = async (
  options: RoleMenuByRoleIdParams,
  isTree?: boolean
): Promise<MenuReturnOptions | RoleMenuByRoleIdReturn> => {
  if (isTree) {
    const sql = `SELECT (SELECT t2.id FROM roles_menus t2 WHERE t2.menu_id = t1.id AND t2.role_id = ?) AS checked, t1.id, t1.parent_code, t2.label AS parent_label, t1.code, t1.label, t1.sort, t1.create_time, t1.update_time, t1.remarks FROM menus t1 LEFT JOIN menus t2 ON t1.parent_code = t2.code WHERE 1=1`
    const res = <MenuOptions[]>await query(sql, options.roleId)
    const menuData = await _handleAllMenuHierarchy(res)
    return {
      total: 0,
      data: menuData,
    }
  } else {
    options.pageNo = options.pageNo || 1
    options.pageSize = options.pageSize || 10
    const pageNo = (options.pageNo - 1) * options.pageSize
    let whereSQL = ''
    let whereData: any[] = []
    if (options.roleId) {
      whereSQL = 't1.role_id = ?'
      whereData.push(options.roleId)
    } else if (options.roleIds) {
      whereSQL = 'FIND_IN_SET(t1.role_id, ?)'
      whereData.push(options.roleIds)
    }
    const sql1 = `SELECT COUNT(t1.id) AS total FROM roles_menus t1 WHERE ${whereSQL}`
    const sql2 = `SELECT t2.id, t2.parent_code, t3.label AS parent_label, t2.code, t2.label, t2.sort, t2.create_time, t2.update_time, t2.terminal, t2.remarks FROM roles_menus t1 LEFT JOIN menus t2 ON t1.menu_id = t2.id LEFT JOIN menus t3 ON t2.parent_code = t3.code WHERE ${whereSQL} ORDER BY t2.sort, t2.update_time DESC LIMIT ?, ?`
    const res: any = await execTrans([
      { sql: sql1, data: [...whereData] },
      { sql: sql2, data: [...whereData, pageNo, options.pageSize] },
    ])
    return {
      total: res[0][0]['total'],
      data: res[1],
    }
  }

  // let sql = `SELECT * FROM roles_menus WHERE `
  // let data: any[] = []
  // if (options.roleId) {
  //   sql += 'role_id = ?'
  //   data.push(options.roleId)
  // } else if (options.roleIds) {
  //   sql += 'FIND_IN_SET(role_id, ?)'
  //   data.push(options.roleIds)
  // } else return []
  // // 先获取指定角色关联的所有菜单
  // let res: RoleMenuOptions[] = <RoleMenuOptions[]>await query(sql, data)
  // let targetData: MenuOptions[] = []
  // if (res && res.length) {
  //   // 去重
  //   res = _.uniqBy(res, 'menu_id')
  //   // 获取关联的菜单列表
  //   const menuIds: string = _.join(_.map(res, (item) => item.menu_id))
  //   const sql2: string = `SELECT * FROM menus WHERE FIND_IN_SET(id, ?) ORDER BY sort, update_time DESC`
  //   targetData = <MenuOptions[]>await query(sql2, menuIds)
  // }
  // if (isTree) return _handleAllMenuHierarchy(targetData)
  // return targetData
}

/**
 * 根据 menuId/menuIds 获取所有关联的角色列表，返回数组或[]
 */
export const getAllRoleByMenuId = async (options: RoleMenuByMenuIdParams): Promise<RoleOptions[]> => {
  let sql = `SELECT * FROM roles_menus WHERE `
  let data: any[] = []
  if (options.menuId) {
    sql += 'menu_id = ?'
    data.push(options.menuId)
  } else if (options.menuIds) {
    sql += 'FIND_IN_SET(menu_id, ?)'
    data.push(options.menuIds)
  } else return []
  // 先获取指定菜单关联的所有角色
  let res: RoleMenuOptions[] = <RoleMenuOptions[]>await query(sql, data)
  let targetData: RoleOptions[] = []
  if (res && res.length) {
    // 去重
    res = _.uniqBy(res, 'role_id')
    // 获取关联的角色列表
    const roleIds: string = _.join(_.map(res, (item) => item.role_id))
    const sql2: string = `SELECT * FROM roles WHERE FIND_IN_SET(id, ?) ORDER BY sort, update_time DESC`
    targetData = <RoleOptions[]>await query(sql2, roleIds)
  }
  return targetData
}

// 处理菜单树结构层级问题
function _handleAllMenuHierarchy(menus: MenuOptions[]): MenuListOptions[] | any {
  // 取一级菜单
  let data: MenuListOptions[] = [],
    i = 0,
    len = menus.length
  for (i; i < len; i++) {
    menus[i].children = []
    if (!menus[i].parent_code) {
      let obj = menus.splice(i, 1)
      data.push(<MenuListOptions>{ ...obj[0] })
      i--
      len--
    }
  }
  console.log(data)
  return data

  // const _handleList = (arr: MenuListOptions[]) => {
  //   arr.forEach((list) => {
  //     let children: MenuListOptions[] = [],
  //       i2 = 0,
  //       len2 = menus.length
  //     for (i2; i2 < len2; i2++) {
  //       if (menus[i2].parent_code === list.code) {
  //         let obj = menus.splice(i2, 1)
  //         children.push(<MenuListOptions>{ ...obj[0] })
  //         i2--
  //         len2--
  //       }
  //     }
  //     list.children = children
  //     if (menus.length && list.children && list.children.length) _handleList(list.children)
  //   })
  // }
  // _handleList(data)
  // return data
}
