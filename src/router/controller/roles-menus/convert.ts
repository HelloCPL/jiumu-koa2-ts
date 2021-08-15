/**
 * @description: 角色-菜单关联模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
*/

import { Context, Next } from 'koa'
import { Message } from '../../../enums'
import { isExist } from '../convert'
import { query } from '../../../db';
import { ExceptionParameter } from '../../../utils/http-exception';
import { getMenuByParentCode } from '../menus/get'
import { MenuListOptions } from '../menus/interface'

/**
 * 新增时 
 * 先判断角色是否不存在
 * 再判断菜单是否不存在
 * 获取其父级菜单，如果父级菜单，判断父级菜单是否不存在
 * 最后判断角色-菜单关联是否已存在
*/
export const doRoleMenuAddConvert = async (ctx: Context, next: Next) => {
  // 先判断角色是否不存在
  await isExist({
    table: 'roles',
    where: [{ key: 'id', value: ctx.params.roleId }],
    throwType: false,
    message: Message.unexistRole
  })
  // 再判断菜单是否不存在
  await isExist({
    table: 'menus',
    where: [{ key: 'id', value: ctx.params.menuId }],
    throwType: false,
    message: Message.unexistMenus
  })
  // 获取其父级菜单，如果父级菜单，判断父级菜单是否不存在
  const sql = `SELECT t2.id as parentMenuId FROM menus t1 LEFT JOIN menus t2 ON t1.parent_code = t2.code WHERE t1.id = ?`
  const res: any = await query(sql, ctx.params.menuId)
  if (res && res.length && res[0]['parentMenuId']) {
    await isExist({
      table: 'roles_menus',
      where: [
        { key: 'role_id', value: ctx.params.roleId },
        { key: 'menu_id', value: res[0]['parentMenuId'] },
      ],
      throwType: false,
      message: Message.relevantNoParent
    })
  }
  // 最后判断角色-菜单关联是否已存在
  await isExist({
    table: 'roles_menus',
    where: [
      { key: 'role_id', value: ctx.params.roleId },
      { key: 'menu_id', value: ctx.params.menuId },
    ],
    throwType: true,
    message: Message.existRoleMenu
  })
  await next()
}

/**
 * 删除时 
 * 判断角色-菜单关联是否不存在
 * 获取其子级菜单列表，判断子级菜单是否与该角色有关联
*/
export async function doRoleMenuDeleteConvert(ctx: Context, next: Next) {
  // 判断角色-菜单关联是否不存在
  const sql = `SELECT t1.role_id, t1.menu_id, t2.code FROM roles_menus t1 LEFT JOIN menus t2 ON t1.menu_id = t2.id WHERE t1.id = ?`
  const res: any = await query(sql, ctx.params.id)
  if (!(res && res.length && res[0]['menu_id']))
    throw new ExceptionParameter({ message: Message.unexistRoleMenu })
  // 获取其子级菜单列表，判断子级菜单是否与该角色有关联
  if (res[0]['code']) {
    const menuList: MenuListOptions[] = await getMenuByParentCode(res[0]['code'])
    if (menuList && menuList.length) {
      const menuIds = _handleMenuList(menuList)
      const sql2 = `SELECT id FROM roles_menus WHERE role_id = ? AND FIND_IN_SET(menu_id, ?)`
      const data2 = [res[0]['role_id'], menuIds]
      const res2: any = await query(sql2, data2)
      if (res2 && res2.length)
        throw new ExceptionParameter({ message: Message.relevantHasChildren })
    }
  }
  await next()
}

// 处理子级菜单 ids 
function _handleMenuList(data: MenuListOptions[]): string {
  let menuIdList: string[] = []
  const _handleList = ((arr: MenuListOptions[]) => {
    arr.forEach(item => {
      if (item.id) menuIdList.push(item.id)
      if (item.children && item.children.length)
        _handleList(item.children)
    })
  })
  _handleList(data)
  return menuIdList.join(',')
}
