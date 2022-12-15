/**
 * @description 用户-角色关联删除
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'

/**
 * 用户-角色关联删除
 */
export const doUserRoleDelete = async (ctx: Context) => {
  const sql: string = 'DELETE FROM users_roles WHERE id = ? OR (role_id = ? AND user_id = ?)'
  const data = [ctx._params.id, ctx._params.roleId, ctx._params.userId]
  await query(sql, data)
  throw new Success()
}
