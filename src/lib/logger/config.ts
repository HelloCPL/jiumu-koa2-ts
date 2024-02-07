/**
 * @description: 配置日志信息
 * @author chen
 * @update 2021-03-11 16:31:23
 */

import { LOGS_URL, LOGD_DAYS_TO_KEEP } from '@/config'
import { deleteFile, readDir } from '@/utils/files'
import { Store } from '@/utils/store'
import { getCurrentTime, getFileName, isBeforeTargetDate } from '@/utils/tools'
import { isArray } from 'lodash'

import path from 'path'

// 普通日志信息
const infoFileName = 'info' // 文件名

export function getConfig() {
  return {
    // 日志格式等设置
    appenders: {
      'rule-console': { type: 'console' },
      infoLogger: {
        type: 'dateFile',
        filename: path.join(LOGS_URL, infoFileName),
        pattern: '-yyyy-MM-dd-hh.log',
        alwaysIncludePattern: true,
        encoding: 'utf-8',
        maxLogSize: 5 * 1024 * 1024, // 5 m
        numBackups: 3
      }
    },
    // 供外部调用的名称与对应设置定义
    categories: {
      default: { appenders: ['rule-console'], level: 'all' },
      infoLogger: { appenders: ['infoLogger'], level: 'all' },
      // "errorLogger": { "appenders": ["errorLogger"], "level": "all" },
      http: { appenders: ['infoLogger'], level: 'info' }
    },
    baseLogPath: LOGS_URL
  }
}

/**
 * 清除过期的日志
 */
export const clearExpiredLogs = () => {
  const key = 'clear-logs-time'
  const clearLogsTime = Store.get(key)
  if (!clearLogsTime || !isBeforeTargetDate(clearLogsTime, 1)) {
    Store.set(key, getCurrentTime())
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
              if (reg.test(d) && !isBeforeTargetDate(d, LOGD_DAYS_TO_KEEP)) status = true
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
