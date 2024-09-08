import { PermissionOptions, PermissionParams } from './interface'

/**
 * 处理权限数据
 * @param datas 原始数据
 * @param params.roleId? 角色 id
 * @param params.userId? 用户 id
 */
export const handlePermission = (datas: PermissionOptions[], params: PermissionParams = {}) => {
  datas.forEach((item) => {
    // 若与指定角色关联
    if (params.roleId) {
      if (item.checked_role_id) item.checked_role_id = '1'
      else item.checked_role_id = '0'
    }
    // 若与指定用户关联
    if (params.userId) {
      if (item.checked_user_id) item.checked_user_id = '1'
      else item.checked_user_id = '0'
    }
  })
}
