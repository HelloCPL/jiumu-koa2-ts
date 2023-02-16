/**
 * @description: 文件操作模块相关路由
 * @author chen
 * @update 2021-01-27 11:10:43
 */

import { Context } from 'koa'
import { Prefix, Request, Required, Convert } from '@/router/router'
import { doFileAdd, doFileChunkAdd } from '@/router/controller/files-info/add'
import { doFileGetOne } from '@/router/controller/files-info/get'
import { doFileDelete } from '@/router/controller/files-info/delete'
import { doFileDeleteConvert, doFileGetOneConvert } from '@/router/controller/files-info/convert'

@Prefix('file')
export default class API {
  // 1 文件上传 可上传一个或多个文件 返回数组格式
  @Request({
    path: 'add',
    methods: ['post']
  })
  async doFileAdd(ctx: Context) {
    await doFileAdd(ctx)
  }

  // 2 文件删除 传 ids 可删除多个 用逗号隔开
  @Request({
    path: 'delete',
    methods: ['post', 'get']
  })
  @Required(['ids'])
  @Convert(doFileDeleteConvert)
  async doFileDelete(ctx: Context) {
    await doFileDelete(ctx)
  }

  // 3 获取一个指定文件 返回对象或null
  @Request({
    path: 'get/one',
    methods: ['post', 'get']
  })
  @Required(['id'])
  @Convert(doFileGetOneConvert)
  async doFileGetOne(ctx: Context) {
    await doFileGetOne(ctx)
  }

  // 4. 切片上传，用于大文件上传
  @Request({
    path: 'chunk/add',
    methods: ['post']
  })
  @Required(['fileHash', 'chunkHash'])
  async doFileChunkAdd(ctx: Context) {
    await doFileChunkAdd(ctx)
  }
}
