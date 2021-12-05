/**
 * @description 角色获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query, execTrans } from "../../../db";
import { Context, Next } from 'koa';
import { getSelectWhereAsKeywordData, getOrderByKeyword } from '../../../utils/handle-sql'
import { RoleOptions, RoleParamsOptions, RoleReturnOptions } from './interface'
import { getAllRoleByPermissionId } from '../roles-permissions/get'
import { getAllRoleByUserId } from '../users-roles/get'
import { getAllRoleByMenuId } from '../roles-menus/get'
import _ from 'lodash'

// 获取指定的某个角色
export const doRoleGetOne = async (ctx: Context, next: Next) => {
  const data = await getMenuOne(ctx.params.id)
  throw new Success({ data });
}

// 我的所有角色
export const doRoleGetAllSelf = async (ctx: Context, next: Next) => {
  // const data = await getMenuOne(ctx.params.id)
  const data = await getAllRoleByUserId({ userId: ctx.user.id })
  throw new Success({ data });
}

// 获取角色列表
export const doRoleGetList = async (ctx: Context, next: Next) => {
  const parmas: RoleParamsOptions = {
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
    keyword: ctx.params.keyword
  }
  const data = await getMenuList(parmas)
  if (ctx.params.menuId) {
    // 增加`checked` 字段，表示是否与该菜单关联
    const menuList = await getAllRoleByMenuId({ menuId: ctx.params.menuId })
    const roleIdsList = _.map(menuList, item => item.id)
    _handleRoleData(data.data, roleIdsList)
  } else if (ctx.params.permissionId) {
    // 增加`checked` 字段，表示是否与该权限关联
    const roleList = await getAllRoleByPermissionId({ permissionId: ctx.params.permissionId })
    const roleIdsList = _.map(roleList, item => item.id)
    _handleRoleData(data.data, roleIdsList)
  } else if (ctx.params.userId) {
    // 增加`checked` 字段，表示是否与该用户关联
    const userList = await getAllRoleByUserId({ userId: ctx.params.userId })
    const roleIdsList = _.map(userList, item => item.id)
    _handleRoleData(data.data, roleIdsList)
  }
  throw new Success({ total: data.total, data: data.data });
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
    valid: ['label'],
    data: params,
    prefix: 'WHERE'
  })
  // 处理搜索排序
  const orderParams = getOrderByKeyword({
    valid: ['label'],
    data: params,
  })
  const sql1 = `SELECT COUNT(id) as total FROM roles ${sqlParams.sql}`
  const data1 = [...sqlParams.data]
  const sql2 = `SELECT id, code, ${orderParams.orderValid} sort, create_time, update_time, terminal, remarks FROM roles ${sqlParams.sql} ORDER BY ${orderParams.orderSql} sort, update_time DESC LIMIT ?, ?`
  const data2 = [...data1, pageNo, params.pageSize]
  const res: any = await execTrans([{ sql: sql1, data: data1 }, { sql: sql2, data: data2 }])
  return {
    total: res[0][0]['total'],
    data: res[1]
  }
}

// 处理角色是否与用户/权限关联
function _handleRoleData(data: RoleOptions[], targetData: string[]) {
  data.forEach(item => {
    if (targetData.indexOf(item.id) === -1)
      item.checked = false
    else
      item.checked = true
  })
}
