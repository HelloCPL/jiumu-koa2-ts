/**
 * @description 角色-菜单关联接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
*/

// 角色-菜单关联对象接口类型
export interface RoleMenuOptions extends BaseOptions {
  id: string,
  role_id: string,
  menu_id: string
}

// 角色-菜单关联获取关联菜单参数接口类型
export interface RoleMenuByRoleIdParams {
  roleId?: string,
  roleIds?: string
}

// 角色-菜单关联获取关联角色参数接口类型
export interface RoleMenuByMenuIdParams {
  menuId?: string,
  menuIds?: string
}