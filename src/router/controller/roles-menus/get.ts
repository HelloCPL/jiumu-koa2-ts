/**
 * @description 获取角色-菜单关联数据
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Context, Next } from 'koa';
import _ from 'lodash'
import { MenuOptions, MenuListOptions } from '../menus/interface'
import { RoleOptions } from '../roles/interface'
import { RoleMenuOptions, RoleMenuByRoleIdParams, RoleMenuByMenuIdParams } from './interface'
import { getAllRoleByUserId, getAllUserByRoleId } from '../users-roles/get'

// 获取指定角色关联的所有菜单
export const doRoleMenugetAllMenuByRoleId = async (ctx: Context, next: Next) => {
  const data = await getAllMenuByRoleId({ roleId: ctx.params.roleId }, ctx.params.isTree)
  throw new Success({ data });
}

// 获取指定菜单关联的所有角色
export const doRoleMenuGetAllRoleByMenuId = async (ctx: Context, next: Next) => {
  const data = await getAllRoleByMenuId({ menuId: ctx.params.menuId })
  throw new Success({ data });
}

// 获取指定用户关联的所有菜单
export const doRoleMenugetAllMenuByUserId = async (ctx: Context, next: Next) => {
  const userList = await getAllRoleByUserId({ userId: ctx.params.userId })
  const roleIds = _.join(_.map(userList, item => item.id))
  const data = await getAllMenuByRoleId({ roleIds: roleIds }, true)
  throw new Success({ data });
}

// 获取指定菜单关联的所有用户
export const doRoleMenuGetAllUserByMenuId = async (ctx: Context, next: Next) => {
  const roleList = await getAllRoleByMenuId({ menuId: ctx.params.menuId })
  const roleIds = await _.join(_.map(roleList, item => item.id))
  const data = await getAllUserByRoleId({ roleIds: roleIds })
  throw new Success({ data });
}

/**
 * 根据 roleId/roleIds 获取所有关联的菜单列表，返回数组或[]
 * 参数 isTree 菜单是否为树结构
*/
export const getAllMenuByRoleId = async (options: RoleMenuByRoleIdParams, isTree?: boolean): Promise<MenuOptions[] | MenuListOptions[]> => {
  let sql = `SELECT * FROM roles_menus WHERE `
  let data: any[] = []
  if (options.roleId) {
    sql += 'role_id = ?'
    data.push(options.roleId)
  } else if (options.roleIds) {
    sql += 'FIND_IN_SET(role_id, ?)'
    data.push(options.roleIds)
  } else return []
  // 先获取指定角色关联的所有菜单
  let res: RoleMenuOptions[] = <RoleMenuOptions[]>await query(sql, data)
  let targetData: MenuOptions[] = []
  if (res && res.length) {
    // 去重
    res = _.uniqBy(res, 'menu_id')
    // 获取关联的菜单列表
    const menuIds: string = _.join(_.map(res, item => item.menu_id))
    const sql2: string = `SELECT * FROM menus WHERE FIND_IN_SET(id, ?) ORDER BY sort, update_time DESC`
    targetData = <MenuOptions[]>await query(sql2, menuIds)
  }
  if (isTree) return _handleAllMenuHierarchy(targetData)
  return targetData
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
    const roleIds: string = _.join(_.map(res, item => item.role_id))
    const sql2: string = `SELECT * FROM roles WHERE FIND_IN_SET(id, ?) ORDER BY sort, update_time DESC`
    targetData = <RoleOptions[]>await query(sql2, roleIds)
  }
  return targetData
}

// 处理菜单树结构层级问题
function _handleAllMenuHierarchy(menus: MenuOptions[]): MenuListOptions[] {
  let data: MenuListOptions[] = []
  // 取一级菜单
  menus.forEach(item => {
    item.children = []
    if (!item.parent_code) {
      data.push(<MenuListOptions>{ ...item })
    }
  })
  const _handleList = (arr: MenuListOptions[]) => {
    arr.forEach(list => {
      let children = <MenuListOptions[]>menus.filter(item => item.parent_code === list.code)
      list.children = children
      if (list.children && list.children.length)
        _handleList(list.children)
    })
  }
  _handleList(data)
  return data
}
