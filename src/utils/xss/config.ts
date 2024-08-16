/**
 * 通用的标签属性不过滤
 */
const attributeWhitelist = [
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

/**
 * 指定标签可过滤的属性
 */
const tagAttributeWhitelist = [
  {
    tags: ['img'],
    attributeWhitelist: ['src', 'filter', 'alpha', 'opacity', 'rules']
  },
  {
    tags: ['frame', 'frameset'],
    attributeWhitelist: [
      'frameborder',
      'framespacing',
      'scrolling',
      'noresize',
      'marginhight',
      'marginwidth',
      'target'
    ]
  },
  {
    tags: ['marquee'],
    attributeWhitelist: [
      'behavior',
      'scrollamount',
      'scrolldelay',
      'scrollheight',
      'scrollleft',
      'scrolltop',
      'truespeed'
    ]
  },
  {
    tags: ['form'],
    attributeWhitelist: ['action', 'method', 'enctype', 'onsubmit', 'noreset', 'target']
  }
]

/**
 * 处理 xss 属性过滤条件
 */
export const handleAttributeFilter = (tag: string, name: string) => {
  const flag1 = attributeWhitelist.indexOf('name') !== -1
  const flag2 = name.startsWith('data-')
  let flag3 = false
  tagAttributeWhitelist.find((item) => {
    if (item.tags.indexOf(tag) !== -1 && item.attributeWhitelist.indexOf(name) !== -1) {
      flag3 = true
    }
    return flag3
  })
  return flag1 && flag2 && flag3
}
