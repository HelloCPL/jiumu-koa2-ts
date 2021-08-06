/**
 * @description: 遍历寻找成员方法
 * @author chen
 * @update 2021-01-20 15:14:26
 * @list 方法集合说明
 *   findMembers // 遍历寻找成员方法
*/

interface MembersOptions {
  prefix?: any,
  specifiedType?: any,
  filter?: any,
}

// 遍历寻找成员方法
export function findMembers(instance: any, options: MembersOptions) {
  function _find(instance: any): any {
    if (instance.__proto__ === null) return []
    // 获取自身属性
    let names = Reflect.ownKeys(instance)
    // 过滤
    names = names.filter(name => _shouldKeep(name))
    return [...names, ..._find(instance.__proto__)]
  }

  // 过滤条件
  function _shouldKeep(value: any) {
    if (options.filter)
      if (options.filter(value)) return true
    if (options.prefix)
      if (value.startsWith(options.prefix)) return true
    if (options.specifiedType)
      if (instance[value] instanceof options.specifiedType) return true
  }

  return _find(instance)
}