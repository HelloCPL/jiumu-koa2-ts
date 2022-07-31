/**
 * @description 角色-菜单关联接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
 */

// 角色-菜单关联对象接口类型
export interface RoleMenuOptions extends BaseOptions {
  id: string
  role_id: string
  menu_id: string
}

// 角色-菜单关联获取关联菜单参数接口类型
export interface RoleMenuByRoleIdParams {
  roleId: string
  pageNo?: number
  pageSize?: number
}

// 角色-菜单关联获取关联角色参数接口类型
export interface RoleMenuByMenuIdParams {
	menuId: string
	pageNo?: number
	pageSize?: number
	simple?: string
}

// 用户-菜单关联获取关联菜单参数接口类型
export interface RoleMenuByUserIdParams {
  userId: string
  pageNo?: number
  pageSize?: number
}

// 菜单返回结构
export interface RoleMenuByRoleIdReturn {
  total: number
  data: any[]
}
