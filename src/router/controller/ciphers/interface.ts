/**
 * @description 口令接口类型
 * @author cpl
 * @create 2023-03-14 15:48:33
 */

// 获取本人的某个口令参数类型
export interface CipherOneParams {
  id: string
  userId: string
}

// 获取本人口令列表参数类型
export interface CipherListParams {
  pageNo: number
  pageSize: number
  userId: string
  keyword?: string
  type?: string
  classify?: string
  highlight?: string
}

// 口令对象接口类型
export interface CipherOptions extends BaseOptions {
  id: string
  account: string
  cipher: string
  type: string
  type_label?: string
  classify?: any
  sort?: number
  key_str?: string
  iv_str?: string
}

// 口令列表获取返回类型
export interface CipherListReturn {
  total: number
  data: CipherOptions[]
}
