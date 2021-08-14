/**
 * @description 权限接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
*/

// 权限对象接口类型
export interface PermissionOptions extends BaseOptions {
  id: string,
  code: string,
  label: string,
  parent_code?: string,
  href?: string,
  sort?: number,
}

// 权限数组接口类型
export interface PermissionListOptions extends PermissionOptions {
  children: PermissionListOptions[]
}

// 自定义权限接口
export interface PermissionCustomOptions extends ObjectAny {
  code: string,
  children: PermissionCustomOptions[]
}
