/**
 * @description 资源接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
*/

// 资源对象接口类型
export interface SourceOptions extends BaseOptions {
  id: string,
  title: string,
  attachment: any,
  classify?: any,
  is_secret?: string,
  is_top?: string,
  sort?: number,
  create_user: string,
  create_user_name?: string,
  is_self?: string,
  is_like?: string,
  like_count?: number,
  is_collection?: string,
  collection_count?: number,
  comment_count?: number,
}

// 资源列表获取参数类型
export interface SourceListParams {
  pageNo: number,
  pageSize: number,
  userId: string,
  keyword?: string,
  type?: string,
  classify?: string,
  createUser?: string,
  isSecret?:string
}

// 资源列表获取返回类型
export interface SourceListReturn {
  total: number,
  data: SourceOptions[]
}
