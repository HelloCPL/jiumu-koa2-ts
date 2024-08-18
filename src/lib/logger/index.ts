/**
 * 日志入口
 */
import { Log } from './config'
import { getLogger } from './logger'

const logs = ['info', 'error']

Log.init(logs)

const logger = getLogger(logs[0])
const loggerError = getLogger(logs[1])

export { logger, loggerError }
