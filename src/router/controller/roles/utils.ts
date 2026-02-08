import { RoleOptions, RoleParams } from './interface'

/**
 * 处理角色数据
 * @param datas 原始数据
 * @param params.roleId? 角色 id
 * @param params.userId? 用户 id
 */
export const handleRole = (datas: RoleOptions[], params: RoleParams = {}) => {
  datas.forEach((item) => {
    // 若与指定用户关联
    if (params.userId) {
      if (item.checked_user_id) item.checked_user_id = '1'
      else item.checked_user_id = '0'
    }
    // 若与指定权限关联
    if (params.permissionId) {
      if (item.checked_permission_id) item.checked_permission_id = '1'
      else item.checked_permission_id = '0'
    }
    // 若与指定菜单关联
    if (params.menuId) {
      if (item.checked_menu_id) item.checked_menu_id = '1'
      else item.checked_menu_id = '0'
    }
  })
}
