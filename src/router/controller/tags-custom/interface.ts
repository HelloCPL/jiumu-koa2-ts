/**
 * @description 用户自定义标签接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
 */

// 用户自定义标签对象接口类型
export interface TagCustomOptions extends BaseOptions {
  id: string
  label: string
  sort?: string
  create_user?: string
  create_user_name?: string
  create_user_avatar?: any
  is_self?: string
}

// 自定义标签类型
export interface TagCustomTypeOptions {
  type: string
  total: number
}

// 用户自定义标签列表获取参数类型
export interface TagCustomListParams {
  pageNo: number
  pageSize: number
  createUser?: string
  userId?: string
  type?: string
  keyword?: string
  highlight?: string
  showUserInfo?: any
}

// 用户自定义标签列表获取返回类型
export interface TagCustomListReturn {
  total: number
  data: TagCustomOptions[]
}

export interface TagCustomSelfParams {
  ids: string
  userId?: string
  ignoreUserId?: BaseStatus
  showUserInfo?: BaseStatus
}

export interface TagCustomHandleParams {
  userId?: string
  showUserInfo?: any
}
