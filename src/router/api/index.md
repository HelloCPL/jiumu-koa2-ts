
## ---------------- 接口请求/返回通用说明  ---------------------

#### 关于请求前缀

- BASE_URL + PUBLIC_PATH + path
  - BASE_URL 基础地址
    + 开发环境 `http://localhost:3030/`
    + 测试环境 `http://106.55.153.80/`
    + 生产环境 `http://106.55.153.80/`
  - PUBLIC_PATH 服务器路径
    + 开发环境 ` `
    + 测试环境 `/jiumu-koa2-ts-test`
    + 生产环境 `/jiumu-koa2-ts-prod`

#### 关于请求头

- 非公开接口需要添加 `authorization` 请求头

#### 关于参数

- 对于 `get` 请求，query参数优先（即参数名相同情况下）

- 对于 `post` 请求，body参数优先

#### 关于数据返回格式

- 统一返回对象，格式为 `{message,  total, code,data}`

  + `message: string | array` 提示信息，必填参数未传时为数组，其他情况为字符串

  + `total: number` 数据总数，只有当列表接口时会返回数据总数，否则默认返回 `0`

  + `code: number` 状态码
    - `200` 成功
    - `500` 服务器错误
    - `400` 参数格式错误
    - `404` 未找到
    - `403` 权限不足
    - `401` 授权失败
    - `205` 重新登录
    - `206` `token` 失效需重新刷新
    - `423` 静态资源被锁定，无权限查看/链接已过期
  
  + `data: any` 返回数据

#### 关于数据保密性

- 如果表字段有 `is_secret` 或 `is_draft` 字段，如果 `is_secret=1` 或 `is_draft=1` 时，不管获取指定一个数据或列表，只有本人可获取，数据表包括但不限于 `files_info articles questions sources novels novels_chapter `
