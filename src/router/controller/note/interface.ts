/**
 * 获取某个笔记的参数
 */
export interface NoteOneParams {
  id: string
  userId: string
  showUserInfo?: BaseStatus
}

// 获取列表参数类型接口
export interface NoteListParams {
  rootId?: string
  targetId?: string
  relevance?: BaseStatus
  pageNo: number
  pageSize: number
  userId: string // 当前访问者
  keyword?: string
  highlight?: BaseStatus
  isSecret?: BaseStatus
  classify?: string
  showUserInfo?: BaseStatus
}

/**
 * 笔记接口类型
 */
export interface NoteOptions extends BaseOptions {
  id: string
  root_id: string
  target_id: string
  title: string
  content: string
  classify?: any
  sort: number
  is_secret: string
  create_user: string
  create_user_name?: string
  create_user_avatar?: any
  is_self: string
}

// 列表获取返回类型
export interface NoteListReturn {
  total: number
  data: NoteOptions[]
}

/**
 * 笔记处理时的参数
 */
export interface NoteParams {
  userId: string
  showUserInfo?: BaseStatus
  showTargetRelevance?: BaseStatus
}
