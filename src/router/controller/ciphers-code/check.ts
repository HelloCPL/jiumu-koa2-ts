/**
 * @description 查看秘钥code是否存在
 * @author cpl
 * @create 2023-03-14 11:05:46
 */

import { Success } from '@/utils/http-exception'
import { Context } from 'koa'
import { isExistCipherCode } from './convert'

/*
 * 查看秘钥code是否存在
 */
export const doCipherCodeCheck = async (ctx: Context) => {
  const flag = await isExistCipherCode(ctx)
  throw new Success({ data: flag })
}
