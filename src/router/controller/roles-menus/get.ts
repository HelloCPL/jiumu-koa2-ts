/**
 * @description 获取角色-菜单关联数据
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { execTrans, query } from '@/db'
import { Context } from 'koa'
import { MenuOptions, MenuReturnOptions } from '../menus/interface'
import { RoleReturnOptions } from '../roles/interface'
import {
  RoleMenuByRoleIdParams,
  RoleMenuByMenuIdParams,
  RoleMenuByRoleIdReturn,
  RoleMenuByUserIdParams
} from './interface'
import { UserListReturn, UserOptions } from '../users/interface'
import { handleMenuTree, handleUser } from './utils'

// 获取指定角色关联的所有菜单
export const doRoleMenugetAllMenuByRoleId = async (ctx: Context) => {
  const data = await getAllMenuByRoleId(
    {
      roleId: ctx._params.roleId,
      pageNo: ctx._params.pageNo * 1 || 1,
      pageSize: ctx._params.pageSize * 1 || 10
    },
    ctx._params.isTree
  )
  throw new Success(data)
}

// 获取指定菜单关联的所有角色
export const doRoleMenuGetAllRoleByMenuId = async (ctx: Context) => {
  const data = await getAllRoleByMenuId({
    menuId: ctx._params.menuId,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10
  })
  throw new Success(data)
}

// 获取指定用户关联的所有菜单
export const doRoleMenugetAllMenuByUserId = async (ctx: Context) => {
  const data = await getAllMenuByUserId(
    {
      userId: ctx._params.userId,
      pageNo: ctx._params.pageNo * 1 || 1,
      pageSize: ctx._params.pageSize * 1 || 10
    },
    ctx._params.isTree
  )
  throw new Success(data)
}

// 获取指定菜单关联的所有用户
export const doRoleMenuGetAllUserByMenuId = async (ctx: Context) => {
  const data = await getAllUserByMenuId({
    menuId: ctx._params.menuId,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    simple: ctx._params.simple || '1'
  })
  throw new Success(data)
}

/**
 * 根据 roleId 获取所有关联的菜单列表，返回数组或[]
 * 参数 isTree 菜单是否为树结构
 */
export const getAllMenuByRoleId = async (
  options: RoleMenuByRoleIdParams,
  isTree?: BaseStatus
): Promise<MenuReturnOptions | RoleMenuByRoleIdReturn> => {
  if (isTree === '1') {
    const sql = `
      SELECT 
        t3.id AS relevance_id, t1.id, t1.parent_code, t2.label AS parent_label, t1.code, t1.label,
        t1.sort, t1.configurable, t1.create_time, t1.update_time, t1.terminal, t1.remarks
      FROM menus t1
      LEFT JOIN menus t2 ON t1.parent_code = t2.code
      LEFT JOIN roles_menus t3 ON (t1.id = t3.menu_id AND t3.role_id = ?)
      WHERE 
        t1.id IN (SELECT t4.menu_id FROM roles_menus t4 WHERE t4.role_id = ?)
      ORDER BY t1.sort, t1.update_time DESC`
    const res = <MenuOptions[]>await query(sql, [options.roleId, options.roleId])
    return {
      total: 0,
      data: handleMenuTree(res)
    }
  } else {
    options.pageNo = options.pageNo || 1
    options.pageSize = options.pageSize || 10
    const pageNo = (options.pageNo - 1) * options.pageSize
    const sql1 = `
      SELECT 
        COUNT(t1.id) AS total 
      FROM menus t1 
      WHERE 
        t1.id IN (SELECT t4.menu_id FROM roles_menus t4 WHERE t4.role_id = ?) `
    const sql2 = `
      SELECT 
        t3.id AS relevance_id, t1.id, t1.parent_code, t2.label AS parent_label, t1.code, t1.label,
        t1.sort, t1.configurable, t1.create_time, t1.update_time, t1.terminal, t1.remarks
      FROM menus t1
      LEFT JOIN menus t2 ON t1.parent_code = t2.code
      LEFT JOIN roles_menus t3 ON (t1.id = t3.menu_id AND t3.role_id = ?)
      WHERE 
        t1.id IN (SELECT t4.menu_id FROM roles_menus t4 WHERE t4.role_id = ?)
      ORDER BY t1.sort, t1.update_time DESC
      LIMIT ?, ?`
    const res: any = await execTrans([
      { sql: sql1, data: [options.roleId] },
      { sql: sql2, data: [options.roleId, options.roleId, pageNo, options.pageSize] }
    ])
    return {
      total: res[0][0]['total'],
      data: res[1]
    }
  }
}

/**
 * 根据 menuId 获取所有关联的角色列表，返回数组或[]
 */
export const getAllRoleByMenuId = async (options: RoleMenuByMenuIdParams): Promise<RoleReturnOptions> => {
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  const sql1 = `
    SELECT 
      COUNT(t1.id) AS total 
    FROM roles t1 
    WHERE 
      t1.id IN (SELECT t3.role_id FROM roles_menus t3 WHERE t3.menu_id = ?)`
  const sql2 = `
    SELECT 
      t2.id As relevance_id, t1.id, t1.code, t1.label, t1.sort, 
      t1.configurable, t1.create_time, t1.update_time, t1.terminal, t1.remarks 
    FROM roles t1 
    LEFT JOIN roles_menus t2 ON (t2.role_id = t1.id AND t2.menu_id = ?)
    WHERE t1.id IN (SELECT t3.role_id FROM roles_menus t3 WHERE t3.menu_id = ?) 
    ORDER BY t1.sort, t1.update_time DESC 
    LIMIT ?, ?`
  const res: any = await execTrans([
    { sql: sql1, data: [options.menuId] },
    { sql: sql2, data: [options.menuId, options.menuId, pageNo, options.pageSize] }
  ])

  return {
    total: res[0][0]['total'],
    data: res[1]
  }
}

/**
 * 根据 userId 获取所有关联的菜单列表，返回数组或[]
 * 参数 isTree 菜单是否为树结构
 */
export const getAllMenuByUserId = async (
  options: RoleMenuByUserIdParams,
  isTree?: BaseStatus
): Promise<MenuReturnOptions | RoleMenuByRoleIdReturn> => {
  if (isTree === '1') {
    const sql = `SELECT 
        t1.id, t1.parent_code, t2.label AS parent_label, t1.code, t1.label, 
        t1.sort, t1.configurable, t1.create_time, t1.update_time, t1.terminal, t1.remarks 
      FROM menus t1 
      LEFT JOIN menus t2 ON t1.parent_code = t2.code
      WHERE 
        t1.id IN (
          SELECT t3.menu_id FROM roles_menus t3 
          WHERE t3.role_id IN (
            SELECT t4.role_id FROM users_roles t4 
            WHERE t4.user_id = ?
          )
        )
      ORDER BY t1.sort, t1.update_time DESC`
    const res = <MenuOptions[]>await query(sql, options.userId)
    return {
      total: 0,
      data: handleMenuTree(res)
    }
  } else {
    options.pageNo = options.pageNo || 1
    options.pageSize = options.pageSize || 10
    const pageNo = (options.pageNo - 1) * options.pageSize
    const sql1 = `
      SELECT 
        COUNT(t1.id) AS total 
      FROM menus t1 
      WHERE 
        t1.id IN (
          SELECT t3.menu_id FROM roles_menus t3 
          WHERE t3.role_id IN (
            SELECT t4.role_id FROM users_roles t4 
            WHERE t4.user_id = ?
          )
        )`
    const sql2 = `
      SELECT 
        t1.id, t1.parent_code, t2.label AS parent_label, t1.code, t1.label, 
        t1.sort, t1.configurable, t1.create_time, t1.update_time, t1.terminal, t1.remarks 
      FROM menus t1 
      LEFT JOIN menus t2 ON t1.parent_code = t2.code
      WHERE 
        t1.id IN (
          SELECT t3.menu_id FROM roles_menus t3 
          WHERE t3.role_id IN (
            SELECT t4.role_id FROM users_roles t4 
            WHERE t4.user_id = ?
          )
        )
      ORDER BY t1.sort, t1.update_time DESC 
      LIMIT ?, ?`
    const res: any = await execTrans([
      { sql: sql1, data: [options.userId] },
      { sql: sql2, data: [options.userId, pageNo, options.pageSize] }
    ])
    return {
      total: res[0][0]['total'],
      data: res[1]
    }
  }
}

/**
 * 根据 menuId 获取所有关联的用户列表，返回数组或[]
 */
export const getAllUserByMenuId = async (options: RoleMenuByMenuIdParams): Promise<UserListReturn> => {
  options.pageNo = options.pageNo || 1
  options.pageSize = options.pageSize || 10
  const pageNo = (options.pageNo - 1) * options.pageSize
  const sql1 = `
    SELECT 
      COUNT(t1.id) AS total 
    FROM users t1 
    WHERE 
      t1.id IN (
        SELECT t3.user_id FROM users_roles t3
        WHERE t3.role_id IN (
          SELECT t4.role_id FROM roles_menus t4
          WHERE t4.menu_id = ?
        )
      )`
  let sql2: string
  if (options.simple === '1') {
    sql2 = `
      SELECT 
        t1.id, t1.phone, t1.username, t1.create_time, t1.update_time, t1.terminal
      FROM users t1 
      WHERE 
        t1.id IN (
          SELECT t3.user_id FROM users_roles t3
          WHERE t3.role_id IN (
            SELECT t4.role_id FROM roles_menus t4
            WHERE t4.menu_id = ?
          )
        ) 
      ORDER BY t1.update_time DESC 
      LIMIT ?, ?`
  } else {
    sql2 = `
      SELECT 
        t1.id, t1.phone, t1.username, t1.sex, t2.label as sex_label, 
        t1.birthday, t1.avatar, t1.professional, t1.address, 
        t1.create_time, t1.update_time, t1.terminal, t1.remarks 
      FROM users t1 
      LEFT JOIN tags t2 ON t1.sex = t2.code 
      WHERE 
        t1.id IN (
          SELECT t3.user_id FROM users_roles t3
          WHERE t3.role_id IN (
            SELECT t4.role_id FROM roles_menus t4
            WHERE t4.menu_id = ?
          )
        ) 
      ORDER BY t1.update_time DESC 
      LIMIT ?, ?`
  }
  const res: any = await execTrans([
    { sql: sql1, data: [options.menuId] },
    { sql: sql2, data: [options.menuId, pageNo, options.pageSize] }
  ])
  const userData = <UserOptions[]>res[1]
  await handleUser(userData, options.simple)
  return {
    total: res[0][0]['total'],
    data: userData
  }
}
