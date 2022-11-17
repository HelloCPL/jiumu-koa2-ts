/**
 * @description 文件上传方法
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import fs, { ReadStream, WriteStream } from 'fs'
import path from 'path'
import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { validateRange } from '@/utils/validator'
import { getFileRandomName, getSuffix, getUuId, formatDate, getStaticPlace } from '@/utils/tools'
import { query } from '@/db'
import { File } from 'formidable'
import _ from 'lodash'
import { getFileById } from './get'
import { Terminal } from '@/enums'
import { FileInfoOptions } from './interface'
import { dirExist } from '@/utils/dir-exist'
import { STATIC_URL, STATIC_DIRS } from '@/config'

/**
 * 文件上传 可上传一个或多个文件 返回数组格式
 */
export const doFileAdd = async (ctx: Context) => {
  const files: any = ctx.request.files
  const file: File = files.file
  const fileList: FileInfoOptions[] = []
  if (_.isArray(file)) {
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
  const params: any = await validateRange(
    [
      { value: ctx._data.query.isSecret, range: ['0', '1'], default: '0' },
      {
        value: ctx._data.query.staticPlace,
        range: ['files', 'images', 'videos', 'editors', 'sources'],
        default: ''
      }
    ],
    true
  )
  const isSecret = params[0]
  const staticPlace = params[1] || getStaticPlace(<string>file.name)
  const createTime = formatDate(new Date())
  const id = getUuId()
  const filePath = getFileRandomName(<string>file.name)
  // 先写文件
  await _readerStream(file, staticPlace, filePath)
  // 再写入数据库
  const sql =
    'INSERT files_info (id, file_path, file_name, file_size, suffix,static_place, create_user, is_secret, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  // @ts-ignore
  const data = [
    id,
    filePath,
    file.name,
    file.size,
    getSuffix(file.name),
    staticPlace,
    ctx._user.id,
    isSecret,
    createTime,
    createTime,
    Terminal[ctx._terminal],
    ctx._data.query.remarks
  ]
  await query(sql, data)
  const fileInfo = await getFileById(id, ctx._user.id)
  return fileInfo
}

/*
 * 写文件
 * file 文件 staticPlace 文件存放位置 filePath 文件名
 */
const _readerStream = async (file: File, staticPlace: string, filePath: string) => {
  const dir = path.join(STATIC_URL, `${staticPlace}`)
  // 判断目录是否存在，不存在则创建
  await dirExist(dir)
  // 创建可读流
  const reader: ReadStream = fs.createReadStream(file.path)
  const savePath = path.join(dir, filePath)
  const upStream: WriteStream = fs.createWriteStream(savePath)
  reader.pipe(upStream)
}

/*
 * 大文件上传切片 只传一个
https://juejin.cn/post/7016498747496464415
fileHash
chunkHash = fileHash + index
 */
export const doFileAddChunk = async (ctx: Context) => {
  const files: any = ctx.request.files
  // const file = ctx.request.files.chunk
  const file = files.file as File
  const fileHash = ctx._params.fileHash
  const chunkHash = ctx._params.chunkHash
  const chunkdir = `files_temp/${fileHash}`

  // 判断目录是否存在，不存在则创建
  await dirExist(chunkdir)
  const chunkIndex = chunkHash.split('-')[1]
  console.log(chunkIndex)
  // 判断文件是否存在
  // 写入切片

  // 写文件
  throw new Success()
}
