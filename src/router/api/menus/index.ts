/**
 * @description: 菜单管理模块
 * @author chen
 * @update 2021-08-11 14:12:49
*/

import { Context, Next } from 'koa'
import { Prefix, Convert, Request, Required } from '../../router'
import { doMenuAddConvert, doMenuUpdateConvert, doMenuDeleteConvert } from '../../controller/menus/convert'
import { doMenuAdd } from '../../controller/menus/add'
import { doMenuUpdate } from '../../controller/menus/update'
import { doMenuDelete } from '../../controller/menus/delete'
import { doMenuGetOne, doMenuGetByParentCode } from '../../controller/menus/get'
import { doRoleMenugetAllMenuByUserId } from '../../controller/roles-menus/get';

@Prefix('menu')
export default class API {
  // 1 菜单新增
  @Request({
    path: 'add',
    methods: ['get', 'post']
  })
  @Required(['code', 'label'])
  @Convert(doMenuAddConvert)
  async doMenuAdd(ctx: Context, next: Next) {
    await doMenuAdd(ctx, next)
  }

  // 2 菜单修改
  @Request({
    path: 'update',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doMenuUpdateConvert)
  async doMenuUpdate(ctx: Context, next: Next) {
    await doMenuUpdate(ctx, next)
  }
  
  // 3 菜单删除
  @Request({
    path: 'delete',
    methods: ['get', 'post']
  })
  @Required(['id'])
  @Convert(doMenuDeleteConvert)
  async doMenuDelete(ctx: Context, next: Next) {
    await doMenuDelete(ctx, next)
  }

  // 4 获取指定的某个菜单
  @Request({
    path: 'get/one',
    methods: ['get', 'post']
  })
  @Required(['id'])
  async doMenuGetOne(ctx: Context, next: Next) {
    await doMenuGetOne(ctx, next)
  }

  // 5 获取我的所有菜单
  @Request({
    path: 'get/all/self',
    methods: ['get', 'post']
  })
  async doMenuGetAllSelf(ctx: Context, next: Next) {
    ctx.params.userId = ctx.user.id
    await doRoleMenugetAllMenuByUserId(ctx, next)
  }

  // 6 获取某类菜单
  @Request({
    path: 'get/byparentcode',
    methods: ['get', 'post']
  })
  async doMenuGetByParentCode(ctx: Context, next: Next) {
    await doMenuGetByParentCode(ctx, next)
  }
}
