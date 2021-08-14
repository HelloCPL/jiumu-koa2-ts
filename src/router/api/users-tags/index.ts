/**
 * @description: 用户-特殊标签关联模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doUserTagAddConvert, doUserTagDeleteConvert, doUserTagGetAllUserByTagCodeConvert } from '../../controller/users-tags/convert'
import { doUserTagAdd } from '../../controller/users-tags/add'
import { doUserTagDelete } from '../../controller/users-tags/delete'
import { doUserTagGetAllTagByUserId, doUserTagGetAllUserByTagCode } from '../../controller/users-tags/get'

@Prefix('user-tag')
export default class API {
  // 1 新增用户-特殊标签关联
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['tagCode', 'userId'])
  @Convert(doUserTagAddConvert)
  async doUserTagAdd(ctx: Context, next: Next) {
    await doUserTagAdd(ctx, next)
  }

  // 2 删除用户-特殊标签关联
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doUserTagDeleteConvert)
  async doUserTagDelete(ctx: Context, next: Next) {
    await doUserTagDelete(ctx, next)
  }

  // 3 获取指定用户关联的所有特殊标签
  @Request({
    path: 'get/alltag/byuserid',
    methods: ['get', 'post']
  })
  @Required(['userId'])
  async doUserTagGetAllTagByUserId(ctx: Context, next: Next) {
    await doUserTagGetAllTagByUserId(ctx, next)
  }

  // 4 获取指定特殊标签关联的所有用户
  @Request({
    path: 'get/alluser/bytagcode',
    methods: ['get', 'post']
  })
  @Required(['tagCode'])
  @Convert(doUserTagGetAllUserByTagCodeConvert)
  async doUserTagGetAllUserByTagCode(ctx: Context, next: Next) {
    await doUserTagGetAllUserByTagCode(ctx, next)
  }
}
