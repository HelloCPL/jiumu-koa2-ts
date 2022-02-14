
## ---------------- 新增博客文章 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增博客文章

#### 请求

- `get | post` 
- `article/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| title | string | 是 | 博客文章标题 |
| content | string | 是 | 内容 |
| contentType | string | 是 | 内容类型，取系统标签400范围 |
| type | string | 是 | 文章类型，取系统标签300范围 |
| isDraft | string | 是 | 是否草稿，1 是 0 否，默认0 |
| coverImg | string | 否 | 封面图，图片id，只传一个 |
| attachment | string | 否 | 附件，文件id，多个逗号隔开，最多3个 |
| classify | string | 否 | 自定义分类，用户自定义标签id集合，最多3个，分类类型建议用articleClassify |
| isSecret | string | 否 | 是否为私密文章，1 是 0 否，默认0 |
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

## ---------------- 修改博客文章 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 修改博客文章，仅可修改自己发布的博客文章

#### 请求

- `get | post` 
- `article/update`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 博客文章id |
| title | string | 否 | 博客文章标题 |
| content | string | 否 | 内容 |
| contentType | string | 否 | 内容类型，取系统标签400范围 |
| type | string | 否 | 文章类型，取系统标签300范围 |
| isDraft | string | 否 | 是否草稿，1 是 0 否，默认0 |
| coverImg | string | 否 | 封面图，图片id，只传一个 |
| attachment | string | 否 | 附件，文件id，多个逗号隔开，最多3个 |
| classify | string | 否 | 自定义分类，用户自定义标签id集合，最多3个，分类类型建议用articleClassify |
| isSecret | string | 否 | 是否为私密文章，1 是 0 否，默认0 |
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

## ---------------- 删除博客文章 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除博客文章，仅可删除自己发布的博客文章

#### 请求

- `get | post` 
- `article/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 博客文章id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取指定的博客文章 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的博客文章，如果为私密博客文章只有本人可获取

#### 请求

- `get | post` 
- `article/get/one`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 博客文章id |

#### 返回字段说明

- 返回对象或null
- `coverImg` 封面图字段为文件对象或null；`attachment` 附件字段为文件列表数组或[]；`classify` 字段为用户自定义标签列表数组或[]

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 博客文章id |
| title | string | 标题 |
| content | string | 内容 |
| contentType | string | 内容类型标签code |
| contentTypeLabel | string | 内容类型标签说明 |
| coverImg | object/null | 封面图，文件对象/null |
| attachment | array/[] | 附件，文件数组/[] |
| type | string | 文章类型标签code |
| typeLabel | string | 文章类型标签说明 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| isDraft | string | 是否草稿，1 是 0 否 |
| isSecret | string | 是否为私密文章，1 是 0 否 |
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
| collectionCount | number | 收藏总数 |
| isSelf | string | 是否本人的博客文章，1 是 0 否 |
| commentCount | number | 评论总数 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "069a2271-7d71-4379-96d5-0efd28beef90",
    "title": "大标题",
    "content": "多内容",
    "contentType": "402",
    "contentTypeLabel": "Markdown编辑器",
    "coverImg": {
      "id": "19b340ee-c271-4219-98d9-531f16ebc2d0",
      "filePath": "http://localhost:3030/files/01e94470-f9ba-11eb-ab65-0190628cb5e3.png",
      "fileName": "avatar6.png",
      "fileSize": 28326,
      "suffix": "png",
      "staticPlace": "files",
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "isSecret": "0",
      "checkValidTime": 3,
      "createTime": "2021-08-10 17:04:45",
      "terminal": "pc",
      "remarks": null
    },
    "attachment": [
      {
        "id": "19b340ee-c271-4219-98d9-531f16ebc2d0",
        "filePath": "http://localhost:3030/files/01e94470-f9ba-11eb-ab65-0190628cb5e3.png",
        "fileName": "avatar6.png",
        "fileSize": 28326,
        "suffix": "png",
        "staticPlace": "files",
        "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
        "isSecret": "0",
        "checkValidTime": 3,
        "createTime": "2021-08-10 17:04:45",
        "terminal": "pc",
        "remarks": null
      }
    ],
    "type": "301",
    "typeLabel": "原创",
    "classify": [
      {
        "id": "b2888c02-ffec-4039-8ec3-91ec4a8716d4",
        "label": "前端",
        "sort": 1,
        "type": 'articleClassify',
        "createTime": "2021-08-18 03:10:58",
        "updateTime": "2021-08-18 03:10:58",
        "terminal": "管理端"
      }
    ],
    "isDraft": "0",
    "isSecret": "0",
    "isTop": "1",
    "sort": 3,
    "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
    "createUserName": "超级管理员",
    "createTime": "2021-08-19 11:29:26",
    "updateTime": "2021-08-19 11:29:26",
    "terminal": "管理端",
    "remarks": "好备注",
    "isLike": "1",
    "likeCount": 2,
    "isCollection": "1",
    "collectionCount": 2,
    "isSelf": "1",
    "commentCount": 3
  },
  "total": 0
}
```

## ---------------- 获取自己的博客文章列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取自己的博客文章列表
- 只有超级管理员可置顶

#### 请求

- `get | post` 
- `article/get/list/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| type | string | 否 | 文章类型，取系统标签300范围 |
| isDraft | string | 否 | 是否草稿，1 是 0 否 |
| isSecret | string | 否 | 是否为私密文章，1 是 0 否 |

#### 返回字段说明

- 返回数组或[]
- 排序规则
   `搜索相似度(createUserName全等搜索 title)降序`
   `isTop是否置顶`
   `sort升序`
   `likeCount点赞总数降序`
   `collectionCount收藏总数降序`
   `updateTime更新时间降序`
- `coverImg` 封面图字段为文件对象或null；`attachment` 附件字段为文件列表数组或[]；`classify` 字段为用户自定义标签列表数组或[]

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 博客文章id |
| title | string | 标题 |
| coverImg | object/null | 封面图，文件对象/null |
| type | string | 文章类型标签code |
| typeLabel | string | 文章类型标签说明 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| isDraft | string | 是否草稿，1 是 0 否 |
| isSecret | string | 是否为私密文章，1 是 0 否 |
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
| isSelf | string | 是否本人的博客文章，1 是 0 否 |
| commentCount | number | 评论总数 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "5c5c2ee8-d440-472f-adfb-33a98145a260",
      "title": "大标题ceshi",
      "coverImg": {
        "id": "19b340ee-c271-4219-98d9-531f16ebc2d0",
        "filePath": "http://localhost:3030/files/01e94470-f9ba-11eb-ab65-0190628cb5e3.png",
        "fileName": "avatar6.png",
        "fileSize": 28326,
        "suffix": "png",
        "staticPlace": "files",
        "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
        "isSecret": "0",
        "checkValidTime": 3,
        "createTime": "2021-08-10 17:04:45",
        "terminal": "pc",
        "remarks": null
      },
      "type": "301",
      "typeLabel": "原创",
      "classify": [
        {
          "id": "b2888c02-ffec-4039-8ec3-91ec4a8716d4",
          "label": "前端",
          "sort": 1,
          "type": 'articleClassify',
          "createTime": "2021-08-18 03:10:58",
          "updateTime": "2021-08-18 03:10:58",
          "terminal": "管理端"
        }
      ],
      "isDraft": "0",
      "isSecret": "0",
      "isTop": "1",
      "sort": 2,
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createUserName": "超级管理员",
      "createTime": "2021-08-19 11:28:35",
      "updateTime": "2021-08-19 11:34:56",
      "terminal": "管理端",
      "remarks": "备注123123",
      "isLike": "0",
      "likeCount": 0,
      "isCollection": "0",
      "collectionCount": 0,
      "isSelf": "1",
      "commentCount": 0
    }
  ],
  "total": 3
}
```

## ---------------- 获取指定用户非草稿的博客文章列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定用户非草稿的博客文章列表，如果为私密博客文章只可获取本人发布的博客文章
- 只有超级管理员可置顶

#### 请求

- `get | post` 
- `article/get/list/byuserid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| userId | string | 是 | 指定用户id |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| type | string | 否 | 文章类型，取系统标签300范围 |
| isSecret | string | 否 | 是否为私密文章，1 是 0 否，其中 1 只对自己发布的文章才有权限查看 |

#### 返回字段说明

- 返回数组或[]
- 排序规则
   `搜索相似度(createUserName全等搜索 title)降序`
   `isTop是否置顶`
   `sort升序`
   `likeCount点赞总数降序`
   `collectionCount收藏总数降序`
   `updateTime更新时间降序`
- `coverImg` 封面图字段为文件对象或null；`attachment` 附件字段为文件列表数组或[]；`classify` 字段为用户自定义标签列表数组或[]

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 博客文章id |
| title | string | 标题 |
| coverImg | object/null | 封面图，文件对象/null |
| type | string | 文章类型标签code |
| typeLabel | string | 文章类型标签说明 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| isDraft | string | 是否草稿，1 是 0 否 |
| isSecret | string | 是否为私密文章，1 是 0 否 |
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
| isSelf | string | 是否本人的博客文章，1 是 0 否 |
| commentCount | number | 评论总数 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "5c5c2ee8-d440-472f-adfb-33a98145a260",
      "title": "大标题ceshi",
      "coverImg": {
        "id": "19b340ee-c271-4219-98d9-531f16ebc2d0",
        "filePath": "http://localhost:3030/files/01e94470-f9ba-11eb-ab65-0190628cb5e3.png",
        "fileName": "avatar6.png",
        "fileSize": 28326,
        "suffix": "png",
        "staticPlace": "files",
        "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
        "isSecret": "0",
        "checkValidTime": 3,
        "createTime": "2021-08-10 17:04:45",
        "terminal": "pc",
        "remarks": null
      },
      "type": "301",
      "typeLabel": "原创",
      "classify": [
        {
          "id": "b2888c02-ffec-4039-8ec3-91ec4a8716d4",
          "label": "前端",
          "sort": 1,
          "type": 'articleClassify',
          "createTime": "2021-08-18 03:10:58",
          "updateTime": "2021-08-18 03:10:58",
          "terminal": "管理端"
        }
      ],
      "isDraft": "0",
      "isSecret": "0",
      "isTop": "1",
      "sort": 2,
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createUserName": "超级管理员",
      "createTime": "2021-08-19 11:28:35",
      "updateTime": "2021-08-19 11:34:56",
      "terminal": "管理端",
      "remarks": "备注123123",
      "isLike": "0",
      "likeCount": 0,
      "isCollection": "0",
      "collectionCount": 0,
      "isSelf": "1",
      "commentCount": 0
    }
  ],
  "total": 3
}
```

## ---------------- 获取所有非草稿的博客文章列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取所有非草稿的博客文章列表，如果为私密博客文章只可获取本人发布的博客文章
- 只有超级管理员可置顶

#### 请求

- `get | post` 
- `article/get/list`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| type | string | 否 | 文章类型，取系统标签300范围 |
| isSecret | string | 否 | 是否为私密文章，1 是 0 否，其中 1 只对自己发布的文章才有权限查看 |

#### 返回字段说明

- 返回数组或[]
- 排序规则
   `isTop是否置顶`
   `likeCount点赞总数降序`
   `搜索相似度(createUserName全等搜索 title)降序`
   `collectionCount收藏总数降序`
   `updateTime更新时间降序`
   `sort升序`
- `coverImg` 封面图字段为文件对象或null；`attachment` 附件字段为文件列表数组或[]；`classify` 字段为用户自定义标签列表数组或[]

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 博客文章id |
| title | string | 标题 |
| coverImg | object/null | 封面图，文件对象/null |
| type | string | 文章类型标签code |
| typeLabel | string | 文章类型标签说明 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| isDraft | string | 是否草稿，1 是 0 否 |
| isSecret | string | 是否为私密文章，1 是 0 否 |
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
| isSelf | string | 是否本人的博客文章，1 是 0 否 |
| commentCount | number | 评论总数 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "33812e97-4c7f-4ce3-8f1a-588abf4be8df",
      "title": "标题哈哈哈咿呀呀咿呀呀",
      "coverImg": {
        "id": "19b340ee-c271-4219-98d9-531f16ebc2d0",
        "filePath": "http://localhost:3030/files/01e94470-f9ba-11eb-ab65-0190628cb5e3.png",
        "fileName": "avatar6.png",
        "fileSize": 28326,
        "suffix": "png",
        "staticPlace": "files",
        "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
        "isSecret": "0",
        "checkValidTime": 3,
        "createTime": "2021-08-10 17:04:45",
        "terminal": "pc",
        "remarks": null
      },
      "type": "301",
      "typeLabel": "原创",
      "classify": [
        {
          "id": "3b526adf-a90d-405e-9758-6bff1bf01489",
          "label": "java",
          "sort": 1,
          "type": 'articleClassify',
          "createTime": "2021-08-18 03:11:31",
          "updateTime": "2021-08-18 03:11:31",
          "terminal": "管理端"
        }
      ],
      "isDraft": "0",
      "isSecret": "0",
      "isTop": "1",
      "sort": 2,
      "createUser": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f",
      "createUserName": "陈一支",
      "createTime": "2021-08-19 10:48:09",
      "updateTime": "2021-08-19 10:48:09",
      "terminal": "管理端",
      "remarks": "备注123123",
      "isLike": "1",
      "likeCount": 1,
      "isCollection": "1",
      "collectionCount": 1,
      "isSelf": "0",
      "commentCount": 3
    }
  ],
  "total": 8
}
```
