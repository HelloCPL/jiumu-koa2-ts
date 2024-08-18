import { isArray, isFunction } from 'lodash'
import Subscriber from '../subscriber'
import { StoreJson } from './jsonfile'
import { StoreAbstractClass } from './store-abstract'

// 创建一个依赖收集器
const subscriber = new Subscriber()

export class StoreData implements StoreAbstractClass {
  storeJson: StoreJson
  locked = false

  constructor(storeJson: StoreJson) {
    this.storeJson = storeJson
  }

  /**
   * 存储
   * @param key
   * @param value
   * @param option.sync? 是否同步修改，默认 true
   */
  set(key: string, value: any, option?: StoreOption): void {
    if (this.locked) {
      subscriber.add(this.set, key, value, option)
      return
    }
    this.locked = true
    const origin = this.storeJson.getData()
    const sync = option?.sync !== false
    origin[key] = value
    this.storeJson.setData(origin, sync)
    this.locked = false
    subscriber.pop()
  }

  /**
   * 获取指定 key 的值或整个对象
   * @param key? key 不传则获取整个对象
   * @returns 返回指定 key 的值或整个对象
   */
  get(key?: string): any {
    const origin = this.storeJson.getData()
    if (key) {
      return origin[key]
    } else return origin
  }

  /**
   * 删除某个 key 的值
   * @param key
   * @param option.sync? 是否同步修改，默认 true
   */
  delete(key: string, option?: StoreOption): void {
    if (this.locked) {
      subscriber.add(this.delete, key)
      return
    }
    this.locked = true
    const origin: ObjectAny = this.storeJson.getData()
    if (Object.prototype.hasOwnProperty.call(origin, key)) {
      const sync = option?.sync !== false
      delete origin[key]
      this.storeJson.setData(origin, sync)
    }
    this.locked = false
    subscriber.pop()
  }

  /**
   * 判断某个 key 是否存在
   * @param key
   * @returns 返回 boolean
   */
  has(key: string): boolean {
    const origin = this.storeJson.getData()
    return Object.prototype.hasOwnProperty.call(origin, key)
  }

  /**
   * 清空所有内容
   */
  clear() {
    this.storeJson.setData({})
  }

  // --------------------------  有关数组的辅助方法 ----------------------------

  /**
   * 以数组形式管理某个 key 的数据新增
   * @param key
   * @param value
   * @param option.unique? 为真时，数组若已有匹配的值则不会继续新增（但也不会删除已有重复的值） 默认 false
   * @param option.validator? 自定义匹配规则
   * @param option.sync? 是否同步修改，默认 true
   */
  listAdd(key: string, value: any, option?: StoreAddOption) {
    if (this.locked) {
      subscriber.add(this.listAdd, key, value, option)
      return
    }
    this.locked = true
    const origin = this.storeJson.getData()
    const data = origin[key]
    const _value = value
    let hasSet = true
    if (isArray(data)) {
      if (option?.unique) {
        option.validator = option.validator || ((item) => item === _value)
        let isExist = false
        for (let i = 0; i < data.length; i++) {
          isExist = option.validator(data[i])
          if (isExist) {
            break
          }
        }
        if (isExist) hasSet = false
        else origin[key].push(value)
      } else if (!option?.unique) origin[key].push(value)
    } else {
      origin[key] = [value]
    }
    if (hasSet) {
      const sync = option?.sync !== false
      this.storeJson.setData(origin, sync)
    }
    this.locked = false
    subscriber.pop()
  }

  /**
   * 以数组形式管理某个 key 的数据删除，通过索引删除或替换
   * @param key
   * @param index 替换或删除的索引
   * @param len? 替换或删除的长度，默认 1
   * @param value? 要替换的值
   * @param value
   * @param option.sync? 是否同步修改，默认 true
   */
  listSplice(key: string, index: number, len = 1, value?: any, option?: StoreOption) {
    if (this.locked) {
      subscriber.add(this.listSplice, key, index, len, value)
      return
    }
    this.locked = true
    const origin = this.storeJson.getData()
    const data = origin[key]
    const sync = option?.sync !== false
    if (isArray(data) && data.length && index >= 0) {
      if (value !== undefined) {
        data.splice(index, len, value)
      } else {
        data.splice(index, len)
      }
      origin[key] = data
      this.storeJson.setData(origin, sync)
    }
    this.locked = false
    subscriber.pop()
  }

  /**
   * 以数组形式管理某个 key 的数据删除，匹配值进行删除
   * @param key
   * @param value 可以指定某个值，也可以是自定义校验函数
   * @param option.sync? 是否同步修改，默认 true
   * @param option.repeat? 为真时，会删除所有指定的值，否则只删除匹配的最后一个 默认 true
   */
  listDeleteByValue(key: string, value: any, option?: StoreDeleteOption) {
    if (this.locked) {
      subscriber.add(this.listDeleteByValue, key, value, option)
    }
    this.locked = true
    const origin = this.storeJson.getData()
    const data = origin[key]
    if (isArray(data)) {
      const repeat = option?.repeat !== false
      let hasSet = false
      if (!isFunction(value)) {
        const _value = value
        value = (item: any) => {
          return item === _value
        }
      }
      const len = data.length - 1
      for (let i = len; i >= 0; i--) {
        if (value(data[i])) {
          hasSet = true
          origin[key].splice(i, 1)
          i -= 1
          if (!repeat) break
        }
      }
      if (hasSet) {
        const sync = option?.sync !== false
        this.storeJson.setData(origin, sync)
      }
    }
    this.locked = false
    subscriber.pop()
  }

  /**
   * 以数组形式管理某个 key 的数据是否存在
   * @param key
   * @param value 可以指定某个值，也可以是自定义校验函数
   * @returns 返回这个 key 数组中符合条件的索引
   */
  listHasByValue(key: string, value: any): number {
    const origin = this.storeJson.getData()
    const data = origin[key]
    let targetIndex = -1
    if (isArray(data)) {
      if (!isFunction(value)) {
        const _value = value
        value = (item: any) => {
          return item === _value
        }
      }
      data.find((item, index) => {
        if (value(item)) {
          targetIndex = index
          return true
        }
        return false
      })
    }
    return targetIndex
  }

  /**
   * 以数组形式管理某个 key 的数据的获取，匹配值进行获取
   * @param key
   * @param value 可以指定某个值，也可以是自定义校验函数
   * @returns 返回这个 key 数组中符合条件的值
   */
  listGetByValue(key: string, value: any) {
    const origin = this.storeJson.getData()
    const data = origin[key]
    let result: any = null
    if (isArray(data)) {
      if (!isFunction(value)) {
        const _value = value
        value = (item: any) => {
          return item === _value
        }
      }
      for (let i = 0; i < data.length; i++) {
        if (value(data[i])) {
          result = data[i]
          break
        }
      }
    }
    return result
  }
}
