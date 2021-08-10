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
import Static from 'koa-static'
import path from 'path'
import { verifyStatic } from './lib/verify-auth'
import { initCompress } from './lib/compress'


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
// 初始化路由
const route = new Route(app)
route.init()
/**
 * 初始化静态资源
 * 访问如 http://localhost:3000/files/395d00a0-6918-11eb-a413-3be76f9212d3.jpg
*/
const staticPath = path.join(__dirname, '../static/')
app.use(verifyStatic) // 校验静态资源访问权限
app.use(Static(staticPath))
// 启用 gizp 压缩
initCompress(app)

Http.createServer(app.callback()).listen(Config.PORT, () => {
  console.log(`${Config.BASE_URL} is running...`);
})
