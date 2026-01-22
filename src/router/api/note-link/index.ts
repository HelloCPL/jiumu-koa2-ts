/**
 * @description: 笔记关联
 * @author: cpl
 * @create: 2023-02-07 11:57:09
 */

import { Convert, Prefix, Request, Required } from '@/router/router'
import { Context } from 'koa'
import { doNoteLinkAddConvert, doNoteLinkDeleteConvert } from '@/router/controller/note-link/convert'
import { doNoteLinkAdd } from '@/router/controller/note-link/add'
import { doNoteLinkDelete } from '@/router/controller/note-link/delete'
import { doNoteLinkGetListByRootId } from '@/router/controller/note-link/get'

@Prefix('note-link')
export default class API {
  // 1 新增笔记关联
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['noteId', 'targetId'])
  @Convert(doNoteLinkAddConvert)
  async doNoteLinkAdd(ctx: Context) {
    await doNoteLinkAdd(ctx)
  }

  // 2 删除笔记关联
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['noteId', 'targetId'])
  @Convert(doNoteLinkDeleteConvert)
  async doNoteLinkDelete(ctx: Context) {
    await doNoteLinkDelete(ctx)
  }

  // 3 获取的相同根节点的其他目标节点的可关联笔记列表
  @Request({
    path: 'get/list/byrootid',
    methods: ['get', 'post']
  })
  @Required([
    'rootId',
    'targetId',
    { field: 'pageNo', required: false, name: 'isInt', options: [{ min: 1 }] },
    { field: 'pageSize', required: false, name: 'isInt', options: [{ min: 1 }] }
  ])
  async doNoteLinkGetListByRootId(ctx: Context) {
    await doNoteLinkGetListByRootId(ctx)
  }
}
