/**
 * @description 封装常用方法
 * @author chen
 * @update 2021-01-25 16:03:11
 */

import { v1 as uuidv1, v4 as uuidv4 } from 'uuid'
import { isString, isArray, camelCase, isPlainObject, uniqBy } from 'lodash'
import { ENV } from '@/config'
import { Context } from 'koa'
import { TerminalType } from '@/enums'
import { imagesSuffix, videoSuffix } from './config'

export * from './date'
export * from './os'
export * from './timeout'

/**
 * 返回格式后的路径，仅返回路径，不保留参数
 * @param ...arg 路径片段
 * @returns 返回完整的路径
 *   如 member/list 或 member/list/ ==> /member/list
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
 * @param arr 任意类型
 * @returns 返回数组
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
      if (isObject2(obj[key])) newObj[camelCase(key)] = _toObjectKey(obj[key])
      else if (isArray(obj[key])) newObj[camelCase(key)] = _toArrayKey(obj[key])
      else newObj[camelCase(key)] = obj[key]
    }
    return newObj
  }
  // 处理数组 key
  const _toArrayKey = (arr: ObjectAny[]) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      if (isArray(arr[i])) arr[i] = _toArrayKey(<ObjectAny[]>arr[i])
      else if (isObject2(arr[i])) arr[i] = _toObjectKey(arr[i])
    }
    return arr
  }
  if (isArray(results))
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
  return isPlainObject(obj) || (typeof obj === 'object' && toString.call(obj) === '[object Object]')
}

/**
 * 获取文件后缀
 * @param path 路径
 * @param separator 指定分隔符，默认 '.'
 * @returns 返回后缀
 */
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

type StaticPlaceReturn = 'images' | 'videos' | 'files'

/**
 * 根据文件名获取资源存放位置，仅对普通的 'images' 'videos' 'files' 资源
 * @param fileName 文件名称
 * @returns 返回对应的资源目录名称
 */
export function getStaticPlace(fileName: string): StaticPlaceReturn {
  const suffix = getSuffix(fileName)
  if (imagesSuffix.indexOf(suffix) !== -1) {
    return 'images'
  } else if (videoSuffix.indexOf(suffix) !== -1) {
    return 'videos'
  } else {
    return 'files'
  }
}

/**
 * 生成唯一id标识
 * @returns 返回 id
 */
export function getUuId(): string {
  return uuidv4()
}

/**
 * 根据文件名称生成文件随机名字
 * @param fileName 文件名称
 * @returns 返回文件名称
 */
export function getFileRandomName(fileName: string): string {
  const suffix = getSuffix(fileName)
  return uuidv1() + '.' + suffix
}

/**
 * 获取文件名称
 * @param path 可以是路径或文件名称
 * @param noSuffix 是否去除后缀
 */
export function getFileName(path: string, noSuffix?: boolean): string {
  if (!isString(path)) return ''
  let name: string = path.replace(/.*(\\|\/)+/g, '')
  if (noSuffix) {
    const i = name.lastIndexOf('.')
    if (i !== 1) name = name.substring(0, i)
  }
  name = name.replace(/\?.*/, '')
  return name
}

/**
 * 获取 key 常用于缓存key名
 * @param key 初始 key
 * @returns 返回修饰后的 key
 */
export const getKey = (key: string): string => {
  return `jiumu_koa2_ts_${ENV}_${key}`
}

/**
 * 获取请求的终端，路径 terminal
 * @returns 返回终端类型
 */
export const getTerminal = (ctx: Context): TerminalType => {
  const url: string = ctx.request.url
  const terminal: TerminalType = <TerminalType>url.substring(1, url.indexOf('/', 1)).toLowerCase()
  return terminal
}

interface TreeOption {
  data: any[]
  parentCode: any
  parentKey?: string
  key?: string
}
/**
 * 将一维数组转为树结构
 * @param option.data 任意类型数组
 * @param option.parentCode 指定父级的值
 * @param option.parentKey? 父级属性 key
 * @param option.key? 属性 key
 * @returns 返回树结构数组
 */
export const getTree = (option: TreeOption): any[] => {
  const { data, parentCode, parentKey = 'parent_code', key = 'code' } = option
  if (!data.length) return []
  // 去重
  const originData = uniqBy(data, 'id')
  // 降序排序
  const sortData = (data: any[]) => {
    if (data[0]?.update_time) {
      data.sort((a, b) => {
        if (a.update_time > b.update_time) return 1
        else if (a.update_time < b.update_time) return -1
        else return 0
      })
    }
    if (data[0]?.sort || data[0]?.sort === 0) {
      data.sort((a, b) => {
        if (a.update_time > b.update_time) return 1
        else if (a.update_time < b.update_time) return -1
        else return 0
      })
    }
  }
  sortData(originData)
  const trees: any[] = []
  const subTrees: any[] = []
  // 获取第一级
  originData.forEach((item) => {
    item.children = []
    if ((!parentCode && !item[parentKey]) || parentCode === item[parentKey]) {
      trees.push(item)
    } else {
      subTrees.push(item)
    }
  })
  // 递归获取子级
  const findTree = (arr: any[]) => {
    arr.forEach((list) => {
      subTrees.forEach((obj) => {
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

type WordCount = {
  characterCount: number
  wordCount: number
}
/**
 * 计算指定文本的字符数和单词数
 * @param text 指定文本
 * @returns 返回字符数和单词数
 */
export const countWordCharactersAndWords = (text?: string): WordCount => {
  let wordCount = 0
  let characterCount = 0
  if (text) {
    const noHtml = text.replace(/<[^>]*>/g, '')
    const singleSpaces = noHtml.replace(/\s+/g, ' ').trim()
    // 计算单词数（假设单词由空格分隔）
    wordCount = singleSpaces.split(' ').filter((word) => word.length > 0).length
    // 计算字符数（包括 Unicode 字符）
    characterCount = noHtml.replace(/\s/g, '').length
  }
  return { characterCount, wordCount }
}

/**
 * 将多个空格替换成一个空格
 * @param text 指定文本
 * @returns 返回文本
 */
export const replaceMultipleSpaces = (text: string): string => {
  return text.replace(/\s+/g, ' ')
}
