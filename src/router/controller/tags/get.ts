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
export const doTagGetByParentCode = async (parentCode: string) => {

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


interface TagOptions extends ObjectAny {
  code: string,
  children: any[] | null
}

/**
 * 获取某类标签，返回数组或[]
*/
export const getByParentCode = async (parentCode: string): Promise<TagOptions[]> => {
  let data: TagOptions[] = [{ code: parentCode, children: null }]
  // 递归查询
  return data
}