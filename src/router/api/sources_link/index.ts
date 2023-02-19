/**
 * @describe: 资源的外部资源信息
 * @author: cpl
 * @create: 2023-02-19 14:23:08
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import {
  doSourceLinkUpdateConvert,
  doSourceLinkDeleteConvert
} from '@/router/controller/sources-link/convert'
import { doSourceLinkAdd } from '@/router/controller/sources-link/add'
import { doSourceLinkUpdate } from '@/router/controller/sources-link/update'
import { doSourceLinkDelete } from '@/router/controller/sources-link/delete'

@Prefix('source-link')
export default class API {
  // 1 资源的外部资源信息新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['title', 'link&isURL'])
  async doSourceLinkAdd(ctx: Context) {
    await doSourceLinkAdd(ctx)
  }

  // 2 资源的外部资源信息修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doSourceLinkUpdateConvert)
  async doSourceLinkUpdate(ctx: Context) {
    await doSourceLinkUpdate(ctx)
  }

  // 3 资源的外部资源信息删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doSourceLinkDeleteConvert)
  async doSourceLinkDelete(ctx: Context) {
    await doSourceLinkDelete(ctx)
  }
}
