/**
 * 文件相关辅助函数
 */

import { getCurrentTime, getDateValueOf, toPath } from '@/utils/tools'
import { FileInfoOptions } from './interface'
import { BASE_URL, FILE_VAILD_TIME, PUBLIC_PATH } from '@/config'
import { encrypt } from '@/utils/crypto'

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
