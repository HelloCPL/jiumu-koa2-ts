
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
| attachment | string | 是 | 资源地址；其中701时为内部资源文件id，多个逗号隔开，最多3个 |
| type | string | 是 | 资源类型，取系统标签700 |
| classify | string | 否 | 自定义分类，用户自定义标签id集合，最多3个，分类类型建议用sourceClassify |
| isSecret | string | 否 | 是否为私密资源，1 是 0 否，默认0 |
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


## ---------------- 修改资源 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 修改资源

#### 请求

- `get | post`
- `source/update`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 资源id |
| title | string | 否 | 资源标题 |
| type | string | 否 | 资源类型，取系统标签700 |
| attachment | string | 否 | 资源文件id，多个逗号隔开，最多3个 |
| classify | string | 否 | 自定义分类，用户自定义标签id集合，最多3个，分类类型建议用sourceClassify |
| isSecret | string | 否 | 是否为私密资源，1 是 0 否 |
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

## ---------------- 删除资源 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除资源，仅可删除自己发布的资源

#### 请求

- `get | post`
- `source/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 资源id |

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
| showUserInfo | string | 否 | 是否增加创建者姓名与头像 '1' 是 其他否 默认 '1' |

#### 返回字段说明

- 返回对象或null

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 资源id |
| title | string | 标题 |
| attachment | array/[] | 资源文件 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| isSecret | string | 是否为私密资源，1 是 0 否 |
| isTop | string | 是否置顶，1 是 0 否 |
| sort | number | 排序，值越小越前，默认1 |
| type | string | 资源类型标签code |
| typeLabel | string | 资源类型标签说明 |
| createUser | string | 创建者id |
| createUserName | string | 创建者名字 |
| createUserAvatar | object/null | 创建者头像 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |
| isLike | string | 是否点赞，1 是 0 否 |
| likeCount | number | 点赞总数 |
| isCollection | string | 是否收藏，1 是 0 否 |
| CollectionCount | number | 收藏总数 |
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
    "createUserAvatar": {
      "id": "628aa32f-f270-43e8-921b-15fc9736f486",
      "filePath": "http://localhost:3030/images/e30b56b0-7aaf-11ed-bce7-1fcf06575d20.jpg",
      "fileName": "R-C (2).jpg",
      "fileSize": 20764,
      "suffix": "jpg",
      "staticPlace": "images",
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createUserName": "管理员",
      "isSecret": "0",
      "createTime": "2022-12-13 14:32:16",
      "updateTime": "2022-12-13 14:32:16",
      "terminal": "移动端",
      "remarks": null
    },
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
| highlight | string | 否 | 是否高亮显示搜索关键字 '0' 否 '1' 高亮（需要用v-html渲染） 默认不高亮 |
| type | string | 否 | 资源类型，取系统标签700范围 |
| classify | string | 否 | 自定义文章类型，分类类型建议用sourceClassify，单选 |
| isSecret | string | 否 | 是否为私密资源，1 是 0 否 |
| showUserInfo | string | 否 | 是否增加创建者姓名与头像 '1' 是 其他否 默认 '0' |

#### 返回字段说明

- 返回数组或[]
- 排序规则
    `搜索相似度(createUserName全等搜索 title)降序`
    `sort升序`
    `updateTime更新时间降序`

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 资源id |
| title | string | 标题 |
| attachment | array/[] | 资源文件 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| isSecret | string | 是否为私密资源，1 是 0 否 |
| isTop | string | 是否置顶，1 是 0 否 |
| sort | number | 排序，值越小越前，默认1 |
| type | string | 资源类型标签code |
| typeLabel | string | 资源类型标签说明 |
| createUser | string | 创建者id |
| createUserName | string | 创建者名字 |
| createUserAvatar | object/null | 创建者头像 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |
| isLike | string | 是否点赞，1 是 0 否 |
| likeCount | number | 点赞总数 |
| isCollection | string | 是否收藏，1 是 0 否 |
| CollectionCount | number | 收藏总数 |
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
      "createUserName": "超级管理员",
      "title": "<span data-search-key='search' style='color: #f56c6c'>资源</span>标题6",
      "type": "701",
      "typeLabel": "内部文件/图片id来源",
      "attachment": [
        {
          "id": "82b7e221-f6b6-4b9a-a41a-8d2d93b9c689",
          "filePath": "http://localhost:3030/sources/c67bcdd0-711f-11ec-ba07-331148890c46.png",
          "fileName": "1-吴晓炫.png",
          "fileSize": 306947,
          "suffix": "png",
          "staticPlace": "sources",
          "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
          "createUserName": "超级管理员",
          "isSecret": "0",
          "checkValidTime": 3,
          "createTime": "2022-01-09 15:43:02",
          "updateTime": "2022-01-09 20:08:20",
          "terminal": "管理端",
          "remarks": null
        }
      ],
      "classify": [
        {
          "id": "b2888c02-ffec-4039-8ec3-91ec4a8716d4",
          "label": "前端",
          "sort": 1,
          "type": "classify",
          "createTime": "2021-08-18 03:10:58",
          "updateTime": "2021-08-18 03:10:58",
          "terminal": "管理端"
        }
      ],
      "isSecret": "0",
      "isTop": "0",
      "sort": 1,
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
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
  "total": 5
}
```

## ---------------- 获取指定用户公开的资源列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定用户公开的资源列表

#### 请求

- `get | post`
- `source/get/list/byuserid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| userId | string | 是 | 指定用户id |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| highlight | string | 否 | 是否高亮显示搜索关键字 '0' 否 '1' 高亮（需要用v-html渲染） 默认不高亮 |
| type | string | 否 | 资源类型，取系统标签700范围 |
| classify | string | 否 | 自定义文章类型，分类类型建议用sourceClassify，单选 |
| showUserInfo | string | 否 | 是否增加创建者姓名与头像 '1' 是 其他否 默认 '0' |

#### 返回字段说明

- 返回数组或[]
- 排序规则
    `搜索相似度(createUserName全等搜索 title)降序`
    `sort升序`
    `updateTime更新时间降序`

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 资源id |
| title | string | 标题 |
| attachment | array/[] | 资源文件 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| isSecret | string | 是否为私密资源，1 是 0 否 |
| isTop | string | 是否置顶，1 是 0 否 |
| sort | number | 排序，值越小越前，默认1 |
| type | string | 资源类型标签code |
| typeLabel | string | 资源类型标签说明 |
| createUser | string | 创建者id |
| createUserName | string | 创建者名字 |
| createUserAvatar | object/null | 创建者头像 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |
| isLike | string | 是否点赞，1 是 0 否 |
| likeCount | number | 点赞总数 |
| isCollection | string | 是否收藏，1 是 0 否 |
| CollectionCount | number | 收藏总数 |
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
      "createUserName": "超级管理员",
      "title": "<span data-search-key='search' style='color: #f56c6c'>资源</span>标题6",
      "type": "701",
      "typeLabel": "内部文件/图片id来源",
      "attachment": [
        {
          "id": "82b7e221-f6b6-4b9a-a41a-8d2d93b9c689",
          "filePath": "http://localhost:3030/sources/c67bcdd0-711f-11ec-ba07-331148890c46.png",
          "fileName": "1-吴晓炫.png",
          "fileSize": 306947,
          "suffix": "png",
          "staticPlace": "sources",
          "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
          "createUserName": "超级管理员",
          "isSecret": "0",
          "checkValidTime": 3,
          "createTime": "2022-01-09 15:43:02",
          "updateTime": "2022-01-09 20:08:20",
          "terminal": "管理端",
          "remarks": null
        }
      ],
      "classify": [
        {
          "id": "b2888c02-ffec-4039-8ec3-91ec4a8716d4",
          "label": "前端",
          "sort": 1,
          "type": "classify",
          "createTime": "2021-08-18 03:10:58",
          "updateTime": "2021-08-18 03:10:58",
          "terminal": "管理端"
        }
      ],
      "isSecret": "0",
      "isTop": "0",
      "sort": 1,
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
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
  "total": 5
}
```

## ---------------- 获取所有用户公开的资源列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取所有用户公开的资源列表

#### 请求

- `get | post`
- `source/get/list`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| highlight | string | 否 | 是否高亮显示搜索关键字 '0' 否 '1' 高亮（需要用v-html渲染） 默认不高亮 |
| type | string | 否 | 资源类型，取系统标签700范围 |
| showUserInfo | string | 否 | 是否增加创建者姓名与头像 '1' 是 其他否 默认 '0' |

#### 返回字段说明

- 返回数组或[]
- 排序规则
    `搜索相似度(createUserName全等搜索 title)降序`
    `isTop是否置顶`
    `likeCount点赞总数降序`
    `collectionCount收藏总数降序`
    `updateTime更新时间降序`

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 资源id |
| title | string | 标题 |
| attachment | array/[] | 资源文件 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| isSecret | string | 是否为私密资源，1 是 0 否 |
| isTop | string | 是否置顶，1 是 0 否 |
| sort | number | 排序，值越小越前，默认1 |
| type | string | 资源类型标签code |
| typeLabel | string | 资源类型标签说明 |
| createUser | string | 创建者id |
| createUserName | string | 创建者名字 |
| createUserAvatar | object/null | 创建者头像 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |
| isLike | string | 是否点赞，1 是 0 否 |
| likeCount | number | 点赞总数 |
| isCollection | string | 是否收藏，1 是 0 否 |
| CollectionCount | number | 收藏总数 |
| isSelf | string | 是否本人的资源，1 是 0 否 |
| commentCount | number | 收藏总数 |

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "714ca62a-cd26-4504-bcfa-352e12bf8be1",
      "createUserName": "超级管理员",
      "title": "<span data-search-key='search' style='color: #f56c6c'>资源</span>标题6",
      "type": "701",
      "typeLabel": "内部文件/图片id来源",
      "attachment": [
        {
          "id": "82b7e221-f6b6-4b9a-a41a-8d2d93b9c689",
          "filePath": "http://localhost:3030/sources/c67bcdd0-711f-11ec-ba07-331148890c46.png",
          "fileName": "1-吴晓炫.png",
          "fileSize": 306947,
          "suffix": "png",
          "staticPlace": "sources",
          "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
          "createUserName": "超级管理员",
          "isSecret": "0",
          "checkValidTime": 3,
          "createTime": "2022-01-09 15:43:02",
          "updateTime": "2022-01-09 20:08:20",
          "terminal": "管理端",
          "remarks": null
        }
      ],
      "classify": [
        {
          "id": "b2888c02-ffec-4039-8ec3-91ec4a8716d4",
          "label": "前端",
          "sort": 1,
          "type": "classify",
          "createTime": "2021-08-18 03:10:58",
          "updateTime": "2021-08-18 03:10:58",
          "terminal": "管理端"
        }
      ],
      "isSecret": "0",
      "isTop": "0",
      "sort": 1,
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
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
  "total": 5
}
```
