import { STATIC_DIRS, STATIC_URL } from '@/config'
import path from 'path'
import { judgeDirSync, sureIsDirSync } from '@/utils/files'
import jsonfile from 'jsonfile'
import { isObject, isString } from 'lodash'
import { parseStoreData, stringifyStoreData, toParse, toStringify } from '../tools'
import { decrypt, encrypt } from '../crypto'

/**
 * 操作 json 文件
 */
export class StoreJson {
  IS_INIT = false
  filePath = ''

  constructor(fileName: string) {
    const dir = path.resolve(STATIC_URL, STATIC_DIRS[8])
    sureIsDirSync(dir)
    this.filePath = path.resolve(dir, `${fileName}.json`)
  }

  init() {
    if (this.IS_INIT) return
    const status = judgeDirSync(this.filePath)
    if (status !== 0) {
      jsonfile.writeFileSync(this.filePath, {})
    }
  }

  // 原始数据 提高性能
  private origin: any = null

  /**
   * 文件读取
   */
  getData(): ObjectAny {
    if (!this.IS_INIT) this.init()
    if (this.origin) return this.origin
    const obj: ObjectAny = {}
    try {
      const content = jsonfile.readFileSync(this.filePath)
      let doc: any
      if (isObject(content)) {
        doc = content
      } else if (isString(content)) {
        doc = toParse(toEncryptOrDecrypt2(content, false))
      }
      if (isObject(doc)) {
        this.origin = doc
        return doc
      }
      return obj
    } catch (e) {
      return obj
    }
  }

  /**
   * 文件写入
   * sync 是否同步
   */
  setData(data: ObjectAny, sync = true): void {
    if (!this.IS_INIT) this.init()
    this.origin = null
    const _data = toEncryptOrDecrypt2(toStringify(data))
    if (sync) {
      jsonfile.writeFileSync(this.filePath, _data)
      this.getData()
    } else {
      jsonfile.writeFile(this.filePath, _data, () => {
        this.getData()
      })
    }
  }
}

/**
 * 处理内容加密或解密
 * @param value 要加密或解密的内容
 * @param isEncrypt 是否加密 true 加密 false 解密
 * @returns 返回加密或解密后的字符串
 */
function toEncryptOrDecrypt2(value: string, isEncrypt = true): string {
  if (isEncrypt) {
    // 加密
    const _val = stringifyStoreData(value)
    if (!_val || _val.includes('__encrypt__')) return _val
    return encrypt(_val) + '__encrypt__'
  } else {
    // 解密
    const hasEncrypt = isString(value) && value.search(/__encrypt__/g) !== -1
    if (hasEncrypt) {
      value = value.replace(/__encrypt__/g, '')
      value = decrypt(value)
    }
    return parseStoreData(value)
  }
}
