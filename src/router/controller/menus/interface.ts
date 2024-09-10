/**
 * @description 菜单接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
 */

// 菜单对象接口类型
export interface MenuOptions extends BaseOptions {
  id: string
  code: string
  label: string
  parent_code?: string
  sort: number
  checked?: BaseStatus
}

// 菜单数组接口类型
export interface MenuListOptions extends MenuOptions {
  children: MenuListOptions[]
}

// 自定义菜单接口
export interface MenuCustomOptions extends ObjectAny {
  code: string
  children: MenuCustomOptions[]
}

export interface MenuReturnOptions {
  total: number
  data: MenuOptions[]
}
