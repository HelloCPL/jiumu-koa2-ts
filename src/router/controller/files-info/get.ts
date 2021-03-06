/**
 * @description: 获取文件
 * @author chen
 * @update 2021-08-10 12:52:14
*/

import { Context, Next } from "koa";
import { query, execTrans } from "../../../db";
import { BASE_URL, PUBLIC_PATH, FILE_VAILD_TIME } from "../../../config";
import dayjs from "dayjs";
import { encrypt } from "../../../utils/crypto";
import { Success } from "../../../utils/http-exception";
import { FileInfoOptions, FileListParamsOptions, FileListReturnOptions } from './interface'
import { toPath } from "../../../utils/tools";

/**
 * 获取一个指定文件 返回对象或null
*/
export const doFileGetOne = async (ctx: Context, next: Next) => {
  const fileInfo = await getFileById(ctx._params.id, ctx._user.id)
  throw new Success({ data: fileInfo })
}

/**
 * 获取指定用户的所有文件列表 返回数组或[]
*/
export const doFileGetListByUserId = async (ctx: Context, next: Next) => {
  const params = {
    userId: ctx._params.userId,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    suffix: ctx._params.suffix
  }
  const data = await _handleFileList(params)
  throw new Success(data)
}

/**
 * 获取指定用户的所有文件列表 返回数组或[]
*/
export const doFileGetListSelf = async (ctx: Context, next: Next) => {
  const params = {
    userId: ctx._user.id,
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    suffix: ctx._params.suffix
  }
  const data = await _handleFileList(params)
  throw new Success(data)
}


/**
 * 根据 fileId 获取文件信息 返回对象或null
*/
export const getFileById = async (fileId: string, userId?: string): Promise<FileInfoOptions | null> => {
  if (!fileId) return null
  const sql = `SELECT t1.id, t1.file_path, t1.file_name, t1.file_size, t1.suffix, t1.static_place, t1.create_user, t2.username as create_user_name, t1.is_secret, t1.create_time, t1.update_time, t1.terminal, t1.remarks FROM files_info t1 LEFT JOIN users t2 ON t1.create_user = t2.id WHERE t1.id = ? AND (t1.is_secret = 0 OR (t1.is_secret = 1 AND t1.create_user = ?))`
  const data = [fileId, userId]
  const res: any = await query(sql, data)
  if (res && res.length)
    return _handleFile(<FileInfoOptions>res[0])
  return null
}

/**
 * 根据 fileIds 获取文件信息，用逗号隔开
 * 返回数组或空数组
*/
export const getFileByIds = async (fileIds: string, userId?: string): Promise<FileInfoOptions[]> => {
  if (!fileIds) return []
  const sql = `SELECT t1.id, t1.file_path, t1.file_name, t1.file_size, t1.suffix, t1.static_place, t1.create_user, t2.username as create_user_name, t1.is_secret, t1.create_time, t1.update_time, t1.terminal, t1.remarks FROM files_info t1 LEFT JOIN users t2 ON t1.create_user = t2.id WHERE FIND_IN_SET(t1.id, ?) AND (t1.is_secret = 0 OR (t1.is_secret = 1 AND t1.create_user = ?))`
  const data = [fileIds, userId]
  const res: any = await query(sql, data)
  let fileList: FileInfoOptions[] = []
  if (res && res.length) {
    res.forEach((file: FileInfoOptions) => {
      let fileInfo = _handleFile(file)
      if (fileInfo) fileList.push(fileInfo)
    })
  }
  return fileList
}

/**
 * 处理文件返回格式
 * 如果私密文件判断是否有权限
 * 否则正常返回
*/
function _handleFile(file: FileInfoOptions): FileInfoOptions {
  file.file_path = toPath(BASE_URL, PUBLIC_PATH, file.static_place, file.file_path)
  if (file.is_secret === '1') {
    let queryParams = '?'
    // 添加用户标识和链接有效期
    const vt: string = (dayjs().valueOf() + FILE_VAILD_TIME).toString()
    queryParams += `vt=${encrypt(vt)}`
    queryParams += `&uid=${encrypt(file.create_user)}`
    file.file_path += queryParams
  }
  return file
}

// 根据用户获取文件列表
async function _handleFileList(options: FileListParamsOptions): Promise<FileListReturnOptions> {
  const pageNo = (options.pageNo - 1) * options.pageSize
  let sqlParam: SQLParamsOptions = { sql: '', data: [] }
  if (options.suffix) {
    sqlParam.sql = ` AND FIND_IN_SET(t1.suffix, ?) `
    sqlParam.data.push(options.suffix)
  }
  const sql1 = `SELECT COUNT(t1.id) AS total FROM files_info t1 WHERE t1.create_user = ? ${sqlParam.sql}`
  const data1 = [options.userId, ...sqlParam.data]
  const sql2 = `SELECT t1.id, t1.file_path, t1.file_name, t1.file_size, t1.suffix, t1.static_place, t1.create_user, t2.username as create_user_name, t1.is_secret, t1.create_time, t1.update_time, t1.terminal, t1.remarks FROM files_info t1 LEFT JOIN users t2 ON t1.create_user = t2.id WHERE t1.create_user = ? ${sqlParam.sql} ORDER BY t1.create_time DESC LIMIT ?, ?`
  const data2 = [...data1, pageNo, options.pageSize]
  const res: any = await execTrans([{ sql: sql1, data: data1 }, { sql: sql2, data: data2 }])
  let fileList: FileInfoOptions[] = []
  if (res[1] && res[1].length) {
    res[1].forEach((file: FileInfoOptions) => {
      let fileInfo = _handleFile(file)
      if (fileInfo) fileList.push(fileInfo)
    })
  }
  return {
    total: res[0][0]['total'],
    data: fileList
  }
}
