
// 废弃

// /**
//  * @description: 用户-权限关联额外权限模块
//  * @author chen
//  * @update 2021-08-11 14:12:49
// */

// import { Context, Next } from 'koa'
// import { Prefix, Convert, Request, Required } from '../../router'
// import { doUserPermissionAddConvert, doUserPermissionUpdateConvert, doUserPermissionDeleteConvert } from '../../controller/users-permissions/convert'
// import { doUserPermissionAdd } from '../../controller/users-permissions/add'
// import { doUserPermissionUpdate } from '../../controller/users-permissions/update'
// import { doUserPermissionDelete } from '../../controller/users-permissions/delete'
// import { doUserPermissionGetAllPermission } from '../../controller/users-permissions/get'

// @Prefix('user/permission')
// export default class API {
//   // 1 新增用户-权限关联额外权限
//   @Request({
//     path: 'add',
//     methods: ['get', 'post']
//   })
//   @Required(['userId', 'permissionId', 'status'])
//   @Convert(doUserPermissionAddConvert)
//   async doUserPermissionAdd(ctx: Context, next: Next) {
//     await doUserPermissionAdd(ctx, next)
//   }

//   // 2 修改用户-权限关联额外权限
//   @Request({
//     path: 'update',
//     methods: ['get', 'post']
//   })
//   @Required(['id'])
//   @Convert(doUserPermissionUpdateConvert)
//   async doUserPermissionUpdate(ctx: Context, next: Next) {
//     await doUserPermissionUpdate(ctx, next)
//   }

//   // 3 删除用户-权限关联额外权限
//   @Request({
//     path: 'delete',
//     methods: ['get', 'post']
//   })
//   @Required(['id'])
//   @Convert(doUserPermissionDeleteConvert)
//   async doUserPermissionDelete(ctx: Context, next: Next) {
//     await doUserPermissionDelete(ctx, next)
//   }

//   // 4 获取指定用户拥有的额外权限
//   @Request({
//     path: 'get/allpermission',
//     methods: ['get', 'post']
//   })
//   @Required(['userId'])
//   async doUserPermissionGetAllPermission(ctx: Context, next: Next) {
//     await doUserPermissionGetAllPermission(ctx, next)
//   }
// }
