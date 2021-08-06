/**
 * @description: 连接 redis 保存 token
 * @author chen
 * @update 2021-01-29 11:24:45
 * @list 方法集合说明
 *   clientSet // 保存 redis 值
 *   clientGet // 获取 redis 值
 *   clientDel // 删除 redis 值
*/

import Redis from 'redis'
import Config from '../config'
import _ from 'lodash'
// import Logger from '../../utils/logs'
const REDIS = Config.REDIS

interface RedisOptions {
  key: string,
  value: any
}

const prefixName = 'jiumu_koa2_ts_'

// 创建 redis 连接
const redisClient = Redis.createClient(REDIS.PORT, REDIS.HOST)

// 登录
redisClient.auth(REDIS.PASSWORD, () => {
  console.log('redis 登录成功');
})

// 监听 redis 错误事件
redisClient.on('error', err => {
  // Logger.error('redis 发生错误', err, 'redis 发生错误')
})

// 保存 redis 值
export const clientSet = (key: string, value: any) => {
  key = prefixName + key
  return new Promise((resolve, reject) => {
    const options = _handleSetItem(key, value)
    redisClient.set(options.key, options.value, (err: any) => {
      if (err) reject(err)
      else resolve(null)
    })
  })
}
function _handleSetItem(key: string, value: any): RedisOptions {
  if (_.isObject(value)) value = JSON.stringify(value)
  if (_.isNumber(value)) value = `__number__${value.toString()}`
  if (_.isBoolean(value)) value = `__boolean__${value.toString()}`
  if (_.isUndefined(value)) value = `__undefined__`
  if (_.isNull(value)) value = `__null__`
  value = value || ''
  return { key, value }
}

// 获取 redis 值
export const clientGet = (key: string) => {
  key = prefixName + key
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err: any, value) => {
      if (err) reject(err)
      else resolve(_handleGetItem(value))
    })
  })
}
function _handleGetItem(value: any): any {
  if (!value) return value
  if (value.startsWith('__number__')) return Number(value.substring(10))
  if (value.startsWith('__boolean__true')) return true
  if (value.startsWith('__boolean__false')) return false
  if (value === '__undefined__') return undefined
  if (value === '__null__') return null
  try {
    value = JSON.parse(value)
  } catch (e) {
    // 
  }
  return value
}

// 删除 redis 值
export const clientDel = (key: string) => {
  key = prefixName + key
  return new Promise((resolve, reject) => {
    try {
      redisClient.del(key, (err: any) => {
        if (err) reject(err)
        else resolve(null)
      })
    } catch (e) { resolve(null) }
  })
}
