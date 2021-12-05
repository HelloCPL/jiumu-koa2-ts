/**
 * @description: 置顶操作模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
*/

import { Context, Next } from 'koa'
import { validateRange } from '../../../utils/validator'
import { getAllRoleByUserId } from '../users-roles/get';
import { RoleOptions } from '../roles/interface';
import { ExceptionForbidden } from '../../../utils/http-exception';

/**
 * 置顶操作时 
 * 判断 type 是否系统标签500范围
 * 判断是否拥有管理员角色
*/
export const doTopUpdateConvert = async (ctx: Context, next: Next) => {
  // 判断 type 是否系统标签500范围
  await validateRange([
    {
      value: ctx.params.type,
      range: ['502', '503', '504', '505'],
      message: 'type参数必须为系统标签500范围'
    }
  ])
  // 判断是否管理员角色
  const res: RoleOptions[] = await getAllRoleByUserId({ userId: ctx.user.id })
  let flag = false
  if (res && res.length) {
    res.find((item): boolean => {
      if (item.code === 'super') {
        flag = true
        return true
      }
      return false
    })
  }
  if (!flag)
    throw new ExceptionForbidden()
  await next()
}