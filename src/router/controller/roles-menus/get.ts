/**
 * @description 获取角色-菜单关联数据
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Context, Next } from 'koa';
import _ from 'lodash'
import { MenuOptions } from '../menus/interface'
import { RoleOptions } from '../roles/interface'
import { RoleMenuOptions, RoleMenuByRoleIdParams, RoleMenuByMenuIdParams } from './interface'

// 获取指定角色关联的所有菜单
export const doRoleMenugetAllMenuByRoleId = async (ctx: Context, next: Next) => {
  const data = await getAllMenuByRoleId({ roleId: ctx.params.roleId })
  throw new Success({ data });
}

// 获取指定菜单关联的所有角色
export const doRoleMenuGetAllRoleByMenuId = async (ctx: Context, next: Next) => {
  const data = await getAllRoleByMenuId({ menuId: ctx.params.menuId })
  throw new Success({ data });
}


/**
 * 根据 roleId/roleIds 获取所有关联的菜单列表，返回数组或[]
*/
export const getAllMenuByRoleId = async (options: RoleMenuByRoleIdParams): Promise<MenuOptions[]> => {
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
