
## ---------------- 用户注册  ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 用户注册

#### 请求

- `post`
- `user/register`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| phone | string | 是 | 手机号 |
| password | string | 是 | 密码 |

#### 返回字段说明

- 返回对象或null

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| token | string | token |
| tokenRefresh | string | 刷新token |

#### 返回示例

```
  {
    "code": 200,
    "message": "注册成功",
    "data": {
      "token": "Basic ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBaQ0k2SWpJMVpHSmtabUkxTFdOa01EUXROR1ppWlMwNFpUZzFMV1JoT0dNNU9EbGlNbVl3WWlJc0luQm9iMjVsSWpvaWRHVnpkREV5TXpRMU5qYzRPU0lzSW5SbGNtMXBibUZzSWpvaWNHTWlMQ0oxYzJWeUxXRm5aVzUwSWpvaVVHOXpkRzFoYmxKMWJuUnBiV1V2Tnk0eU5pNDRJaXdpYVdGMElqb3hOakk0TlRZd05EYzNMQ0psZUhBaU9qRTJNamcyTkRZNE56ZDkub0RUVHA4QVZmUWpGb0doSEc4Z1R5aWt5bHJCZTBiREJENTZ3YUQ3aGI0WTo=",
      "tokenRefresh": "Basic ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBaQ0k2SWpJMVpHSmtabUkxTFdOa01EUXROR1ppWlMwNFpUZzFMV1JoT0dNNU9EbGlNbVl3WWlJc0luQm9iMjVsSWpvaWRHVnpkREV5TXpRMU5qYzRPU0lzSW5SbGNtMXBibUZzSWpvaWNHTWlMQ0oxYzJWeUxXRm5aVzUwSWpvaVVHOXpkRzFoYmxKMWJuUnBiV1V2Tnk0eU5pNDRJaXdpYVdGMElqb3hOakk0TlRZd05EYzNMQ0psZUhBaU9qRTJNamt4TmpVeU56ZDkuaDFEZjNiYjZVQTZnWEtYdlAxS181MUdJdFU4TXc1Ujh3TDFBYW50ZTdoMDo="
    },
    "total": 0
  }
```

## ---------------- 用户登录  ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 用户登录

#### 请求

- `post`
- `user/login`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| phone | string | 是 | 手机号 |
| password | string | 是 | 密码 |

#### 返回字段说明

- 返回对象或null

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| token | string | token |
| tokenRefresh | string | 刷新token |

#### 返回示例

```
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "Basic ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBaQ0k2SWpJMVpHSmtabUkxTFdOa01EUXROR1ppWlMwNFpUZzFMV1JoT0dNNU9EbGlNbVl3WWlJc0luQm9iMjVsSWpvaWRHVnpkREV5TXpRMU5qYzRPU0lzSW5SbGNtMXBibUZzSWpvaWNHTWlMQ0oxYzJWeUxXRm5aVzUwSWpvaVVHOXpkRzFoYmxKMWJuUnBiV1V2Tnk0eU5pNDRJaXdpYVdGMElqb3hOakk0TlRZd05EYzNMQ0psZUhBaU9qRTJNamcyTkRZNE56ZDkub0RUVHA4QVZmUWpGb0doSEc4Z1R5aWt5bHJCZTBiREJENTZ3YUQ3aGI0WTo=",
      "tokenRefresh": "Basic ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBaQ0k2SWpJMVpHSmtabUkxTFdOa01EUXROR1ppWlMwNFpUZzFMV1JoT0dNNU9EbGlNbVl3WWlJc0luQm9iMjVsSWpvaWRHVnpkREV5TXpRMU5qYzRPU0lzSW5SbGNtMXBibUZzSWpvaWNHTWlMQ0oxYzJWeUxXRm5aVzUwSWpvaVVHOXpkRzFoYmxKMWJuUnBiV1V2Tnk0eU5pNDRJaXdpYVdGMElqb3hOakk0TlRZd05EYzNMQ0psZUhBaU9qRTJNamt4TmpVeU56ZDkuaDFEZjNiYjZVQTZnWEtYdlAxS181MUdJdFU4TXc1Ujh3TDFBYW50ZTdoMDo="
    },
    "total": 0
  }
```

## ---------------- 修改本用户基本信息  ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 修改本用户基本信息，仅可修改基本信息

#### 请求

- `post get`
- `user/update/base/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| username | string | 否 | 用户名 |
| sex | string | 否 | 性别，使用系统标签200范围 |
| birthday | string | 否 | 生日 |
| avatar | string | 否 | 头像，使用文件信息id |
| professional | string | 否 | 职业 |
| address | string | 否 | 地址 |
| remarks | string | 否 | 备注 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 修改本用户账号  ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 修改本用户账号，即修改手机号，会重新生成双`token`并返回

#### 请求

- `post`
- `user/update/phone/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| phone | string | 是 | 要修改的用户账号 |

#### 返回字段说明

- 返回对象或null

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| token | string | token |
| tokenRefresh | string | 刷新token |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "token": "Basic ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBaQ0k2SWpJMVpHSmtabUkxTFdOa01EUXROR1ppWlMwNFpUZzFMV1JoT0dNNU9EbGlNbVl3WWlJc0luQm9iMjVsSWpvaVlXUnRhVzRpTENKMFpYSnRhVzVoYkNJNkluQmpJaXdpZFhObGNpMWhaMlZ1ZENJNklsQnZjM1J0WVc1U2RXNTBhVzFsTHpjdU1qWXVPQ0lzSW1saGRDSTZNVFl5T1RBNU5UZzJOQ3dpWlhod0lqb3hOakk1TVRneU1qWTBmUS5mV2ExNnJENGxlVzd1VWo0c0VLUVd5bDdHWkxWUDR5ZFhnZEk1VlhSb3o0Og==",
    "tokenRefresh": "Basic ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBaQ0k2SWpJMVpHSmtabUkxTFdOa01EUXROR1ppWlMwNFpUZzFMV1JoT0dNNU9EbGlNbVl3WWlJc0luQm9iMjVsSWpvaVlXUnRhVzRpTENKMFpYSnRhVzVoYkNJNkluQmpJaXdpZFhObGNpMWhaMlZ1ZENJNklsQnZjM1J0WVc1U2RXNTBhVzFsTHpjdU1qWXVPQ0lzSW1saGRDSTZNVFl5T1RBNU5UZzJOQ3dpWlhod0lqb3hOakk1TnpBd05qWTBmUS5OX2lDOFNyZXZtRnJockdla0NBeTRwYjdSRmwzZndqcm1CSHFwQTBpdEhnOg=="
  },
  "total": 0
}
```

## ---------------- 修改本用户密码  ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 修改本用户密码

#### 请求

- `post`
- `user/update/password/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| password | string | 是 | 原密码 |
| newPassword | string | 是 | 新密码 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 修改指定用户基本信息  ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 修改指定用户基本信息，仅可修改基本信息

#### 请求

- `post get`
- `user/update/base`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 用户id |
| username | string | 否 | 用户名 |
| sex | string | 否 | 性别，使用系统标签200范围 |
| birthday | string | 否 | 生日 |
| avatar | string | 否 | 头像，使用文件信息id |
| professional | string | 否 | 职业 |
| address | string | 否 | 地址 |
| remarks | string | 否 | 备注 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取本用户信息  ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取本用户信息，只有用户基本信息，
- 其中用户拥有的所有角色、权限、菜单(树结构)、特殊标签列表信息等需要另外请求

#### 请求

- `post get`
- `user/get/self`

#### 参数
- 无

#### 返回字段说明

- 返回对象或null

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 用户id |
| phone | string | 用户账号（即手机号） |
| username | string | 用户名称 |
| sex | string | 性别标签code |
| sexLabel | string | 性别标签说明 |
| birthday | string | 生日 |
| avatar | object/null | 头像文件对象 |
| professional | string | 职位 |
| address | string | 地址 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f",
    "phone": "15820291405",
    "username": "陈一支",
    "sex": "201",
    "sexLabel": "男",
    "birthday": "2021-08-10 00:00:00",
    "avatar": {
      "id": "7d1b48cb-2b82-49de-953a-83b174b0f40d",
      "filePath": "http://localhost:3030/files/6116b140-f9eb-11eb-957c-5ba7f06be854.png?vt=7woX1Z6i5ndwVhyDTSZ5HQ==&uid=bdSXpWAwve+kayTb5UHBxdbYvCniR19YvOPanH3zpv7HfE7JCa7mW1xwlvtu0RyX",
      "fileName": "avatar.png",
      "fileSize": 6210,
      "suffix": "png",
      "staticPlace": "files",
      "createUser": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f",
      "isSecret": "1",
      "checkValidTime": 3,
      "createTime": "2021-08-10 22:58:10",
      "terminal": "pc",
      "remarks": null
    },
    "professional": "刺客",
    "address": "广州",
    "createTime": "2021-08-09 15:19:54",
    "updateTime": "2021-08-16 10:53:05",
    "terminal": "pc",
    "remarks": "负责改项目的设计、实现、测试、发布"
  },
  "total": 0
}
```

## ---------------- 获取指定用户基本信息  ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定用户基本信息，仅包含用户基本信息

#### 请求

- `post get`
- `user/get/base`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 用户id |

#### 返回字段说明

- 返回对象或null

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 用户id |
| phone | string | 用户账号（即手机号） |
| username | string | 用户名称 |
| sex | string | 性别标签code |
| sexLabel | string | 性别标签说明 |
| birthday | string | 生日 |
| avatar | object/null | 头像文件对象 |
| professional | string | 职位 |
| address | string | 地址 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
    "phone": "admin",
    "username": "超级管理员",
    "sex": "201",
    "birthday": "2000-12-15 00:00:00",
    "avatar": {
      "id": "35f8c435-ee99-4068-9bd9-474dc956b744",
      "filePath": "http://localhost:3030/files/177f0e70-f9bd-11eb-9db1-3da2abba6b57.png?vt=uLzibVgcaBkl1nxwneNM0w==&uid=yZzASIOQWMhsrCNUh4RNctRJbqHLqquhemBZSm+ZkbXkuXUA1kfAc+xECsYNpeYr",
      "fileName": "avatar6.png",
      "fileSize": 28326,
      "suffix": "png",
      "staticPlace": "files",
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "isSecret": "1",
      "checkValidTime": 3,
      "createTime": "2021-08-10 17:26:50",
      "terminal": "pc",
      "remarks": null
    },
    "professional": "打工人",
    "address": "广东",
    "createTime": "2021-08-10 09:54:37",
    "updateTime": "2021-08-16 10:42:28",
    "terminal": "pc",
    "remarks": "超级管理员需配置所有权限和标签"
  },
  "total": 0
}
```

## ---------------- 获取用户列表基本信息  ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取用户列表，仅包含用户基本信息

#### 请求

- `post get`
- `user/get/list`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| keyword | string | 否 | 搜索关键字 |
| simple | string | 否 | '1' 返回数据列表简洁模式 '0' 正常模式 |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |

#### 返回字段说明

- 返回数组或[]
- 排序规则
  `搜索相似度(phone全等搜索 username)降序`
  `updateTime更新时间降序`

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 用户id |
| phone | string | 用户账号（即手机号） |
| username | string | 用户名称 |
| sex | string | 性别标签code |
| sexLabel | string | 性别标签说明 |
| birthday | string | 生日 |
| avatar | object/null | 头像文件对象 |
| professional | string | 职位 |
| address | string | 地址 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f",
      "phone": "15820291405",
      "username": "陈一支",
      "sex": "201",
      "sexLabel": "男",
      "birthday": "2021-08-10 00:00:00",
      "avatar": {
        "id": "7d1b48cb-2b82-49de-953a-83b174b0f40d",
        "filePath": "http://localhost:3030/files/6116b140-f9eb-11eb-957c-5ba7f06be854.png?vt=M/A3N3GVhPMiVkZ1wLiPmQ==&uid=bdSXpWAwve+kayTb5UHBxdbYvCniR19YvOPanH3zpv7HfE7JCa7mW1xwlvtu0RyX",
        "fileName": "avatar.png",
        "fileSize": 6210,
        "suffix": "png",
        "staticPlace": "files",
        "createUser": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f",
        "isSecret": "1",
        "checkValidTime": 3,
        "createTime": "2021-08-10 22:58:10",
        "terminal": "pc",
        "remarks": null
      },
      "professional": "刺客",
      "address": "广州",
      "createTime": "2021-08-09 15:19:54",
      "updateTime": "2021-08-16 10:53:05",
      "terminal": "pc",
      "remarks": "负责改项目的设计、实现、测试、发布"
    },
  ],
  "total": 2
}
```

## ---------------- 更新token  ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 更新`token`，将`tokenRefresh`放在`header`请求头`authorization`上，返回新生成的双`token`

#### 请求

- `post get`
- `user/update/token`

#### 参数
- 将`tokenRefresh`放在`header`请求头`authorization`上即可


#### 返回字段说明

- 返回对象或null

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| token | string | token |
| tokenRefresh | string | 刷新token |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "token": "Basic ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBaQ0k2SWpKaFpHWmxNelU0TFdabU1UZ3ROR0psWlMxaE5HWXhMVFJqTURCbU5XTTJOV0U0WmlJc0luQm9iMjVsSWpvaU1UVTRNakF5T1RFME1EVWlMQ0owWlhKdGFXNWhiQ0k2SW5Caklpd2lkWE5sY2kxaFoyVnVkQ0k2SWxCdmMzUnRZVzVTZFc1MGFXMWxMemN1TWpZdU9DSXNJbWxoZENJNk1UWXlPVEV3Tmpjd01pd2laWGh3SWpveE5qSTVNVGt6TVRBeWZRLmdYcE1tdE1PamV2LWMzdHVyQTBHYUg4MFZFcDBpaXd4SV96QTFGWGVfdmM6",
    "tokenRefresh": "Basic ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBaQ0k2SWpKaFpHWmxNelU0TFdabU1UZ3ROR0psWlMxaE5HWXhMVFJqTURCbU5XTTJOV0U0WmlJc0luQm9iMjVsSWpvaU1UVTRNakF5T1RFME1EVWlMQ0owWlhKdGFXNWhiQ0k2SW5Caklpd2lkWE5sY2kxaFoyVnVkQ0k2SWxCdmMzUnRZVzVTZFc1MGFXMWxMemN1TWpZdU9DSXNJbWxoZENJNk1UWXlPVEV3Tmpjd01pd2laWGh3SWpveE5qSTVOekV4TlRBeWZRLngtMnNhTDN4NWtUSlR3WXA1cEJSMDJNRlFKX0lSQzFhZ2NQd1ExMFVtUkU6"
  },
  "total": 0
}
```

## ---------------- 退出登录  ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 退出登录，会将双`token`权限清除

#### 请求

- `post get`
- `user/exit`

#### 参数
- 无

#### 返回示例

```
{
  "code": 403,
  "message": "令牌已失效，请重新登录",
  "data": null,
  "total": 0
}
```
