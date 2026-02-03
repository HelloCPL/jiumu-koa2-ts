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
    const key = CryptoJS.enc.Utf8.parse(keyStr || CRYPTOJS_KEY)
    const iv = CryptoJS.enc.Utf8.parse(ivStr || CRYPTOJS_IV)
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
 * @param str 要解密的字符串
 * @param keyStr 解密字符串 key
 * @param ivStr 解密字符串 iv
 */
export function decrypt(str: string, keyStr?: string, ivStr?: string): string {
  if (!str) return str
  try {
    const key = CryptoJS.enc.Utf8.parse(keyStr || CRYPTOJS_KEY)
    const iv = CryptoJS.enc.Utf8.parse(ivStr || CRYPTOJS_IV)
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

/**
 * 将多余空格去除
 * @params str 解密后的字符串
 */
function formatStr(str: string): string {
  if (!str) return ''
  try {
    // 方法1: 使用正则表达式直接移除所有不可见控制字符和零宽字符
    // 保留普通空格，移除其他空白和控制字符
    let cleaned = str.replace(/[\x00-\x1F\x7F\u200B\uFEFF]/g, '')
    // 方法2: 特别处理ZeroPadding的尾部空字符
    cleaned = cleaned.replace(/\x00+$/, '')
    // 方法3: 移除字符串开头和结尾的不可见字符
    cleaned = cleaned.replace(/^[\s\x00-\x1F]+|[\s\x00-\x1F]+$/g, '')
    return cleaned
  } catch (e) {
    return str
  }
}
