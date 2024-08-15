import { camelCase, snakeCase, uniq } from 'lodash'

/**
 * 处理某个字段是否参与查询，且返回查询时的规则
 * field 参与的字段
 *   '!field' 以 '!' 开头表示不参与查询，如 '!name'
 *   '@field' 参与 keyword where 条件的查询；仅为高亮查询设置
 *            以一个 '@' 不参与 highlight 的返回字段（keyword为真时且 highlight 为真时仍参与返回），
 *            以两个以上 '@' 全程不参与 highlight 的返回字段
 *   '(field)' 以 '()' 包裹表示全选匹配，如 '(name)'
 *   'xxx.field' 以 'xxx.' 开头表示指定表名称，如 'users.name'
 *   'field:newField' 以 ':xxx' 表示将该字段重命名，如 'name:username'
 * 组合顺序，如 '!xxx.(field):newField'
 */
export const handleField = (key: string): SQLUtilsKeyResult => {
  let isValid = true
  if (key.startsWith('!')) {
    isValid = false
    key = key.substring(1)
  }
  let validHighlightCount = 0
  while(key.startsWith('@')) {
    validHighlightCount += 1
    key = key.substring(1)
  }
  let t = ''
  const i1 = key.indexOf('.')
  if (i1 !== -1) {
    t = key.substring(0, i1)
    key = key.substring(i1 + 1)
  }
  let field = key
  let dataField = key
  const i2 = key.indexOf(':')
  if (i2 !== -1) {
    field = key.substring(0, i2)
    dataField = key.substring(i2 + 1)
  }
  let isEqual = false
  const reg = /^\(.*\)$/
  if (reg.test(field)) {
    isEqual = true
    field = field.substring(1, field.length - 1)
  }
  if(reg.test(dataField)) {
    dataField = dataField.substring(1, dataField.length - 1)
  }

  return {
    field: formatField(t ? t + '.' : '' + snakeCase(field)),
    dataField: camelCase(dataField),
    isEqual,
    isValid,
    validHighlightCount
  }
}

/**
 * 处理下划线名称，去掉数字前的下划线，如 t_2.my_name_3 ==> t2.my_name3
 */
function formatField(field: string): string {
  const reg = /_\d+/
  const i1 = field.search(reg)
  if (i1 === 0) field = field.substring(1, field.length)
  else if (i1 !== -1) field = field.substring(0, i1) + field.substring(i1 + 1)
  const i2 = field.search(reg)
  if (i2 !== -1) return formatField(field)
  return field
}

/**
 * 处理 where 查询时的 keyword 字段
 * keyword 原始字段
 * max 最大长度
 */
export const handleKeyword = (key: string, max = 6): string[] => {
  const target: string[] = []
  if (!key) return target
  const matches: string[] = []
  let match
  const reg1 = /\((.*?)\)|\[(.*?)\]|\{(.*?)\}|（(.*?)）/g
  while ((match = reg1.exec(key)) !== null) {
    if (match[1]) {
      matches.push(match[1])
    } else if (match[2]) {
      matches.push(match[2])
    } else if (match[3]) {
      matches.push(match[3])
    } else if (match[4]) {
      matches.push(match[4])
    }
  }
  key = key.replace(reg1, ',')
  matches.push(key)
  const reg2 = /[\s;；，,.。\|\(\)（）\[\]\{\}]/g
  matches.forEach((value) => {
    if (value) {
      target.push(...value.replace(reg2, ',').split(','))
    }
  })

  return uniq(target.filter((val) => val))
    .sort((str1, str2) => str2.length - str1.length)
    .slice(0, max)
}

/**
 * 模糊查询，需要 order keyword 排序时，处理 select 字段
 */
export function handleOrderFields(orderField: string, field: string, keyword: string) {
  const color = '#F56C6C'
  let replaced = orderField || field
  replaced = replaced.trimEnd()
  if (replaced.endsWith(',')) replaced = replaced.substring(0, replaced.length - 1)
  return `REPLACE(${replaced}, '${keyword}', "<span data-search-key='search' style='color: ${color}'>${keyword}</span>")`
}
