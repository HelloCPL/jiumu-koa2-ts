
import { Context, Next } from "koa"

declare global {

  // 任意类型
  interface ObjectAny {
    [x: string]: any
  }

  // 状态
  type BaseStatus = '0' | '1'

  // 返回SQL表数据基本类型
  interface BaseOptions extends ObjectAny {
    create_time: string
    terminal: string
    update_time?: string
    remarks?: string
  }

  // SQL参数类型
  interface SQLParamsOptions extends ObjectAny {
    sql: string
    data: any
  }

  type Controller = (ctx: Context, next: Next) => any
}

