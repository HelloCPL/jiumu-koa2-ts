/**
 * @description 小说接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
*/

// 小说对象接口类型
export interface NovelOptions extends BaseOptions {
  id: string,
  name: string,
  introduce: string,
  classify?: any,
  type?: string,
  type_label?: string,
  author: string,
  is_secret?: string,
  is_draft: string,
  create_user: string,
  create_user_name?: string,
  is_self?: string,
  is_like?: string,
  like_count?: number,
  chapter_like_count?: number,
  is_collection?: string,
  collection_count?: number,
  chapter_collection_count?: number,
  comment_count?: number,
  chapter_comment_count?:number,
  chapter_count?: number
}

// 获取列表参数类型接口
export interface NovelListParams {
  pageNo: number,
  pageSize: number,
  userId: string, // 当前访问者
  keyword?: string,
  createUser?: string, // 指定作者
  type?: string,
  classify?: string,
  isDraft?: string,
  isSecret?: string
}

// 小说列表获取返回类型
export interface NovelListReturn {
  total: number,
  data: NovelOptions[]
}