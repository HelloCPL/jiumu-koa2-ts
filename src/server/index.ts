/**
 * @description: 项目服务入口
 * @author chen
 * @update 2021-08-06 10:12:55
 */

import Http from 'http'
import KoaCors from '@koa/cors'
import KoaBody from 'koa-body'
import { app } from './app'
import { MAX_FIELDS_SIZE, STATIC_URL, PORT, ENV, BASE_URL, PUBLIC_PATH } from '@/config'
import InitGlobal from '@/global'
import { mountRequest } from '@/lib/mount-parameter'
import { catchError } from '@/lib/catch-error'
import { Route } from '@/router'
import { verifyStatic } from '@/lib/verify-auth'
import Static from 'koa-static'
import { useMDAPI } from '@/router/mdapi'
import { initCompress } from '@/lib/compress'
import { toPath } from '@/utils/tools'
import { logger } from '@/lib/logger'

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

// 注册 mkapi 文档静态资源
useMDAPI(app)

// 启用 gizp 压缩
initCompress(app)

/**
 *  ---------------------  Server ---------------------
 */

const server = Http.createServer(app.callback())

type StartReturn = {
  port: number
  env: string
}

/**
 * 开启服务
 * @returns Promise<StartReturn>
 */
const startServer = (): Promise<StartReturn> => {
  return new Promise((resolve) => {
    server.listen(PORT, () => {
      let message = `服务启动成功:\n  Local:   http://localhost:${PORT}`
      if (!BASE_URL.includes('localhost')) {
        message += `\n  Network: ${toPath(BASE_URL, PUBLIC_PATH)}`
      }
      logger.info({ message }, true)
      resolve({ port: PORT, env: ENV })
    })
  })
}

/**
 * 关闭服务
 * @returns Promise<boolean>
 */
const closeServer = (): Promise<boolean> => {
  return new Promise((resolve) => {
    server.close(() => {
      logger.info({ message: 'Server closed.' }, true)
      resolve(true)
    })
  })
}

export { startServer, closeServer }
