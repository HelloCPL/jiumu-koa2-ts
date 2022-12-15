/**
 * @description 博客文章接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
 */

// 博客文章对象接口类型
export interface ArticleOptions extends BaseOptions {
  id: string
  title: string
  content: string
  content_type: string
  content_type_label?: string
  cover_img?: any
  attachment?: any
  type: string
  type_label?: string
  classify?: any
  is_draft: string
  is_secret?: string
  is_top?: string
  sort?: number
  create_user: string
  create_user_name?: string
  create_user_avatar?: any
  is_self?: string
  is_like?: string
  like_count?: number
  is_collection?: string
  collection_count?: number
  comment_count?: number
}

// 博客文章列表获取参数类型
export interface ArticleListParams {
  pageNo: number
  pageSize: number
  userId: string
  keyword?: string
  highlight?: string
  createUser?: string
  type?: string
  classify?: string
  isDraft?: string
  isSecret?: string
  showUserInfo?: any
}

// 博客文章列表获取返回类型
export interface ArticleListReturn {
  total: number
  data: ArticleOptions[]
}

export interface ArticleOneParams {
  id: string
  userId: string
  showUserInfo?: any
}
