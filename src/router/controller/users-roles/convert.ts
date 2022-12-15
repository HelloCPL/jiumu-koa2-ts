/**
 * @description: 用户-角色关联模块中间件
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context, Next } from 'koa'
import { query } from '@/db'
import { Message } from '@/enums'
import { Success } from '@/utils/http-exception'
import { isExist } from '../convert'

/**
 * 新增时
 * 判断用户是否不存在
 * 判断角色是否不存在
 * 判断用户-角色关联是否已存在
 */
export const doUserRoleAddConvert = async (ctx: Context, next: Next) => {
  //  判断用户是否不存在
  await isExist({
    table: 'users',
    where: [{ key: 'id', value: ctx._params.userId }],
    throwType: false,
    message: Message.unexistUser
  })
  // 判断角色是否不存在
  await isExist({
    table: 'roles',
    where: [{ key: 'id', value: ctx._params.roleId }],
    throwType: false,
    message: Message.unexistRole
  })
  // 判断用户-角色关联是否已存在
  const flag = await _isExist(ctx)
  if (flag) throw new Success()
  await next()
}

/**
 * 删除时
 * 判断用户-角色关联是否不存在
 */
export async function doUserRoleDeleteConvert(ctx: Context, next: Next) {
  // 判断用户-角色关联是否不存在
  const flag = await _isExist(ctx)
  if (!flag) throw new Success()
  await next()
}

// 判断关联是否存在
async function _isExist(ctx: Context): Promise<boolean> {
  const sql = 'SELECT t1.id FROM users_roles t1 WHERE t1.id = ? OR (t1.role_id = ? AND t1.user_id = ?)'
  const data = [ctx._params.id, ctx._params.roleId, ctx._params.userId]
  const res: any = await query(sql, data)
  return res && res.length
}
