/**
 * @description: 笔记关联
 * @author: cpl
 * @create: 2023-02-07 11:57:09
 */

import { Convert, Prefix, Request, Required } from '@/router/router'
import { Context } from 'koa'
import {
  doNovelNoteLinkAddConvert,
  doNovelNoteLinkDeleteConvert
} from '@/router/controller/novels-note-link/convert'
import { doNovelNoteLinkAdd } from '@/router/controller/novels-note-link/add'
import { doNovelNoteLinkDelete } from '@/router/controller/novels-note-link/delete'
import { doNovelNoteLinkDeleteGetListSelf } from '@/router/controller/novels-note-link/get'

@Prefix('novel-note-link')
export default class API {
  // 1 新增笔记关联
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['noteId', 'targetId', 'targetType'])
  @Convert(doNovelNoteLinkAddConvert)
  async doNovelNoteLinkAdd(ctx: Context) {
    await doNovelNoteLinkAdd(ctx)
  }

  // 2 删除笔记关联
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Convert(doNovelNoteLinkDeleteConvert)
  async doNovelNoteLinkDelete(ctx: Context) {
    await doNovelNoteLinkDelete(ctx)
  }

  // 3 获取本用户的可共享关联的笔记列表
  @Request({
    path: 'get/list/self',
    methods: ['get', 'post']
  })
  @Required(['share'])
  async doNovelNoteLinkDeleteGetListSelf(ctx: Context) {
    await doNovelNoteLinkDeleteGetListSelf(ctx)
  }
}
