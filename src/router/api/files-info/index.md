
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
| staticPlace | string | 否 | 文件存放位置 可选 `files images videos editors` 默认 `files` ，`query` 传参 |
| remarks | string | 否 | 备注说明 `query` 传参 |

#### 返回字段说明

- 返回数组或[]

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 文件id |
| filePath | string | 文件完整路径 |
| fileName | string | 文件名称 |
| fileSize | number | 文件大小，单位 B |
| suffix | string | 文件后缀 |
| staticPlace | string | 文件存放位置 |
| createUser | string | 创建者 |
| isSecret | string | 是否私密文件，1 是 0 否 |
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

#### 返回字段说明

- 返回对象或null

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 文件id |
| filePath | string | 文件完整路径 |
| fileName | string | 文件名称 |
| fileSize | number | 文件大小，单位 B |
| suffix | string | 文件后缀 |
| staticPlace | string | 文件存放位置 |
| createUser | string | 创建者 |
| isSecret | string | 是否私密文件，1 是 0 否 |
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
    "isSecret": "0",
    "checkValidTime": 3,
    "createTime": "2021-08-11 15:34:13",
    "terminal": "管理端",
    "remarks": null
  },
  "total": 0
}
```

<!-- ## ---------------- 废弃 获取本用户的所有文件/图片列表 返回数组或[] ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定本用户的所有文件/图片列表 返回数组或[]

#### 请求

- `get | post` 
- `file/get/list/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页页数，默认10 |
| suffix | string | 否 | 指定后缀类型，多个用逗号隔开 如 'png,docx' |

#### 返回字段说明

- 返回数组或[]

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 文件id |
| filePath | string | 文件完整路径 |
| fileName | string | 文件名称 |
| fileSize | number | 文件大小，单位 B |
| suffix | string | 文件后缀 |
| staticPlace | string | 文件存放位置 |
| createUser | string | 创建者 |
| isSecret | string | 是否私密文件，1 是 0 否 |
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
      "id": "012d28c4-959c-4874-bb03-474d66d0792a",
      "filePath": "http://localhost:3030/files/afad2f70-fa5c-11eb-ab7b-db29bdd8c894.png",
      "fileName": "avatar6.png",
      "fileSize": 28326,
      "suffix": "png",
      "staticPlace": "files",
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "isSecret": "0",
      "checkValidTime": 3,
      "createTime": "2021-08-11 12:29:15",
      "terminal": "管理端",
      "remarks": null
    }
  ],
  "total": 9
}
``` -->

<!-- 由于保密性废弃
## ---------------- 获取指定用户的所有文件/图片列表 返回数组或[] ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定用户的所有文件/图片列表，返回数组或[]

#### 请求

- `get | post` 
- `file/get/list/byuserid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| userId | string | 是 | 用户id |
| pageNo | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页页数，默认10 |
| suffix | string | 否 | 指定后缀类型，多个用逗号隔开 如 'png,docx' |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "012d28c4-959c-4874-bb03-474d66d0792a",
      "filePath": "http://localhost:3030/files/afad2f70-fa5c-11eb-ab7b-db29bdd8c894.png",
      "fileName": "avatar6.png",
      "fileSize": 28326,
      "suffix": "png",
      "staticPlace": "files",
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "isSecret": "0",
      "checkValidTime": 3,
      "createTime": "2021-08-11 12:29:15",
      "terminal": "管理端",
      "remarks": null
    }
  ],
  "total": 9
}
```
 -->
