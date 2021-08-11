
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
      "terminal": "管理端",
      "remarks": null
    }
  ],
  "total": 0
}
```

## ---------------- 获取文件/图片 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取文件/图片，返回数组对象格式
- 注意：如果是私密文件，只有上传者本人可获取该文件，如果是公开文件所有用户均可获取

#### 请求

- `get | post` 
- `file/get`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| ids | string | 是 | 图片ids，用逗号隔开 |

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
