
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



















