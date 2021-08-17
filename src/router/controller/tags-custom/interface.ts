/**
 * @description 标签接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
*/

// 标签对象接口类型
export interface TagCustomOptions extends BaseOptions {
  id: string,
  label: string,
  sort?: string,
}