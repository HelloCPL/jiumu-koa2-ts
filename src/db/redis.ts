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
import { IS_VERIFY_TOKEN_BY_REDIS, REDIS } from '@/config'
import { getKey, parseStoreData, stringifyStoreData } from '@/utils/tools'
import { logger, loggerError } from '@/lib/logger'
import { Message } from '@/enums'

/**
 * 创建 redis 实例
 */
function createRedis() {
  let redisClient: RedisClient
  if (IS_VERIFY_TOKEN_BY_REDIS) {
    redisClient = Redis.createClient(REDIS.PORT, REDIS.HOST)
    // 登录
    redisClient.auth(REDIS.PASSWORD, () => {
      logger.info({ message: Message.redisLoginSuccess }, true)
    })
    // 监听 redis 错误事件
    redisClient.on('error', (err) => {
      loggerError.error({
        message: Message.redisError,
        error: err
      })
    })
  }
  /**
   * 保存值到 redis
   * @params key 键名
   * @params value 值
   */
  const clientSet = (key: string, value: any): Promise<any> | undefined => {
    if (redisClient) {
      key = getKey(key)
      return new Promise((resolve, reject) => {
        redisClient.set(key, stringifyStoreData(value), (err: any) => {
          if (err) {
            loggerError.error({
              message: Message.redisError,
              error: err
            })
            reject(err)
          } else resolve(null)
        })
      })
    }
  }

  /**
   * 获取 redis 值
   * @params key 键名
   */
  const clientGet = (key: string): Promise<any> | undefined => {
    if (redisClient) {
      key = getKey(key)
      return new Promise((resolve, reject) => {
        // @ts-ignore
        redisClient.get(key, (err: any, value) => {
          if (err) {
            loggerError.error({
              message: Message.redisError,
              error: err
            })
            reject(err)
          } else resolve(parseStoreData(value))
        })
      })
    }
  }

  /**
   * 删除某个 redis
   * @params key 键名
   */
  const clientDel = (key: string): Promise<any> | undefined => {
    if (redisClient) {
      key = getKey(key)
      return new Promise((resolve, reject) => {
        try {
          redisClient.del(key, (err: any) => {
            if (err) {
              loggerError.error({
                message: Message.redisError,
                error: err
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
    clientDel
  }
}

export const { clientSet, clientGet, clientDel } = createRedis()
