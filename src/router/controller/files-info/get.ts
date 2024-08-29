/**
 * @description: 获取文件
 * @author chen
 * @update 2021-08-10 12:52:14
 */

import { Context } from 'koa'
import { query } from '@/db'
import { Success } from '@/utils/http-exception'
import { FileInfoOptions } from './interface'
import { handleFileIsSecret } from './utils'

/**
 * 获取一个指定文件 返回对象或null
 */
export const doFileGetOne = async (ctx: Context) => {
  const showUserInfo = ctx._params.showUserInfo || '0'
  const fileInfo = await getFileById(ctx._params.id, ctx._user.id, showUserInfo)
  throw new Success({ data: fileInfo })
}

/**
 * 根据 fileId 获取文件信息 返回对象或null
 * @param fileId 文件id
 * @param userId 用户id，如果为私密文件，必须传这个，不传则无法拿到私密文件
 * @param showUserInfo 是否获取创建者名称
 */
export const getFileById = async (
  fileId: string,
  userId?: string,
  showUserInfo?: BaseStatus
): Promise<FileInfoOptions | null> => {
  if (!fileId) return null
  const userInfoField = showUserInfo === '1' ? ' t2.username AS create_user_name, ' : ''
  const leftJoinUsers = showUserInfo === '1' ? ' LEFT JOIN users t2 ON t1.create_user = t2.id ' : ''
  const sql = `
  SELECT 
    t1.id, t1.file_path, t1.file_name, t1.file_size, t1.suffix, t1.static_place, t1.create_user, ${userInfoField} t1.is_secret, t1.create_time, t1.update_time, t1.terminal, t1.remarks 
  FROM 
    files_info t1 
  ${leftJoinUsers}
  WHERE 
    (t1.id = ? OR t1.file_path = ?) AND (t1.is_secret = 0 OR (t1.is_secret = 1 AND t1.create_user = ?))`
  const data = [fileId, fileId, userId]
  const res: any = await query(sql, data)
  if (res && res.length) return handleFileIsSecret(<FileInfoOptions>res[0])
  return null
}

/**
 * 根据 fileIds 获取文件信息，用逗号隔开，返回数组或空数组
 * @param fileId 文件id
 * @param userId 用户id，如果为私密文件，必须传这个，不传则无法拿到私密文件
 * @param showUserInfo 是否获取创建者名称
 */
export const getFileByIds = async (
  fileIds: string,
  userId?: string,
  showUserInfo?: BaseStatus
): Promise<FileInfoOptions[]> => {
  if (!fileIds) return []
  const userInfoField = showUserInfo === '1' ? ' t2.username AS create_user_name, ' : ''
  const leftJoinUsers = showUserInfo === '1' ? ' LEFT JOIN users t2 ON t1.create_user = t2.id ' : ''
  const sql = `
  SELECT 
    t1.id, t1.file_path, t1.file_name, t1.file_size, t1.suffix, t1.static_place, t1.create_user, ${userInfoField} t1.is_secret, t1.create_time, t1.update_time, t1.terminal, t1.remarks 
  FROM 
    files_info t1 
  ${leftJoinUsers}
  WHERE 
    FIND_IN_SET(t1.id, ?) AND (t1.is_secret = 0 OR (t1.is_secret = 1 AND t1.create_user = ?))`
  const data = [fileIds, userId]
  const res: any = await query(sql, data)
  const fileList: FileInfoOptions[] = []
  if (res && res.length) {
    res.forEach((file: FileInfoOptions) => {
      const fileInfo = handleFileIsSecret(file)
      if (fileInfo) fileList.push(fileInfo)
    })
  }
  return fileList
}
