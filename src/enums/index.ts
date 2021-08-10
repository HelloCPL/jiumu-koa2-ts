/**
 * @description: 枚举
 * @author chen
 * @update 2021-01-20 11:20:09
 * @list 方法集合说明
 *   Message // 返回数据信息提示
 *   Code // 返回数据状态码
 *   ParamsMessage // 必传参数不满足条件时提示文本
*/

/**
 * 返回数据信息提示
*/
export enum Message {
  success = '操作成功',
  error = '服务器发生错误',
  parameter = '参数错误',
  notFound = '资源不存在',
  forbidden = '权限不足',
  authFailed = '授权失败',
  rules = '服务器发生错误，校验规则有误',
  authLogin = '令牌已失效，请重新登录',
  authRefresh = '令牌已过期，请重新刷新',
  locked = '资源受保护，令牌过期或无权限查看',

  register = '注册成功',
  login = '登录成功',

  noToken = '权限不足，令牌不存在',
  errorDevice = '登录设备异常，请重新登录',
  errorLogin = '您的账号已在其他设备登录，如果不是本人操作，请修改密码',
  errorDoing = '操作失败',

  dbSQL = '服务器发生错误：数据库查询语句出错',
  dbConnect = '服务器发生错误：创建数据库连接失败',
  dbExecTrancStart = '服务器发生错误：事务开启失败',
  dbExecTrancPerform = '服务器发生错误：事务执行失败',
  
  userExist = '用户已存在',
  userUnExist = '用户不存在',
  password = '密码错误'
}

/**
 * 返回数据状态码
*/
export enum Code {
  success = 200,
  error = 500,
  parameter = 400,
  notFound = 404,
  forbidden = 403, // 权限不足
  authFailed = 401, // 授权失败
  authLogin = 205, // 重新登录
  authRefresh = 206, // token 失效需重新刷新
  locked = 423, // 静态资源被锁定，用于不返回日志信息
}

/**
 * 必传参数不满足条件时提示文本
 * 这里只列举常用的校验格式提示，更多请参考 validator 校验插件官网
*/
export enum MessageParameter {
  isLength = '参数必传',
  isString = '参数必须为字符串',
  isBoolean = '参数必须为boolean类型',
  isInt = '参数必须为整型',
  isFloat = '参数必须为浮点型',
  isEmail = '参数必须为邮箱格式',
  isBase64 = '参数必须为base64格式',
  isDataURI = '参数必须为DataURI格式', // 即图片经baseXX编码后的字符串
  isURL = '参数必须为URL格式',
  isJWT = '参数必须为JWT token格式',
}







