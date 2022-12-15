/**
 * @description: 用户-特殊标签关联模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import {
  doUserTagAddConvert,
  doUserTagDeleteConvert,
  doUserTagGetAllUserByTagCodeConvert
} from '@/router/controller/users-tags/convert'
import { doUserTagAdd } from '@/router/controller/users-tags/add'
import { doUserTagDelete } from '@/router/controller/users-tags/delete'
import { doUserTagGetAllTagByUserId, doUserTagGetAllUserByTagCode } from '@/router/controller/users-tags/get'

@Prefix('user-tag')
export default class API {
  // 1 新增用户-特殊标签关联
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['tagCode', 'userId'])
  @Convert(doUserTagAddConvert)
  async doUserTagAdd(ctx: Context) {
    await doUserTagAdd(ctx)
  }

  // 2 删除用户-特殊标签关联
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Convert(doUserTagDeleteConvert)
  async doUserTagDelete(ctx: Context) {
    await doUserTagDelete(ctx)
  }

  // 3 获取指定用户关联的所有特殊标签
  @Request({
    path: 'get/alltag/byuserid',
    methods: ['get', 'post']
  })
  @Required(['userId'])
  async doUserTagGetAllTagByUserId(ctx: Context) {
    await doUserTagGetAllTagByUserId(ctx)
  }

  // 4 获取指定特殊标签关联的所有用户
  @Request({
    path: 'get/alluser/bytagcode',
    methods: ['get', 'post']
  })
  @Required(['tagCode'])
  @Convert(doUserTagGetAllUserByTagCodeConvert)
  async doUserTagGetAllUserByTagCode(ctx: Context) {
    await doUserTagGetAllUserByTagCode(ctx)
  }
}
