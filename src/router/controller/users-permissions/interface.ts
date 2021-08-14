/**
 * @description 用户-额外权限关联接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
*/

// 用户-额外权限关联对象接口类型
export interface UserPermissionOptions extends BaseOptions {
  id: string,
  permission_id: string,
  user_id: string,
}
