import { STATIC_DIRS, STATIC_URL } from '@/config'
import path from 'path'
import { judgeDirSync, sureIsDirSync } from '@/utils/files'
import jsonfile from 'jsonfile'
import { isObject, isString } from 'lodash'
import { parseStoreData, stringifyStoreData, toParse, toStringify } from '../tools'
import { decrypt, encrypt } from '../crypto'
import Subscriber from '../subscriber'

const subscriber = new Subscriber()
/**
 * 操作 json 文件
 */
export class StoreJson {
  private filePath: string
  private locked = false

  constructor(fileName: string) {
    const dir = path.resolve(STATIC_URL, STATIC_DIRS[8])
    sureIsDirSync(dir)
    this.filePath = path.resolve(dir, `${fileName}.json`)
    this.init()
  }

  init() {
    const status = judgeDirSync(this.filePath)
    if (status !== 0) {
      jsonfile.writeFileSync(this.filePath, {})
    }
    this.getData()
  }

  // 原始数据 提高性能
  private origin: any = null

  /**
   * 文件读取
   */
  getData(): ObjectAny {
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
  setData(data: ObjectAny, sync?: boolean): void {
    if (this.locked) {
      subscriber.add(this.setData, data, sync)
      return
    }
    this.locked = true
    this.origin = data
    const _data = toEncryptOrDecrypt2(toStringify(data))
    if (sync) {
      jsonfile.writeFileSync(this.filePath, _data)
      this.locked = false
      subscriber.pop()
    } else {
      jsonfile.writeFile(this.filePath, _data, () => {
        this.locked = false
        subscriber.pop()
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
