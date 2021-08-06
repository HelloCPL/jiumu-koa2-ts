## 项目运行

`npm i`

`npm run dev`


### 目录说明

```
  app.ts  ------------------------------ 项目入口
  static  ------------------------------ 静态资源集合
  logs  -------------------------------- 日志记录集合
  src
    apis  ------------------------------ 接口路由集合目录，主要书写路由集合，**以 wechat结尾的文件仅用于小程序，其他可用于多个端**
    config 
      index.ts  ------------------------ 配置文件
      logs.ts  ------------------------- 日志配置文件
    controller  ------------------------ 业务书写集合目录（注：apis目录声明路由，具体实现方法在controller目录书写）
    db/index.ts  ----------------------- 查询数据库方法集合
    global  ---------------------------- 全局方法集合
      enums.ts  ------------------------ 全局枚举声明
      http-exception.ts  --------------- 设置常用异常类
      index.ts  ------------------------ 挂载全局变量 global 出口
      logs.ts  ------------------------- 日志方法集合
      tools.ts  ------------------------ 常用方法集合
    lib  ------------------------------- 引用包目录
    middlewares
      exception/index.ts  -------------- 全局异常处理
      redis/index.ts  ------------------ 连接 redis
      router
        index.ts  ---------------------- 路由注册装饰器
        Route.ts  ---------------------- 路由自动注册
      token-auth/index.ts  ------------- token 权限拦截
    typedts  --------------------------- 全局变量 global 和 安装包的声明
      custom.d.ts  --------------------- 自定义接口，用于全局范围
      global.d.ts  --------------------- 全局变量 global 挂载新属性声明
      koa-redis.d.ts  ------------------ 追加 redis 声明
      koa.d.ts  ------------------------ koa 追加 Context 上下文新属性声明
    utils  ----------------------------- 常用方法（全局方法集合放 global 目录）
      crypto.ts  ----------------------- crypto-js 密码加密解密方法
      find-members.ts  ----------------- 自定义查找成员方法
      validator.ts  -------------------- 定义常用校验方法集合
```

















