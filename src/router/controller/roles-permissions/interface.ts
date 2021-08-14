/**
 * @description 角色-权限关联接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
*/

// 角色-权限关联对象接口类型
export interface RolePermissionOptions extends BaseOptions {
  id: string,
  role_id: string,
  permission_id: string,
}

// 角色-权限关联获取关联权限参数接口类型
export interface RolePermissionByRoleIdParams {
  roleId?: string,
  roleIds?: string
}

// 角色-权限关联获取关联角色参数接口类型
export interface RolePermissionByPermissionIdParams {
  permissionId?: string,
  permissionIds?: string
}
