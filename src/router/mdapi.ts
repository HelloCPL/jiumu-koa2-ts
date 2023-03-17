/**
 * @description md API 文档接口
 * @author cpl
 * @create 2023-03-17 10:10:34
 */

import Koa from 'koa'
import koaMount from 'koa-mount'
import path from 'path'
import { IS_SHOW_MDAPI } from '@/config'
import Static from 'koa-static'

export const useMDAPI = (app: Koa) => {
  if (IS_SHOW_MDAPI) {
    const p = path.resolve(__dirname, '../../src/router/api')
    app.use(koaMount('/pc/mdapi', Static(p)))
  }
}
