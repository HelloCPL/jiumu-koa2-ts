/**
 * @description: 设置全局变量或方法
 * @author chen
 * @update 2021-08-06 10:56:54
 */

class InitGlobal {
  constructor() {}

  init() {
    global._unlessPath = [] // 不校验路由集合
    global._requestCount = 0 // 记录第几次请求
    global._requestStart = process.hrtime.bigint() // 请求开始时间
    global._results = {} // 缓存结果，一般用于缓存mysql查询，避免重复查询
  }
}

export default new InitGlobal()
