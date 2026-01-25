/**
 * 依赖收集
 */
export default class Subscriber {
  private collection: any[] = []
  add(fn: Function, ...arg: any[]) {
    this.collection.unshift({ fn, arg })
  }
  pop() {
    if (this.collection.length) {
      const obj = this.collection.pop()
      if (obj.arg) obj.fn(...obj.arg)
      else obj.fn()
      if (this.collection.length > 0) {
        this.pop()
      }
    }
  }
}
