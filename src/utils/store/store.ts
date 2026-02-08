import Subscriber from '../subscriber'
import { StoreJson } from './jsonfile'
import { StoreAbstractClass } from './store-abstract'

const subscriber = new Subscriber()

export class StoreData implements StoreAbstractClass {
  private storeJson: StoreJson
  private locked = false

  constructor(storeJson: StoreJson) {
    this.storeJson = storeJson
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
   * 存储
   * @param key
   * @param value
   * @param option.sync? 是否同步修改，默认 false
   */
  set(key: string, value: any, option?: StoreOption): void {
    if (this.locked) {
      subscriber.add(this.set, key, value, option)
      return
    }
    this.locked = true
    const origin = this.storeJson.getData()
    origin[key] = value
    this.storeJson.setData(origin, option?.sync)
    this.locked = false
    subscriber.pop()
  }

  /**
   * 删除某个 key 的值
   * @param key
   * @param option.sync? 是否同步修改，默认 true
   */
  delete(key: string, option?: StoreOption): void {
    if (this.locked) {
      subscriber.add(this.delete, key, option)
      return
    }
    this.locked = true
    const origin: ObjectAny = this.storeJson.getData()
    if (Object.prototype.hasOwnProperty.call(origin, key)) {
      delete origin[key]
      this.storeJson.setData(origin, option?.sync)
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
  DANGER_CLEAR(option?: StoreOption) {
    if (this.locked) {
      subscriber.add(this.DANGER_CLEAR, option)
      return
    }
    this.locked = true
    this.storeJson.setData({}, option?.sync)
    this.locked = false
    subscriber.pop()
  }
}
