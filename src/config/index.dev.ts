/**
 * @author chen
 * @description dev 开发环境配置
 * @update 2022-04-30 18:05:17
 */

import path from 'path'
import { ConfigOptions } from './interface'

function createConfig(): ConfigOptions {
  const config: ConfigOptions = {
    ENV: 'dev', // 开发环境
    PORT: 3030, // http 服务端口
    PUBLIC_PATH: '', // 服务器位置
    DATABASE: {
      // mysql数据库配置
      NAME: '', // 名称
      USER: '', // 账号
      PASSWORD: '.', // 密码
      HOST: '', // 主机
      PORT: 3306, // 端口
      CONNECTION_LIMIT: 500 // 最大连接数
    },
    REDIS: {
      // redis服务配置
      HOST: '', // 主机
      PORT: 6379, // 端口
      PASSWORD: '' // 密码
    },
    WX: {
      // 微信小程序信息配置
      APP_ID: '',
      APP_SECRET: ''
    },
    TOKEN: {
      // token 信息配置
      SECRET_KEY: 'dev_jiumu', // key
      VALID_TIME: 60 * 60 * 24 * 7, // token 有效期7天
      REFRESH_VALID_TIME: 60 * 60 * 24 * 15 // tokenRefresh 有效期15天
    },
    BASE_URL: 'http://localhost:3030/', // 默认服务路径
    STATIC_URL: path.resolve(process.cwd(), '../jiumu-koa2-ts-static'), // 静态资源路径
    STATIC_DIRS: [
      'files',
      'images',
      'videos',
      'editors',
      'sources',
      'files_big',
      'files_big_upload_temp',
      'files_big_download_temp',
      'store'
    ], // 静态资源目录
    LOGS_URL: path.resolve(process.cwd(), '../jiumu-koa2-ts-logs'), // 日志记录路径
    LOGD_DAYS_TO_KEEP: 15, // 日志有效保留最长时间，超过则清除 单位 day
    CRYPTOJS_KEY: '', // crypto-js 加密字符
    CRYPTOJS_IV: '', // crypto-js 加密字符
    MAX_FIELDS_SIZE: 20 * 1024 * 1024, // 静态资源上传最大文件大小 默认20m 注意：切片上传不受限制
    FILE_VAILD_TIME: 7 * 24 * 60 * 60 * 1000, // 非公开静态资源链接有效期7天
    IS_VERIFY_TOKEN_BY_REDIS: true, // 是否使用redis在线校验token信息 为false时将不校验IS_ALLOW_MULTIPLE_LOGIN条件
    IS_ALLOW_MULTIPLE_LOGIN: true, // 同一账号是否允许在不同设备不同平台（如浏览器）同时登录
    IS_VERIFY_API_PERMISSION: false, // 是否校验非公开api的用户请求权限
    IS_VERIFY_STATIC_PERMISSION: true, // 是否校验非公开静态资源文件的请求权限
    IS_PRINT_LOG: true, // 是否在终端打印请求的普通日志信息
    IS_SHOW_MDAPI: true // 是否提供mdapi文档接口
  }

  try {
    // 该文件为私密配置文件信息
    let secretConfig = require('./secret')
    secretConfig = secretConfig.default || secretConfig
    config.DATABASE = secretConfig.DATABASE
    config.REDIS = secretConfig.REDIS
    config.WX = secretConfig.WX
    config.CRYPTOJS_KEY = secretConfig.CRYPTOJS_KEY
    config.CRYPTOJS_IV = secretConfig.CRYPTOJS_IV
  } catch (e) {}

  return config
}

const CONFIG: ConfigOptions = createConfig()

export default CONFIG
