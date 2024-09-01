/**
 * @description 笔记关联接口类型
 * @author cpl
 * @create 2023-02-07 16:58:39
 */

import { NoteOptions } from '../note/interface'

export interface NoteLinkOptions extends NoteOptions {
  isTargetRelevance: string
}

export interface NoteLinkParams {
  rootId: string
  targetId: string
  userId: string
  keyword?: string
  highlight?: BaseStatus
  pageNo: number
  pageSize: number
  isSecret?: BaseStatus
  classify?: string
  showUserInfo?: BaseStatus
}

export interface NoteLinkReturnOption {
  total: number
  data: NoteLinkOptions[]
}
