/**
 * @description: 设置全局变量或方法
 * @author chen
 * @update 2021-08-06 10:56:54
*/

class InitGlobal {
  constructor() {}

  init() {
    global.requestCount = 0 // 请求次数
    global.requestStart = process.hrtime.bigint() // 请求开始时间
    global.requestEnd = process.hrtime.bigint() // 请求结束时间
  }
}

export default new InitGlobal()