
## ---------------- 上传文件/图片 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 上传一个或多个文件/图片，返回数组对象格式

#### 请求

- `post` 
- `file/add`

#### 参数

- 字段名称 file

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| isSecret | string | 否 | 是否私有文件 默认 0 ，`query` 传参 |
| staticPlace | string | 否 | 文件存放位置 可选 `files images videos editors sources` 默认 `files` ，`query` 传参 |
| remarks | string | 否 | 备注说明 `query` 传参 |

#### 返回字段说明

- 返回数组或[]

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 文件id |
| filePath | string | 文件完整路径 |
| fileName | string | 文件名称 |
| fileSize | number | 文件大小，单位 B |
| suffix | string | 文件后缀 |
| staticPlace | string | 文件存放位置 |
| createUser | string | 创建者 |
| isSecret | string | 是否私密文件，'1' 是 '0' 否 |
| checkValidTime | string | 如果为私密链接查看有效期，单位天 |
| createTime | string | 创建时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "d93b9321-bad4-4605-804c-e284a53c333c",
      "filePath": "http://localhost:3030/files/86c2cb50-fa76-11eb-a739-9f5ab7713dc1.png",
      "fileName": "avatar6.png",
      "fileSize": 28326,
      "suffix": "png",
      "staticPlace": "files",
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "isSecret": "0",
      "checkValidTime": 3,
      "createTime": "2021-08-11 15:34:13",
      "updateTime": "2021-08-11 15:34:13",
      "terminal": "管理端",
      "remarks": null
    }
  ],
  "total": 0
}
```

## ---------------- 删除文件/图片 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除文件/图片，返回数组对象格式
- 注意：只有上传者本人可删除该文件，如果 ids 包含非本人的文件id则不能删除

#### 请求

- `get | post` 
- `file/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| ids | string | 是 | 图片ids，用逗号隔开 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取一个指定文件/图片 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取一个指定文件/图片，返回对象或null
- 注意：如果是私密文件，只有上传者本人可获取该文件，如果是公开文件所有用户均可获取

#### 请求

- `get | post` 
- `file/get/one`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 图片id |
| showUserInfo | string | 否 | 是否增加创建者头像 '1' 是 其他否 默认 '0' |

#### 返回字段说明

- 返回对象或null

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 文件id |
| filePath | string | 文件完整路径 |
| fileName | string | 文件名称 |
| fileSize | number | 文件大小，单位 B |
| suffix | string | 文件后缀 |
| staticPlace | string | 文件存放位置 |
| createUser | string | 创建者 |
| createUserName | string | 创建者名字 |
| isSecret | string | 是否私密文件，'1' 是 '0' 否 |
| checkValidTime | string | 如果为私密链接查看有效期，单位天 |
| createTime | string | 创建时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |


#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "d93b9321-bad4-4605-804c-e284a53c333c",
    "filePath": "http://localhost:3030/files/86c2cb50-fa76-11eb-a739-9f5ab7713dc1.png",
    "fileName": "avatar6.png",
    "fileSize": 28326,
    "suffix": "png",
    "staticPlace": "files",
    "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
    "createUserName": "超级管理员",
    "isSecret": "0",
    "checkValidTime": 3,
    "createTime": "2021-08-11 15:34:13",
    "terminal": "管理端",
    "remarks": null
  },
  "total": 0
}
```

## ---------------- 切片上传 ---------------------
#### 简要描述

- `pc | web | app | wechat` 端
- 切片上传，用于大文件上传，每次只传一个

#### 请求

- `post`
- `file/chunk/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| fileHash | string | 是 | 文件哈希，`body` 传参 |
| chunkIndex | number | 是 | 切片索引，`body` 传参 |

#### 返回字段说明

- 任何结果codo都为200，data返回字段说明
- 200 成功
- 404 资源不存在

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": 200,
  "total": 0
}
```

## ---------------- 切片合并 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 切片合并，用于大文件上传

#### 请求

- `post`
- `file/chunk/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| fileName | string | 是 | 文件哈希 |
| fileHash | string | 是 | 文件哈希 |
| chunkSize | number | 是 | 每段切片大小 大小必须大于零 |
| chunkLength | number | 是 | 切片总长度 长度必须大于零 |
| fileSize | number | 否 | 文件大小  |
| isSecret | string | 否 | 是否私有文件 默认 0  |
| remarks | string | 否 | 备注 |

#### 返回字段说明

- 如果为真，则表明该索引切片未上传，用逗号隔开的字符串，如 '1,13' 请重新上传

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "d93b9321-bad4-4605-804c-e284a53c333c",
    "filePath": "http://localhost:3030/files/86c2cb50-fa76-11eb-a739-9f5ab7713dc1.png",
    "fileName": "avatar6.png",
    "fileSize": 28326,
    "suffix": "png",
    "staticPlace": "files",
    "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
    "createUserName": "超级管理员",
    "isSecret": "0",
    "checkValidTime": 3,
    "createTime": "2021-08-11 15:34:13",
    "terminal": "管理端",
    "remarks": null
  },
  "total": 0
}
```

## ---------------- 校验大文件是否上传 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 校验大文件是否存在

#### 请求

- `get | post`
- `file/chunk/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| fileHash | string | 是 | 文件哈希 |
| fileName | string | 是 | 文件名 |

#### 返回字段说明

- data返回字段说明
- true 资源已存在
- false 资源不存在

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": true,
  "total": 0
}
```