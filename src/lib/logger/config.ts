/**
 * @description: 配置日志信息
 * @author chen
 * @update 2021-03-11 16:31:23
 */

import { LOGS_URL } from '@/config'

import path from 'path'

// 普通日志信息
const infoPath = '/info' // 错误日志目录
const infoFileName = 'info' // 文件名

export default {
  // 日志格式等设置
  appenders: {
    'rule-console': { type: 'console' },
    infoLogger: {
      type: 'dateFile',
      filename: path.join(LOGS_URL, infoPath, infoFileName),
      pattern: '-yyyy-MM-dd-hh.log',
      alwaysIncludePattern: true,
      encoding: 'utf-8',
      maxLogSize: 20 * 1024 * 1024, // 20 m
      numBackups: 3,
      path: infoPath
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
