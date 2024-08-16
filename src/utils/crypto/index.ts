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
 * @param str 要加密的字符串
 * @param keyStr 加密字符串 key
 * @param ivStr 加密字符串 iv
 */
export function encrypt(word: string, keyStr?: string, ivStr?: string): string {
  if (!word) return ''
  try {
    keyStr = keyStr ? keyStr : CRYPTOJS_KEY
    ivStr = ivStr ? ivStr : CRYPTOJS_IV
    const key = CryptoJS.enc.Utf8.parse(keyStr)
    const iv = CryptoJS.enc.Utf8.parse(ivStr)
    const srcs = CryptoJS.enc.Utf8.parse(word)
    return CryptoJS.AES.encrypt(srcs, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    }).toString()
  } catch (_e) {
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
    const key = CryptoJS.enc.Utf8.parse(keyStr)
    const iv = CryptoJS.enc.Utf8.parse(ivStr)
    const descyptStr = CryptoJS.AES.decrypt(str, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    }).toString(CryptoJS.enc.Utf8)
    return formatStr(descyptStr)
  } catch (_e) {
    return ''
  }
}

// 将多余空格去除
function formatStr(str: string): string {
  if (!str) return ''
  const strArr = str.split('')
  let targetStr = ''
  for (let i = 0, len = strArr.length; i < len; i++) {
    const item = strArr[i].trim()
    if (item && item !== '\x00' && item !== '\x02') {
      targetStr += item
    }
  }
  return targetStr
}
