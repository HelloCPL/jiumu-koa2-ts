// import path from 'path'
// import { getEnv } from '../../utils/env'
// import { deleteFile, readDir } from '../../../public/utils/file'
// import { isArray } from 'lodash'
// import { getFileName } from '../../../public/utils/tools'
// import { getCurrentTime, isBeforeTargetDate } from '../../utils/date'
// import { StoreCommon } from '../../store/index'
// import log4js from 'log4js'
// import { sureIsDir } from '../../../public/utils/file'

// const LOGS_URL = path.resolve(getEnv('VITE_USERDATA_DIR'), getEnv('VITE_SERVICE_LOGS_DIR'))

// /**
//  * 日志类
//  */
// export class Log {
//   static isInit = false

//   static init(names: string[]) {
//     if (this.isInit) return
//     this.initDir()
//     const obj = this.getConfig(names)
//     log4js.configure(obj)
//     this.isInit = true
//   }

//   // 初始化目录
//   static initDir() {
//     sureIsDir(LOGS_URL)
//   }

//   // 获取配置
//   static getConfig(names: string[]) {
//     const config: any = {
//       appenders: {
//         'rule-console': { type: 'console' }
//       },
//       // 供外部调用的名称与对应设置定义
//       categories: {
//         default: { appenders: ['rule-console'], level: 'all' }
//       },
//       baseLogPath: LOGS_URL
//     }
//     names.forEach((name) => {
//       config.appenders[name] = {
//         type: 'dateFile',
//         filename: path.join(LOGS_URL, name),
//         pattern: '-yyyy-MM-dd-hh.log',
//         alwaysIncludePattern: true,
//         encoding: 'utf-8',
//         maxLogSize: 3 * 1024 * 1024, // 3 m
//         numBackups: 3
//       }
//       config.categories[name] = { appenders: [name], level: 'info' }
//     })
//     return config
//   }
// }

// /**
//  * 清除过期的日志
//  */
// export const clearExpiredLogs = () => {
//   const key = 'clear-logs-time'
//   const clearLogsTime = StoreCommon.get(key)
//   if (!clearLogsTime || !isBeforeTargetDate(clearLogsTime, 1)) {
//     StoreCommon.set(key, getCurrentTime())
//     readDir(LOGS_URL).then((paths) => {
//       if (isArray(paths)) {
//         const logs = paths
//           .map((p) => {
//             let status = false
//             const file = getFileName(p, true)
//             const i1 = file.indexOf('.-')
//             if (i1 !== -1) {
//               const d = file.substring(i1 + 2).substring(0, 10)
//               const reg = /\d{4}-\d{2}-\d{2}/
//               if (reg.test(d) && !isBeforeTargetDate(d, getEnv('VITE_SERVICE_LOGS_DAYS_TO_KEEP')))
//                 status = true
//             }
//             return {
//               status,
//               path: p
//             }
//           })
//           .filter((item) => item.status)
//         logs.forEach((item) => {
//           deleteFile(item.path)
//         })
//       }
//     })
//   }
// }
