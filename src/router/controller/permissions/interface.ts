/**
 * @description 权限接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
 */

// 权限对象接口类型
export interface PermissionOptions extends BaseOptions {
  id: string
  code: string
  label: string
  parent_code?: string
  href?: string
  sort?: number
  checked_role_id?: BaseStatus
  checked_user_id?: BaseStatus
}

// 权限参数类型
export interface PermissionParamsOptions {
  pageNo: number
  pageSize: number
  keyword?: string
  highlight?: string
  userId?: string
  roleId?: string
}

// 权限列表返回
export interface PermissionReturnOptions {
  total: number
  data: PermissionOptions[]
}

export interface PermissionParams {
  userId?: string
  roleId?: string
}
