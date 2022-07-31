/**
 * @description 角色接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
*/

// 角色对象接口类型
export interface RoleOptions extends BaseOptions {
  id: string,
  code: string,
  label: string,
  sort?: number,
}

// 角色参数
export interface RoleParamsOptions {
	pageNo: number
	pageSize: number
	keyword?: string
	highlight?: string
	userId?: string
	permissionId?: string
	menuId?: string
}

// 角色列表返回
export interface RoleReturnOptions {
  total: number,
  data: RoleOptions[]
}
