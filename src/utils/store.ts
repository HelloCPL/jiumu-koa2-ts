/**
 * @description 本地文件存储
 * @author cpl
 * @createTime 2024-02-05 11:32:35
 */

import path from 'path'
import { judgeDirSync, sureIsDirSync } from './files'
import { getKey, isObject2 } from './tools'
import { STATIC_URL, STATIC_DIRS } from '@/config'
import jsonfile from 'jsonfile'
import { isArray, isBoolean, isNull, isNumber, isObject, isString } from 'lodash'
import Subscriber from './subscriber'
import { decrypt, encrypt } from './crypto'

export class StoreJson {
  IS_INIT = false
  filePath = ''

  // 原始数据 提高性能
  private origin: any = null

  constructor(fileName: string) {
    const dir = path.resolve(STATIC_URL, STATIC_DIRS[8])
    sureIsDirSync(dir)
    fileName = `${getKey(fileName)}.json`
    this.filePath = path.resolve(dir, fileName)
  }

  init() {
    if (this.IS_INIT) return
    const status = judgeDirSync(this.filePath)
    if (status !== 0) {
      jsonfile.writeFileSync(this.filePath, {})
    }
  }

  // 设置数据
  getData(): ObjectAny {
    if (!this.IS_INIT) this.init()
    if (this.origin) return this.origin
    const obj: ObjectAny = {}
    try {
      const doc = jsonfile.readFileSync(this.filePath)
      if (isObject(doc)) {
        this.origin = doc
        return doc
      }
      return obj
    } catch (e) {
      return obj
    }
  }

  // 设置数据
  setData(data: ObjectAny): void {
    if (!this.IS_INIT) this.init()
    this.origin = null
    jsonfile.writeFileSync(this.filePath, data)
  }
}

interface StoreOption {
  encrypt?: boolean // 缓存内容是否加密
}

interface StoreDeleteOption {
  repeat?: boolean
}

abstract class StoreAbstractClass {
  static set: (key: string, value: any, option?: StoreOption) => void
  static get: (key: string) => any
  static delete: (key: string) => void
  static has: (key: string) => boolean
  static clear: () => void
}
const subscriber = new Subscriber()

class StoreData implements StoreAbstractClass {
  storeJson: StoreJson

  locked = false

  constructor(storeJson: StoreJson) {
    this.storeJson = storeJson
  }

  /**
   * 存储
   */
  set(key: string, value: any, option?: StoreOption): void {
    if (this.locked) {
      subscriber.add(this.set, key, value, option)
      return
    }
    this.locked = true
    const origin = this.storeJson.getData()
    const isEncrypt = option?.encrypt !== false
    if (isEncrypt) {
      value = toEncryptOrDecrypt(value)
    }
    origin[key] = value
    this.storeJson.setData(origin)
    this.locked = false
    subscriber.pop()
  }

  /**
   * 获取 指定的key
   * key 不传则获取整个对象
   */
  get(key?: string): any {
    const origin = this.storeJson.getData()
    if (key) return toEncryptOrDecrypt(origin[key], false)
    else return toEncryptOrDecrypt(origin, false)
  }

  /**
   * 删除某个key
   */
  delete(key: string): void {
    if (this.locked) {
      subscriber.add(this.delete, key)
      return
    }
    this.locked = true
    const origin: ObjectAny = this.storeJson.getData()
    if (Object.prototype.hasOwnProperty.call(origin, key)) {
      delete origin[key]
      this.storeJson.setData(origin)
    }
    this.locked = false
    subscriber.pop()
  }

  /**
   * 判断 key 是否存在
   */
  has(key: string): boolean {
    const origin = this.storeJson.getData()
    return Object.prototype.hasOwnProperty.call(origin, key)
  }

  /**
   * 清空
   */
  clear() {
    this.storeJson.setData({})
  }
}

const storeJson = new StoreJson('data')
export const Store = new StoreData(storeJson)

/**
 * 处理内容加密或解密
 */
function toEncryptOrDecrypt(value: any, isEncrypt = true) {
  const handleED = (val: any) => {
    if (isEncrypt) return encrypt(_setItemFormat(val)) + '__encrypt__'
    else {
      const hasEncrypt = isString(val) && val.search(/__encrypt__/g) !== -1
      if (hasEncrypt) {
        val = val.replace(/__encrypt__/g, '')
        val = decrypt(val)
      }
      return _getItemFormat(val)
    }
  }
  // 处理对象 key
  const handleObjectKey = (obj: ObjectAny) => {
    const newObj: ObjectAny = {}
    for (const key in obj) {
      if (isArray(obj[key])) newObj[key] = handleArrayKey(obj[key])
      else if (isObject2(obj[key])) newObj[key] = handleObjectKey(obj[key])
      else {
        newObj[key] = handleED(obj[key])
      }
    }
    return newObj
  }
  // 处理数组
  const handleArrayKey = (arr: any[]) => {
    const newArr: any[] = []

    for (let i = 0, len = arr.length; i < len; i++) {
      if (isArray(arr[i])) newArr[i] = handleArrayKey(<ObjectAny[]>arr[i])
      else if (isObject2(arr[i])) newArr[i] = handleObjectKey(arr[i])
      else {
        newArr[i] = handleED(arr[i])
      }
    }
    return newArr
  }
  if (isArray(value))
    // @ts-ignore
    return handleArrayKey(value)
  else if (isObject2(value))
    // @ts-ignore
    return handleObjectKey(value)
  return handleED(value)
}

// 格式化存储数据
function _setItemFormat(value: any) {
  if (Object.is(value, NaN)) return '__NaN__'
  else if (isNull(value)) return '__Null__'
  else if (value === undefined) return '__Undefined__'
  else if (isBoolean(value)) return `__Boolean__${value.toString().replace(/__Boolean__/gi, '')}`
  else if (isNumber(value)) return `__Number__${value.toString().replace(/__Number__/gi, '')}`
  else return value
}

// 解构存储数据格式
function _getItemFormat(value: any): any {
  if (!value) return value
  else if (value === '__NaN__') return NaN
  else if (value === '__Null__') return null
  else if (value === '__Undefined__') return undefined
  else if (value === '__Boolean__true') return true
  else if (value === '__Boolean__false') return false
  else if (isString(value) && value.startsWith('__Number__')) return Number(value.substring(10))
  else return value
}
