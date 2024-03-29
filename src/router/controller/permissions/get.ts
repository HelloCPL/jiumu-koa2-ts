/**
 * @description 权限获取
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '@/utils/http-exception'
import { query, execTrans } from '@/db'
import { Context } from 'koa'
import { getSelectWhereAsKeywordData, getOrderByKeyword } from '@/utils/handle-sql'
import { PermissionOptions, PermissionParmsOptions, PermissionReturnOptions } from './interface'

// 获取指定的某个权限
export const doPermissionGetOne = async (ctx: Context) => {
  const data = await getPermissionOne(ctx._params.id)
  throw new Success({ data })
}

// 获取权限列表
export const doPermissionGetList = async (ctx: Context) => {
  const parmas: PermissionParmsOptions = {
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    keyword: ctx._params.keyword,
    highlight: ctx._params.highlight,
    userId: ctx._params.userId,
    roleId: ctx._params.roleId
  }
  const data = await getPermissionList(parmas)
  throw new Success({ total: data.total, data: data.data })
}

/**
 * 获取指定的某个权限，返回对象或null
 */
export const getPermissionOne = async (id: string): Promise<PermissionOptions | null> => {
  const sql: string =
    'SELECT t1.id, t1.code, t1.label, t1.href, t1.sort, t1.configurable, t1.create_time, t1.update_time, t1.terminal, t1.remarks FROM permissions t1 WHERE t1.code = ? OR t1.id = ?'
  const data = [id, id]
  let res: any = await query(sql, data)
  res = res[0] || null
  return res
}

/**
 * 获取权限列表，返回数组或[]
 */
export const getPermissionList = async (params: PermissionParmsOptions): Promise<PermissionReturnOptions> => {
  const pageNo = (params.pageNo - 1) * params.pageSize
  // 处理搜索
  const sqlParams = getSelectWhereAsKeywordData({
    valid: ['t1.label', 't1.code'],
    data: params,
    prefix: 'WHERE'
  })
  // 处理搜索排序
  const orderParams = getOrderByKeyword({
    valid: ['t1.label', 't1.code'],
    data: params
  })
  const sql1 = `SELECT COUNT(t1.id) AS total FROM permissions t1 ${sqlParams.sql}`
  const data1 = [...sqlParams.data]
  const data2 = []
  // 是否与指定角色关联
  let sqlRoleId = ''
  let sqlRoleIdLeft = ''
  if (params.roleId) {
    sqlRoleId = 't2.id AS checked_role_id,'
    sqlRoleIdLeft = 'LEFT JOIN roles_permissions t2 ON (t2.role_id = ? AND t2.permission_id = t1.id)'
    data2.push(params.roleId)
  }
  // 是否与指定用户关联
  let sqlUserId = ''
  let sqlUserIdLeft = ''
  if (params.userId) {
    sqlUserId = 't3.id AS checked_user_id,'
    sqlUserIdLeft =
      'LEFT JOIN roles_permissions t3 ON (t3.permission_id = t1.id AND t3.role_id IN (SELECT t4.role_id FROM users_roles t4 WHERE t4.user_id = ?))'
    data2.push(params.userId)
  }
  data2.push(...data1, pageNo, params.pageSize)
  const sql2 = `SELECT t1.id, ${orderParams.orderValid} t1.href, t1.sort, t1.configurable, t1.create_time, t1.update_time, ${sqlRoleId} ${sqlUserId} t1.terminal, t1.remarks FROM permissions t1 ${sqlRoleIdLeft} ${sqlUserIdLeft} ${sqlParams.sql} ORDER BY  t1.sort, ${orderParams.orderSql} t1.update_time DESC LIMIT ?, ?`
  const res: any = await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 }
  ])
  // 若与指定角色关联
  if (params.roleId) {
    res[1].forEach((item: any) => {
      if (item.checked_role_id) item.checked_role_id = '1'
      else item.checked_role_id = '0'
    })
  }
  // 若与指定用户关联
  if (params.userId) {
    res[1].forEach((item: any) => {
      if (item.checked_user_id) item.checked_user_id = '1'
      else item.checked_user_id = '0'
    })
  }
  return {
    total: res[0][0]['total'],
    data: res[1]
  }
}
