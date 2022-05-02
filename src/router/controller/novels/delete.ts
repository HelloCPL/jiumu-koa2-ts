/**
 * @description 小说删除
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";

/**
 * 小说删除
*/
export const doNovelDelete = async (ctx: Context, next: Next) => {
  const sql: string = `DELETE FROM novels WHERE id = ?`
  await query(sql, ctx._params.id)
  throw new Success();
}
