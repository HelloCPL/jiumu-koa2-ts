/**
 * @description 问答删除
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";

/**
 * 问答删除
*/
export const doQuestionDelete = async (ctx: Context, next: Next) => {
  const sql: string = `DELETE FROM questions WHERE id = ?`
  await query(sql, ctx._params.id)
  throw new Success();
}
