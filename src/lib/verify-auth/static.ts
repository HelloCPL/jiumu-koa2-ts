import { Context, Next } from 'koa'
import { getQueryParams, isStaticUrl } from './utils'
import { IS_VERIFY_STATIC_PERMISSION } from '@/config'
import { ExceptionHttp, ExceptionNotFound } from '@/utils/http-exception'
import { getCurrentTime, getDateValueOf, getSuffix, toPath } from '@/utils/tools'
import { query } from '@/db'
import { Code, Message } from '@/enums'

/**
 * 静态资源访问权限拦截
 * @description 对静态资源请求作拦截
 * @description 对 mdapi 文档资源作拦截
 */
export const verifyStatic = async (ctx: Context, next: Next) => {
  if (IS_VERIFY_STATIC_PERMISSION) {
    const url: string = ctx.request.url
    if (isStaticUrl(url)) {
      const filePath = getSuffix(toPath(url), '/')
      const sql: string = 'SELECT is_secret, create_user FROM files_info WHERE file_path = ?'
      const res: any = await query(sql, filePath)
      if (res.length && res[0]['is_secret'] === '1') {
        const vt = getQueryParams(url, 'vt=')
        const uid = getQueryParams(url, 'uid=')
        // 校验访问权限
        if (!vt || !uid || uid !== res[0]['create_user']) {
          throw new ExceptionHttp({ message: Message.lockedAuth, code: Code.locked })
        }
        // 校验链接有效期
        try {
          const targetTime = getDateValueOf(Number(vt))
          const currentTime = getDateValueOf(getCurrentTime())
          if (targetTime < currentTime)
            throw new ExceptionHttp({ message: Message.lockedTime, code: Code.locked })
        } catch (e) {
          throw new ExceptionHttp({ message: Message.lockedTime, code: Code.locked })
        }
      }
    } else if (url.startsWith('/pc/mdapi/') && !url.endsWith('index.md')) {
      throw new ExceptionNotFound()
    }
  }
  await next()
}
