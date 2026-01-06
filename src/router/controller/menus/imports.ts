/**
 * @description 菜单导入
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
 * 菜单导入
 */
export const doMenuImport = async (ctx: Context) => {
  const files: any = ctx.request.files
  const file: File = files.file
  const fileContent = await readFile(file.path)
  const menusData = toParse(fileContent)
  let count = 0
  if (isArray(menusData) && menusData.length) {
    const uniqueData = menusData.filter(
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
      FROM menus t1 
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
        INSERT menus 
          (id, code, parent_code, label, sort, configurable, create_time, update_time, terminal, remarks) 
        VALUES ${placeholders}`
        const currentTime = formatDate(new Date())
        const terminal = Terminal[ctx._terminal]
        const data = validData.flatMap((item: any) => {
          return [
            getUuId(),
            item.code,
            item.parent_code || '',
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
  throw new Success({ message: `成功导入${count}条菜单数据`, data: count })
}
