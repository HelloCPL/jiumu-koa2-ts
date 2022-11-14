/**
 * @description: 连接 redis 保存 token
 * @author chen
 * @update 2021-01-29 11:24:45
 * @list 方法集合说明
 *   clientSet // 保存 redis 值
 *   clientGet // 获取 redis 值
 *   clientDel // 删除 redis 值
 */

import Redis, { RedisClient } from 'redis'
import { IS_VERIFY_TOKEN_BY_REDIS, REDIS } from '../config'
import _ from 'lodash'
import { getKey } from '../utils/tools'
import Logger from '../lib/logger'
import { RedisOptions } from './interface'

function createRedis() {
  let redisClient: RedisClient | null = null
  if (IS_VERIFY_TOKEN_BY_REDIS) {
    redisClient = Redis.createClient(REDIS.PORT, REDIS.HOST)
    // 登录
    redisClient.auth(REDIS.PASSWORD, () => {
      console.log('redis 登录成功')
    })
    // 监听 redis 错误事件
    redisClient.on('error', (err) => {
      // Logger.error('redis 发生错误', err, 'redis 发生错误')
      Logger.error({
        message: 'redis 发生错误',
        error: err,
      })
    })
  }
  // 保存 redis 值
  const clientSet = (key: string, value: any): Promise<any> | undefined => {
    if (redisClient) {
      key = getKey(key)
      return new Promise((resolve, reject) => {
        const options = _handleSetItem(key, value)
        // @ts-ignore
        redisClient.set(options.key, options.value, (err: any) => {
          if (err) {
            Logger.error({
              message: 'redis 发生错误',
              error: err,
            })
            reject(err)
          } else resolve(null)
        })
      })
    }
  }

  // 获取 redis 值
  const clientGet = (key: string): Promise<any> | undefined => {
    if (redisClient) {
      key = getKey(key)
      return new Promise((resolve, reject) => {
        // @ts-ignore
        redisClient.get(key, (err: any, value) => {
          if (err) {
            Logger.error({
              message: 'redis 发生错误',
              error: err,
            })
            reject(err)
          } else resolve(_handleGetItem(value))
        })
      })
    }
  }

  // 删除 redis 值
  const clientDel = (key: string): Promise<any> | undefined => {
    if (redisClient) {
      key = getKey(key)
      return new Promise((resolve, reject) => {
        try {
          // @ts-ignore
          redisClient.del(key, (err: any) => {
            if (err) {
              Logger.error({
                message: 'redis 发生错误',
                error: err,
              })
              reject(err)
            } else resolve(null)
          })
        } catch (e) {
          reject(e)
        }
      })
    }
  }

  return {
    clientSet,
    clientGet,
    clientDel,
  }
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

export const { clientSet, clientGet, clientDel } = createRedis()
