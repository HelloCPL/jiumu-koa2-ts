/**
 * @description: 项目入口
 * @author chen
 * @update 2021-08-06 10:12:55
 */

import 'module-alias/register'

import Koa from 'koa'
import Http from 'http'
import KoaCors from '@koa/cors'
import KoaBody from 'koa-body'
import { MAX_FIELDS_SIZE, STATIC_URL, PORT, BASE_URL, PUBLIC_PATH } from './config'
import InitGlobal from './global'
import { catchError } from './lib/catch-error'
import { Route } from './router'
import Static from 'koa-static'
import { verifyStatic } from './lib/verify-auth'
import { initCompress } from './lib/compress'
import { toPath } from './utils/tools'
import { useMDAPI } from './router/mdapi'
import { mountRequest } from '@/lib/mount-parameter'

const app: Koa = new Koa()

// 处理跨域
app.use(KoaCors())
// 处理body参数，并用于文件上传插件
app.use(
  KoaBody({
    multipart: true,
    jsonLimit: '10mb',
    formLimit: '128kb',
    textLimit: '128kb',
    formidable: {
      maxFieldsSize: MAX_FIELDS_SIZE // 设置上传文件大小最大限制
    }
  })
)
// 初始化全局变量/常量
InitGlobal.init()

// 初始化请求参数
app.use(mountRequest)

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
// mkapi 文档静态资源
useMDAPI(app)
// 启用 gizp 压缩
initCompress(app)

Http.createServer(app.callback()).listen(PORT, () => {
  console.log(`${toPath(BASE_URL, PUBLIC_PATH)} is running...`)
})
