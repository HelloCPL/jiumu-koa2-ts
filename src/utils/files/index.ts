/*
 * 文件操作相关方法
 */

import { STATIC_URL } from '@/config'
import fs, { ReadStream, Stats, WriteStream } from 'fs'
import { File } from 'formidable'
import path from 'path'
import zlib from 'zlib'
import { isArray } from 'lodash'
import { getFileName, getSuffix, getUuId } from './tools'

/*
 * 获取路径
 * 相对于 jiumu-koa2-ts-static
 */
export function getPath(...p: string[]): string {
  return path.join(STATIC_URL, ...p)
}

/*
 * 读取路径信息 异步
 * @param dir 路径
 * @returns 存在返回信息；不存在返回 Promise<false>
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
 * @param dir 路径
 * @returns 存在返回信息； 不存在返回 false
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
 * @param dir 路径
 * @returns 返回 Promise<boolean>
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
 * @param dir 路径
 * @returns 返回 boolean
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
 * @param dir 路径
 * @returns 返回 Promise<1> 目录 Promise<0> 文件 Promise<-1> 不存在
 */
export async function judgeDir(dir: string): Promise<1 | 0 | -1> {
  const isExist = await fsStat(dir)
  if (isExist && isExist.isDirectory()) return 1
  else if (isExist && isExist.isFile()) return 0
  return -1
}

/*
 * 判断是否为目录或文件 同步
 * @param dir 路径
 * @returns 返回 1 目录 0 文件 -1 不存在
 */
export function judgeDirSync(dir: string): 1 | 0 | -1 {
  try {
    const isExist = fsStatSync(dir)
    if (isExist && isExist.isDirectory()) return 1
    else if (isExist && isExist.isFile()) return 0
    else return -1
  } catch (e) {
    return -1
  }
}

/*
 * 判断目录是否存在，不存在则创建目录 异步
 * @param dir 路径
 * @returns 返回是否创建成功 Promise<boolean>
 */
export async function sureIsDir(dir: string): Promise<boolean> {
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
 * @param dir 路径
 * @returns 返回是否创建成功 boolean
 */
export function sureIsDirSync(dir: string): boolean {
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
 * 接收一个文件对象，创建一个相同的文件 异步
 * @param file 文件对象
 * @param dir 文件存放位置
 * @param fileName 指定文件名
 */
export async function createFile(file: File, dir: string, fileName: string) {
  // 保证目录存在
  await sureIsDir(dir)
  // 创建可读流
  const reader: ReadStream = fs.createReadStream(file.path)
  const savePath = path.join(dir, fileName)
  const writeStream: WriteStream = fs.createWriteStream(savePath)
  reader.pipe(writeStream)
}

/**
 * 复制文件 异步
 * @param originPath 原始文件路径
 * @param targetDir 目标目录路径
 * @param filename 目标名称
 * @returns 返回是否复制成功 Promise<boolean>
 */
export async function copyFile(originPath: string, targetDir: string, filename: string): Promise<boolean> {
  return new Promise((resolve) => {
    const code = judgeDirSync(originPath)
    if (code === 0) {
      sureIsDirSync(targetDir)
      const targetFile = path.join(targetDir, filename)
      fs.copyFile(originPath, targetFile, (err) => {
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
 * @param filePath 文件路径
 */
export async function deleteFile(filePath: string) {
  const type = await judgeDir(filePath)
  if (type === 0) {
    fs.unlink(filePath, () => {})
  }
}

/*
 * 删除文件 同步
 * @param filePath 文件路径
 */
export function deleteFileSync(filePath: string) {
  const type = judgeDirSync(filePath)
  if (type === 0) {
    fs.unlinkSync(filePath)
  }
}

/*
 * !!! 慎用 !!!
 * 删除目录及下所有目录/文件
 * 或删除文件 同步
 * @param dir 要删除的目录路径
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
 * @param dir 指定目录
 * @param suffix 指定要获取的后缀，不传默认所有类型文件
 * @returns Promise<string[] | null> 返回文件列表或null
 */
export function readDir(dir: string, suffix?: string): Promise<string[] | null> {
  return new Promise((resolve) => {
    judgeDir(dir).then((status) => {
      if (status === 1) {
        fs.readdir(dir, (err, files) => {
          if (!err && isArray(files)) {
            const result = files
              .filter((value) => {
                const flag = judgeDirSync(path.join(dir, value)) === 0
                if (suffix && suffix.includes('.')) {
                  return flag && value.endsWith(suffix)
                } else {
                  return flag
                }
              })
              .map((value) => path.join(dir, value))
            resolve(result)
          } else {
            resolve(null)
          }
        })
      } else {
        resolve(null)
      }
    })
  })
}

/**
 * 获取指定目录下的所有文件 同步
 * @param dir 指定目录
 * @param suffix 指定要获取的后缀，不传默认所有类型文件
 * @param recursion 是否递归遍历
 * @returns string[] | null 返回文件列表或null
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
 * @param filePath 文件路径
 * @param encoding 字符编码，默认 utf8
 * @param max 最多尝试读取几次
 * @returns Promise<string> 返回文件内容
 */
export function readFile(filePath: string, encoding: BufferEncoding = 'utf8', max = 1): Promise<string> {
  return new Promise((resolve) => {
    fs.readFile(filePath, encoding, (err, data) => {
      let content = data
      if (err) content = ''
      if (!content && max < 1) {
        readFile(filePath, encoding, max - 1).then((content) => resolve(content))
      } else {
        resolve(content)
      }
    })
  })
}

/**
 * 读取指定文件内容 同步
 * @param filePath 文件路径
 * @param encoding 字符编码，默认 utf8
 * @param max 最多尝试读取几次
 * @returns string 返回文件内容
 */
export function readFileSync(filePath: string, encoding: BufferEncoding = 'utf8', max = 1): string {
  let content = ''
  try {
    content = fs.readFileSync(filePath, encoding)
  } catch (e) {
    console.warn(e)
  }
  if (!content && max < 1) {
    return readFileSync(filePath, encoding, max - 1)
  }
  return content
}

/**
 * 向文件写入内容，覆盖 异步
 * @param filePath 指定文件路径
 * @param data 要写入的文件内容
 * @param encoding 字符编码，默认 utf8
 * @returns Promise<boolean> 返回是否写入成功
 */
export function writeFile(filePath: string, data: any, encoding: BufferEncoding = 'utf8'): Promise<boolean> {
  return new Promise((resolve) => {
    fs.writeFile(filePath, data, encoding, (err) => {
      const code = judgeDirSync(filePath)
      if (err || code !== 0) resolve(false)
      else resolve(true)
    })
  })
}

/**
 * 向文件写入内容 覆盖 同步
 * @param filePath 指定文件路径
 * @param data 要写入的文件内容
 * @param encoding 字符编码，默认 utf8
 * @returns boolean 返回是否写入成功
 */
export function writeFileSync(filePath: string, data: any, encoding: BufferEncoding = 'utf8'): boolean {
  try {
    const o = path.resolve(filePath, '..')
    sureIsDirSync(o)
    fs.writeFileSync(filePath, data, encoding)
    const code = judgeDirSync(filePath)
    if (code === 0) return true
    return false
  } catch (e) {
    console.warn(e)
    return false
  }
}

/**
 * 解压文件到指定目录 异步
 * @param originPath 原始文件路径
 * @param targetPath 目标路径
 * @returns Promise<boolean> 返回是否解压成功
 */
export function unzip(originPath: string, targetPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const o = path.resolve(originPath, '..')
    const t = path.resolve(targetPath, '..')
    sureIsDirSync(o)
    sureIsDirSync(t)
    const gunzip = zlib.createGunzip()
    const rs = fs.createReadStream(originPath)
    const ws = fs.createWriteStream(targetPath)
    rs.pipe(gunzip).pipe(ws)
    rs.on('end', () => {
      const code = judgeDirSync(targetPath)
      if (code !== -1) resolve(true)
      else resolve(false)
    })
    rs.on('error', () => {
      resolve(false)
    })
    gunzip.on('error', () => {
      resolve(false)
    })
  })
}

/**
 * 压缩文件到指定目录 异步
 * @param originPath 原始文件路径
 * @param targetPath 目标路径
 * @returns Promise<boolean> 返回是否压缩成功
 */
export function zip(originPath: string, targetPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const o = path.resolve(originPath, '..')
    const t = path.resolve(targetPath, '..')
    sureIsDirSync(o)
    sureIsDirSync(t)
    fs.createReadStream(originPath)
      .pipe(zlib.createGzip())
      .pipe(fs.createWriteStream(targetPath))
      .on('finish', () => {
        const code = judgeDirSync(targetPath)
        if (code !== -1) resolve(true)
        else resolve(false)
      })
      .on('error', () => {
        resolve(false)
      })
  })
}

/**
 * 文件重命名 异步
 * 如果新路径已存在则不进行
 * @param originPath 原始文件路径
 * @param targetPath 目标路径
 * @returns Promise<boolean> 返回是否重命名成功
 */
export function rename(originPath: string, targetPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    judgeDir(originPath).then((code1) => {
      judgeDir(targetPath).then((code2) => {
        if (code1 === 0 && code2 !== 0) {
          fs.rename(originPath, targetPath, (err) => {
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
 * @param originPath 原始文件路径
 * @param targetPath 目标路径
 * @returns boolean 返回是否重命名成功
 */
export function renameSync(originPath: string, targetPath: string): boolean {
  if (judgeDirSync(originPath) === 0 && judgeDirSync(targetPath) !== 0) {
    fs.renameSync(originPath, targetPath)
    if (judgeDirSync(targetPath) === 0) return true
  }
  return false
}

/**
 * 确保所给文件路径不同名，
 * 如果相同添加 (index)，最多尝试 100 次，否则添加随机数
 * 如：test.txt 存在 ==> test(1).txt , 不存在 ==> test.txt
 * @param filePath 原始文件路径
 * @returns string 返回重新命名的文件的路径
 */
export function sureFileNameUnique(filePath: string): string {
  if (judgeDirSync(filePath) !== 0) {
    return filePath
  }
  const fileBase = path.resolve(filePath, '..')
  const fileName = getFileName(filePath, true)
  const suffix = getSuffix(filePath)
  let index = 1
  let newPath = ''
  do {
    const p = path.resolve(fileBase, `${fileName}(${index}).${suffix}`)
    if (judgeDirSync(p) !== 0) {
      newPath = p
    }
    index++
  } while (!newPath && index < 100)
  if (index >= 100) {
    newPath = path.resolve(fileBase, `${getUuId}.${suffix}`)
  }
  return newPath
}
