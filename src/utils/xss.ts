import { FilterXSS, escapeAttrValue } from 'xss'

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
    const attribute = [
      'width',
      'height',
      'style',
      'title',
      'bgcolor',
      'background',
      'align',
      'alt',
      'color',
      'border',
      'bordercolor',
      'bordercolorlight',
      'bordercolordark',
      'clos',
      'rows',
      'colspan',
      'rowspan',
      'cellpadding',
      'cellspacing',
      'type',
      'name',
      'size',
      'disabled',
      'checked',
      'readonly',
      'maxlength',
      'hidden',
      'multiple',
      'direction',
      'dir',
      'face',
      'scrollamount',
      'scrolldelay',
      'autostart',
      'startime',
      'volume',
      'controls',
      'usemap',
      'tabindex',
      'accept',
      'draggable'
    ]
    const flag =
      attribute.indexOf('name') !== -1 ||
      name.substr(0, 5) === 'data-' ||
      (tag === 'img' &&
        (name === 'src' || name === 'filter' || name === 'alpha' || name === 'opacity' || name === 'rules')) ||
      ((tag === 'frame' || tag === 'frameset') &&
        (name === 'frameborder' ||
          name === 'framespacing' ||
          name === 'scrolling' ||
          name === 'noresize' ||
          name === 'marginhight' ||
          name === 'marginwidth' ||
          name === 'target')) ||
      (tag === 'marquee' &&
        (name === 'behavior' ||
          name === 'scrollamount' ||
          name === 'scrolldelay' ||
          name === 'scrollheight' ||
          name === 'scrollleft' ||
          name === 'scrolltop' ||
          name === 'truespeed')) ||
      (tag === 'form' &&
        (name === 'action' ||
          name === 'method' ||
          name === 'enctype' ||
          name === 'onsubmit' ||
          name === 'noreset' ||
          name === 'target'))
    if (flag) return name + '="' + escapeAttrValue(value) + '"'
  }
})

export default myxss
