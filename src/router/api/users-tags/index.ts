/**
 * @description: 用户-特殊标签关联模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doUserTagAddExist, doUserTagDeleteExist } from '../../controller/users-tags/convert'
import { doUserTagAdd } from '../../controller/users-tags/add'
import { doUserTagDelete } from '../../controller/users-tags/delete'
import { doUserTagGetAllTag } from '../../controller/users-tags/get'


@Prefix('user/tag')
export default class API {
  // 1 新增用户-特殊标签关联
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['tagCode', 'userId'])
  @Convert(doUserTagAddExist)
  async doUserTagAdd(ctx: Context, next: Next) {
    await doUserTagAdd(ctx, next)
  }

  // 2 删除用户-特殊标签关联
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doUserTagDeleteExist)
  async doUserTagDelete(ctx: Context, next: Next) {
    await doUserTagDelete(ctx, next)
  }

  // 3 获取指定用户拥有的所有特殊标签
  @Request({
    path: 'get/alltag',
    methods: ['get', 'post']
  })
  @Required(['userId'])
  async doUserTagGetAllTag(ctx: Context, next: Next) {
    await doUserTagGetAllTag(ctx, next)
  }

}











