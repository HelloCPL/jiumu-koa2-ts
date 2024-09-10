/**
 * @description 角色获取
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { query, execTrans, getSelectWhereKeyword } from '@/db'
import { Context } from 'koa'
import { RoleOptions, RoleParamsOptions, RoleReturnOptions } from './interface'
import { getAllRoleByUserId } from '../users-roles/get'
import { UserRoleByUserIdParams } from '../users-roles/interface'
import { handleRole } from './utils'

// 获取指定的某个角色
export const doRoleGetOne = async (ctx: Context) => {
  const data = await getMenuOne(ctx._params.id)
  throw new Success({ data })
}

// 我的角色列表
export const doRoleGetAllSelf = async (ctx: Context) => {
  const params: UserRoleByUserIdParams = {
    userId: ctx._user.id,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10
  }
  const data = <RoleReturnOptions>await getAllRoleByUserId(params)
  throw new Success(data)
}

// 获取角色列表
export const doRoleGetList = async (ctx: Context) => {
  const parmas: RoleParamsOptions = {
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    keyword: ctx._params.keyword,
    highlight: ctx._params.highlight,
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
  const sql: string = `
    SELECT 
      t1.id, t1.code, t1.label, t1.sort, t1.configurable, 
      t1.create_time, t1.update_time, t1.terminal, t1.remarks 
    FROM roles t1 
    WHERE t1.code = ? OR t1.id = ?`
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
  const keywordResult = getSelectWhereKeyword({
    valid: ['t1.label'],
    data: params,
    prefix: 'WHERE',
    isOrderKeyword: true
  })
  const sql1 = `SELECT COUNT(t1.id) AS total FROM roles t1 ${keywordResult.sql}`
  const data1 = [...keywordResult.data]
  const data2 = []
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
  const sql2 = `
    SELECT 
      t1.id, t1.code, t1.sort, t1.configurable, t1.create_time, 
      ${keywordResult.orderFields} 
      ${sqlUserId} 
      ${sqlPermissionId} 
      ${sqlMenuId} 
      t1.update_time, t1.terminal, t1.remarks 
    FROM roles t1 
    ${sqlUserIdLeft} 
    ${sqlPermissionIdLeft} 
    ${keywordResult.sql} 
    ${sqlMenuIdLeft} 
    ORDER BY ${keywordResult.orderSql} t1.sort, t1.update_time DESC 
    LIMIT ?, ?`
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  handleRole(res[1], {
    userId: params.userId,
    permissionId: params.permissionId,
    menuId: params.menuId
  })
  return {
    total: res[0][0]['total'],
    data: res[1]
  }
}
