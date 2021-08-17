/**
 * @description 点赞接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
*/

// 点赞对象接口类型
export interface LikeOptions extends BaseOptions {
  id: string,
  target_id: string,
  create_user: string,
  type: string,
  create_user_name?: string,
  type_label?: string,
}

// 点赞参数
export interface LikeParams {
  userId: string,
  pageNo: number,
  pageSize: number,
}

// 点赞列表返回
export interface LikeReturn {
  total: number,
  data: LikeOptions[]
}
