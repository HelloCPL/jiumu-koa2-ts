/**
 * @description: 文件操作模块相关路由
 * @author chen
 * @update 2021-01-27 11:10:43
*/

import { Context, Next } from 'koa'
import { Prefix, Request, Required, Convert } from '../../router'
import { doFileUpload } from '../../controller/file-operate/upload'
import { doFileGet } from '../../controller/file-operate/get'
import { doFileDelete } from '../../controller/file-operate/delete'
import { doFileDeleteIsPower } from '../../controller/file-operate/convert'


@Prefix('file')
export default class User {
  // 1 文件上传 可上传一个或多个文件 返回数组格式
  @Request({
    path: 'upload',
    methods: ['post'],
  })
  async doFileUpload(ctx: Context, next: Next) {
    await doFileUpload(ctx, next)
  }

  // 2 文件获取 返回数组格式
  @Request({
    path: 'get',
    methods: ['post', 'get'],
  })
  @Required(['ids'])
  async doFileGet(ctx: Context, next: Next) {
    await doFileGet(ctx, next)
  }

  // 3 文件删除 传 ids 可删除多个 用逗号隔开
  @Request({
    path: 'delete',
    methods: ['post', 'get'],
  })
  @Required(['ids'])
  @Convert(doFileDeleteIsPower)
  async doFileDelete(ctx: Context, next: Next) {
    await doFileDelete(ctx, next)
  }
}