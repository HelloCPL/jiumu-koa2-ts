/**
 * @description 用户接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
 */

import { TerminalType } from '@/enums'

// 用户对象接口类型
export interface UserOptions extends BaseOptions {
  id: string
  phone: string
  password?: string
  username: string
  sex?: string
  birthday?: string
  avatar?: any
  professional?: string
  address?: string
}

// 用户数组接口类型
export interface UserListOptions extends UserOptions {
  children: UserListOptions[]
}

// token类型
export interface TokenOptions extends ObjectAny {
  id: string
  phone: string
  terminal: TerminalType
  'user-agent': string
}

// token参数类型
export interface TokenParamsOptions {
  id: string
  phone: string
  validTime: number
  key: string
}

// token保存参数类型
export interface TokenSaveParamsOptions {
  id: string
  terminal: TerminalType
  'user-agent': string
  key: string
}

// 获取用户列表参数类型
export interface UserListParams {
  pageNo: number
  pageSize: number
  keyword?: string
  highlight?: string
  simple?: string
}

// 获取用户列表返回类型
export interface UserListReturn {
  total: number
  data: UserOptions[]
}
