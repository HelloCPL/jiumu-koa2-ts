/**
 * @description 文件上传方法
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { validateRange } from '@/utils/validator'
import { getFileRandomName, getSuffix, getUuId, formatDate, getStaticPlace } from '@/utils/tools'
import { query } from '@/db'
import { File } from 'formidable'
import { Terminal } from '@/enums'
import { FileInfoOptions } from './interface'
import { createFile, getPath, sureIsDirSync } from '@/utils/files'
import { isArray } from 'lodash'
import { handleFileIsSecret } from './utils'

/**
 * 文件上传 可上传一个或多个文件 返回数组格式
 */
export const doFileAdd = async (ctx: Context) => {
  const files: any = ctx.request.files
  const file: File = files.file
  const fileList: FileInfoOptions[] = []
  if (isArray(file)) {
    for (const val of file) {
      const fileInfo = await _writeFile(ctx, val)
      if (fileInfo) fileList.push(fileInfo)
    }
  } else if (file) {
    const fileInfo = await _writeFile(ctx, file)
    if (fileInfo) fileList.push(fileInfo)
  }
  throw new Success({ data: fileList })
}

/**
 * 将文件写入数据库，并将文件信息返回
 * 先保存文件再入库
 */
async function _writeFile(ctx: Context, file: File): Promise<FileInfoOptions | null> {
  const rangeResult: any = await validateRange(
    [
      { value: ctx._data.query.isSecret, range: ['0', '1'], default: '0' },
      {
        value: ctx._data.query.staticPlace,
        range: ['files', 'images', 'videos', 'editors', 'sources', 'files_big'],
        default: 'files'
      }
    ],
    true
  )
  const isSecret = rangeResult[0]
  const staticPlace = rangeResult[1] || getStaticPlace(<string>file.name)
  const createTime = formatDate(new Date())
  const id = getUuId()
  const filePath = getFileRandomName(<string>file.name)
  const suffix = getSuffix(file.name)
  // 先写文件
  const dir = getPath(staticPlace)
  sureIsDirSync(dir)
  await createFile(file, dir, filePath)
  // 再写入数据库
  const sql = `
  INSERT files_info 
    (id, file_path, file_name, file_size, suffix,static_place, create_user, is_secret, create_time, update_time, terminal, remarks) 
  VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  // @ts-ignore
  const data = [
    id,
    filePath,
    file.name,
    file.size,
    suffix,
    staticPlace,
    ctx._user.id,
    isSecret,
    createTime,
    createTime,
    Terminal[ctx._terminal],
    ctx._data.query.remarks
  ]
  await query(sql, data)
  return handleFileIsSecret({
    id,
    file_path: filePath,
    file_name: file.name as string,
    file_size: file.size,
    suffix,
    static_place: staticPlace,
    create_user: ctx._user.id,
    is_secret: isSecret,
    create_time: createTime,
    update_time: createTime,
    terminal: Terminal[ctx._terminal],
    remarks: ctx._data.query.remarks
  })
}
