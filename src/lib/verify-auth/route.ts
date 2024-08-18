import { getTerminal, toPath } from '@/utils/tools'
import { Context, Next } from 'koa'
import { isStaticUrl } from './utils'
import { analysisToken } from '@/router/controller/users/token'
import { Code, Message } from '@/enums'
import { IS_VERIFY_API_PERMISSION } from '@/config'
import { ExceptionAuthFailed } from '@/utils/http-exception'
import { query } from '@/db'

/**
 * 普通路由拦截，校验 token 权限
 * @description 白名单路由不错拦截，即路由配置 unless=true 的路由
 */
export const verifyRoute = async (ctx: Context, next: Next) => {
  const url = toPath(ctx.request.url)
  const flag1 = !isStaticUrl(url)
  const flag2 = global._unlessPath.indexOf(url) === -1 || ctx.request.header['authorization']
  if (flag1 && flag2) {
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

  // 挂载用户信息
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
  const url = toPath(ctx.request.url)
  const sql =
    'SELECT DISTINCT t2.href FROM roles_permissions t1 LEFT JOIN permissions t2 ON t1.permission_id = t2.id WHERE t1.role_id  IN (SELECT t3.role_id FROM users_roles t3 WHERE t3.user_id = ?) AND t2.href = ?'
  const res: any = await query(sql, [ctx._user.id, url])
  if (res && res.length) {
    await next()
  } else {
    throw new ExceptionAuthFailed({ message: Message.forbiddenApi })
  }
}
