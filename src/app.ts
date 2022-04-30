/**
 * @description: 项目入口
 * @author chen
 * @update 2021-08-06 10:12:55
*/


import Koa from 'koa'
import Http from 'http'
import KoaCors from '@koa/cors'
import KoaBody from 'koa-body'
import { MAX_FIELDS_SIZE, STATIC_URL, PORT, BASE_URL } from './config'
import InitGlobal from './global'
import { catchError } from './lib/catch-error'
import { Route } from './router'
import Static from 'koa-static'
import { verifyStatic } from './lib/verify-auth'
import { initCompress } from './lib/compress'

const app: Koa = new Koa()

// 处理跨域
app.use(KoaCors())
// 处理body参数，并用于文件上传插件
app.use(KoaBody({
  multipart: true,
  formidable: {
    maxFieldsSize: MAX_FIELDS_SIZE// 设置上传文件大小最大限制
  }
}))
// 初始化全局变量/常量
InitGlobal.init()
// 全局异常捕获
app.use(catchError)
// 注册路由
const route = new Route(app)
route.init()
/**
 * 设置静态资源访问
 * 访问如 http://localhost:3000/files/395d00a0-6918-11eb-a413-3be76f9212d3.jpg
*/
app.use(verifyStatic) // 校验静态资源访问权限
app.use(Static(STATIC_URL))
// 启用 gizp 压缩
initCompress(app)

Http.createServer(app.callback()).listen(PORT, () => {
  console.log(`${BASE_URL} is running...`);
})
