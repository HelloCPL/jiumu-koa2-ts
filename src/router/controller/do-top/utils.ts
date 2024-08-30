/**
 * 获取可置顶的资源类型
 * @param type 资源类型
 */
export const getTopSourcesType = (type: string) => {
  const tList: ObjectAny = {
    '502': {
      table: 'questions',
      label: '问答来源'
    },
    '503': {
      table: 'sources',
      label: '资源文件来源'
    },
    '504': {
      table: 'novels',
      label: '连载来源'
    },
    '505': {
      table: 'articles',
      label: '博客文章来源'
    }
  }
  return tList[type] || null
}
