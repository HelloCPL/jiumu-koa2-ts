/**
 * @description 文件删除方法
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { execTrans } from '@/db'
import fs, { Stats } from 'fs'
import path from 'path'
import { STATIC_URL } from '@/config'

interface FileDeleteOptions extends ObjectAny {
  file_path: string
  static_place: string
}

/**
 * 文件删除 传 ids 可删除多个 用逗号隔开
 */
export const doFileDelete = async (ctx: Context) => {
  const sql1 = 'SELECT file_path, static_place FROM files_info WHERE FIND_IN_SET(id, ?)'
  const sql2 = 'DELETE FROM files_info WHERE FIND_IN_SET(id, ?)'
  const res: any = await execTrans([
    { sql: sql1, data: ctx._params.ids },
    { sql: sql2, data: ctx._params.ids }
  ])
  const filesPath: FileDeleteOptions[] = res[0]
  if (filesPath.length) {
    filesPath.forEach((item: FileDeleteOptions) => {
      const filePath: string = path.join(STATIC_URL, `${item.static_place}`, item.file_path)
      const stat: Stats = fs.statSync(filePath)
      if (stat.isFile()) fs.unlinkSync(filePath)
    })
  }
  throw new Success()
}
