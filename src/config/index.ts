/**
 * @author chen
 * @description 配置文件
 * @update 2022-04-30 18:54:40
 */

const env = process.argv[2]
import { ConfigOptions } from './interface'

function createConfig(): ConfigOptions {
  if (env === 'prod') {
    const config = require('./index.prod')
    return config.default || config
  } else if (env === 'test') {
    const config = require('./index.test')
    return config.default || config
  } else {
    const config = require('./index.dev')
    return config.default || config
  }
}

const CONFIG: ConfigOptions = createConfig()

export const {
  ENV,
  PORT,
  PUBLIC_PATH,
  DATABASE,
  REDIS,
  WX,
  TOKEN,
  BASE_URL,
  STATIC_URL,
  STATIC_DIRS,
  LOGS_URL,
  LOGD_DAYS_TO_KEEP,
  CRYPTOJS_KEY,
  CRYPTOJS_IV,
  MAX_FIELDS_SIZE,
  FILE_VAILD_TIME,
  IS_ALLOW_MULTIPLE_LOGIN,
  IS_VERIFY_TOKEN_BY_REDIS,
  IS_VERIFY_API_PERMISSION,
  IS_VERIFY_STATIC_PERMISSION,
  IS_PRINT_LOG,
  IS_SHOW_MDAPI
} = CONFIG

export default CONFIG
