/**
 * @description 角色获取
 * @author chen
 * @update 2021-08-07 15:15:08
*/


import { Success } from '../../../utils/http-exception'
import { query, execTrans } from "../../../db";
import { Context, Next } from 'koa';

// 获取一级评论列表
export const doCommentGetListType1 = async (ctx: Context, next: Next) => {
  throw new Success();
}

// 获取二级评论列表
export const doCommentGetListType2 = async (ctx: Context, next: Next) => {
  throw new Success();
}
