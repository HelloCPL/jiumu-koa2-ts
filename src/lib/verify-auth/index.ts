/**
 * @description 权限校验
 * @author chen
 * @update 2021-01-21 14:23:03
 * @list 方法集合说明
 *   verifyRoute // 拦截普通路由请求 token 权限
 *   verifyStatic // 拦截静态资源访问权限
*/

import { Context, Next } from 'koa'
import { analysisToken } from '../../router/controller/users/token'
import { Code, Message } from '../../enums'
import { ExceptionHttp, ExceptionAuthFailed } from '../../utils/http-exception'
import { getSuffix } from '../../utils/tools';
import { query } from '../../db';
import { decrypt } from '../../utils/crypto';
import dayjs from 'dayjs'
import Logger from '../logger'
import { getAllPermissionByUserId } from '../../router/controller/roles-permissions/get';
import { IS_VERIFY_API_PERMISSION, IS_VERIFY_STATIC_PERMISSION } from '../../config'

/**
 * 拦截普通路由请求 token 权限
*/
export const verifyRoute = async (ctx: Context, next: Next) => {
  const url = _getFullPath(ctx.request.url)
  if (global.unlessPath.indexOf(url) === -1) {
    const tokenInfo = await analysisToken(ctx)
    if (tokenInfo.code === Code.success) {
      ctx.user = tokenInfo.data
      if (IS_VERIFY_API_PERMISSION) {
        await verifyApiByUser(ctx, next)
      }
    } else {
      Logger.request(ctx)
      throw new ExceptionAuthFailed(tokenInfo)
    }
  }
  Logger.request(ctx)
  await next()
}

// 获取请求路径
function _getFullPath(path: string): string {
  let index = path.indexOf('?')
  if (index !== -1)
    path = path.substring(0, index)
  return path
}

/**
 * 校验非公开api的用户请求权限
*/
async function verifyApiByUser(ctx: Context, next: Next) {
  let flag = false
  const res: any = await getAllPermissionByUserId({
    userId: ctx.user.id,
    pageNo: 1,
    pageSize: 100000
  })
  if (res && Array.isArray(res.data)) {
    const url = _getFullPath(ctx.request.url)
    const url2 = url.substring(url.indexOf('/', 1))
    res.data.find((item: any) => {
      if (item.href === url || (url2 && item.href === url2)) {
        flag = true
        return true
      }
    })
  }
  if (flag)
    await next()
  else
    throw new ExceptionAuthFailed({ message: Message.forbiddenApi })
}

/**
 * 拦截静态资源访问权限
*/
export const verifyStatic = async (ctx: Context, next: Next) => {
  if (IS_VERIFY_STATIC_PERMISSION) {
    const url: string = ctx.request.url
    if (url.startsWith('/files/') || url.startsWith('/images/') || url.startsWith('/videos/') || url.startsWith('/editors/') || url.startsWith('/sources/')) {
      let filePath = getSuffix(_getFullPath(url), '/')
      const sql: string = `SELECT is_secret, create_user FROM files_info WHERE file_path = ?`
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
    }
  }
  await next()
}

// 获取指定参数并解密
function _getQueryParams(url: string, key: string): string {
  let i = url.lastIndexOf('?')
  if (i === -1) return ''
  const queryPath = url.substring(i + 1)
  const queryParams: string[] = queryPath.split('&')
  let params = ''
  // @ts-ignore 
  queryParams.find(value => {
    let keyIndex = value.indexOf(key)
    if (keyIndex !== -1) {
      params = decrypt(value.substring(keyIndex + key.length))
      return true
    }
  })
  return params
}














