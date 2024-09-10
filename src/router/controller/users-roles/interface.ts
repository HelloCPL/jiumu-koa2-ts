/**
 * @description 用户-角色关联接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
 */

// 用户-角色关联对象接口类型
export interface UserRoleOptions extends BaseOptions {
  id: string
  role_id: string
  user_id: string
}

// 用户-角色关联获取关联角色参数接口类型
export interface UserRoleByRoleIdParams {
  roleId: string
  pageNo?: number
  pageSize?: number
  simple?: BaseStatus
}

// 用户-角色关联获取关联用户参数接口类型
export interface UserRoleByUserIdParams {
  userId: string
  pageNo?: number
  pageSize?: number
}
