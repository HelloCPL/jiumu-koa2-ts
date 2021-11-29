
## ---------------- 新增资源 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增资源

#### 请求

- `get | post` 
- `source/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| title | string | 是 | 资源标题 |
| attachment | string | 是 | 资源文件id，多个逗号隔开，最多5个 |
| classify | string | 否 | 自定义分类，用户自定义标签id集合，最多3个，分类类型建议用sourceClassify |
| isSecret | string | 否 | 是否为私密资源，1 是 0 否，默认0 |
| isTop | string | 否 | 是否置顶，1 是 0 否，默认0 |
| sort | mediumint | 否 | 排序，值越小越前，默认1 |
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


## ---------------- 新增资源 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增资源

#### 请求

- `get | post` 
- `source/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 资源id |
| title | string | 否 | 资源标题 |
| attachment | string | 否 | 资源文件id，多个逗号隔开，最多5个 |
| classify | string | 否 | 自定义分类，用户自定义标签id集合，最多3个，分类类型建议用sourceClassify |
| isSecret | string | 否 | 是否为私密资源，1 是 0 否 |
| isTop | string | 否 | 是否置顶，1 是 0 否 |
| sort | mediumint | 否 | 排序，值越小越前 |
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

## ---------------- 获取指定的资源 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的资源，如果 `isSecret=1` 仅创建者本人可获取

#### 请求

- `get | post` 
- `source/get/one`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 资源id |

#### 返回字段说明

- 返回对象或null

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 资源id |
| title | string | 标题 |
| attachment | array/[] | 资源文件 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| isSecret | string | 是否为私密资源，1 是 0 否 |
| isTop | string | 是否置顶，1 是 0 否 |
| sort | number | 排序，值越小越前，默认1 |
| createUser | string | 创建者id |
| createUserName | string | 创建者名字 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |
| isLike | string | 是否点赞，1 是 0 否 |
| likeCount | number | 点赞总数 |
| isCollection | string | 是否收藏，1 是 0 否 |
| likeCount | number | 收藏总数 |
| isSelf | string | 是否本人的资源，1 是 0 否 |
| commentCount | number | 收藏总数 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "44a34814-b345-442a-b4ac-597340d80d85",
    "title": "资源标题7",
    "attachment": [
      {
        "id": "df12a740-3ccb-451e-80e9-df21608453f6",
        "filePath": "http://localhost:3030/files/424f8090-f9b7-11eb-ad7b-f9f5bf6514d6.png",
        "fileName": "avatar6.png",
        "fileSize": 28326,
        "suffix": "png",
        "staticPlace": "files",
        "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
        "isSecret": "0",
        "checkValidTime": 3,
        "createTime": "2021-08-10 16:45:05",
        "terminal": "pc",
        "remarks": null
      }
    ],
    "classify": [
      {
        "id": "b2888c02-ffec-4039-8ec3-91ec4a8716d4",
        "label": "前端",
        "sort": 1,
        "type": 'sourceClassify',
        "createTime": "2021-08-18 03:10:58",
        "updateTime": "2021-08-18 03:10:58",
        "terminal": "管理端"
      }
    ],
    "isSecret": "1",
    "isTop": "1",
    "sort": 1,
    "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
    "createUserName": "超级管理员",
    "createTime": "2021-08-20 11:56:31",
    "updateTime": "2021-08-20 14:56:59",
    "terminal": "管理端",
    "remarks": null,
    "isLike": "0",
    "likeCount": 0,
    "isCollection": "0",
    "collectionCount": 0,
    "isSelf": "1",
    "commentCount": 0
  },
  "total": 0
}
```

## ---------------- 获取自己的资源列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取自己的资源列表

#### 请求

- `get | post` 
- `source/get/list/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| isSecret | string | 否 | 是否为私密资源，1 是 0 否 |

#### 返回字段说明

- 返回数组或[]
- 按 `isTop是否置顶、sort降序、likeCount点赞总数升序、collectionCount收藏总数升序、updateTime更新时间升序` 排序

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 资源id |
| title | string | 标题 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| isSecret | string | 是否为私密资源，1 是 0 否 |
| isTop | string | 是否置顶，1 是 0 否 |
| sort | number | 排序，值越小越前，默认1 |
| createUser | string | 创建者id |
| createUserName | string | 创建者名字 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |
| isLike | string | 是否点赞，1 是 0 否 |
| likeCount | number | 点赞总数 |
| isCollection | string | 是否收藏，1 是 0 否 |
| likeCount | number | 收藏总数 |
| isSelf | string | 是否本人的资源，1 是 0 否 |
| commentCount | number | 收藏总数 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "714ca62a-cd26-4504-bcfa-352e12bf8be1",
      "title": "资源标题6",
      "classify": [
        {
          "id": "b2888c02-ffec-4039-8ec3-91ec4a8716d4",
          "label": "前端",
          "sort": 1,
          "type": 'sourceClassify',
          "createTime": "2021-08-18 03:10:58",
          "updateTime": "2021-08-18 03:10:58",
          "terminal": "管理端"
        }
      ],
      "isSecret": "0",
      "isTop": "0",
      "sort": 1,
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createUserName": "超级管理员",
      "createTime": "2021-08-20 11:56:59",
      "updateTime": "2021-08-20 11:56:59",
      "terminal": "管理端",
      "remarks": null,
      "isLike": "0",
      "likeCount": 0,
      "isCollection": "0",
      "collectionCount": 0,
      "isSelf": "1",
      "commentCount": 0
    }
  ],
  "total": 1
}
```

## ---------------- 获取资源列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取资源列表，如果 `isSecret=1` 仅创建者本人可获取

#### 请求

- `get | post` 
- `source/get/list`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| userId | string | 否 | 指定用户id |
| isSecret | string | 否 | 是否为私密资源，1 是 0 否，一般只传 0，其中 1 只对自己发布的资源才有权限查看 |

#### 返回字段说明

- 返回数组或[]
- 按 `isTop是否置顶、sort降序、likeCount点赞总数升序、collectionCount收藏总数升序、updateTime更新时间升序` 排序

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 资源id |
| title | string | 标题 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| isSecret | string | 是否为私密资源，1 是 0 否 |
| isTop | string | 是否置顶，1 是 0 否 |
| sort | number | 排序，值越小越前，默认1 |
| createUser | string | 创建者id |
| createUserName | string | 创建者名字 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |
| isLike | string | 是否点赞，1 是 0 否 |
| likeCount | number | 点赞总数 |
| isCollection | string | 是否收藏，1 是 0 否 |
| likeCount | number | 收藏总数 |
| isSelf | string | 是否本人的资源，1 是 0 否 |
| commentCount | number | 收藏总数 |

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "44a34814-b345-442a-b4ac-597340d80d85",
      "title": "资源标题7",
      "classify": [
        {
          "id": "b2888c02-ffec-4039-8ec3-91ec4a8716d4",
          "label": "前端",
          "sort": 1,
          "type": 'sourceClassify',
          "createTime": "2021-08-18 03:10:58",
          "updateTime": "2021-08-18 03:10:58",
          "terminal": "管理端"
        }
      ],
      "isSecret": "1",
      "isTop": "1",
      "sort": 1,
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createUserName": "超级管理员",
      "createTime": "2021-08-20 11:56:31",
      "updateTime": "2021-08-20 14:56:59",
      "terminal": "管理端",
      "remarks": null,
      "isLike": "0",
      "likeCount": 0,
      "isCollection": "0",
      "collectionCount": 0,
      "isSelf": "1",
      "commentCount": 0
    }
  ],
  "total": 5
}
```
