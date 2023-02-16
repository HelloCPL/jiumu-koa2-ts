/**
 * @author chen
 * @description 判断路径是否存在，不存在则创建
 * @update 2022-01-09 14:59:31
 */

import fs, { Stats } from 'fs'
import path from 'path'

// 读取路径信息
function getStat(dir: string) {
  return new Promise((resolve) => {
    fs.stat(dir, (err: any, stats: Stats) => {
      if (err) resolve(false)
      else resolve(stats)
    })
  })
}

// 创建路径
function mkdir(dir: string) {
  return new Promise((resolve) => {
    fs.mkdir(dir, (err: any) => {
      if (err) resolve(false)
      else resolve(true)
    })
  })
}

// 判断目录是否存在，不存在则创建目录
export async function dirExist(dir: string) {
  const isExist = await getStat(dir)
  // @ts-ignore
  // 目录存在返回true
  if (isExist && isExist.isDirectory()) return true
  // 文件存在返回false
  else if (isExist) return false
  // 路径不存在则拿上级路径
  const tempDir = path.parse(dir).dir
  const status = await dirExist(tempDir)
  let mkdirStatus
  if (status) {
    mkdirStatus = await mkdir(dir)
  }
  return mkdirStatus
}
