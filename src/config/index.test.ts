/**
 * @author chen
 * @description test 测试环境配置
 * @update 2022-04-30 18:05:17
*/


import path from 'path'
import { ConfigOptions } from './interface'

function createConfig(): ConfigOptions {
  let config: ConfigOptions = {
    ENV: 'test', // 测试环境
    PORT: 7101, // http 服务端口
    PUBLIC_PATH: '/jiumu-koa2-ts-test', // 服务器位置
    DATABASE: { // mysql数据库配置
      NAME: '', // 名称
      USER: '', // 账号
      PASSWORD: '.', // 密码
      HOST: '', // 主机
      PORT: 3306, // 端口
      CONNECTION_LIMIT: 500 // 最大连接数
    },
    REDIS: { // redis服务配置
      HOST: '', // 主机
      PORT: 6379, // 端口
      PASSWORD: '' // 密码
    },
    WX: { // 微信小程序信息配置
      APP_ID: '',
      APP_SECRET: '',
    },
    TOKEN: { // token 信息配置
      SECRET_KEY: 'jiumu_test', // key
      VALID_TIME: 60 * 60 * 24, // token 有效期24小时
      REFRESH_VALID_TIME: 60 * 60 * 24 * 7, // 刷新 token 有效期7天
    },
    BASE_URL: 'https://www.jiumublog.cn/', // 默认服务路径
    STATIC_URL: path.join(__dirname, '../../../jiumu-koa2-ts-test-static'), // 静态资源路径
    LOGS_URL: path.join(__dirname, '../../../jiumu-koa2-ts-test-logs'), // 日志记录路径
    CRYPTOJS_KEY: '', // crypto-js 加密字符
    CRYPTOJS_IV: '', // crypto-js 加密字符
    MAX_FIELDS_SIZE: 500 * 1024 * 1024, // 静态资源上传最大文件大小 默认500m
    FILE_VAILD_TIME: 3 * 24 * 60 * 60 * 1000, // 非公开静态资源链接有效期
    IS_VERIFY_TOKEN_BY_REDIS: true, // 是否使用redis在线校验token信息 为false时将不校验IS_ALLOW_MULTIPLE_LOGIN条件
    IS_ALLOW_MULTIPLE_LOGIN: true, // 同一账号是否允许在不同设备不同平台（如浏览器）同时登录
    IS_VERIFY_API_PERMISSION: false, // 是否校验非公开api的用户请求权限
    IS_VERIFY_STATIC_PERMISSION: true, // 是否校验非公开静态资源文件的请求权限
    IS_PRINT_LOG: true // 是否在终端打印请求的普通日志信息
  }

  try {
    // 该文件为自己的服务器/小程序信息
    let secretConfig = require('./secret')
    secretConfig = secretConfig.default || secretConfig
    config.DATABASE = secretConfig.DATABASE
    config.REDIS = secretConfig.REDIS
    config.WX = secretConfig.WX
    config.CRYPTOJS_KEY = secretConfig.CRYPTOJS_KEY
		config.CRYPTOJS_IV = secretConfig.CRYPTOJS_IV
  } catch (e) { }

  return config
}

const CONFIG: ConfigOptions = createConfig()

export default CONFIG