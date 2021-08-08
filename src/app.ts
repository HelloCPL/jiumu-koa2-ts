/**
 * @description: 项目入口
 * @author chen
 * @update 2021-08-06 10:12:55
*/


import Koa from 'koa'
import Http from 'http'
import KoaCors from '@koa/cors'
import KoaBody from 'koa-body'
import Config from './config'
import InitGlobal from './global'
import { catchError } from './lib/catch-error'
import { Route } from './router'

const app: Koa = new Koa()

// 处理跨域
app.use(KoaCors())
// 处理body参数，并用于文件上传插件
app.use(KoaBody({
  multipart: true,
  formidable: {
    maxFieldsSize: 500 * 1024 * 1024 // 设置上传文件大小最大限制，默认500M
  }
}))
// 初始化全局方法或变量
InitGlobal.init()
// 全局异常捕获
app.use(catchError)
// 挂载 token 权限判断处理
// 初始化路由
const route = new Route(app)
route.init()

Http.createServer(app.callback()).listen(Config.PORT, () => {
  console.log(`${Config.BASE_URL} is running...`);
})
