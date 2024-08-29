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

interface FileParams {
  userId?: string
  ignoreUserId?: BaseStatus
  showUserInfo?: BaseStatus
}

/**
 * 获取一个指定文件 返回对象或null
 */
export const doFileGetOne = async (ctx: Context) => {
  const showUserInfo = ctx._params.showUserInfo || '0'
  const fileInfo = await getFileById({
    id: ctx._params.id,
    userId: ctx._user.id,
    showUserInfo
  })
  throw new Success({ data: fileInfo })
}

interface FileById extends FileParams {
  id: string
}
/**
 * 根据 fileId 获取文件信息 返回对象或null
 * @param options.id 文件 id 或 filePath
 * @param options.userId? 用户id，如果为私密文件，必须传这个，不传则无法拿到私密文件
 * @param options.ignoreUserId? 是否强制忽略用户权限校验
 * @param options.showUserInfo? 是否获取创建者名称
 */
export const getFileById = async (options: FileById): Promise<FileInfoOptions | null> => {
  if (!options.id) return null
  const userInfoField = options.showUserInfo === '1' ? ' t2.username AS create_user_name, ' : ''
  const leftJoinUsers = options.showUserInfo === '1' ? ' LEFT JOIN users t2 ON t1.create_user = t2.id ' : ''
  let secretSql = ''
  const secretData = []
  if (options.ignoreUserId !== '1') {
    secretSql = ' AND (t1.is_secret = 0 OR (t1.is_secret = 1 AND t1.create_user = ?)) '
    secretData.push(options.userId)
  }
  const sql = `
  SELECT 
    t1.id, t1.file_path, t1.file_name, t1.file_size, t1.suffix, t1.static_place, t1.create_user, ${userInfoField} t1.is_secret, t1.create_time, t1.update_time, t1.terminal, t1.remarks 
  FROM files_info t1 
  ${leftJoinUsers}
  WHERE 
    (t1.id = ? OR t1.file_path = ?) 
    ${secretSql}`
  const data = [options.id, options.id, ...secretData]
  const res: any = await query(sql, data)
  if (res && res.length) return handleFileIsSecret(<FileInfoOptions>res[0])
  return null
}

interface FileByIds extends FileParams {
  ids: string
}

/**
 * 根据 fileIds 获取文件信息，用逗号隔开，返回数组或空数组
 * @param options.ids 文件 id 集合，用逗号分隔
 * @param options.userId? 用户id，如果为私密文件，必须传这个，不传则无法拿到私密文件
 * @param options.ignoreUserId? 是否强制忽略用户权限校验
 * @param options.showUserInfo? 是否获取创建者名称
 */
export const getFileByIds = async (options: FileByIds): Promise<FileInfoOptions[]> => {
  if (!options.ids) return []
  const userInfoField = options.showUserInfo === '1' ? ' t2.username AS create_user_name, ' : ''
  const leftJoinUsers = options.showUserInfo === '1' ? ' LEFT JOIN users t2 ON t1.create_user = t2.id ' : ''
  let secretSql = ''
  const secretData = []
  if (options.ignoreUserId !== '1') {
    secretSql = ' AND (t1.is_secret = 0 OR (t1.is_secret = 1 AND t1.create_user = ?)) '
    secretData.push(options.userId)
  }
  const sql = `
  SELECT 
    t1.id, t1.file_path, t1.file_name, t1.file_size, t1.suffix, t1.static_place, t1.create_user, ${userInfoField} t1.is_secret, t1.create_time, t1.update_time, t1.terminal, t1.remarks 
  FROM files_info t1 
  ${leftJoinUsers}
  WHERE 
    FIND_IN_SET(t1.id, ?)
    ${secretSql}`
  const data = [options.ids, ...secretData]
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
