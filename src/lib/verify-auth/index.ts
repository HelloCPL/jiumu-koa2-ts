/**
 * @description 权限校验
 * @author chen
 * @update 2021-01-21 14:23:03
 * @list 方法集合说明
 *   verifyRoute // 拦截普通路由请求 token 权限
 *   verifyStatic // 拦截静态资源访问权限
 */

import { Context, Next } from 'koa'
import { analysisToken } from '@/router/controller/users/token'
import { Code, Message } from '@/enums'
import { ExceptionHttp, ExceptionAuthFailed, ExceptionNotFound } from '@/utils/http-exception'
import { getSuffix, toPath } from '@/utils/tools'
import { query } from '@/db'
import { decrypt } from '@/utils/crypto'
import dayjs from 'dayjs'
import Logger from '../logger'
import { IS_VERIFY_API_PERMISSION, IS_VERIFY_STATIC_PERMISSION, STATIC_DIRS } from '@/config'
import { getTerminal } from '@/utils/tools'

/**
 * 拦截普通路由请求 token 权限
 */
export const verifyRoute = async (ctx: Context, next: Next) => {
  const url = toPath(ctx.request.url)
  Logger.request(ctx)
  if (global._unlessPath.indexOf(url) === -1 || ctx.request.header['authorization']) {
    const tokenInfo = await analysisToken(ctx)
    if (tokenInfo.code === Code.success) {
      ctx._user = tokenInfo.data
      if (IS_VERIFY_API_PERMISSION) {
        await verifyApiByUser(ctx, next)
      }
    } else if (global._unlessPath.indexOf(url) === -1) {
      throw new ExceptionAuthFailed(tokenInfo)
    }
  }
  if (!ctx._user) {
    ctx._user = {
      id: '',
      phone: '',
      terminal: getTerminal(ctx),
      'user-agent': <string>ctx.request.header['user-agent']
    }
  }
  await next()
}

/**
 * 校验非公开api的用户请求权限
 */
async function verifyApiByUser(ctx: Context, next: Next) {
  let flag = false
  // 获取用户所有权限
  const sql =
    'SELECT DISTINCT t2.href FROM roles_permissions t1 LEFT JOIN permissions t2 ON t1.permission_id = t2.id WHERE t1.role_id  IN (SELECT t3.role_id FROM users_roles t3 WHERE t3.user_id = ?)'
  const res: any = await query(sql, ctx._user.id)
  if (res && Array.isArray(res)) {
    const url = toPath(ctx.request.url)
    const url2 = url.substring(url.indexOf('/', 1))
    // @ts-ignore
    res.find((item: any) => {
      const itemUrl = toPath(item.href)
      if (itemUrl === url || (url2 && itemUrl === url2)) {
        flag = true
        return true
      }
    })
  }
  if (flag) await next()
  else throw new ExceptionAuthFailed({ message: Message.forbiddenApi })
}

/**
 * 拦截静态资源访问权限
 */
export const verifyStatic = async (ctx: Context, next: Next) => {
  const url: string = ctx.request.url
  if (IS_VERIFY_STATIC_PERMISSION) {
    // const url: string = ctx.request.url

    if (_judgeUrlInStaticDirs(url)) {
      const filePath = getSuffix(toPath(url), '/')
      const sql: string = 'SELECT is_secret, create_user FROM files_info WHERE file_path = ?'
      const res: any = await query(sql, filePath)
      if (res.length && res[0]['is_secret'] === '1') {
        const vt = _getQueryParams(url, 'vt=')
        const uid = _getQueryParams(url, 'uid=')
        // 校验访问权限
        if (!vt || !uid || uid !== res[0]['create_user']) {
          throw new ExceptionHttp({ message: Message.lockedAuth, code: Code.locked })
        }
        // 校验链接有效期
        try {
          const targetTime = dayjs(Number(vt)).valueOf()
          const currentTime = dayjs().valueOf()
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

// 判断访问静态资源
function _judgeUrlInStaticDirs(url: string): boolean {
  let flag = false
  STATIC_DIRS.find((dir) => {
    if (url.startsWith(`/${dir}/`)) {
      flag = true
    }
    return flag
  })
  return flag
}

// 获取指定参数并解密
function _getQueryParams(url: string, key: string): string {
  const i = url.lastIndexOf('?')
  if (i === -1) return ''
  const queryPath = url.substring(i + 1)
  const queryParams: string[] = queryPath.split('&')
  let params = ''
  // @ts-ignore
  queryParams.find((value) => {
    const keyIndex = value.indexOf(key)
    if (keyIndex !== -1) {
      params = decrypt(value.substring(keyIndex + key.length))
      return true
    }
  })
  return params
}
