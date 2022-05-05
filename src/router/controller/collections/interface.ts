/**
 * @description 收藏接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
*/

// 收藏对象接口类型
export interface CollectionOptions extends BaseOptions {
  id: string,
  target_id: string,
  create_user: string,
  type: string,
  create_user_name?: string,
  type_label?: string,
}

// 收藏参数
export interface CollectionParams {
  userId: string,
  pageNo: number,
  pageSize: number,
  type?: string
}

// 收藏列表返回
export interface CollectionReturn {
  total: number,
  data: CollectionOptions[]
}
