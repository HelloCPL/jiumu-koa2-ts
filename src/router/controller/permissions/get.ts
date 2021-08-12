/**
 * @description 权限获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { isExistChildren } from './convert'
import { Context, Next } from 'koa';

// 获取指定的某个权限
export const doPermissionGetOne = async (ctx: Context, next: Next) => {
  const data = await getOne(ctx.params.id)
  throw new Success({ data });
}

// 获取某类权限
export const doPermissionGetByParentCode = async (ctx: Context, next: Next) => {
  const parentCode = ctx.params.parentCode || '0'
  const data = await getByParentCode(parentCode)
  throw new Success({ data })
}

/**
 * 获取指定的某个权限，返回对象或null
*/
export const getOne = async (id: string): Promise<ObjectAny | null> => {
  const sql: string = `SELECT * FROM permissions WHERE code = ? OR id = ?`
  const data = [id, id]
  let res: any = await query(sql, data)
  res = res[0] || null
  return res
}

// 获取某类权限数据列表接口
interface TagOptions extends ObjectAny {
  code: string,
  children: TagOptions[]
}

/**
 * 获取某类权限，返回数组或[]
*/
export const getByParentCode = async (parentCode: string): Promise<TagOptions[]> => {
  let data: TagOptions[] = [{ code: parentCode, children: [] }]
  const _handleGetData = async (arr: TagOptions[]) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      const hasChildren = await isExistChildren(arr[i].code, 'code')
      if (hasChildren) {
        const sql = `SELECT * FROM permissions WHERE parent_code = ? ORDER BY sort`
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