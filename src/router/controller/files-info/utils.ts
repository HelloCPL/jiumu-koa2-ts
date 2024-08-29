/**
 * 文件相关辅助函数
 */

import { getCurrentTime, getDateValueOf, sureIsArray, toPath } from '@/utils/tools'
import { FileInfoOptions } from './interface'
import { BASE_URL, FILE_VAILD_TIME, PUBLIC_PATH } from '@/config'
import { encrypt } from '@/utils/crypto'
import { getFileByIds } from './get'

/**
 * 处理文件对象，如果为私密文件添加权限参数限制，否则正常返回
 * @param file
 * @returns file
 */
export function handleFileIsSecret(file: FileInfoOptions): FileInfoOptions {
  file.file_path = toPath(BASE_URL, PUBLIC_PATH, file.static_place, file.file_path)
  if (file.is_secret === '1') {
    let queryParams = '?'
    // 添加用户标识和链接有效期
    const vt: string = (getDateValueOf(getCurrentTime()) + FILE_VAILD_TIME).toString()
    queryParams += `vt=${encrypt(vt)}`
    queryParams += `&uid=${encrypt(file.create_user)}`
    file.file_path += queryParams
  }
  return file
}

/**
 * 根据所给数据获取指定的所有文件
 * @param data 指定数据，对象或数组
 * @param keys 指定数据的 key 集合
 */
export async function getFileByData(
  data: ObjectAny | ObjectAny[],
  keys: string[] = ['id']
): Promise<FileInfoOptions[]> {
  const arr = sureIsArray(data)
  const ids: string[] = []
  arr.forEach((row) => {
    keys.forEach((key) => {
      const val = row[key]
      if (val && ids.indexOf(val) === -1) ids.push(val)
    })
  })
  const files = await getFileByIds({
    ids: ids.join(','),
    ignoreUserId: '1'
  })
  return files
}

/**
 * 根据原始文件集合，返回指定的文件或 null
 * @param originFiles 原始文件集合
 * @param id 文件 id
 */
export function getOriginFileById(originFiles: FileInfoOptions[], id: string): FileInfoOptions | null {
  if (!id) return null
  return originFiles.find((row) => row.id === id) || null
}

/**
 * 根据原始文件集合，返回指定的文件集合或 []
 * @param originFiles 原始文件集合
 * @param ids 文件 id 集合
 */
export function getOriginFileByIds(originFiles: FileInfoOptions[], ids: string): FileInfoOptions[] {
  if (!ids) return []
  return originFiles.filter((row) => ids.indexOf(row.id) !== -1)
}
