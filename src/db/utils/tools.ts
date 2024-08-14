import { camelCase, snakeCase } from 'lodash'

/**
 * 处理某个字段是否参与查询，且返回查询时的规则
 * field 参与的字段
 *   '!field' 以 '!' 开头表示不参与查询，如 '!name'
 *   '(field)' 以 '()' 包裹表示全选匹配，如 '(name)'
 *   'xxx.field' 以 'xxx.' 开头表示指定表名称，如 'users.name'
 *   'field:newField' 以 ':xxx' 表示将该字段重命名，如 'name:username'
 * 组合顺序，如 '!(xxx.field:newField)'
 */
export const handleField = (key: string): SQLKeyResult => {
  let isValid = true
  if (key.startsWith('!')) {
    isValid = false
    key = key.substring(1)
  }
  let isEqual = false
  if (/^\(.*\)$/.test(key)) {
    isEqual = true
    key = key.substring(1, key.length - 1)
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

  return {
    field: formatField(t ? t + '.' : '' + snakeCase(field)),
    dataField: camelCase(dataField),
    isEqual,
    isValid
  }
}

/**
 * 处理下划线名称，去掉数字前的下划线，如 t_2.my_name_3 ==> t2.my_name3
 */
function formatField(field: string) {
  const reg = /_\d+/
  const i1 = field.search(reg)
  if (i1 === 0) field = field.substring(1, field.length)
  else if (i1 !== -1) field = field.substring(0, i1) + field.substring(i1 + 1)
  const i2 = field.search(reg)
  if (i2 !== -1) return formatField(field)
  return field
}
