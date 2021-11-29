/**
 * @description: 设置异常类
 * @author chen
 * @update 2021-01-20 10:24:21
 * @list 异常类说明
 *   ExceptionHttp // 服务器异常
 *   ExceptionParameter // 参数异常
 *   ExceptionNotFound // 资源不存在异常
 *   ExceptionForbidden // 权限不足异常
 *   ExceptionAuthFailed // 授权失败异常
 *   Success // 特殊异常 成功类异常用于返回数据
*/

import { toCamelCase } from '../utils/tools'
import { Message, Code } from '../enums'

// 异常类接口类型
export interface ExceptionOptions {
  message?: string,
  data?: any,
  code?: number,
  total?: number
}

// 服务器异常
export class ExceptionHttp extends Error {
  message: string
  data: any
  code: number
  total: number
  constructor(config: ExceptionOptions = {}) {
    super()
    this.message = config.message || Message.error
    this.data = this.formatData(config.data)
    this.code = config.code || Code.error
    this.total = config.total || 0
  }

  // 格式化返回数据 若为对象，属性名统一转成驼峰命名
  protected formatDataKey() {
    this.data = toCamelCase(this.data)
  }

  // 处理返回数据格式
  protected formatData(data: any) {
    if (data || data === 0 || data === false)
      return data
    return null
  }
}

// 参数异常
export class ExceptionParameter extends ExceptionHttp {
  constructor(config: ExceptionOptions = {}) {
    super()
    this.message = config.message || Message.parameter
    this.data = this.formatData(config.data)
    this.code = config.code || Code.parameter
    this.total = config.total || 0
    this.formatDataKey()
  }
}

// 资源不存在异常
export class ExceptionNotFound extends ExceptionHttp {
  constructor(config: ExceptionOptions = {}) {
    super()
    this.message = config.message || Message.notFound
    this.data = this.formatData(config.data)
    this.code = config.code || Code.notFound
    this.total = config.total || 0
    this.formatDataKey()
  }
}

// 权限不足异常
export class ExceptionForbidden extends ExceptionHttp {
  constructor(config: ExceptionOptions = {}) {
    super()
    this.message = config.message || Message.forbidden
    this.data = this.formatData(config.data)
    this.code = config.code || Code.forbidden
    this.total = config.total || 0
    this.formatDataKey()
  }
}

// 授权失败异常
export class ExceptionAuthFailed extends ExceptionHttp {
  constructor(config: ExceptionOptions = {}) {
    super()
    this.message = config.message || Message.authFailed
    this.data = this.formatData(config.data)
    this.code = config.code || Code.authFailed
    this.total = config.total || 0
    this.formatDataKey()
  }
}

// 特殊异常 成功类异常用于返回数据
export class Success extends ExceptionHttp {
  constructor(config: ExceptionOptions = {}) {
    super()
    this.message = config.message || Message.success
    this.data = this.formatData(config.data)
    this.code = config.code || Code.success
    this.total = config.total || 0
    this.formatDataKey()
  }
}
