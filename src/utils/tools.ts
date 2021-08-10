/**
 * @description 封装常用方法
 * @author chen
 * @update 2021-01-25 16:03:11
 * @list 方法集合说明
 *   toPath // 返回格式后的路径
 *   sureIsArray // 确保返回数组集合方法
 *   toCamelCase // 将 key 名称转换成 驼峰命名
 *   isObject // 判断是否为对象
 *   getSuffix // 获取文件后缀
 *   getUuId // 生成唯一id标识
 *   getFileRandomName // 生成文件随机名字
 *   formatDate // 格式化日期
 *   getKey // 获取 key
 *   getTerminal // 获取路径 terminal
*/

import { v1 as uuidv1, v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import dayjs from 'dayjs'
import Config from '../config'
import { Context } from 'koa'
/**
 * 返回格式后的路径
 * 如 member/list 或 member/list/ ==> /member/list
*/
export function toPath(...arg: string[]): string {
  let getPath = (path: string) => {
    if (!path) return ''
    if (!path.startsWith('/'))
      path = '/' + path
    if (path.endsWith('/'))
      path = path.substring(0, path.length - 1)
    return path
  }
  return arg.map(item => getPath(item)).join('')
}

/**
 * 确保返回数组集合方法
*/
export function sureIsArray(arr: any): any[] {
  return Array.isArray(arr) ? arr : [arr]
}

/**
 * 如果是对象或数组将 key 名称转换成 驼峰命名
*/
export function toCamelCase<T>(results: T): T {
  // 处理对象 key
  const _toObjectKey = (obj: ObjectAny) => {
    let newObj: ObjectAny = {}
    for (let key in obj) {
      if (isObject(obj[key]))
        newObj[_.camelCase(key)] = _toObjectKey(obj[key])
      else if (_.isArray(obj[key]))
        newObj[_.camelCase(key)] = _toArrayKey(obj[key])
      else
        newObj[_.camelCase(key)] = obj[key]
    }
    return newObj
  }
  // 处理数组 key
  const _toArrayKey = (arr: ObjectAny[]) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      if (_.isArray(arr[i]))
        arr[i] = _toArrayKey(<ObjectAny[]>arr[i])
      else if (isObject(arr[i]))
        arr[i] = _toObjectKey(arr[i])
    }
    return arr
  }
  if (_.isArray(results))
    // @ts-ignore 
    return _toArrayKey(results)
  else if (isObject(results))
    // @ts-ignore 
    return _toObjectKey(results)
  return results
}

/**
 * 判断是否为对象，补充 lodash 不能识别数据库查询返回的数据是否为对象的问题
*/
export function isObject(obj: any): boolean {
  return _.isPlainObject(obj) || (typeof obj === 'object' && toString.call(obj) === '[object Object]')
}

// 获取文件后缀
export function getSuffix(path: string, separator = '.'): string {
  if (!path) return ''
  let suffix = ''
  let i = path.lastIndexOf(separator)
  if (i !== -1) {
    suffix = path.substring(i + 1)
    let i2 = suffix.lastIndexOf('?')
    if (i2 !== -1)
      suffix = suffix.substring(0, i2)
  }
  return suffix
}

// 生成唯一id标识
export function getUuId(): string {
  return uuidv4()
}

// 生成文件随机名字
export function getFileRandomName(fileName: string): string {
  const suffix = getSuffix(fileName)
  return uuidv1() + '.' + suffix
}

// 格式化日期
export function formatDate(date: any, format = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!date) return ''
  try {
    return dayjs(date).format(format)
  } catch (e) {
    return ''
  }
}

// 获取 key
export const getKey = (key: string): string => {
  return `${Config.ENV}_jiumu_koa2_ts_${key}`
}

// 获取路径 terminal
export const getTerminal = (ctx: Context): string => {
  const url: string = ctx.request.url
  const terminal: string = url.substring(1, url.indexOf('/', 1)).toLowerCase()
  return terminal
}