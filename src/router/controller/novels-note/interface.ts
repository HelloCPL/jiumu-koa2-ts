/**
 * @description 笔记接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
 */

// 笔记目标类型
export interface NovelNoteTargetOptions {
  id: string
  title?: string
  type: string
  typeLabel?: string
}

// 笔记接口类型
export interface NovelNoteOptions extends BaseOptions {
  id: string
  title: string
  content: string
  classify?: any
  sort: number
  is_secret: string
  create_user: string
  create_user_name?: string
  is_self?: string
}

// 获取列表参数类型接口
export interface NovelNoteListParams {
  targetId: string
  pageNo: number
  pageSize: number
  userId: string // 当前访问者
  keyword?: string
  highlight?: string
  isSecret?: string
  classify?: string
  showUserInfo?: any
}

// 列表获取返回类型
export interface NovelNoteListReturn {
  total: number
  data: NovelNoteOptions[]
}

export interface NovelNoteOneParams {
  id: string
  userId: string
  showUserInfo?: any
}

export interface NoteChapterParams {
  userId: string
  targetId?: string
  showUserInfo?: any
}
