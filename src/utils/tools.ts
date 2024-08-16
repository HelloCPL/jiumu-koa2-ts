/**
 * @description 封装常用方法
 * @author chen
 * @update 2021-01-25 16:03:11
 * @list 方法集合说明
 *   toPath // 返回格式后的路径
 *   sureIsArray // 确保返回数组集合方法
 *   toCamelCase // 将数组或对象 key 名称转换成 驼峰命名
 *   isObject2 // 判断是否为对象
 *   getSuffix // 获取文件后缀
 *   getUuId // 生成唯一id标识
 *   getFileRandomName // 生成文件随机名字
 *   formatDate // 格式化日期
 *   getKey // 获取 key
 *   getTerminal // 获取路径 terminal
 *   getIP // 获取路径 terminal
 *   getTree // 获取树结构
 */

import { v1 as uuidv1, v4 as uuidv4 } from 'uuid'
import _, { isString } from 'lodash'
import dayjs, { ManipulateType } from 'dayjs'
import { ENV } from '@/config'
import { Context } from 'koa'
import { TerminalType } from '@/enums'

/**
 * 返回格式后的路径
 * 如 member/list 或 member/list/ ==> /member/list
 */
export function toPath(...arg: string[]): string {
  const getPath = (path: string) => {
    if (!path) return ''
    const i = path.indexOf('?')
    if (i !== -1) path = path.substring(0, i)
    if (!path.startsWith('/')) path = '/' + path
    if (path.endsWith('/')) path = path.substring(0, path.length - 1)
    if (path.startsWith('/http:') || path.startsWith('/https:')) path = path.substring(1)
    return path
  }
  return arg.map((item) => getPath(item)).join('')
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
    const newObj: ObjectAny = {}
    for (const key in obj) {
      if (isObject2(obj[key])) newObj[_.camelCase(key)] = _toObjectKey(obj[key])
      else if (_.isArray(obj[key])) newObj[_.camelCase(key)] = _toArrayKey(obj[key])
      else newObj[_.camelCase(key)] = obj[key]
    }
    return newObj
  }
  // 处理数组 key
  const _toArrayKey = (arr: ObjectAny[]) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      if (_.isArray(arr[i])) arr[i] = _toArrayKey(<ObjectAny[]>arr[i])
      else if (isObject2(arr[i])) arr[i] = _toObjectKey(arr[i])
    }
    return arr
  }
  if (_.isArray(results))
    // @ts-ignore
    return _toArrayKey(results)
  else if (isObject2(results))
    // @ts-ignore
    return _toObjectKey(results)
  return results
}

/**
 * 判断是否为对象，补充 lodash 不能识别数据库查询返回的数据是否为对象的问题
 */
export function isObject2(obj: any): boolean {
  return _.isPlainObject(obj) || (typeof obj === 'object' && toString.call(obj) === '[object Object]')
}

// 获取文件后缀
export function getSuffix(path: string | undefined | null, separator = '.'): string {
  if (!path) return ''
  let suffix = ''
  const i = path.lastIndexOf(separator)
  if (i !== -1) {
    suffix = path.substring(i + 1)
    const i2 = suffix.lastIndexOf('?')
    if (i2 !== -1) suffix = suffix.substring(0, i2)
  }
  return suffix
}

// 根据文件名获取资源存放位置
export function getStaticPlace(fileName: string): string {
  const suffix = getSuffix(fileName)
  const imagesSuffix = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'svg',
    'bmp',
    'tiff',
    'dxf',
    'cgm',
    'cdr',
    'eps',
    'emf',
    'pict',
    'raw'
  ]
  const videoSuffix = [
    'wmv',
    'asf',
    'asx',
    'rm',
    'ram',
    'rmvb',
    'mpg',
    'mpeg',
    'mpe',
    '3gp',
    'mov',
    'mp4',
    'm4v',
    'avi',
    'dat',
    'mkv',
    'flv',
    'vob',
    'qt',
    'navi',
    'divx'
  ]
  if (imagesSuffix.indexOf(suffix) !== -1) {
    return 'images'
  } else if (videoSuffix.indexOf(suffix) !== -1) {
    return 'videos'
  } else {
    return 'files'
  }
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

/**
 * 获取文件名称
 * path 可以是路径或文件名称
 * noSuffix 是否去除后缀
 */
export function getFileName(path: string, noSuffix?: boolean): string {
  if (!isString(path)) return ''
  let name: string = path.replace(/.*(\\|\/)+/g, '')
  if (noSuffix) {
    const i = name.lastIndexOf('.')
    if (i !== 1) name = name.substring(0, i)
  }
  return name
}

// 格式化日期
export function formatDate(date: any, format = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!date || !dayjs(date).isValid()) return ''
  return dayjs(date).format(format)
}

/**
 * 获取当前时间
 */
export function getCurrentTime(format = 'YYYY-MM-DD HH:mm:ss') {
  const current = dayjs()
  return formatDate(current, format)
}

/**
 * 获取时间戳
 */
export const getDateValueOf = (date: any) => {
  if (!date || !dayjs(date).isValid()) return 0
  return dayjs(date).valueOf()
}

/**
 * 当前时间是否在所给时间之前
 */
export const isBeforeTargetDate = (date?: string, value?: any, unit: ManipulateType = 'day'): boolean => {
  if (date && dayjs(date).isValid()) {
    let d = dayjs(date)
    if (Number(value)) d = d.add(Number(value), unit)
    if (dayjs(getCurrentTime()).isBefore(d)) return true
  }
  return false
}

// 获取 key 常用于缓存key名
export const getKey = (key: string): string => {
  return `jiumu_koa2_ts_${ENV}_${key}`
}

// 获取路径 terminal
export const getTerminal = (ctx: Context): TerminalType => {
  const url: string = ctx.request.url
  const terminal: TerminalType = <TerminalType>url.substring(1, url.indexOf('/', 1)).toLowerCase()
  return terminal
}

// 获取客户端IP
export const getIP = (ctx: Context) => {
  return ctx.ip || ctx.req.headers['x-forwarded-for'] || ctx.req.socket.remoteAddress
}

// 获取树结构
interface TreeOption {
  data: any[]
  parentCode: any
  parentKey?: string
  key?: string
}
export const getTree = (option: TreeOption): any[] => {
  const parentKey = option.parentKey || 'parent_code'
  const key = option.key || 'code'
  const trees: any[] = []
  // 去重
  const originData = _.uniqBy(option.data, 'id')
  // 排序
  if (originData.length) {
    if (originData[0].update_time) {
      originData.sort((a, b) => {
        if (a.update_time > b.update_time) return 1
        else if (a.update_time < b.update_time) return -1
        else return 0
      })
    }
    if (originData[0].sort || originData[0].sort === 0) {
      originData.sort((a, b) => {
        if (a.sort > b.sort) return 1
        else if (a.sort < b.sort) return -1
        else return 0
      })
    }
  }
  // 获取第一级
  originData.forEach((item) => {
    item.children = []
    if ((!option.parentCode && !item[parentKey]) || option.parentCode === item[parentKey]) {
      trees.push(item)
    }
  })
  // 递归获取子级
  const findTree = (arr: any[]) => {
    arr.forEach((list) => {
      originData.forEach((obj) => {
        if (obj[parentKey] === list[key]) {
          list.children.push(obj)
        }
      })
      if (list.children.length) findTree(list.children)
    })
  }
  findTree(trees)
  return trees
}

// 获取文本字数
// 汉字 单词 符号
export const getWordNumber = (str?: string): number => {
  if (!str) return 0
  try {
    str = str
      .replace(/<\/?[^>]*>|(\n|\t|\r)|(\s)/g, '')
      .replace(/[\x00-\xff]/g, 'm')
      .replace(/m+/g, '*')
    return str.length
  } catch (e) {
    return 0
  }
}

/**
 * 将多个空格替换成一个空格
*/
export const replaceMultipleSpaces = (str: string) => {
  return str.replace(/\s+/g, ' ')
}
