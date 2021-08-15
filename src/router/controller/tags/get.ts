/**
 * @description 标签获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { isExistHasChildren } from '../convert'
import { Context, Next } from 'koa';
import { TagOptions, TagListOptions, TagCustomOptions } from './interface'
import { getAllTagByUserId } from '../users-tags/get'
import _ from 'lodash'

// 获取指定的某个标签
export const doTagGetByCode = async (ctx: Context, next: Next) => {
  const data = await getByCode(ctx.params.code)
  throw new Success({ data });
}

// 获取某类标签
export const doTagGetByParentCode = async (ctx: Context, next: Next) => {
  const parentCode = ctx.params.parentCode || ''
  const data = await getTagByParentCode(parentCode)
  if (parentCode == '8888' && ctx.params.userId) {
    // 增加`checked` 字段，表示是否与该用户关联
    const userList = await getAllTagByUserId({ userId: ctx.params.userId })
    const userIdsList = _.map(userList, item => item.id)
    _handleRoleData(data, userIdsList)
  }
  throw new Success({ data })
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

/**
 * 获取某类标签，返回数组或[]
*/
export const getTagByParentCode = async (parentCode: string): Promise<TagListOptions[]> => {
  let data: TagCustomOptions[] = [{ code: parentCode, children: [] }]
  const _handleGetData = async (arr: TagCustomOptions[]) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      const hasChildren = <boolean>await isExistHasChildren({
        table: 'tags',
        where: { key: 'code', value: arr[i].code },
        noThrow: true
      })
      if (hasChildren) {
        const sql = `SELECT * FROM tags WHERE parent_code = ? ORDER BY sort`
        const res: TagCustomOptions[] = <TagCustomOptions[]>await query(sql, arr[i].code)
        arr[i].children = res
        await _handleGetData(arr[i].children)
      } else
        arr[i].children = []
    }
  }
  // 递归查询
  await _handleGetData(data)
  // @ts-ignore
  const targetData: TagListOptions[] = data[0].children
  return targetData
}

// 处理角色是否与用户/权限关联
function _handleRoleData(data: TagListOptions[], targetData: string[]) {
  const _handleList = (arr: TagListOptions[]) => {
    arr.forEach(item => {
      if (targetData.indexOf(item.id) === -1)
        item.checked = false
      else item.checked = true
      if (item.children && item.children.length)
        _handleList(item.children)
    })
  }
  _handleList(data)
}
