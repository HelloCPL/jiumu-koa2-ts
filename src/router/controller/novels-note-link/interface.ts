/**
 * @description 笔记关联接口类型
 * @author cpl
 * @create 2023-02-07 16:58:39
 */

export interface NovelNoteLinkOptions extends BaseOptions {
  id: string
  note_id: string
  note_title: string
  target_id: string
  target_type: string
  target_type_label: string
  target_title: string
}

export interface NovelNoteLinkParams {
  share: string
  userId: string
  keyword?: string
  highlight?: '0' | '1'
  pageNo: number
  pageSize: number
}

export interface NovelNoteLinkReturnOption {
  total: number
  data: NovelNoteLinkOptions[]
}
