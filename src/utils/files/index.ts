/**
 * 文件操作相关方法
 */

import { STATIC_URL } from '@/config'
import fs, { ReadStream, Stats, WriteStream } from 'fs'
import { File } from 'formidable'
import path from 'path'
import zlib from 'zlib'
import { isArray } from 'lodash'
import { getFileName, getSuffix, getUuId } from '../tools'

/**
 * 获取路径
 * 相对于 STATIC_URL
 */
export function getPath(...p: string[]): string {
  return path.join(STATIC_URL, ...p)
}

/**
 * 读取路径信息 异步
 * @param dir 路径
 * @returns 存在返回信息；不存在返回 Promise<false>
 */
export function fsStat(dir: string): Promise<Stats | false> {
  return new Promise((resolve) => {
    fs.stat(dir, (err: NodeJS.ErrnoException | null, stats: Stats) => {
      if (err) {
        console.warn('warn in fsStat:', err)
        resolve(false)
      } else resolve(stats)
    })
  })
}

/**
 * 读取路径信息 同步
 * @param dir 路径
 * @returns 存在返回信息； 不存在返回 false
 */
export function fsStatSync(dir: string): Stats | false {
  try {
    return fs.statSync(dir)
  } catch (err) {
    console.warn('Unexpected warn in fsStatSync:', err)
    return false
  }
}

/**
 * 创建目录 异步
 * @param dir 路径
 * @returns 返回 Promise<boolean>
 */
export function fsMkdir(dir: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.mkdir(dir, { recursive: true }, (err: NodeJS.ErrnoException | null) => {
      if (err) {
        console.warn('warn in fsMkdir:', err)
        resolve(false)
      } else resolve(true)
    })
  })
}

/**
 * 创建目录 同步
 * @param dir 路径
 * @returns 返回 boolean
 */
export function fsMkdirSync(dir: string): boolean {
  try {
    fs.mkdirSync(dir, { recursive: true })
    return true
  } catch (err) {
    console.warn('Unexpected warn in fsMkdirSync:', err)
    return false
  }
}

/**
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

/**
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
  } catch (err) {
    console.warn('Unexpected warn in judgeDirSync:', err)
    return -1
  }
}

/**
 * 判断目录是否存在，不存在则创建目录 异步
 * @param dir 路径
 * @returns 返回是否创建成功 Promise<boolean>
 */
export async function sureIsDir(dir: string): Promise<boolean> {
  const type = await judgeDir(dir)
  // 目录存在返回true
  if (type === 1) return true
  else if (type === 0) return false
  return await fsMkdir(dir)
}

/**
 * 判断目录是否存在，不存在则创建目录 同步
 * @param dir 路径
 * @returns 返回是否创建成功 boolean
 */
export function sureIsDirSync(dir: string): boolean {
  const type = judgeDirSync(dir)
  if (type === 1) return true
  else if (type === 0) return false
  return fsMkdirSync(dir)
}

/**
 * 接收一个文件对象，创建一个相同的文件 异步
 * @param file 文件对象
 * @param dir 文件存放位置
 * @param fileName 指定文件名
 */
export function createFile(file: File, dir: string, fileName: string): Promise<boolean> {
  // 保证目录存在
  return new Promise((resolve) => {
    try {
      if (!sureIsDirSync(dir)) {
        resolve(false)
        return
      }
      const savePath = path.join(dir, fileName)
      // 创建可读流
      const reader: ReadStream = fs.createReadStream(file.path)
      const writeStream: WriteStream = fs.createWriteStream(savePath)
      reader.on('error', (err: NodeJS.ErrnoException | null) => {
        console.warn('warn in createFile read stream:', err)
        resolve(false)
      })
      writeStream.on('error', (err: NodeJS.ErrnoException | null) => {
        console.warn('warn in createFile write stream:', err)
        resolve(false)
      })
      writeStream.on('finish', () => {
        resolve(true)
      })
      reader.pipe(writeStream)
    } catch (err) {
      console.warn('Unexpected warn in createFile:', err)
      resolve(false)
    }
  })
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
      if (!sureIsDirSync(targetDir)) {
        resolve(false)
        return
      }
      const targetFile = path.join(targetDir, filename)
      fs.copyFile(originPath, targetFile, (err: NodeJS.ErrnoException | null) => {
        if (err) {
          console.warn('warn in copyFile:', err)
          resolve(false)
        } else resolve(true)
      })
    } else {
      resolve(false)
    }
  })
}

/**
 * 删除文件 异步
 * @param filePath 文件路径
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const type = judgeDirSync(filePath)
    if (type === 0) {
      fs.unlink(filePath, (err: NodeJS.ErrnoException | null) => {
        if (err) {
          console.warn('warn in deleteFile:', err)
          resolve(false)
        } else resolve(true)
      })
    } else {
      resolve(true)
    }
  })
}

/**
 * 删除文件 同步
 * @param filePath 文件路径
 */
export function deleteFileSync(filePath: string): boolean {
  const type = judgeDirSync(filePath)
  if (type === 0) {
    try {
      fs.unlinkSync(filePath)
      return true
    } catch (err) {
      console.warn('Unexpected warn in deleteFileSync:', err)
      return false
    }
  } else {
    return true
  }
}

/**
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
      if (type2 !== -1) Danger_deleteDirSync(dir2)
    })
    try {
      fs.rmdirSync(dir)
    } catch (err) {
      console.warn('Unexpected warn in Danger_deleteDirSync:', err)
    }
  } else if (type === 0) {
    deleteFileSync(dir)
  }
}

/**
 * 获取指定目录下的所有文件 异步
 * @param dir 指定目录
 * @param suffix 指定要获取的后缀，不传默认所有类型文件
 * @returns Promise<string[]> 返回文件列表
 */
export function readDir(dir: string, suffix?: string): Promise<string[]> {
  return new Promise((resolve) => {
    const status = judgeDirSync(dir)
    if (status === 1) {
      fs.readdir(dir, (err: NodeJS.ErrnoException | null, files) => {
        if (!err && isArray(files)) {
          const result = files
            .filter((value) => {
              const flag = judgeDirSync(path.join(dir, value)) === 0
              if (suffix) {
                const targetSuffix = suffix?.startsWith('.') ? suffix : '.' + suffix
                return flag && value.endsWith(targetSuffix)
              } else {
                return flag
              }
            })
            .map((value) => path.join(dir, value))
          resolve(result)
        } else {
          resolve([])
        }
      })
    } else {
      resolve([])
    }
  })
}

/**
 * 获取指定目录下的所有文件 同步
 * @param dir 指定目录
 * @param suffix 指定要获取的后缀，不传默认所有类型文件
 * @param recursive 是否递归遍历
 * @returns string[] 返回文件列表
 */
export function readDirSync(dir: string, suffix?: string, recursive?: boolean): string[] {
  const result: string[] = []
  const _read = (dir: string) => {
    const files = fs.readdirSync(dir)
    files.forEach((value: string) => {
      const newDir = path.resolve(dir, value)
      const code = judgeDirSync(newDir)
      if (code === 0) {
        if (suffix) {
          const targetSuffix = suffix?.startsWith('.') ? suffix : '.' + suffix
          if (value.endsWith(targetSuffix)) result.push(newDir)
        } else {
          result.push(newDir)
        }
      } else if (code === 1 && recursive) {
        _read(newDir)
      }
    })
  }
  const status = judgeDirSync(dir)
  if (status === 1) {
    _read(dir)
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
    fs.readFile(filePath, encoding, (err: NodeJS.ErrnoException | null, data) => {
      if (err) {
        if (max > 1) {
          readFile(filePath, encoding, max - 1).then(resolve)
        } else {
          resolve('')
        }
      } else {
        resolve(data)
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
  try {
    const content = fs.readFileSync(filePath, encoding)
    return content
  } catch (err) {
    console.warn('Unexpected warn in readFileSync:', err)
    if (max > 1) return readFileSync(filePath, encoding, max - 1)
    return ''
  }
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
    fs.writeFile(filePath, data, encoding, (err: NodeJS.ErrnoException | null) => {
      if (err) resolve(false)
      else resolve(judgeDirSync(filePath) === 0)
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
    const dir = path.resolve(filePath, '..')
    sureIsDirSync(dir)
    fs.writeFileSync(filePath, data, encoding)
    return judgeDirSync(filePath) === 0
  } catch (err) {
    console.warn('Unexpected warn in writeFileSync:', err)
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
    try {
      const o = path.resolve(originPath, '..')
      const t = path.resolve(targetPath, '..')
      sureIsDirSync(o)
      sureIsDirSync(t)
      const gunzip = zlib.createGunzip()
      const readStream = fs.createReadStream(originPath)
      const writeStream = fs.createWriteStream(targetPath)
      readStream.pipe(gunzip).pipe(writeStream)
      writeStream.on('finish', () => {
        resolve(judgeDirSync(targetPath) !== -1)
      })
      readStream.on('error', (err: NodeJS.ErrnoException | null) => {
        console.warn('warn in unzip read stream:', err)
        resolve(false)
      })
      writeStream.on('error', (err: NodeJS.ErrnoException | null) => {
        console.warn('warn in unzip write stream:', err)
        resolve(false)
      })
      gunzip.on('error', (err: NodeJS.ErrnoException | null) => {
        console.warn('warn in unzip gunzip:', err)
        resolve(false)
      })
    } catch (err) {
      console.warn('Unexpected warn in unzip:', err)
      resolve(false)
    }
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
    try {
      const o = path.resolve(originPath, '..')
      const t = path.resolve(targetPath, '..')
      sureIsDirSync(o)
      sureIsDirSync(t)
      const gzip = zlib.createGzip()
      const readStream = fs.createReadStream(originPath)
      const writeStream = fs.createWriteStream(targetPath)

      readStream.pipe(gzip).pipe(writeStream)

      writeStream.on('finish', () => {
        resolve(judgeDirSync(targetPath) !== -1)
      })
      readStream.on('error', (err: NodeJS.ErrnoException | null) => {
        console.warn('warn in zip read stream:', err)
        resolve(false)
      })
      writeStream.on('error', (err: NodeJS.ErrnoException | null) => {
        console.warn('warn in unzip write stream:', err)
        resolve(false)
      })
      gzip.on('error', (err: NodeJS.ErrnoException | null) => {
        console.warn('warn in zip gzip:', err)
        resolve(false)
      })
    } catch (err) {
      console.warn('Unexpected warn in zip:', err)
      resolve(false)
    }
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
    const code1 = judgeDirSync(originPath)
    const code2 = judgeDirSync(targetPath)
    if (code1 === 0 && code2 !== 0) {
      fs.rename(originPath, targetPath, (err: NodeJS.ErrnoException | null) => {
        if (!err) resolve(true)
        else resolve(false)
      })
    } else {
      resolve(false)
    }
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
  try {
    const code1 = judgeDirSync(originPath)
    const code2 = judgeDirSync(targetPath)

    if (code1 === 0 && code2 !== 0) {
      fs.renameSync(originPath, targetPath)
      return judgeDirSync(targetPath) === 0
    }
    return false
  } catch {
    return false
  }
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
      break
    }
    index++
  } while (!newPath && index < 100)
  if (index >= 100) {
    newPath = path.resolve(fileBase, `${getUuId}.${suffix}`)
  }
  return newPath
}
