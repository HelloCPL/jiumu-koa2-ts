/**
 * @description 文件上传方法
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import fs, { ReadStream, WriteStream } from 'fs'
import path from 'path'
import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { validateRange } from '../../../utils/validator'
import { getFileRandomName, getSuffix, getUuId, formatDate } from "../../../utils/tools";
import { query } from "../../../db";
import { File } from 'formidable'
import _ from 'lodash'
import { FileOptions, getFileById } from './get'
import { Message } from '../../../enums';

/**
 * 文件上传 可上传一个或多个文件 返回数组格式
*/
export const doFileUpload = async (ctx: Context, next: Next) => {
  const files: any = ctx.request.files
  const file: File = files.file
  let fileList: FileOptions[] = []
  if (_.isArray(file)) {
    for (let val of file) {
      const fileInfo = await _writeFile(ctx, val)
      if (fileInfo) fileList.push(fileInfo)
    }
  } else if (file) {
    const fileInfo = await _writeFile(ctx, file)
    if (fileInfo) fileList.push(fileInfo)
  }
  throw new Success({ message: Message.success, data: fileList })
}

/**
 * 将文件写入数据库，并将文件信息返回
*/
async function _writeFile(ctx: Context, file: File): Promise<FileOptions | null> {
  const isSecret = validateRange({
    value: ctx.data.query.isSecret,
    range: ['0', '1'],
    noThrow: true,
    default: '0'
  })
  const staticPlace = validateRange({
    value: ctx.data.query.staticPlace,
    range: ['files', 'images', 'videos', 'editors'],
    noThrow: true,
    default: 'files'
  })
  // 先写入数据库
  const id = getUuId()
  // @ts-ignore 
  const filePath = getFileRandomName(file.name)
  const sql = `INSERT files_info (id, file_path, file_name, file_size, suffix,  static_place, create_user, is_secret, create_time, terminal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  // @ts-ignore 
  const data = [id, filePath, file.name, file.size, getSuffix(file.name), staticPlace, ctx.user.id, isSecret, formatDate(new Date()), ctx.terminal]
  await query(sql, data)
  // 再创建可读流
  const reader: ReadStream = fs.createReadStream(file.path)
  const savePath = path.join(__dirname, `../../../../static/${staticPlace}`, filePath)
  const upStream: WriteStream = fs.createWriteStream(savePath)
  reader.pipe(upStream)
  const fileInfo = await getFileById(ctx, id)
  return fileInfo
}