

import { FilterXSS, escapeAttrValue } from 'xss'

/**
 * @author chen
 * @params text
 * @description 自定义 xss 过滤规则 
 * 保留style、data-开头的属性 图片地址
 * @update 2021-12-05 00:17:23
*/

const myxss = new FilterXSS({
  css: false,
  onTagAttr(tag, name, value) {
    let flag = name.substr(0, 5) === 'data-' || name === 'width' || name === 'height' || name === "style" || (tag === 'img' && name === 'src')
    if (flag)
      return name + '="' + escapeAttrValue(value) + '"'
  }
});

export default myxss