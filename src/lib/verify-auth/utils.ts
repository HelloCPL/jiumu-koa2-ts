import { STATIC_DIRS } from '@/config'
import { decrypt } from '@/utils/crypto'

/**
 * 判断当前请求是否为静态资源
 * @param url 请求路径
 * @returns 返回是否静态资源路由 true 是 false 否
 */
export const isStaticUrl = (url: string): boolean => {
  let flag = false
  STATIC_DIRS.find((dir) => {
    if (url.startsWith(`/${dir}/`)) {
      flag = true
    }
    return flag
  })
  return flag
}

/**
 * 获取路径的指定参数，并对参数进行解密
 * @param url 路径
 * @param key 指定的 key
 * @returns 返回指定 key 的值
 */
export const getQueryParams = (url: string, key: string): string => {
  const i = url.lastIndexOf('?')
  if (i === -1) return ''
  const queryPath = url.substring(i + 1)
  const queryParams: string[] = queryPath.split('&')
  let params = ''
  queryParams.find((value) => {
    const keyIndex = value.indexOf(key)
    if (keyIndex !== -1) {
      params = decrypt(value.substring(keyIndex + key.length))
      return true
    }
    return false
  })
  return params
}
