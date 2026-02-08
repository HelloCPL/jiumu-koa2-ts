/**
 * @description: 设置全局变量或方法
 * @author chen
 * @update 2021-08-06 10:56:54
 */
import { logger } from '@/lib/logger'
class InitGlobal {
  constructor() {}

  init() {
    global._unlessPath = [] // 不校验路由集合
    logger.info('挂载全局变量')
  }
}

export default new InitGlobal()
