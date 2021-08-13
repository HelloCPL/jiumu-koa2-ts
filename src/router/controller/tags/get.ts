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
  const parentCode = ctx.params.parentCode || ''
  const data = await getByParentCode(parentCode)
  throw new Success({ data })
}

export interface TagOptions extends ObjectAny {
  id: string,
  code: string,
  label: string,
  parent_code: string,
  sort?: number
}

/**
 * 获取指定的某个标签，返回对象或null
*/
export const getByCode = async (code: string): Promise<TagOptions | null> => {
  const sql: string = `SELECT * FROM tags WHERE code = ? OR id = ?`
  const data = [code, code]
  let res: any = await query(sql, data)
  res = res[0] || null
  return res
}

// 获取某类标签数据列表接口
export interface TagsOptions extends ObjectAny {
  code: string,
  children: TagsOptions[]
}

/**
 * 获取某类标签，返回数组或[]
*/
export const getByParentCode = async (parentCode: string): Promise<TagsOptions[]> => {
  console.log(111);
  let data: TagsOptions[] = [{ code: parentCode, children: [] }]
  const _handleGetData = async (arr: TagsOptions[]) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      const hasChildren = await isExistChildren(arr[i].code, 'code')
      if (hasChildren) {
        const sql = `SELECT * FROM tags WHERE parent_code = ? ORDER BY sort`
        const res: TagsOptions[] = <TagsOptions[]>await query(sql, arr[i].code)
        arr[i].children = res
        await _handleGetData(arr[i].children)
      }
    }
  }
  // 递归查询
  await _handleGetData(data)
  return data[0].children
}
