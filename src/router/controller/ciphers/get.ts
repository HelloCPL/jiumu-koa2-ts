/**
 * @description 口令获取
 * @author cpl
 * @create 2023-03-14 15:43:24
 */

import { query } from '@/db'
import { decrypt } from '@/utils/crypto'
import { getSelectWhereAsKeywordData } from '@/utils/handle-sql'
import { Success } from '@/utils/http-exception'
import { Context } from 'koa'
import _ from 'lodash'
import { getTagCustomByIds } from '../tags-custom/get'
import { CipherListParams, CipherListReturn, CipherOneParams, CipherOptions } from './interface'

// 获取本人的某个口令
export const doCipherGetOneSelf = async (ctx: Context) => {
  const params = {
    id: ctx._params.id,
    userId: ctx._user.id
  }
  const data = await getCipherGetOneSelf(params)
  throw new Success({ data })
}

// 获取本人的口令列表
export const doCipherGetListSelf = async (ctx: Context) => {
  const params: CipherListParams = {
    pageNo: ctx._params.pageNo * 1 || 1,
    pageSize: ctx._params.pageSize * 1 || 10,
    keyword: ctx._params.keyword,
    userId: ctx._user.id,
    type: ctx._params.type,
    classify: ctx._params.classify
  }
  const data = await getCipherGetList(params)
  throw new Success(data)
}

/*
 * 获取本人的某个口令，返回对象或null
 */
export const getCipherGetOneSelf = async (params: CipherOneParams): Promise<CipherOptions | null> => {
  const sql: string =
    'SELECT t1.id, t1.title, t1.account, t1.cipher, t1.type, t2.label AS type_label, t1.classify, t1.sort, t1.create_user, t1.create_time, t1.update_time, t1.terminal FROM ciphers t1 LEFT JOIN tags t2 ON t1.type = t2.code WHERE t1.id = ? AND t1.create_user = ?'
  const data = [params.id, params.userId]
  let res: any = await query(sql, data)
  res = res[0] || null
  if (res) await _handleCipher(res)
  return res
}

/*
 * 获取本人的口令列表
 */
export const getCipherGetList = async (options: CipherListParams): Promise<CipherListReturn> => {
  const pageNo = (options.pageNo - 1) * options.pageSize
  // 处理keyword参数
  const sqlParamsKeyword = getSelectWhereAsKeywordData({
    valid: ['t1.title'],
    data: options,
    prefix: 'AND'
  })

  return {
    total: 0,
    data: []
  }
}
/*
 * 处理口令数据
 */
async function _handleCipher(datas: CipherOptions | CipherOptions[]) {
  const _handleList = async (data: CipherOptions) => {
    // 处理自定义标签
    if (data.classify)
      data.classify = await getTagCustomByIds({
        ids: data.classify,
        userId: data.create_user
      })
    else data.classify = []
    // 处理账号
    data.account = decrypt(data.account)
    // 处理密码
    data.cipher = decrypt(data.cipher)
  }
  if (_.isArray(datas)) {
    for (let i = 0, len = datas.length; i < len; i++) {
      await _handleList(datas[i])
    }
  } else {
    await _handleList(datas)
  }
}
