/**
 * @description: 枚举
 * @author chen
 * @update 2021-01-20 11:20:09
 * @list 枚举集合说明
 *   Message // 返回数据信息提示
 *   Code // 返回数据状态码
 *   ParamsMessage // 必传参数不满足条件时提示文本
 *   Terminal // 终端类型
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
  forbiddenApi = '权限不足：用户没有此接口的请求权限',
  authFailed = '授权失败',
  rules = '服务器发生错误，校验规则有误',
  authLogin = '令牌已失效，请重新登录',
  authRefresh = '令牌已过期，请重新刷新',

  lockedAuth = '资源受保护，无权限查看',
  lockedTime = '资源受保护，链接已过期',

  register = '注册成功',
  login = '登录成功',
  exit = '退出成功',

  noToken = '权限不足，令牌不存在',
  errorDevice = '登录设备异常，请重新登录',
  errorLogin = '您的账号已在其他设备登录，如果不是本人操作，请修改密码',
  errorDoing = '操作失败',
  errorPassword = '密码错误',
  errorType = '类型错误',

  dbSQL = '服务器发生错误：数据库查询语句出错',
  dbConnect = '服务器发生错误：创建数据库连接失败',
  dbExecTrancStart = '服务器发生错误：事务开启失败',
  dbExecTrancPerform = '服务器发生错误：事务执行失败',

  existFile = '文件已存在',
  unexistFile = '文件不存在',
  existUser = '用户账号已存在',
  unexistUser = '用户账号不存在',
  existTag = '标签标识已存在',
  unexistTag = '标签标识不存在',
  existPermission = '权限标识已存在',
  unexistPermission = '权限标识不存在',
  existRole = '角色标识已存在',
  unexistRole = '角色标识不存在',
  existMenus = '菜单标识已存在',
  unexistMenus = '菜单标识不存在',
  existRolePermission = '角色-权限关联标识已存在',
  unexistRolePermission = '角色-权限关联标识不存在',
  existRoleMenu = '角色-菜单关联标识已存在',
  unexistRoleMenu = '角色-菜单关联标识不存在',
  existUserPermission = '用户-权限关联标识已存在',
  unexistUserPermission = '用户-权限关联标识不存在',
  existUserRole = '用户-角色关联标识已存在',
  unexistUserRole = '用户-角色关联标识不存在',
  existUserTag = '用户-特殊标签关联标识已存在',
  unexistUserTag = '用户-特殊标签关联标识不存在',
  existLike = '你已点赞，无须重复点赞',
  unexistLike = '你未点赞，无须取消',
  existCollection = '你已收藏，无须重复收藏',
  unexistCollection = '你未收藏，无须取消',
  unexistComment = '评论不存在',
  unexistArticle = '文章不存在',
  unexistQuestion = '问答不存在',
  unexistSource = '资源不存在',
  unexistNovel = '连续载体不存在',
  unexistNovelChapter = '章节不存在',
  existNovelChapterSort = '章节序号已存在，请使用其他序号',
  unexistNovelNote = '笔记不存在',
  unexistNovelNoteLink = '笔记关联标识不存在',

  relevantHasChildren = '有子级关联，请解除子级关联后再操作',
  relevantNoParent = '父级未关联，请关联父级后再操作',
  relevantRolePermission = '角色-权限有关联，请解除关联后再操作',
  relevantUserRole = '用户-角色有关联，请解除关联后再操作',
  relevantUserTag = '用户-标签有关联，请解除关联后再操作',
  relevantRoleMenu = '角色-菜单有关联，请解除关联后再操作'
}

export type MessageType = keyof typeof Message

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
  locked = 423 // 静态资源被锁定，用于不返回日志信息
}

export type CodeValue = 200 | 500 | 400 | 404 | 403 | 401 | 205 | 206 | 423
export type CodeType = keyof typeof Code

/**
 * 必传参数不满足条件时提示文本
 * 这里只列举常用的校验格式提示，更多请参考 validator 校验插件官网
 */
export enum MessageParameter {
  isLength = '参数必传',
  isBoolean = '参数必须为boolean类型',
  isInt = '参数必须为整型',
  isFloat = '参数必须为浮点型',
  isEmail = '参数必须为邮箱格式',
  isBase64 = '参数必须为base64格式',
  isDataURI = '参数必须为DataURI格式', // 即图片经baseXX编码后的字符串
  isURL = '参数必须为URL格式',
  isJWT = '参数必须为JWT token格式'
}

export type MessageParameterType = keyof typeof MessageParameter

// 终端类型枚举
export enum Terminal {
  'pc' = '管理端',
  'web' = '桌面端',
  'app' = '移动端',
  'wechat' = '小程序'
}

export type TerminalType = keyof typeof Terminal

// 可请求类型枚举
export enum Methods {
  'get' = 'get',
  'post' = 'post',
  'put' = 'put',
  'delete' = 'delete'
}

export type MethodsType = keyof typeof Methods
