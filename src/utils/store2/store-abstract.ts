/**
 * 抽象类
 */
export abstract class StoreAbstractClass {
  abstract set: (key: string, value: any, option?: StoreOption) => void
  abstract get: (key: string) => any
  abstract delete: (key: string, option?: StoreOption) => void
  abstract has: (key: string) => boolean
  abstract clear: () => void

  abstract listAdd: (key: string, value: any, option?: StoreAddOption) => void
  abstract listSplice: (key: string, index: number, len?: number, value?: any) => void
  abstract listHasByValue: (key: string, value: any) => number
  abstract listDeleteByValue: (key: string, value: any, option?: StoreDeleteOption) => void
  abstract listGetByValue: (key: string, value: any) => any
}
