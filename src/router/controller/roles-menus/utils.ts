import { getTree } from '@/utils/tools'
import { MenuListOptions, MenuOptions } from '../menus/interface'
import { isArray } from 'lodash'
import { UserOptions } from '../users/interface'
import { getFileByData, getOriginFileById } from '../files-info/utils'
import { FileInfoOptions } from '../files-info/interface'

/**
 * 处理菜单树级结构，且过滤未关联的数据
 * @param datas 原始数据
 */
export function handleMenuTree(datas: MenuOptions[]): MenuListOptions[] {
  if (!isArray(datas)) return []
  const originData = datas.map((item) => {
    return {
      ...item,
      checked: '1'
    }
  })
  return getTree({
    data: originData
  })
}

/**
 * 处理用户数据
 */
export async function handleUser(datas: UserOptions[], simple?: BaseStatus) {
  let files: FileInfoOptions[] = []
  if (simple !== '1') {
    files = await getFileByData(datas, ['avatar'])
  }
  datas.forEach((item) => {
    if (simple !== '1') {
      item.avatar = getOriginFileById(files, item.avatar)
    }
  })
}
