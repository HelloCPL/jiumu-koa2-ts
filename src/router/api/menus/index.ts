/**
 * @description: 菜单管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
 */

import { Context } from 'koa'
import { Prefix, Convert, Request, Required } from '@/router/router'
import { doMenuAddConvert, doMenuUpdateConvert, doMenuDeleteConvert } from '@/router/controller/menus/convert'
import { doMenuAdd } from '@/router/controller/menus/add'
import { doMenuUpdate } from '@/router/controller/menus/update'
import { doMenuDelete } from '@/router/controller/menus/delete'
import { doMenuGetOne, doMenuGetByParentCode } from '@/router/controller/menus/get'
import { doRoleMenugetAllMenuByUserId } from '@/router/controller/roles-menus/get'

@Prefix('menu')
export default class API {
  // 1 菜单新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['code', 'label'])
  @Convert(doMenuAddConvert)
  async doMenuAdd(ctx: Context) {
    await doMenuAdd(ctx)
  }

  // 2 菜单修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doMenuUpdateConvert)
  async doMenuUpdate(ctx: Context) {
    await doMenuUpdate(ctx)
  }

  // 3 菜单删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doMenuDeleteConvert)
  async doMenuDelete(ctx: Context) {
    await doMenuDelete(ctx)
  }

  // 4 获取指定的某个菜单
  @Request({
    path: 'get/one',
    methods: ['get', 'post']
  })
  @Required(['id'])
  async doMenuGetOne(ctx: Context) {
    await doMenuGetOne(ctx)
  }

  // 5 获取我的所有菜单
  @Request({
    path: 'get/all/self',
    methods: ['get', 'post']
  })
  async doMenuGetAllSelf(ctx: Context) {
    ctx._params.userId = ctx._user.id
    await doRoleMenugetAllMenuByUserId(ctx)
  }

  // 6 获取某类菜单
  @Request({
    path: 'get/byparentcode',
    methods: ['get', 'post']
  })
  async doMenuGetByParentCode(ctx: Context) {
    await doMenuGetByParentCode(ctx)
  }
}
