/*
 * 文件操作相关方法
 */

import { STATIC_URL } from '@/config'
import fs, { ReadStream, Stats, WriteStream } from 'fs'
import { File } from 'formidable'
import path from 'path'
import { isArray } from 'lodash'
import zlib from 'zlib'

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

/**
 * 复制文件 异步
 * origin 原始文件路径
 * dir 目标路径
 * filename 目标名称
 */
export async function copyFile(originDir: string, dir: string, filename: string): Promise<boolean> {
  return new Promise((resolve) => {
    const code = judgeDirSync(originDir)
    if (code === 0) {
      sureIsDirSync(dir)
      const targetFile = path.join(dir, filename)
      fs.copyFile(originDir, targetFile, (err) => {
        if (err) resolve(false)
        else resolve(true)
      })
    } else {
      resolve(false)
    }
  })
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
 * !!! 慎用 !!!
 * 删除目录及下所有目录/文件
 * 或删除文件 同步
 */
export function Danger_deleteDirSync(dir: string) {
  const type = judgeDirSync(dir)
  if (type === 1) {
    const files = fs.readdirSync(dir)
    files.forEach((file) => {
      const dir2 = path.resolve(dir, file)
      const type2 = judgeDirSync(dir2)
      if (type2 === 1) {
        Danger_deleteDirSync(dir2)
      } else if (type2 === 0) {
        deleteFileSync(dir2)
      }
    })
    fs.rmdirSync(dir)
  } else if (type === 0) {
    deleteFileSync(dir)
  }
}

/**
 * 获取指定目录下的所有文件 异步
 * dir 指定目录
 * suffix 指定后缀 不传 默认所有类型文件
 */
export function readDir(dir: string, suffix?: string, recursion?: boolean): Promise<string[] | null> {
  return new Promise((resolve) => {
    const files = readDirSync(dir, suffix, recursion)
    resolve(files)
  })
}

/**
 * 获取指定目录下的所有文件 同步
 * dir 指定目录
 * suffix 指定后缀 不传 默认所有类型文件
 * recursion 是否递归遍历
 */
export function readDirSync(dir: string, suffix?: string, recursion?: boolean): string[] | null {
  const result: string[] = []
  const _read = (result: string[], dir: string) => {
    const files = fs.readdirSync(dir)
    files.forEach((value: string) => {
      const newDir = path.resolve(dir, value)
      const code = judgeDirSync(newDir)
      if (code === 0) {
        if (suffix && value.includes('.')) {
          if (value.endsWith(suffix)) result.push(newDir)
        } else {
          result.push(newDir)
        }
      } else if (code === 1 && recursion) {
        _read(result, newDir)
      }
    })
  }
  const status = judgeDirSync(dir)
  if (status === 1) {
    _read(result, dir)
  }
  return result
}

/**
 * 读取指定文件内容 异步
 * dir 文件路径
 * max 最多读取几次
 */
export function readFile(dir: string, encoding: BufferEncoding = 'utf8', max = 1): Promise<string> {
  return new Promise((resolve) => {
    fs.readFile(dir, encoding, (err, data) => {
      let content = data
      if (err) content = ''
      if (!content && max < 1) {
        readFile(dir, encoding, max - 1).then((content) => resolve(content))
      } else {
        resolve(content)
      }
    })
  })
}

/**
 * 读取指定文件内容 同步
 * dir 文件路径
 * max 最多读取几次
 */
export function readFileSync(dir: string, encoding: BufferEncoding = 'utf8', max = 1): string {
  let content = ''
  try {
    content = fs.readFileSync(dir, encoding)
  } catch (e) {
    console.warn(e)
  }
  if (!content && max < 1) {
    return readFileSync(dir, encoding, max - 1)
  }
  return content
}

/**
 * 向文件写入内容 覆盖 异步
 */
export function writeFile(dir: string, data: any, encoding: BufferEncoding = 'utf8'): Promise<boolean> {
  return new Promise((resolve) => {
    fs.writeFile(dir, data, encoding, (err) => {
      if (err) resolve(false)
      else resolve(true)
    })
  })
}

/**
 * 向文件写入内容 覆盖 同步
 */
export function writeFileSync(dir: string, data: any, encoding: BufferEncoding = 'utf8'): boolean {
  try {
    fs.writeFileSync(dir, data, encoding)
    return true
  } catch (e) {
    console.warn(e)
    return false
  }
}

/**
 * 解压文件到指定目录 异步
 */
export function unzip(originPath: string, targetPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const gunzip = zlib.createGunzip()
    const rs = fs.createReadStream(originPath)
    const ws = fs.createWriteStream(targetPath)
    rs.pipe(gunzip).pipe(ws)
    rs.on('end', () => {
      resolve(true)
    })
    rs.on('error', (e) => {
      resolve(false)
    })
  })
}

/**
 * 文件重命名 异步
 * 如果新路径已存在则不进行
 */
export function rename(oldPath: string, newPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    judgeDir(oldPath).then((code1) => {
      judgeDir(newPath).then((code2) => {
        if (code1 === 0 && code2 !== 0) {
          fs.rename(oldPath, newPath, (err) => {
            if (!err) resolve(true)
            else resolve(false)
          })
        } else {
          resolve(false)
        }
      })
    })
  })
}

/**
 * 文件重命名 同步
 * 如果新路径已存在则不进行
 */
export function renameSync(oldPath: string, newPath: string): boolean {
  if (judgeDirSync(oldPath) === 0 && judgeDirSync(newPath) !== 0) {
    fs.renameSync(oldPath, newPath)
    if (judgeDirSync(newPath) === 0) return true
  }
  return false
}
