/**
 * @description 文件信息接口类型
 * @author chen
 * @update 2021-08-13 21:45:19
*/

// 文件信息对象接口类型
export interface FileInfoOptions extends BaseOptions {
  id: string,
  file_path: string,
  file_name?: string,
  file_size?: number,
  suffix?: string,
  type?: string,
  static_place: string,
  create_user: string,
  is_secret?: string,
}

// 根据用户id获取文件参数接口类型
export interface FileListParamsOptions {
  userId: string,
  pageNo: number,
  pageSize: number,
  suffix?: string
}

// 根据用户id获取文件返回接口类型
export interface FileListReturnOptions {
  total: number,
  data: FileInfoOptions[]
}

// 文件修改参数接口类型
export interface FileUpdateOptions {
  ids: string,
  isSecret?: string,
  remarks?: string,
  updateTime?: string
}
