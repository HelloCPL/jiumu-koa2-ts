## 项目运行

`npm i`

`npm run dev`


### 目录说明

```
  logs -------------------------------- 日志记录集合
  static ------------------------------ 静态资源集合
    files ----------------------------- 文件
    images ---------------------------- 图片
    videos ---------------------------- 视频
    editors --------------------------- 富文本文件

  src
    config ---------------------------- 全局配置文件
    db -------------------------------- MySQL数据库查询
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
      index.ts ------------------------ 自动注册路由接口
      router.ts ----------------------- 路由注册装饰器

    typedts --------------------------- 自定义全局接口或扩展插件模块接口类型
    utils ----------------------------- 常用 js 方法集合
      crypto.ts ----------------------- 加密解密方法
      http-exception.ts --------------- 异常类
      tools.ts ------------------------ 常用 js 工具方法
      validator.ts -------------------- 定义常用校验方法集合
```

### 系统项目设计说明

#### 按系统运行流程说明

  - 实例化 `koa`

  - 处理跨域

  - 处理 `body` 参数

  - 构建全局配置，全局枚举，自定义全局接口或扩展插件模块/命名空间接口类型

  - 构建常用 `js` 方法集合，根据功能在 `utils` 目录下按文件区分

  - 初始化全局变量/常量，直接在 `global` 上挂载变量/常量

  - 全局异常处理，设置常用异常类(`utils/http-exception.ts`) ，全局捕获异常并返回

  - 注册路由，自定义路由注册装饰器(`router/router.ts`) ，构建自动注册路由类
    挂载路由访问共享参数，校验路由访问 `token` 拦截
    在 `router/api` 目录按数据表定义路由
    在 `router/controller` 目录对应路由实现业务

  - 设置静态资源访问，先校验静态资源访问权限，再允许访问

  - 启用 `gizp` 压缩

  - 监听服务

#### 按功能模块和书写规范说明

  - 系统按功能模块创建目录，其中 `index.ts` 为该模块的核心功能入口，`interface.ts` 为该模块自定义接口，其他 `*.ts` 文件一般是该模块的辅助方法

  - 非路由模块
    全局配置
    MySQL/redis数据库查询
    全局枚举
    全局变量/常量
    自定义中间（全局异常捕获，启用压缩，系统日志记录，路由参数挂载，路由权限和静态资源权限拦截）
    自定义全局接口类型
    自定义 js 方法集合

  - 路由模块（核心）
    定义路由前缀类装饰器(`@Prefix`)、路由请求方法装饰器(`@Request`)、校验路由必传参数方法装饰器(`@Required`)、添加路由自定义中间件方法装饰器(`@Convert`)
    构建 `Route` 自动注册路由类，使用静态属性 `__DecoratedRouters` 保存装饰的路由
    在`init` 实例方法中使用 `glob` 插件自动引入 `router/api` 目录下的路由文件，然后遍历 `__DecoratedRouters` 将保存装饰的路由及其中间件方法经过处理后匹配路由
    在 `router/api` 目录按数据表名称构建路由功能模块接口，其中 `index.md` 为该模块 `api` 的使用说明文档
    在 `router/controller` 目录构建对应名称的业务处理模块目录，主要实现业务逻辑处理、数据库查询和数据返回等，其中 `convert.ts` 为该模块的中间件方法集合，一般用于数据校验，其他业务方法细分至每个单独的文件，一般以 `增(add) 删(delete) 查(get) 改(update)` 划分

#### 设计特别说明

  - `附件id` `用户自定义标签id` 不作是否存在校验；`系统标签code` `['1', '0']指定范围` 会作是否存在校验

  - `ctx` 自定义挂载说明
    `ctx.terminal` // 访问终端，所有路由均挂载
    `ctx.data` // 包含不同传参方法的访问参数，所有路由均挂载
    `ctx.params` // 自动根据请求方式获取的访问参数，所有路由均挂载
    `ctx.user` // 根据token解析的用户信息，只有 `unless=false` 被拦截（即带token解析）的路由挂载

  - 如果表字段有 `is_secret` 字段，如果 `is_secret=1`，不管获取指定一个或获取列表，只有本人可获取，包括 `files_info articles questions sources`

<!-- 先写 users-roles users-tags -->
<!-- 再优化 permission roles tags 列表获取 -->
<!-- 再设计 menus roles-menus -->
<!-- 再写 users login-info -->
<!-- 再写 likes collections -->
<!-- 再写 comments-first comments-second -->
再写 权限接口关联的接口请求权限校验
<!-- 再写 articles  -->
questions 
sources

用户管理(`user/get/list`)
    修改(`user/update/base`)
    查看用户详情(`user/get/base`)
    关联特殊标签(`tag/get/byparentcode` `userId parentCode=8888`)
        新增用户-特殊标签关联(`user-tag/add`)
        删除用户-特殊标签关联(`user-tag/delete`)
    关联角色(`role/get/list` `userId`)
        新增用户-角色关联(`user-role/add`)
        删除用户-角色关联(`user-role/delete`)
    查看分配的权限(`role-permission/get/allpermission/byuserid`)
    查看分配的菜单(`role-menu/get/allmenu/byuserid`)
    查看用户登录记录(`login/info/get/list`)
角色管理(`role/get/list`)
    新增(`role/add`)
    修改(`role/update`)
    删除(`role/delete`)
    查看角色详情(`role/get/one`)
    查看分配用户(`user-role/get/alluser/byroleid`)
    关联权限(`permission/get/byparentcode` `roleId`)
        新增角色-权限关联(`role-permission/add`)
        删除角色-权限关联(`role-permission/delete`)
    关联菜单(`menu/get/byparentcode` `roleId`)
        新增角色-菜单关联(`role-menu/add`)
        删除角色-菜单关联(`role-menu/delete`)
菜单管理(`menu/get/byparentcode`)
    新增(`menu/add`)
    修改(`menu/update`)
    删除(`menu/delete`)
    查看菜单详情(`menu/get/one`)
    查看分配角色(`role-menu/get/allrole/bymenuid`)
    查看分配用户(`role-menu/get/alluser/bymenuid`)
权限管理(`permission/get/byparentcode`)
    新增(`permission/add`)
    修改(`permission/update`)
    删除(`permission/delete`)
    查看权限详情(`permission/get/one`)
    查看分配角色(`role-permission/get/allrole/bypermissionid`)
    查看分配用户(`role-permission/get/alluser/bypermissionid`)
标签管理(`tag/get/byparentcode`)
    新增(`tag/add`)
    修改(`tag/update`)
    删除(`tag/delete`)
    查看标签详情(`tag/get/one`)
    查看分配用户(`user-tag/get/alluser/bytagcode`)（仅特殊标签可查看）

    











