/**
 * @description 菜单获取
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { query } from '@/db'
import { Context } from 'koa'
import { MenuOptions, MenuListOptions } from './interface'
import { getTree } from '@/utils/tools'

// 获取指定的某个菜单
export const doMenuGetOne = async (ctx: Context) => {
  const data = await getMenuOne(ctx._params.id)
  throw new Success({ data })
}

// 获取某类菜单
export const doMenuGetByParentCode = async (ctx: Context) => {
  const parentCode = ctx._params.parentCode || ''
  const data: MenuListOptions[] = await getMenuByParentCode(
    parentCode,
    ctx._params.userId,
    ctx._params.roleId
  )
  throw new Success({ data })
}

/**
 * 获取指定的某个菜单，返回对象或null
 */
export const getMenuOne = async (id: string): Promise<MenuOptions | null> => {
  const sql: string =
    'SELECT t1.id, t1.parent_code, t2.label AS parent_label, t1.code, t1.configurable, t1.label, t1.sort, t1.create_time, t1.update_time, t1.terminal, t1.remarks FROM menus t1 LEFT JOIN menus t2 ON t1.parent_code = t2.code WHERE t1.code = ? OR t1.id = ?'
  const data = [id, id]
  let res: any = await query(sql, data)
  res = res[0] || null
  return res
}

/**
 * 获取某类菜单，返回数组或[]
 */
export const getMenuByParentCode = async (
  parentCode: string,
  userId?: string,
  roleId?: string
): Promise<MenuListOptions[]> => {
  if (global._results._menus && global._results._menus.length) {
    return <MenuListOptions[]>getTree({
      data: global._results._menus,
      parentCode
    })
  } else {
    const data: any[] = []
    // 是否与指定角色关联
    let sqlRoleId = ''
    let sqlRoleIdLeft = ''
    if (roleId) {
      sqlRoleId = 't3.id AS checked_role_id,'
      sqlRoleIdLeft = 'LEFT JOIN roles_menus t3 ON (t3.role_id = ? AND t3.menu_id = t1.id)'
      data.push(roleId)
    }
    // 是否与指定用户关联
    let sqlUserId = ''
    let sqlUserIdLeft = ''
    if (userId) {
      sqlUserId = 't4.id AS checked_user_id,'
      sqlUserIdLeft =
        'LEFT JOIN roles_menus t4 ON (t4.menu_id = t1.id AND t4.role_id IN (SELECT t5.role_id FROM users_roles t5 WHERE t5.user_id = ?))'
      data.push(userId)
    }
    const sql = `SELECT DISTINCT t1.id, t1.parent_code, t2.label AS parent_label, t1.code, t1.label, t1.sort, t1.configurable, t1.create_time, t1.update_time, t1.terminal, ${sqlRoleId} ${sqlUserId} t1.remarks FROM menus t1 LEFT JOIN menus t2 ON t1.parent_code = t2.code ${sqlRoleIdLeft} ${sqlUserIdLeft}`
    const res: MenuOptions[] = <MenuOptions[]>await query(sql, data)
    // 若与指定角色关联
    if (roleId) {
      res.forEach((item) => {
        if (item.checked_role_id) item.checked_role_id = '1'
        else item.checked_role_id = '0'
      })
    }
    // 若与指定用户关联
    if (userId) {
      res.forEach((item) => {
        if (item.checked_user_id) item.checked_user_id = '1'
        else item.checked_user_id = '0'
      })
    }
    global._results._menus = [...res]
    return <MenuListOptions[]>getTree({
      data: global._results._menus,
      parentCode
    })
  }
}
