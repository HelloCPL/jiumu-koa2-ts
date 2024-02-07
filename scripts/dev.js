/**
 * 测试
 */

const path = require('path')
const fs = require('fs')
const execa = require('execa')

async function run() {
  // 强制更新 删除dist目录
  const argv = process.argv
  if (argv && argv.indexOf('force') !== -1) {
    const distDir = path.resolve(__dirname, '../dist')
    const codeDist = judgeDirSync(distDir)
    if (codeDist === 1) {
      Danger_deleteDirSync(distDir)
    }
  }

  const mode = getMode()
  // 运行命令
  await execa(`tsc && concurrently "tsc -W" "nodemon dist/app.js ${mode}"`, { stdio: 'inherit' })
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

function getMode() {
  const env = ['dev', 'test', 'prod']
  let mode = 'dev'
  const argv = process.argv
  argv.find((value) => {
    if (value.indexOf('mode=') !== -1) {
      value = value.substring(5)
      if (env.indexOf(value) !== -1) {
        mode = value
        return true
      }
      return true
    }
    return false
  })
  return mode
}
