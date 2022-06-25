/**
 * @description 问答接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
*/

// 问答对象接口类型
export interface QuestionOptions extends BaseOptions {
  id: string,
  title: string,
  content: string,
  classify?: any,
  is_draft: string,
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

// 问答列表获取参数类型
export interface QuestionListParams {
  pageNo: number,
  pageSize: number,
  userId: string,
  keyword?: string,
  classify?: string,
  createUser?: string,
  isDraft?:string,
  isSecret?:string
}

// 问答列表获取返回类型
export interface QuestionListReturn {
  total: number,
  data: QuestionOptions[]
}
