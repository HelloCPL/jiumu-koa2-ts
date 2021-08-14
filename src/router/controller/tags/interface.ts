/**
 * @description 标签接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
*/

// 标签对象接口类型
export interface TagOptions extends BaseOptions {
  id: string,
  parent_code?: string,
  code: string,
  label: string,
  sort?: string,
}

// 标签数组接口类型
export interface TagListOptions extends TagOptions {
  children: TagListOptions[]
}

// 自定义标签接口
export interface TagCustomOptions extends ObjectAny {
  code: string,
  children: TagCustomOptions[]
}
