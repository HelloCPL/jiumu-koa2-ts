/**
 * @description 用户-特殊标签关联接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
 */

// 用户-特殊关联对象接口类型
export interface UserTagOptions extends BaseOptions {
  id: string
  user_id: string
  tag_code: string
}

// 用户-特殊关联获取关联角色参数接口类型
export interface UserTagByTagCodeParams {
	tagCode: string
	pageNo?: number
	pageSize?: number
	simple?: string
}

// 用户-特殊关联获取关联用户参数接口类型
export interface UserTagByUserIdParams {
  userId: string
  pageNo?: number
  pageSize?: number,
  all?: boolean
}
