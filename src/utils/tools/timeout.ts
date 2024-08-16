/**
 * 处理定时器
 * 使用方法
 *   const timeout = new Timeout(1000)
 *   timeout.set(() => {
 *     // ...
 *   })
 */

let Times: any[] = []

/**
 * 定时器类
 */
export class Timeout {
  timeId: any = null
  time = 0

  constructor(time: number) {
    this.time = time
    Times.push(this)
  }

  set(cb: Function, t?: number) {
    this.clear()
    this.timeId = setTimeout(cb, t || this.time)
  }

  clear() {
    if (this.timeId) {
      clearTimeout(this.timeId)
      this.timeId = null
    }
  }
}

/**
 * 清空所有定时器
 */
export const clearAllTimeout = () => {
  if (Times.length) {
    for (let i = 0; i < Times.length; i++) {
      Times[i].clear()
    }
    Times = []
  }
}
