/**
 * @description 博客文章新增
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Terminal } from "../../../enums";
import { formatDate, getUuId } from "../../../utils/tools";
import { validateRange } from '../../../utils/validator'

/**
 * 博客文章新增
*/
export const doArticleAdd = async (ctx: Context, next: Next) => {
  // const isDraft = validateRange({
  //   value: ctx.params.isDraft,
  //   range: ['1', '0'],
  //   noThrow: true,
  //   default: '0'
  // })
  // const isSecret = validateRange({
  //   value: ctx.params.isSecret,
  //   range: ['1', '0'],
  //   noThrow: true,
  //   default: '0'
  // })
  // const isTop = validateRange({
  //   value: ctx.params.isTop,
  //   range: ['1', '0'],
  //   noThrow: true,
  //   default: '0'
  // })
  console.log(123123);
  const data2 = await validateRange([
    { value: ctx.params.isDraft, range: ['1', '0'], default: '0' },
    { value: ctx.params.isSecret, range: ['1', '0'], default: '0' },
    { value: ctx.params.isTop, range: ['1', '0'], default: '0' },
  ], true)
  console.log(data2);

  // const sort: number = ctx.params.sort || 1
  // const currentTime = formatDate(new Date())
  // const params = ctx.params
  // const sql: string = `INSERT articles (id, title, content, content_type, cover_img, attachment, type, classify, is_draft, is_secret, is_top, sort, create_user, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  // const data = [getUuId(), params.title, params.content, params.contentType, params.coverImg, params.attachment, params.type, params.classify, isDraft, isSecret, isTop, sort, currentTime, currentTime, Terminal[ctx.terminal], params.remarks]
  // await query(sql, data)
  throw new Success();
}
