## 项目运行

`npm i`

`npm run dev` 可根据需要运行不同环境 `dev test start`


### 目录说明

```
  ../jiumu-koa2-ts-logs --------------- 日志记录存放目录（放在项目外层，具体地址可配置且自动创建）
  ../jiumu-koa2-ts-static ------------- 静态资源存放目录（放在项目外层，具体地址可配置且自动创建）
    files ----------------------------- 文件
    images ---------------------------- 图片
    videos ---------------------------- 视频
    editors --------------------------- 富文本文件

  src
    config ---------------------------- 全局配置文件
    db -------------------------------- 数据库查询
      index.ts ------------------------ mysql数据库查询
      redis.ts ------------------------ redis数据库查询

    enums ----------------------------- 全局枚举
    global ---------------------------- 全局变量/常量
    lib ------------------------------- 引用（外部插件或自定义中间件）
      catch-error --------------------- 全局异常捕获中间件
      compress ------------------------ 启用压缩中间件
      lin-validator ------------------- 参数校验插件
      logger -------------------------- 系统日志记录中间件
      mount-parameter ----------------- 路由共享参数中间件
      verify-auth --------------------- 路由和静态资源权限拦截

    router ---------------------------- 接口集合
      api ----------------------------- 定义接口集合
      controller ---------------------- 实现接口业务集合
      index.ts ------------------------ 自动注册路由
      router.ts ----------------------- 路由注册装饰器
    
    test ------------------------------ 非项目代码或资料
    typedts --------------------------- 自定义全局接口或扩展插件模块接口类型
    utils ----------------------------- 常用 js 方法集合
      crypto.ts ----------------------- 加密解密方法
      dir-exits.ts -------------------- 判断所给目录是否存在方法
      handle-sql.ts ------------------- mysql查询辅助方法集合
      http-exception.ts --------------- 异常类
      tools.ts ------------------------ 常用 js 工具方法
      validator.ts -------------------- 定义常用校验方法集合
      xss.ts -------------------------- xss过滤

    app.ts ---------------------------- 项目入口
```

### 系统项目设计说明

#### 按系统运行流程说明

  - 实例化 `koa`

  - 处理跨域

  - 处理 `body` 参数和设置文件上传大小限制

  - 构建项目功能模块
      全局配置 `config`
      创建数据库查询连接 `db`
      全局枚举 `enums`
      全局变量/常量 `global`
      构建自定义中间件或插件 `lib`
      自定义全局接口或扩展插件模块/命名空间接口类型 `typedts`
      构建常用 `js` 方法集合，根据功能在 `utils` 目录下按文件区分

  - 初始化全局变量/常量

  - 全局异常处理，设置常用异常类(`utils/http-exception.ts`) ，全局捕获异常并返回

  - 自动注册路由
      构建自动注册路由类 `router/index.ts`)
      挂载原始请求参数数据到 `ctx._data 包含 {body query path header}`
      挂载 `query body` 参数到 `ctx._params` 并进行 `xss` 处理
      对非公开路由接口进行 `token` 校验拦截
      对非公开路由接口进行用户请求权限校验拦截（可配置是否校验）
      自定义路由注册装饰器(`router/router.ts`) 
      特别说明：
        在 `router/api` 目录按数据表定义路由接口
        在 `router/controller` 目录对应路由实现业务

  - 设置静态资源访问，先校验静态资源访问权限，再允许访问

  - 启用 `gizp` 压缩

  - 开启监听服务

#### 按功能模块或书写规范说明

  - 系统按功能模块创建目录，其中 `index.ts` 为该模块的核心功能入口，`interface.ts` 为该模块自定义接口，其他 `*.ts` 文件一般是该模块的辅助方法

  - 非路由模块
    全局配置
    MySQL/redis数据库查询
    全局枚举
    全局变量/常量
    自定义中间件或插件（全局异常捕获，启用压缩，参数类型校验插件，系统日志记录，路由参数挂载，路由权限和静态资源权限校验拦截）
    自定义全局接口类型
    自定义 js 方法集合

  - 路由模块（核心）
    定义路由前缀类装饰器(`@Prefix`)、路由请求方法装饰器(`@Request`)、校验路由必传参数及类型方法装饰器(`@Required`)、添加路由自定义中间件方法装饰器(`@Convert`)
    构建 `Route` 自动注册路由类，使用静态属性 `__DecoratedRouters` 保存装饰的路由
    在 `init` 实例方法中使用 `glob` 插件自动引入 `router/api` 目录下的路由文件，然后遍历 `__DecoratedRouters`，先收集公开路由集合，再挂载自定义中间件，最后经处理后注册路由
      在 `router/api` 目录按数据表名称构建路由功能模块接口，其中 `index.md` 为该模块 `api` 的使用说明文档
      在 `router/controller` 目录构建对应名称的业务处理模块目录，主要实现业务逻辑处理、数据库查询和数据返回等，其中 `convert.ts` 为该模块的中间件方法集合，一般用于数据校验，其他业务方法细分至每个单独的文件，一般以 `增(add) 删(delete) 查(get) 改(update)` 划分

### 其他设计说明

  - `ctx` 上下文自定义挂载说明，数据仅对一次请求有效
      `ctx._terminal` // 访问终端，所有路由均挂载
      `ctx._data` // 原始访问参数（包含 `{body query path header}`），所有路由均挂载
      `ctx._params` // 处理后的访问参数（仅包含 `{query body}`，其中相同参数名称下 `get` 请求优先使用 `query` 参数、 `post` 请求优先使用 `body` 参数），所有路由均挂载
      `ctx._user` // 根据token解析的用户信息，只有非公开路由接口（即`unless=false`）会挂载

  - `global` 自定义全局变量说明，数据自项目启动后一直有效
      `global._unlessPath` // 不校验路由集合
      `global._requestCount` // 记录第几次请求
      `global._requestStart` // 记录请求开始时间
      `global._requestEnd` // 记录请求结束时间
      `global._results` // 缓存结果，一般用于缓存mysql查询，避免重复查询，每次新请求会重置

  - 路由接口参数说明
      `附件id` `用户自定义标签id` 参数不作是否存在校验
      `系统标签code` `['1', '0']等指定范围` 参数会作是否存在校验
      其他参数类型看 `api/**/index.md` 说明即可
