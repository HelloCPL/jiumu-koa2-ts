/**
 * @description: 全局配置接口说明
 * @author chen
 * @update 2021-08-06 10:29:37
*/

interface DatabaseOptions {
  NAME: string,
  USER: string,
  PASSWORD: string,
  HOST: string,
  PORT: number,
  CONNECTION_LIMIT: number
}

interface RedisOptions {
  PASSWORD: string,
  HOST: string,
  PORT: number,
}

interface WXOptions {
  APP_ID: string,
  APP_SECRET: string
}

interface ConfigTokenOptions {
  SECRET_KEY: string,
  VALID_TIME: number,
  REFRESH_VALID_TIME: number
}

export interface ConfigOptions extends ObjectAny {
  ENV: string,
  PORT: number,
  HTTPS_PORT: number,
  DATABASE: DatabaseOptions,
  REDIS: RedisOptions,
  WX: WXOptions,
  TOKEN: ConfigTokenOptions,
  BASE_URL: string,
  STATIC_URL: string,
  LOGS_URL: string,
  CRYPTOJS_KEY: string,
  CRYPTOJS_IV: string,
  MAX_FIELDS_SIZE: number,
  IS_ALLOW_MULTIPLE_LOGIN: boolean,
  IS_VERIFY_TOKEN_BY_REDIS: boolean,
  IS_VERIFY_API_PERMISSION: boolean,
  IS_VERIFY_STATIC_PERMISSION: boolean,
  IS_PRINT_LOG: boolean
}

export interface SecretConfigOption {
  DATABASE: DatabaseOptions,
  REDIS: RedisOptions,
  WX: WXOptions
}