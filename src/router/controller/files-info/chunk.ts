/*
 * 大文件 切片处理
 */

import { Context } from 'koa'
import { File } from 'formidable'
import { createFile, Danger_deleteDirSync, getPath, judgeDirSync, sureIsDirSync } from '@/utils/files'
import { ExceptionHttp, Success } from '@/utils/http-exception'
import { Code, Terminal } from '@/enums'
import fs from 'fs'
import { formatDate, getSuffix, getUuId } from '@/utils/tools'
import { query } from '@/db'
import { getFileById } from './get'
import { validateRange } from '@/utils/validator'

/*
 * 切片上传，用于大文件上传
 * https://juejin.cn/post/7016498747496464415
 */
export const doFileChunkAdd = async (ctx: Context) => {
  const files = ctx.request.files
  const fileHash = ctx._params.fileHash
  const chunkIndex = ctx._params.chunkIndex + ''
  if (files && files.chunk && fileHash && chunkIndex) {
    // 切片信息
    const file = <File>files.chunk
    const fileHash = ctx._params.fileHash
    const chunkDir = getPath('files_big_upload_temp', fileHash)
    const chunkPath = getPath('files_big_upload_temp', fileHash, chunkIndex)
    // 确保目录存在
    sureIsDirSync(chunkDir)
    // 判断文件是否存在 不存在则创建
    const type = judgeDirSync(chunkPath)
    if (type !== 0) {
      await createFile(file, chunkDir, chunkIndex)
    }
    throw new Success({ data: Code.success })
  } else throw new Success({ data: Code.notFound })
}

/*
 * 删除指定文件的所有切片
 */
export const doFileChunkDelete = async (ctx: Context) => {
  const dir = getPath('files_big_upload_temp', ctx._params.fileHash)
  // 判断文件是否存在 不存在则创建
  const type = judgeDirSync(dir)
  if (type !== -1) {
    await Danger_deleteDirSync(dir)
  }
  throw new Success()
}

/*
 * 切片合并，用于大文件上传
 */
export const doFileChunkMerge = async (ctx: Context) => {
  const params = ctx._params
  const params2: any = await validateRange(
    [
      {
        value: ctx._data.query.staticPlace,
        range: ['files', 'images', 'videos', 'editors', 'sources', 'files_big'],
        default: 'files_big'
      }
    ],
    true
  )
  const staticPlace = params2[0]
  const fileHash = params.fileHash
  const fileName = fileHash + '_' + params.fileName
  const chunkSize = Number(params.chunkSize)
  const chunkLength = Number(params.chunkLength)
  let count: number = 0
  // 读取切片
  const dir = getPath('files_big_upload_temp', fileHash)
  const chunkPaths = fs.readdirSync(dir)
  chunkPaths.sort((a, b) => Number(a) - Number(b))
  if (chunkPaths.length < chunkLength) {
    // 切片少传，需重新上传
    let paths: string = ''
    for (let i = 0; i < chunkLength; i++) {
      if (chunkPaths.indexOf(i + '') === -1) paths += paths ? `,${i}` : `${i}`
    }
    throw new ExceptionHttp({ message: `缺少${paths}片段，请重新上传这些片段` })
  } else {
    // 合并
    for (let i = 0; i < chunkLength; i++) {
      const chunkPath = getPath('files_big_upload_temp', fileHash, i + '')
      const fileDir = getPath(staticPlace, fileName)
      // 确保目录存在
      const fileBigDir = getPath(staticPlace)
      sureIsDirSync(fileBigDir)
      // 创建可写流
      const writeStream = fs.createWriteStream(fileDir, {
        start: i * chunkSize
      })
      const readStream = fs.createReadStream(chunkPath)
      readStream.on('end', () => {
        count++
        if (count === chunkLength) {
          // 删除目录
          setTimeout(() => {
            Danger_deleteDirSync(dir)
          }, 2000)
        }
      })
      readStream.pipe(writeStream)
    }
    // 将文件信息写进数据库
    const id = getUuId()
    const createTime = formatDate(new Date())
    const sql =
      'INSERT files_info (id, file_path, file_name, file_size, suffix,static_place, create_user, is_secret, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    const data = [
      id,
      fileName,
      params.fileName,
      params.fileSize || chunkSize * chunkLength,
      getSuffix(params.fileName),
      staticPlace,
      ctx._user.id,
      params.isSecret || '0',
      createTime,
      createTime,
      Terminal[ctx._terminal],
      ctx._data.query.remarks
    ]
    await query(sql, data)
    const fileInfo = await getFileById(id, ctx._user.id)
    throw new Success({ data: fileInfo })
  }
}

/*
 * 校验大文件是否存在
 */
export const doFileChunkVerify = async (ctx: Context) => {
  const params = ctx._params
  const file = await getFileById(`${params.fileHash}_${params.fileName}`, ctx._user.id)
  if (file) {
    const dir = getPath(file.static_place, `${params.fileHash}_${params.fileName}`)
    const type = judgeDirSync(dir)
    if (type !== -1) throw new Success({ data: file })
  }
  throw new Success()
}
