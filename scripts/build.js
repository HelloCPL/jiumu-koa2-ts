/**
 * 打包
 */

const { build } = require('esbuild')
const path = require('path')
const fs = require('fs')
const { isArray } = require('lodash')

async function run() {
  // 删除dist目录
  const distDir = path.resolve(__dirname, '../dist')
  const codeDist = judgeDirSync(distDir)
  if (codeDist === 1) {
    Danger_deleteDirSync(distDir)
  }

  // 复制md文件
  const apiDir = path.resolve(__dirname, '../src/router/api')
  const files = readDirSync(apiDir, '.md', true)
  const targetApiDir = path.resolve(__dirname, '../dist/src/router/api')
  sureIsDirSync(targetApiDir)
  files.forEach((file) => {
    const t = file.replace(/\\\\/g, '\\').replace(/\\/g, '/')
    const i = t.lastIndexOf('/api/')
    if (i !== -1) {
      const arr = t.substring(i + 5).split('/')
      if (isArray(arr)) {
        let p = targetApiDir
        arr.forEach((value, index) => {
          if (index >= arr.length - 1) {
            // 复制文件
            copyFile(file, p, value)
          } else {
            p = path.resolve(p, value)
          }
        })
      }
    }
  })

  // 进行node服务打包
  await build({
    entryPoints: ['src/app.ts'],
    bundle: true,
    platform: 'node',
    minify: true,
    outfile: './dist/app.js'
  })

  console.log('build success')
}

run()

// 判断文件还是目录
function judgeDirSync(dir) {
  try {
    const isExist = fsStatSync(dir)
    if (isExist && isExist.isDirectory()) return 1
    else if (isExist && isExist.isFile()) return 0
    else return -1
  } catch (e) {
    return -1
  }
}

function fsStatSync(dir) {
  try {
    return fs.statSync(dir)
  } catch (e) {
    return false
  }
}

/**
 * 删除文件
 */
function deleteFileSync(dir) {
  const type = judgeDirSync(dir)
  if (type === 0) {
    fs.unlinkSync(dir)
  }
}

// 删除目录
function Danger_deleteDirSync(dir) {
  if (!dir || dir === '/') return
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

// 获取指定目录下的所有文件 同步
function readDirSync(dir, suffix, recursion) {
  const result = []
  const _read = (result, dir) => {
    const files = fs.readdirSync(dir)
    files.forEach((value) => {
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

// 创建目录 同步
function fsMkdirSync(dir) {
  try {
    fs.mkdirSync(dir)
    return true
  } catch (e) {
    return false
  }
}

//  判断目录是否存在，不存在则创建目录 同步
function sureIsDirSync(dir) {
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

/**
 * 复制文件 异步
 * origin 原始文件路径
 * dir 目标路径
 * filename 目标名称
 */
function copyFile(originDir, dir, filename) {
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
