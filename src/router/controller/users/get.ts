/**
 * @description: 用户信息获取
 * @author chen
 * @update 2021-08-16 14:44:43
*/

import { Success } from '../../../utils/http-exception'
import { query, execTrans } from "../../../db";
import { Context, Next } from 'koa';
import { UserOptions, UserListParams, UserListReturn } from './interface'
import { getFileById } from '../files-info/get'
import { getAllRoleByUserId } from '../users-roles/get'
import { getAllPermissionByRoleId } from '../roles-permissions/get'
import { getAllMenuByRoleId } from '../roles-menus/get'
import { getAllTagByUserId } from '../users-tags/get'
import _ from 'lodash'
import { getSelectWhereAsKeywordData, getOrderByKeyword } from '../../../utils/handle-sql';

// 获取本用户信息
export const doUserGetSelf = async (ctx: Context, next: Next) => {
  const userInfo = await getUserOne(ctx.user.id)
  // 获取用户拥有的所有角色列表
  const roles = await getAllRoleByUserId({ userId: ctx.user.id })
  const roleIds = _.join(_.map(roles.data, item => item.id))
  // 获取用户拥有的所有权限列表
  const permissions = await getAllPermissionByRoleId({ roleIds })
  // 获取用户拥有的所有菜单列表
  const menus = await getAllMenuByRoleId({ roleIds }, true)
  // 获取用户拥有的所有特殊标签
  const tags = await getAllTagByUserId({ userId: ctx.user.id })
  throw new Success({ data: { userInfo, roles, permissions, menus, tags } });
}

// 获取指定用户基本信息
export const doUserGetBase = async (ctx: Context, next: Next) => {
  const data = await getUserOne(ctx.params.id)
  throw new Success({ data });
}

// 获取用户列表基本信息
export const doUserGetList = async (ctx: Context, next: Next) => {
  let params = {
    pageNo: ctx.params.pageNo * 1 || 1,
    pageSize: ctx.params.pageSize * 1 || 10,
    keyword: ctx.params.keyword
  }
  const data = await getUserList(params)
  throw new Success(data);
}

/**
 * 获取指定的某个用户，返回对象或null
*/
export const getUserOne = async (id: string): Promise<UserOptions | null> => {
  const sql: string = `SELECT t1.id, t1.phone, t1.username, t1.sex, t2.label AS sexLabel, t1.birthday, t1.avatar, t1.professional, t1.address, t1.create_time, t1.update_time, t1.terminal, t1.remarks FROM users t1 LEFT JOIN tags t2 ON t1.sex = t2.code WHERE t1.id = ?`
  const res: any = await query(sql, id)
  if (res && res.length) {
    let userInfo: UserOptions = <UserOptions>res[0]
    userInfo.avatar = await getFileById(userInfo.avatar, userInfo.id)
    return userInfo
  } else return null
}

/**
 * 获取用户列表基本信息，返回数组或[]
*/
export const getUserList = async (options: UserListParams): Promise<UserListReturn> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  // 处理搜索关键字
  const sqlParams = getSelectWhereAsKeywordData({
    valid: ['t1.(phone)', 't1.username'],
    data: options,
    prefix: 'WHERE'
  })
  // 处理搜索排序
  const orderParams = getOrderByKeyword({
    valid: ['t1.(phone)', 't1.username'],
    data: options,
  })
  const sql1 = `SELECT COUNT(t1.id) AS total FROM users t1 ${sqlParams.sql}`
  const data1 = [...sqlParams.data]
  const sql2: string = `SELECT t1.id, ${orderParams.orderValid} t1.sex, t2.label AS sexLabel, t1.birthday, t1.avatar, t1.professional, t1.address, t1.create_time, t1.update_time, t1.terminal, t1.remarks FROM users t1 LEFT JOIN tags t2 ON t1.sex = t2.code ${sqlParams.sql} ORDER BY ${orderParams.orderSql} t1.update_time DESC LIMIT ?, ?`
  const data2 = [...sqlParams.data, pageNo, options.pageSize]
  const res: any = await execTrans([{ sql: sql1, data: data1 }, { sql: sql2, data: data2 }])
  const targetData: UserOptions[] = <UserOptions[]>res[1]
  for (let i = 0, len = targetData.length; i < len; i++) {
    targetData[i]['avatar'] = await getFileById(targetData[i]['avatar'], targetData[i]['id'])
  }
  return {
    total: res[0][0]['total'],
    data: targetData
  }
}

