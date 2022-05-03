/**
 * @description 角色获取
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '../../../utils/http-exception'
import { query, execTrans } from '../../../db'
import { Context, Next } from 'koa'
import { getSelectWhereAsKeywordData, getOrderByKeyword } from '../../../utils/handle-sql'
import { RoleOptions, RoleParamsOptions, RoleReturnOptions } from './interface'
import { getAllRoleByUserId } from '../users-roles/get'
import { UserRoleByUserIdParams } from '../users-roles/interface'

// 获取指定的某个角色
export const doRoleGetOne = async (ctx: Context, next: Next) => {
  const data = await getMenuOne(ctx._params.id)
  throw new Success({ data })
}

// 我的角色列表
export const doRoleGetAllSelf = async (ctx: Context, next: Next) => {
  // const data = await getMenuOne(ctx._params.id)
  const params: UserRoleByUserIdParams = {
    userId: ctx._user.id,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
  }
  const data = await getAllRoleByUserId(params)
  throw new Success(data)
}

// 获取角色列表
export const doRoleGetList = async (ctx: Context, next: Next) => {
  const parmas: RoleParamsOptions = {
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    keyword: ctx._params.keyword,
    userId: ctx._params.userId,
    permissionId: ctx._params.permissionId,
    menuId: ctx._params.menuId
  }
  const data = await getMenuList(parmas)
  throw new Success({ total: data.total, data: data.data })
}

/**
 * 获取指定的某个角色，返回对象或null
 */
export const getMenuOne = async (id: string): Promise<RoleOptions | null> => {
  const sql: string = `SELECT * FROM roles WHERE code = ? OR id = ?`
  const data = [id, id]
  let res: any = await query(sql, data)
  res = res[0] || null
  return res
}

/**
 * 获取角色列表
 */
export const getMenuList = async (params: RoleParamsOptions): Promise<RoleReturnOptions> => {
  const pageNo = (params.pageNo - 1) * params.pageSize
  // 处理搜索
  const sqlParams = getSelectWhereAsKeywordData({
    valid: ['t1.label'],
    data: params,
    prefix: 'WHERE',
  })
  // 处理搜索排序
  const orderParams = getOrderByKeyword({
    valid: ['t1.label'],
    data: params,
  })
  const sql1 = `SELECT COUNT(t1.id) AS total FROM roles t1 ${sqlParams.sql}`
  const data1 = [...sqlParams.data]
  let data2 = []
  // 是否与指定用户关联
  let sqlUserId = ''
  let sqlUserIdLeft = ''
  if (params.userId) {
    sqlUserId = 't2.id AS checked_user_id,'
    sqlUserIdLeft = 'LEFT JOIN users_roles t2 ON (t2.role_id = t1.id AND t2.user_id = ?)'
    data2.push(params.userId)
  }
  // 是否与指定权限关联
  let sqlPermissionId = ''
  let sqlPermissionIdLeft = ''
  if (params.permissionId) {
    sqlPermissionId = 't3.id AS checked_permission_id,'
    sqlPermissionIdLeft = 'LEFT JOIN roles_permissions t3 ON (t3.role_id = t1.id AND t3.permission_id = ?)'
    data2.push(params.permissionId)
  }
  // 是否与指定菜单关联
  let sqlMenuId = ''
  let sqlMenuIdLeft = ''
  if (params.menuId) {
    sqlMenuId = 't4.id AS checked_menu_id,'
    sqlMenuIdLeft = 'LEFT JOIN roles_menus t4 ON (t4.role_id = t1.id AND t4.menu_id = ?)'
    data2.push(params.menuId)
  }
  data2.push(...data1, pageNo, params.pageSize)
  const sql2 = `SELECT t1.id, t1.code, ${orderParams.orderValid} t1.sort, t1.create_time, t1.update_time, ${sqlUserId} ${sqlPermissionId} ${sqlMenuId} t1.terminal, t1.remarks FROM roles t1 ${sqlUserIdLeft} ${sqlPermissionIdLeft} ${sqlParams.sql} ${sqlMenuIdLeft} ORDER BY ${orderParams.orderSql} t1.sort, t1.update_time DESC LIMIT ?, ?`
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 },
  ])
  // 若与指定用户关联
  if (params.userId) {
    res[1].forEach((item: any) => {
      if (item.checked_user_id) item.checked_user_id = '1'
      else item.checked_user_id = '0'
    })
  }
  // 若与指定权限关联
  if (params.permissionId) {
    res[1].forEach((item: any) => {
      if (item.checked_permission_id) item.checked_permission_id = '1'
      else item.checked_permission_id = '0'
    })
  }
  // 若与指定菜单关联
  if (params.menuId) {
    res[1].forEach((item: any) => {
      if (item.checked_menu_id) item.checked_menu_id = '1'
      else item.checked_menu_id = '0'
    })
  }
  return {
    total: res[0][0]['total'],
    data: res[1],
  }
}
