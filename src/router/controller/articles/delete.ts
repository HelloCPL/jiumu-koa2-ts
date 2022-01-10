/**
 * @description 博客文章删除
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { execTrans } from "../../../db";

/**
 * 博客文章删除
*/
export const doArticleDelete = async (ctx: Context, next: Next) => {
  const sql1: string = `DELETE FROM files_info t1 WHERE (FIND_IN_SET(t1.id, (SELECT t2.cover_img FROM articles t2 WHERE t2.id = ?)) OR FIND_IN_SET(t1.id, (SELECT t3.attachment FROM articles t3 WHERE t3.id = ?))) AND t1.create_user = ?`
  const sql2: string = `DELETE FROM articles WHERE id = ?`
  await execTrans([
    {
      sql: sql1,
      data: [ctx.params.id, ctx.params.id, ctx.user.id],
      noThrow: true
    },
    {
      sql: sql2,
      data: [ctx.params.id]
    }
  ])
  throw new Success();
}
