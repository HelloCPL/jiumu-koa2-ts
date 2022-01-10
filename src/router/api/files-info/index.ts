/**
 * @description: 文件操作模块相关路由
 * @author chen
 * @update 2021-01-27 11:10:43
*/

import { Context, Next } from 'koa'
import { Prefix, Request, Required, Convert } from '../../router'
import { doFileAdd } from '../../controller/files-info/add'
import { doFileGetOne, doFileGetListByUserId, doFileGetListSelf } from '../../controller/files-info/get'
import { doFileDelete } from '../../controller/files-info/delete'
import { doFileDeleteConvert, doFileGetOneConvert } from '../../controller/files-info/convert'

@Prefix('file')
export default class API {
  // 1 文件上传 可上传一个或多个文件 返回数组格式
  @Request({
    path: 'add',
    methods: ['post'],
  })
  async doFileAdd(ctx: Context, next: Next) {
    await doFileAdd(ctx, next)
  }

  // 2 文件删除 传 ids 可删除多个 用逗号隔开
  @Request({
    path: 'delete',
    methods: ['post', 'get'],
  })
  @Required(['ids'])
  @Convert(doFileDeleteConvert)
  async doFileDelete(ctx: Context, next: Next) {
    await doFileDelete(ctx, next)
  }

  // 3 获取一个指定文件 返回对象或null
  @Request({
    path: 'get/one',
    methods: ['post', 'get'],
  })
  @Required(['id'])
  @Convert(doFileGetOneConvert)
  async doFileGetOne(ctx: Context, next: Next) {
    await doFileGetOne(ctx, next)
  }

  // 4 获取指定用户的所有文件/图片列表 返回数组或[]
  // @Request({
  //   path: 'get/list/byuserid',
  //   methods: ['post', 'get'],
  // })
  // @Required(['userId'])
  // async doFileGetListByUserId(ctx: Context, next: Next) {
  //   await doFileGetListByUserId(ctx, next)
  // }

  // 5 获取本用户的所有文件/图片列表 返回数组或[]
  // @Request({
  //   path: 'get/list/self',
  //   methods: ['post', 'get'],
  // })
  // async doFileGetListSelf(ctx: Context, next: Next) {
  //   await doFileGetListSelf(ctx, next)
  // }
}
