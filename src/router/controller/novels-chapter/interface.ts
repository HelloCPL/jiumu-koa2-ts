/**
 * @description 小说章节接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
 */

// 小说章节接口类型
export interface NovelChapterOptions extends BaseOptions {
  id: string
  novel_id: string
  novel_name?: string
  novel_author?: string
  title: string
  content: string
  sort: number
  is_secret: string
  is_draft: string
  create_user: string
  create_user_name?: string
  create_user_avatar?: any
  is_like?: string
  like_count?: number
  is_collection?: string
  collection_count?: number
  comment_count?: number
}

// 获取列表参数类型接口
export interface NovelChapterListParams {
  novelId: string
  pageNo: number
  pageSize: number
  userId: string
  isSecret?: string
  isDraft?: string
  isConcise?: string
  showUserInfo?: any
}

// 列表获取返回类型
export interface NovelChapterListReturn {
  total: number
  data: NovelChapterOptions[]
}

export interface NovelChapterOneParams {
  id: string
  userId: string
  showUserInfo?: any
}

export interface handleNovalChapterParams {
  userId: string
  showUserInfo?: any
  isConcise?: string
}
