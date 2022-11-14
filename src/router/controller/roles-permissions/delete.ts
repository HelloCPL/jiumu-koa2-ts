/**
 * @description 角色-权限关联删除
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context, Next } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'

/**
 * 角色-权限关联删除
 */
export const doRolePermissionDelete = async (ctx: Context, next: Next) => {
  const sql: string = `DELETE FROM roles_permissions WHERE id = ? OR (role_id = ? AND permission_id = ?)`
  const data = [ctx._params.id, ctx._params.roleId, ctx._params.permissionId]
  await query(sql, data)
  throw new Success()
}
