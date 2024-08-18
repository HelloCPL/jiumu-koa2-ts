/**
 * @description: 配置日志信息
 * @author chen
 * @update 2021-03-11 16:31:23
 */

import { LOGS_URL, LOGD_DAYS_TO_KEEP } from '@/config'
import { deleteFile, readDir, sureIsDir } from '@/utils/files'
import { getCurrentTime, getFileName, isBeforeTargetDate } from '@/utils/tools'
import { isArray } from 'lodash'
import path from 'path'
import log4js from 'log4js'
import { storeProject } from '@/utils/store'

/**
 * 日志类
 */
export class Log {
  static isInit = false
  static init(names: string[]) {
    if (this.isInit) return
    this.initDir()
    const obj = this.getConfig(names)
    log4js.configure(obj)
    this.isInit = true
  }

  // 初始化目录
  static initDir() {
    sureIsDir(LOGS_URL)
  }

  // 获取配置
  static getConfig(names: string[]) {
    const config: any = {
      appenders: {
        'rule-console': { type: 'console' }
      },
      // 供外部调用的名称与对应设置定义
      categories: {
        default: { appenders: ['rule-console'], level: 'all' }
      },
      baseLogPath: LOGS_URL
    }
    names.forEach((name) => {
      config.appenders[name] = {
        type: 'dateFile',
        filename: path.join(LOGS_URL, name),
        pattern: '-yyyy-MM-dd-hh.log',
        alwaysIncludePattern: true,
        encoding: 'utf-8',
        maxLogSize: 3 * 1024 * 1024, // 3 m
        numBackups: 3
      }
      config.categories[name] = { appenders: [name], level: 'info' }
    })
    return config
  }
}

/**
 * 清除过期的日志
 */
export const clearExpiredLogs = () => {
  const key = 'clear-logs-time'
  const clearLogsTime = storeProject.get(key)
  if (
    !clearLogsTime ||
    !isBeforeTargetDate({
      date: clearLogsTime,
      value: 1
    })
  ) {
    storeProject.set(key, getCurrentTime())
    readDir(LOGS_URL).then((paths) => {
      if (isArray(paths)) {
        const logs = paths
          .map((p) => {
            let status = false
            const file = getFileName(p, true)
            const i1 = file.indexOf('.-')
            if (i1 !== -1) {
              const d = file.substring(i1 + 2).substring(0, 10)
              const reg = /\d{4}-\d{2}-\d{2}/
              if (
                reg.test(d) &&
                !isBeforeTargetDate({
                  date: d,
                  value: LOGD_DAYS_TO_KEEP
                })
              )
                status = true
            }
            return {
              status,
              path: p
            }
          })
          .filter((item) => item.status)
        logs.forEach((item) => {
          deleteFile(item.path)
        })
      }
    })
  }
}
