/**
 * @description: 获取文件
 * @author chen
 * @update 2021-08-10 12:52:14
*/

import { Context, Next } from "koa";
import { query } from "../../../db";
import Config from "../../../config";
import dayjs from "dayjs";
import { encrypt } from "../../../utils/crypto";
import { Success } from "../../../utils/http-exception";

export interface FileOptions extends ObjectAny {
  id: string,
  file_path: string,
  file_name?: string,
  file_size?: number,
  suffix: string,
  static_place: string,
  create_user: string,
  is_secret?: string,
  check_valid_time: number,
  create_time: string,
  terminal: string,
  remarks?: string
}

/**
 * 文件获取 返回数组格式
*/
export const doFileGet = async (ctx: Context, next: Next) => {
  const fileList = await getFileByIds(ctx, ctx.params.ids)
  throw new Success({ data: fileList })
}

/**
 * 根据 id 获取文件信息 返回对象或null
*/
export const getFileById = async (ctx: Context, id: string): Promise<FileOptions | null> => {
  const sql = `SELECT * FROM files_info WHERE id = ?`
  const res: any = await query(sql, id)
  if (res && res.length)
    return _handleFile(ctx, <FileOptions>res[0])
  return null
}

/**
 * 根据 ids 获取文件信息，用逗号隔开
 * 返回数组或空数组
*/
export const getFileByIds = async (ctx: Context, ids: string): Promise<FileOptions[]> => {
  const sql = `SELECT * FROM files_info WHERE FIND_IN_SET(id, ?)`
  const res: any = await query(sql, ids)
  let fileList: FileOptions[] = []
  if (res && res.length) {
    res.forEach((file: FileOptions) => {
      let fileInfo = _handleFile(ctx, file)
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
function _handleFile(ctx: Context, file: FileOptions): FileOptions | null {
  console.log(file);
  if (file.is_secret === '1' && file.create_user !== ctx.user.id) return null
  file.file_path = Config.BASE_URL + file.static_place + '/' + file.file_path
  if (file.is_secret === '1') {
    let queryParams = '?'
    // 添加用户标识和链接有效期
    const vt: string = (dayjs().valueOf() + file.check_valid_time * 24 * 60 * 60 * 1000).toString()
    queryParams += `vt=${encrypt(vt)}`
    queryParams += `&uid=${encrypt(file.create_user)}`
    file.file_path += queryParams
  }
  return file
}