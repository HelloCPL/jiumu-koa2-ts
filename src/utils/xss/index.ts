import { FilterXSS, escapeAttrValue } from 'xss'
import { handleAttributeFilter } from './config'

/**
 * @author chen
 * @params text
 * @description 自定义 xss 过滤规则
 * 保留style、data-开头的属性 图片地址
 * @update 2021-12-05 00:17:23
 */

// 不过滤的标签属性
const myxss = new FilterXSS({
  css: false,
  onTagAttr(tag, name, value) {
    // 通用属性不过滤
    const flag = handleAttributeFilter(tag, name)
    if (flag) return name + '="' + escapeAttrValue(value) + '"'
  },
  escapeHtml: (html) => html
})

export default myxss
