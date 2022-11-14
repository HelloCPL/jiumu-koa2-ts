/**
 * @description 登录信息类型
 * @author chen
 * @update 2021-08-13 21:45:19
 */

// 登录信息对象接口类型
export interface LoginInfoOptions extends BaseOptions {
  id: string
  user_id: string
  user_agent: string
}

// 登录信息列表参数类型
export interface LoginInfoListParams {
  userId: string
  pageNo: number
  pageSize: number
}

// 登录信息列表返回类型
export interface LoginInfoListReturn {
  total: number
  data: LoginInfoOptions[]
}
