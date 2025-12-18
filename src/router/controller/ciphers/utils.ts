import { decrypt, encrypt } from '@/utils/crypto'
import { CipherOptions } from './interface'
import { getUuId } from '@/utils/tools'
import { isArray } from 'lodash'
import { getOriginTagCustomByIds, getTagCustomByData } from '../tags-custom/utils'

/**
 * 处理口令数据
 * @param datas 原始数据
 * @param userId 用户 id
 * @param code 个人口令
 */
export async function handleCipher(datas: CipherOptions | CipherOptions[], userId: string, code: string) {
  const tagCustoms = await getTagCustomByData(datas, ['classify'], userId)
  const _handleList = async (data: CipherOptions) => {
    // 处理自定义标签
    data.classify = getOriginTagCustomByIds(tagCustoms, data.classify)
    // 处理账号
    const account = decrypt(data.account)
    // 处理密码
    const cipher = decrypt(data.cipher)
    data.account88 = account
    data.cipher88 = cipher
    const id = getUuId().replace(/-/g, '')
    const key_str = id.substring(0, 8)
    const iv_str = id.substring(8, 16)
    data.key_str = key_str
    data.iv_str = iv_str
    if (data.type === '802') {
      data.account = encrypt(account, key_str, code + iv_str)
      data.cipher = encrypt(cipher, key_str, code + iv_str)
    } else {
      data.account = encrypt(account, key_str, iv_str)
      data.cipher = encrypt(cipher, key_str, iv_str)
    }
  }
  if (isArray(datas)) {
    for (let i = 0, len = datas.length; i < len; i++) {
      await _handleList(datas[i])
    }
  } else {
    await _handleList(datas)
  }
}
