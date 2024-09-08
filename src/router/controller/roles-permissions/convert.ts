/**
 * @description: 角色-权限关联模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
 */

import { Context, Next } from 'koa'
import { query } from '@/db'
import { Message } from '@/enums'
import { ExceptionParameter, Success } from '@/utils/http-exception'
import { isExist } from '../convert'

/**
 * 新增时
 * 判断角色-权限关联是否已存在
 * 先判断角色是否不存在
 * 再判断权限是否不存在
 */
export const doRolePermissionAddConvert = async (ctx: Context, next: Next) => {
  // 判断角色-权限关联是否已存在
  const flag = await _isExist(ctx)
  if (flag) throw new Success()
  // 先判断角色是否不存在
  await isExist({
    table: 'roles',
    where: [{ key: 'id', value: ctx._params.roleId }],
    throwType: false,
    message: Message.unexistRole
  })
  // 再判断权限是否不存在
  await isExist({
    table: 'permissions',
    where: [{ key: 'id', value: ctx._params.permissionId }],
    throwType: false,
    message: Message.unexistPermission
  })
  await next()
}

/**
 * 删除时
 * 判断角色-权限关联是否不存在
 */
export async function doRolePermissionDeleteConvert(ctx: Context, next: Next) {
  // 判断角色-权限关联是否不存在
  const flag = await _isExist(ctx)
  if (!flag)
    throw new ExceptionParameter({
      message: Message.unexistRolePermission
    })
  await next()
}

// 判断关联是否存在
async function _isExist(ctx: Context): Promise<boolean> {
  const sql =
    'SELECT t1.id FROM roles_permissions t1 WHERE t1.id = ? OR (t1.role_id = ? AND t1.permission_id = ?)'
  const data = [ctx._params.id, ctx._params.roleId, ctx._params.permissionId]
  const res: any = await query(sql, data)
  return res && res.length
}
