/**
 * @description 权限导入
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { query } from '@/db'
import { formatDate, getUuId, toParse } from '@/utils/tools'
import { Success } from '@/utils/http-exception'
import { readFile } from '@/utils/files'
import { isArray } from 'lodash'
import { Terminal } from '@/enums'
import { File } from 'formidable'

/**
 * 权限导入
 */
export const doPermissionImport = async (ctx: Context) => {
  const files: any = ctx.request.files
  const file: File = files.file
  const fileContent = await readFile(file.path)
  const permissionsData = toParse(fileContent)
  let count = 0
  if (isArray(permissionsData) && permissionsData.length) {
    const uniqueData = permissionsData.filter(
      (item, index, self) => item.code && index === self.findIndex((t) => t.code === item.code)
    )
    const codes = uniqueData
      .filter((item) => item.code)
      .map((item) => item.code)
      .join(',')
    if (codes) {
      const sql = `
      SELECT 
        t1.code 
      FROM permissions t1 
      WHERE FIND_IN_SET(t1.code, ?)`
      const res = await query(sql, [codes])
      const existCodes: string[] = []
      if (isArray(res)) {
        res.forEach((item) => {
          existCodes.push(item.code)
        })
      }
      const validData = uniqueData.filter((item) => !existCodes.includes(item.code))
      if (validData.length) {
        const placeholders = validData.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ')
        const sql2 = `
        INSERT permissions 
          (id, code, href, label, sort, configurable, create_time, update_time, terminal, remarks) 
        VALUES ${placeholders}`
        const currentTime = formatDate(new Date())
        const terminal = Terminal[ctx._terminal]
        const data = validData.flatMap((item: any) => {
          return [
            getUuId(),
            item.code,
            item.href || '#',
            item.label || '',
            item.sort || 1,
            item.configurable || 0,
            currentTime,
            currentTime,
            terminal,
            item.remarks || ''
          ]
        })
        const res2 = await query(sql2, data)
        count = res2?.affectedRows || validData.length || 0
      }
    }
  }
  throw new Success({ message: `成功导入${count}条权限数据`, data: count })
}
