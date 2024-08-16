/**
 * 本机机器相关
 */
import { Context } from 'koa'
import { isArray, isString } from 'lodash'
import os from 'os'

/**
 * 获取本机ip
 * @returns 返回本机 ip
 */
export const getMyComputerIp = (): string => {
  const network = os.networkInterfaces()
  let ip = '1'
  let flag = false
  Object.keys(network).find((interfaceName) => {
    const interfaces = network[interfaceName] || []
    interfaces.find((interfaceDetail) => {
      // 排除loopback地址和IPv6地址
      if (interfaceDetail.family === 'IPv4' && !interfaceDetail.internal) {
        ip = interfaceDetail.address
        flag = true
      }
      return flag
    })
    return flag
  })
  return ip
}

/**
 * 获取客户端IP
 */
export const getIP = (ctx: Context): string => {
  let ip = ''
  if (ctx.ip) {
    ip = ctx.ip
  } else {
    const forwarded = ctx.req.headers['x-forwarded-for']
    if (isArray(forwarded) && forwarded.length) {
      ip = forwarded[0]
    } else if (isString(forwarded)) {
      ip = forwarded
    } else {
      ip = <string>ctx.req.socket.remoteAddress
    }
  }
  if (ip) {
    ip = ip.replace(/.*:/g, '')
  }
  if (ip === '1') ip = getMyComputerIp()
  return ip
}
