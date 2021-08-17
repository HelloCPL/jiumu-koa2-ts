/**
 * @description: 评论接口
 * @author chen
 * @update 2021-08-17 15:30:26
*/



// 新增时寻找评论的id返回类型
export interface CommentFindResult {
  comment_first_target_id: string,
  comment_first_id: string,
  reply_user: string,
  flag: number
}
