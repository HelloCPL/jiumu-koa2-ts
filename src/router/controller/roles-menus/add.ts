/**
 * @description 角色-菜单关联新增
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Terminal } from "../../../enums";
import { formatDate, getUuId } from "../../../utils/tools";

/**
 * 角色-菜单关联新增
*/
export const doRoleMenuAdd = async (ctx: Context, next: Next) => {
  const sql: string = `INSERT roles_menus (id, role_id, menu_id, create_time, terminal) VALUES (?, ?, ?, ?, ?)`
  const data = [getUuId(), ctx._params.roleId, ctx._params.menuId, formatDate(new Date()), Terminal[ctx._terminal]]
  await query(sql, data)
  throw new Success();
}
