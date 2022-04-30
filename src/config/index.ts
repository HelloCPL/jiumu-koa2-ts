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
  HTTPS_PORT,
  DATABASE,
  REDIS,
  WX,
  TOKEN,
  BASE_URL,
  STATIC_URL,
  LOGS_URL,
  CRYPTOJS_KEY,
  CRYPTOJS_IV,
  MAX_FIELDS_SIZE,
  IS_ALLOW_MULTIPLE_LOGIN,
  IS_VERIFY_TOKEN_BY_REDIS,
  IS_VERIFY_API_PERMISSION,
  IS_VERIFY_STATIC_PERMISSION,
  IS_PRINT_LOG
} = CONFIG

export default CONFIG