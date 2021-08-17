/**
 * @description: 评论接口
 * @author chen
 * @update 2021-08-17 15:30:26
*/

// 评论对象接口类型
export interface CommentOptions {
  id: string,
  target_id: string,
  content: string,
  create_user: string,
  create_user_name: string,
  create_time: string,
  terminal: string,
  is_like?: string,
  like_count?: number,
  comment_count?: number,
  is_self?: string,
  reply_user?: string | null,
  reply_user_name?: string | null,
  children?: CommentOptions[]
}

// 新增时寻找评论的id返回类型
export interface CommentFindResult {
  comment_first_target_id: string,
  comment_first_id: string,
  reply_user: string,
  flag: number
}
