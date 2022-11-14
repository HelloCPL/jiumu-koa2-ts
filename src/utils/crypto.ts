/**
 * @description: 密码加密与解密 这里选择 crypto-js 亦可选择其他
 * @author chen
 * @update 2021-01-27 14:43:24
 * @list 方法集合说明
 *   encrypt // 加密方法
 *   decrypt // 解密方法
 */

import CryptoJS from 'crypto-js'
import { CRYPTOJS_KEY, CRYPTOJS_IV } from '@/config'

/**
 * crypto-js 加密方法
 * password 参数 keyStr 加密字符串 ivStr 加密字符串
 */
export function encrypt(str: string, keyStr?: string, ivStr?: string): string {
  if (!str) return str
  try {
    keyStr = keyStr ? keyStr : CRYPTOJS_KEY
    ivStr = ivStr ? ivStr : CRYPTOJS_IV
    let key = CryptoJS.enc.Utf8.parse(keyStr)
    let iv = CryptoJS.enc.Utf8.parse(ivStr)
    let srcs = CryptoJS.enc.Utf8.parse(str)
    return CryptoJS.AES.encrypt(srcs, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    }).toString()
  } catch (e) {
    return ''
  }
}

/**
 * crypto-js 解密方法
 */
export function decrypt(str: string, keyStr?: string, ivStr?: string): string {
  if (!str) return str
  try {
    keyStr = keyStr ? keyStr : CRYPTOJS_KEY
    ivStr = ivStr ? ivStr : CRYPTOJS_IV
    let key = CryptoJS.enc.Utf8.parse(keyStr)
    let iv = CryptoJS.enc.Utf8.parse(ivStr)
    let descyptStr = CryptoJS.AES.decrypt(str, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    }).toString(CryptoJS.enc.Utf8)
    return formatStr(descyptStr)
  } catch (e) {
    return ''
  }
}

// 将多余空格去除
function formatStr(str: string): string {
  if (!str) return ''
  let strArr = str.split('')
  let targetStr = ''
  for (let i = 0, len = strArr.length; i < len; i++) {
    let item = strArr[i].trim()
    if (item && item != '\x00' && item != '\x02') {
      targetStr += item
    }
  }
  return targetStr
}
