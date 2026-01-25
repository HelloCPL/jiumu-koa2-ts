/**
 * 抽象类
 */
export abstract class StoreAbstractClass {
  abstract set: (key: string, value: any, option?: StoreOption) => void
  abstract get: (key: string) => any
  abstract delete: (key: string, option?: StoreOption) => void
  abstract has: (key: string) => boolean
  abstract DANGER_CLEAR: (option?: StoreOption) => void
}
