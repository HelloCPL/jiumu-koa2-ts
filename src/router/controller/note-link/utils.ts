import { Message } from '@/enums'

/**
 * 获取笔记关联可选类型
 * @param type 资源类型
 */
export const getNovelNoteLinkType = (type: string) => {
  const tList: ObjectAny = {
    '502': {
      table: 'questions',
      unexistMessage: Message.unexistQuestion,
      titleKey: 'title',
      label: '问答来源'
    },
    '503': {
      table: 'sources',
      unexistMessage: Message.unexistSource,
      titleKey: 'title',
      label: '资源文件来源'
    },
    '504': {
      table: 'novels',
      unexistMessage: Message.unexistNovel,
      titleKey: 'name',
      label: '连载来源'
    },
    '505': {
      table: 'articles',
      unexistMessage: Message.unexistArticle,
      titleKey: 'title',
      label: '博客文章来源'
    },
    '507': {
      table: 'novels_chapter',
      unexistMessage: Message.unexistNovelChapter,
      titleKey: 'title',
      label: '连载章节'
    }
  }
  return tList[type] || null
}
