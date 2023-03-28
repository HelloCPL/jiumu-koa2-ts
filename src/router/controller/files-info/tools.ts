/*
 * 文件操作相关方法
 */

import { STATIC_URL } from '@/config'
import fs, { ReadStream, Stats, WriteStream } from 'fs'
import { File } from 'formidable'
import path from 'path'

/*
 * 获取路径
 * 相对于 jiumu-koa2-ts-static
 */
export function getPath(...p: string[]): string {
  return path.join(STATIC_URL, ...p)
}

/*
 * 读取路径信息 异步
 * 存在返回 信息 不存在 返回 false
 */
export function fsStat(dir: string): Promise<Stats | false> {
  return new Promise((resolve) => {
    fs.stat(dir, (err: any, stats: Stats) => {
      if (err) resolve(false)
      else resolve(stats)
    })
  })
}

/*
 * 读取路径信息 同步
 * 存在返回 信息 不存在 返回 false
 */
export function fsStatSync(dir: string): Stats | false {
  try {
    return fs.statSync(dir)
  } catch (e) {
    return false
  }
}

/*
 * 创建目录 异步
 */
export function fsMkdir(dir: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.mkdir(dir, (err: any) => {
      if (err) resolve(false)
      else resolve(true)
    })
  })
}

/*
 * 创建目录 同步
 */
export function fsMkdirSync(dir: string): boolean {
  try {
    fs.mkdirSync(dir)
    return true
  } catch (e) {
    return false
  }
}

/*
 * 判断是否为目录或文件 异步
 * 返回 1 目录 0 文件 -1 不存在
 */
export async function judgeDir(dir: string): Promise<1 | 0 | -1> {
  const isExist = await fsStat(dir)
  // @ts-ignore
  if (isExist && isExist.isDirectory()) return 1
  // @ts-ignore
  else if (isExist && isExist.isFile()) return 0
  return -1
}

/*
 * 判断是否为目录或文件 同步
 * 返回 1 目录 0 文件 -1 不存在
 */
export function judgeDirSync(dir: string): 1 | 0 | -1 {
  try {
    const isExist = fsStatSync(dir)
    // @ts-ignore
    if (isExist && isExist.isDirectory()) return 1
    // @ts-ignore
    else if (isExist && isExist.isFile()) return 0
    else return -1
  } catch (e) {
    return -1
  }
}

/*
 * 判断目录是否存在，不存在则创建目录 异步
 */
export async function sureIsDir(dir: string) {
  const type = await judgeDir(dir)
  // 目录存在返回true
  if (type === 1) return true
  else if (type === 0) return false
  // 路径不存在则拿上级路径
  const tempDir = path.parse(dir).dir
  const status = await sureIsDir(tempDir)
  let mkdirStatus = false
  if (status) {
    mkdirStatus = await fsMkdir(dir)
  }
  return mkdirStatus
}

/*
 * 判断目录是否存在，不存在则创建目录 同步
 */
export function sureIsDirSync(dir: string) {
  const type = judgeDirSync(dir)
  if (type === 1) return true
  else if (type === 0) return false
  const tempDir = path.parse(dir).dir
  const status = sureIsDirSync(tempDir)
  let mkdirStatus = false
  if (status) {
    mkdirStatus = fsMkdirSync(dir)
  }
  return mkdirStatus
}

/*
 * 创建文件 异步
 * file 文件
 * dir 文件存放位置
 * filePath 指定文件名
 */
export async function createFile(file: File, dir: string, filePath: string) {
  // 保证目录存在
  await sureIsDir(dir)
  // 创建可读流
  const reader: ReadStream = fs.createReadStream(file.path)
  const savePath = path.join(dir, filePath)
  const writeStream: WriteStream = fs.createWriteStream(savePath)
  reader.pipe(writeStream)
}

/*
 * 删除文件 异步
 */
export async function deleteFile(dir: string) {
  const type = await judgeDir(dir)
  if (type === 0) {
    fs.unlink(dir, () => {})
  }
}

/*
 * 删除文件 同步
 */
export function deleteFileSync(dir: string) {
  const type = judgeDirSync(dir)
  if (type === 0) {
    fs.unlinkSync(dir)
  }
}

/*
 * 删除目录及下所有目录/文件
 * 或删除文件 同步
 */
export function deleteDirSync(dir: string) {
  const type = judgeDirSync(dir)
  if (type === 1) {
    const files = fs.readdirSync(dir)
    files.forEach((file) => {
      const dir2 = path.resolve(dir, file)
      const type2 = judgeDirSync(dir2)
      if (type2 === 1) {
        deleteDirSync(dir2)
      } else if (type2 === 0) {
        deleteFileSync(dir2)
      }
    })
    fs.rmdirSync(dir)
  } else if (type === 0) {
    deleteFileSync(dir)
  }
}
