/**
 * @description: 路由相关接口
 * @author chen
 * @update 2021-08-06 16:14:35
*/

import { TerminalType, MethodsType } from '../enums'

// 路由接口
export interface RouteOptions {
  target: any,
  path: string,
  methods: MethodsType[],
  terminals: TerminalType[],
  unless?: boolean,
}

// 请求参数接口
export interface RequestOptions {
  path: string,
  methods: MethodsType[],
  unless?: boolean,
  terminals?: TerminalType[]
}




