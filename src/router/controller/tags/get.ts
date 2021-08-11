/**
 * @description 标签获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { isExistChildren } from './convert'
import { Context, Next } from 'koa';

// 获取指定的某个标签
export const doTagGetByCode = async (ctx: Context, next: Next) => {
  const data = await getByCode(ctx.params.code)
  throw new Success({ data });
}

// 获取某类标签
export const doTagGetByParentCode = async (ctx: Context, next: Next) => {
  const data = await getByParentCode(ctx.params.parentCode)
  throw new Success({ data })
}

/**
 * 获取指定的某个标签，返回对象或null
*/
export const getByCode = async (code: string): Promise<ObjectAny | null> => {
  const sql: string = `SELECT * FROM tags WHERE code = ?`
  const res: any = await query(sql, code)
  let data: ObjectAny | null = null
  if (res && res.length) data = res[0]
  return data
}

// 获取某类标签数据列表接口
interface TagOptions extends ObjectAny {
  code: string,
  children: TagOptions[]
}

/**
 * 获取某类标签，返回数组或[]
*/
export const getByParentCode = async (parentCode: string): Promise<TagOptions[]> => {
  let data: TagOptions[] = [{ code: parentCode, children: [] }]
  const _handleGetData = async (arr: TagOptions[]) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      const hasChildren = await isExistChildren(arr[i].code, 'code')
      if (hasChildren) {
        const sql = `SELECT * FROM tags WHERE parent_code = ? ORDER BY sort`
        const res: TagOptions[] = <TagOptions[]>await query(sql, arr[i].code)
        arr[i].children = res
        await _handleGetData(arr[i].children)
      }
    }
  }
  // 递归查询
  await _handleGetData(data)
  return data[0].children
}