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

interface TokenOptions {
  SECRET_KEY: string,
  VALID_TIME: number,
  REFRESH_VALID_TIME: number
}

export interface ConfigOptions extends ObjectAny {
  ENV: string,
  PORT: number,
  HTTPS_PORT: number,
  CRYPTOJS_KEY: string,
  CRYPTOJS_IV: string,
  DATABASE: DatabaseOptions,
  REDIS: RedisOptions,
  WX: WXOptions,
  TOKEN: TokenOptions,
  BASE_URL: string,
  TERMINALS: string[],
  METHODS: string[],
}