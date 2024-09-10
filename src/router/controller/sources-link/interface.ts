export interface SourceLinkOptions extends BaseOptions {
  id: string
  title: string
  link: string
  cover_img1: any
  cover_img2: string
  sort: number
  create_user: string
  create_user_name?: string
  create_user_avatar?: any
}

export interface SourceLinkByIdParams {
  id: string
  userId?: string
  ignoreUserId?: BaseStatus
  showUserInfo?: BaseStatus
}

export interface SourceLinkByIdsParams {
  ids: string
  userId?: string
  ignoreUserId?: BaseStatus
  showUserInfo?: BaseStatus
}
