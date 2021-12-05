/**
 * @description 权限获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query, execTrans } from "../../../db";
import { Context, Next } from 'koa';
import { getSelectWhereAsKeywordData, getOrderByKeyword } from '../../../utils/handle-sql'
import { PermissionOptions, PermissionParmsOptions, PermissionReturnOptions } from './interface'
import { getAllRoleByUserId } from '../users-roles/get'
import { getAllPermissionByRoleId } from '../roles-permissions/get'
import _ from 'lodash'

// 获取指定的某个权限
export const doPermissionGetOne = async (ctx: Context, next: Next) => {
  const data = await getPermissionOne(ctx.params.id)
  throw new Success({ data });
}

// 获取权限列表
export const doPermissionGetList = async (ctx: Context, next: Next) => {
  const parmas: PermissionParmsOptions = {
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
    keyword: ctx.params.keyword
  }
  const data = await getPermissionList(parmas)
  if (ctx.params.userId) {
    // 若传 userId 增加`checked` 字段，表示是否与该用户关联
    const userRoleList = await getAllRoleByUserId({ userId: ctx.params.userId })
    const roleIds = _.join(_.map(userRoleList, item => item.id))
    const rolePermissionList = await getAllPermissionByRoleId({ roleIds: roleIds })
    const rolePermissionIdsList = _.map(rolePermissionList, item => item.id)
    _handleRolePermission(data.data, rolePermissionIdsList)
  } else if (ctx.params.roleId) {
    // 若传 roleId 增加`checked` 字段，表示是否与该角色关联
    const rolePermissionList = await getAllPermissionByRoleId({ roleId: ctx.params.roleId })
    const rolePermissionIds = _.map(rolePermissionList, item => item.id)
    _handleRolePermission(data.data, rolePermissionIds)
  }
  throw new Success({ total: data.total, data: data.data })
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
 * 获取权限列表，返回数组或[]
*/
export const getPermissionList = async (params: PermissionParmsOptions): Promise<PermissionReturnOptions> => {
  const pageNo = (params.pageNo - 1) * params.pageSize
  // 处理搜索
  const sqlParams = getSelectWhereAsKeywordData({
    valid: ['label'],
    data: params,
    prefix: 'WHERE'
  })
  // 处理搜索排序
  const orderParams = getOrderByKeyword({
    valid: ['label'],
    data: params,
  })
  const sql1 = `SELECT COUNT(id) as total FROM permissions ${sqlParams.sql}`
  const data1 = [...sqlParams.data]
  const sql2 = `SELECT id, code, ${orderParams.orderValid} href, sort, create_time, update_time, terminal, remarks FROM permissions ${sqlParams.sql} ORDER BY ${orderParams.orderSql} sort, update_time DESC LIMIT ?, ?`
  const data2 = [...data1, pageNo, params.pageSize]
  const res: any = await execTrans([{ sql: sql1, data: data1 }, { sql: sql2, data: data2 }])
  return {
    total: res[0][0]['total'],
    data: res[1]
  }
}

// 处理权限是否与角色/权限关联
function _handleRolePermission(data: PermissionOptions[], targetData: string[]) {
  data.forEach(item => {
    if (targetData.indexOf(item.id) === -1)
      item.checked = false
    else
      item.checked = true
  })
}
