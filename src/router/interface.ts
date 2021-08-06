/**
 * @description: 路由相关接口
 * @author chen
 * @update 2021-08-06 16:14:35
*/

export interface RouteOptions {
  target: any,
  method: string,
  path: string,
  unless?: boolean,
  terminals: string[]
}