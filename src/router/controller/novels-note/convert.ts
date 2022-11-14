/**
 * @author chen
 * @description 笔记模块中间件
 * @update 2022-03-20 15:25:20
 */

import { Context, Next } from 'koa'
import { Message } from '@/enums'
import { validateRange } from '@/utils/validator'
import { query } from '@/db'
import { ExceptionParameter, ExceptionForbidden } from '@/utils/http-exception'
import { NovelNoteTargetOptions } from './interface'

/**
 * 新增时
 * 判断 target 中的 type 是否系统标签类型
 */
export const doNovelNoteAddConvert = async (ctx: Context, next: Next) => {
  // 判断 type 是否系统标签500范围
  _judgeTarget(ctx._params.target)
  ctx._params._target = JSON.stringify(ctx._params.target)
  await next()
}

/**
 * 修改时
 * 判断笔记是否不存在，且是否为自己发布的笔记
 * 若传 isSecret 判断 isSecret 是否 ['1', '0'] 范围
 * 若 target 为真 判断 type 是否系统标签500范围
 */
export const doNovelNoteUpdateConvert = async (ctx: Context, next: Next) => {
  // 判断笔记是否不存在
  const sql = `SELECT id, create_user FROM novels_note WHERE id = ?`
  const res: any = await query(sql, ctx._params.id)
  if (!(res && res.length)) throw new ExceptionParameter({ message: Message.unexistNovelNote })
  // 是否为自己发布的笔记
  if (res[0]['create_user'] !== ctx._user.id) throw new ExceptionForbidden({ message: Message.forbidden })
  // 若传 isSecret 判断 isSecret 是否 ['1', '0'] 范围
  if (ctx._params.hasOwnProperty('isSecret')) {
    await validateRange({
      value: ctx._params.isSecret,
      range: ['1', '0'],
      message: `isSecret参数必须为['1', '0']范围`
    })
  }
  // 若 target 为真 判断 type 是否系统标签500范围
  if (ctx._params.hasOwnProperty('target')) {
    _judgeTarget(ctx._params.target)
    ctx._params._target = JSON.stringify(ctx._params.target)
  }
  await next()
}

/**
 * 删除时
 * 判断笔记是否不存在
 * 是否为自己发布的笔记
 */
export const doNovelNoteDeleteConvert = async (ctx: Context, next: Next) => {
  // 判断笔记是否不存在
  const sql = `SELECT id, create_user FROM novels_note WHERE id = ?`
  const res: any = await query(sql, ctx._params.id)
  if (!(res && res.length)) throw new ExceptionParameter({ message: Message.unexistNovelNote })
  // 是否为自己发布的笔记
  if (res[0]['create_user'] !== ctx._user.id) throw new ExceptionForbidden({ message: Message.forbidden })
  await next()
}

// 判断target是否合法
// 0 合法 1 type 有问题 2 id 有问题
function _judgeTarget(target: NovelNoteTargetOptions[]) {
  const typeList = ['502', '503', '504', '505', '507']
  let flag = 0
  if (Array.isArray(target) && target.length) {
    for (let i = 0, len = target.length; i < len; i++) {
      if (!target[i].id) {
        flag = 2
        break
      } else if (typeList.indexOf(target[i].type) === -1) {
        flag = 1
        break
      }
    }
  } else flag = 2
  if (flag === 1) {
    throw new ExceptionParameter({ message: `target里的type参数必须为['502', '503', '504', '505', '507']范围` })
  } else if (flag === 2) {
    throw new ExceptionParameter({ message: `target的id参数必传` })
  }
}
