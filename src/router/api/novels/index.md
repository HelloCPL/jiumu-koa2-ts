
## ---------------- 新增连载 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增连载

#### 请求

- `get | post`
- `novel/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| name | string | 是 | 连载名称 |
| introduce | string | 是 | 简介 |
| author | string | 是 | 作者名称 |
| isDraft | string | 是 | 是否为草稿，'1' 是 '0' 否，默认 '0' |
| type | string | 是 | 连载分类，使用系统标签600范围 |
| classify | string | 否 | 自定义分类，用户自定义标签id集合，最多3个，分类类型建议用novelClassify |
| sort | mediumint | 否 | 自己列表排序，值越小越前，默认1 |
| isSecret | string | 否 | 是否为私密连载，'1' 是 '0' 否，默认 '0' |
| remarks | string | 否 | 备注 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": "9e232a68-d0db-45bd-8ba7-e29cc1b70921",
  "total": 0
}
```

## ---------------- 编辑连载 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 编辑连载，仅本人可编辑

#### 请求

- `get | post`
- `novel/update`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 连载id |
| name | string | 否 | 连载名称 |
| introduce | string | 否 | 简介 |
| author | string | 否 | 作者名称 |
| isDraft | string | 否 | 是否为草稿，'1' 是 '0' 否，默认 '0' |
| classify | string | 否 | 自定义分类，用户自定义标签id集合，最多3个，分类类型建议用novelClassify |
| type | string | 否 | 连载分类，使用系统标签600范围 |
| sort | mediumint | 否 | 自己列表排序，值越小越前，默认1 |
| isSecret | string | 否 | 是否为私密连载，'1' 是 '0' 否，默认 '0' |
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

## ---------------- 删除连载 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除连载，仅本人且没有连载章节时可删除

#### 请求

- `get | post`
- `novel/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 连载id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取指定的连载 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的连载，如果为私密或草稿连载只有本人可获取

#### 请求

- `get | post`
- `novel/get/one`
- 公开

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 连载id |
| showUserInfo | string | 否 | 是否增加创建者姓名与头像 '1' 是 其他否 默认 '1' |

#### 返回字段说明

- 返回对象或null

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 连载id |
| name | string | 连载名称 |
| introduce | string | 简介 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| type | string | 连载类型标签code |
| typeLabel | string | 连载类型标签说明 |
| author | string | 作者名称 |
| isTop | string | 是否为私密连载，'1' 是 '0' 否 |
| isSecret | string | 是否为私密连载，'1' 是 '0' 否 |
| isDraft | string | 是否草稿，'1' 是 '0' 否 |
| sort | number | 排序，值越小越前，默认1 |
| createUser | string | 创建者id |
| createUserName | string | 创建者名字 |
| createUserAvatar | object/null | 创建者头像 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间，查询详情时为所有章节的最新更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |
| isLike | string | 是否点赞，'1' 是 '0' 否 |
| likeCount | number | 点赞总数 |
| chapterLikeCount | number | 该连载下所有章节的点赞总数 |
| isCollection | string | 是否收藏，'1' 是 '0' 否 |
| collectionCount | number | 收藏总数 |
| chapterCollectionCount | number | 该连载下所有章节的收藏总数 |
| isSelf | string | 是否本人的连载，'1' 是 '0' 否 |
| commentCount | number | 评论总数 |
| chapterCommentCount | number | 该连载下所有章节的评论总数 |
| chapterCount | number | 章节总数 非草稿、非私密、或私密且为本人的章节 |
| wordCount | number | 所有章节总字数，仅查询详情有该字段 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "9e232a68-d0db-45bd-8ba7-e29cc1b70921",
    "name": "连续载体1",
    "introduce": "连续载体简介1",
    "classify": [
      {
        "id": "d2ce20ca-98e5-4833-afa6-8c636d3f1973",
        "label": "美术",
        "sort": 1,
        "type": null,
        "createTime": "2021-08-18 03:12:22",
        "updateTime": "2021-08-18 03:12:22",
        "terminal": "管理端",
        "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
        "createUserName": "超级管理员"
      }
    ],
    "type": "601",
    "typeLabel": "灵幻",
    "author": "张三",
    "isTop": "0",
    "isSecret": "1",
    "isDraft": "0",
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
      "isSecret": "0",
      "createTime": "2022-12-13 14:32:16",
      "updateTime": "2022-12-13 14:32:16",
      "terminal": "移动端",
      "remarks": null
    },
    "createTime": "2022-02-18 09:45:08",
    "updateTime": "2022-02-18 09:50:46",
    "terminal": "管理端",
    "remarks": "备注",
    "isLike": "0",
    "likeCount": 0,
    "chapterLikeCount": 2,
    "isCollection": "0",
    "collectionCount": 0,
    "chapterCollectionCount": 1,
    "chapterCount": 6,
    "isSelf": "1",
    "commentCount": 0,
    "chaptercommentCount": 2
  },
  "total": 0
}
```

## ---------------- 获取自己的连载列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取自己的连载列表

#### 请求

- `get | post`
- `novel/get/list/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| highlight | string | 否 | 是否高亮显示搜索关键字 '0' 否 '1' 高亮（需要用v-html渲染） 默认不高亮 |
| type | string | 否 | 连载类型，取系统标签300范围 |
| classify | string | 否 | 自定义文章类型，分类类型建议用novelClassify，单选 |
| isDraft | string | 否 | 是否草稿，'1' 是 '0' 否 |
| isSecret | string | 否 | 是否为私密连载，'1' 是 '0' 否 |
| showUserInfo | string | 否 | 是否增加创建者姓名与头像 '1' 是 其他否 默认 '0' |

#### 返回字段说明

- 返回数组或[]
- 排序规则
    `搜索相似度(连载名称 作者全等 简介 createUserName全等搜索)降序`
    `sort升序`
    `updateTime更新时间降序`
- `classify` 字段为用户自定义标签列表数组或[]

- 返回数组或[]，具体字段看上一个接口字段说明

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "9e232a68-d0db-45bd-8ba7-e29cc1b70921",
      "name": "连续载体1",
      "introduce": "连续载体简介1",
      "classify": [
        {
          "id": "d2ce20ca-98e5-4833-afa6-8c636d3f1973",
          "label": "美术",
          "sort": 1,
          "type": null,
          "createTime": "2021-08-18 03:12:22",
          "updateTime": "2021-08-18 03:12:22",
          "terminal": "管理端",
          "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
          "createUserName": "超级管理员"
        }
      ],
      "type": "601",
      "typeLabel": "灵幻",
      "author": "张三",
      "isTop": "0",
      "isSecret": "1",
      "isDraft": "0",
      "sort": 1,
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createUserName": "超级管理员",
      "createTime": "2022-02-18 09:45:08",
      "updateTime": "2022-02-18 09:50:46",
      "terminal": "管理端",
      "remarks": "备注",
      "isLike": "0",
      "likeCount": 0,
      "chapterLikeCount": 2,
      "isCollection": "0",
      "collectionCount": 0,
      "chapterCollectionCount": 1,
      "chapterCount": 6,
      "isSelf": "1",
      "commentCount": 0,
      "chaptercommentCount": 2
    }
  ],
  "total": 3
}
```

## ---------------- 获取指定用户的非草稿且公开连载列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定用户的非草稿且公开连载列表
- 只有超级管理员可置顶

#### 请求

- `get | post`
- `novel/get/list/byuserid`
- 公开

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| userId | string | 是 | 用户ID |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| highlight | string | 否 | 是否高亮显示搜索关键字 '0' 否 '1' 高亮（需要用v-html渲染） 默认不高亮 |
| type | string | 否 | 连载类型，取系统标签300范围 |
| classify | string | 否 | 自定义文章类型，分类类型建议用novelClassify，单选 |
| showUserInfo | string | 否 | 是否增加创建者姓名与头像 '1' 是 其他否 默认 '0' |

#### 返回字段说明

- 返回数组或[]
- 排序规则
    `搜索相似度(连载名称 作者全等 简介 createUserName全等搜索)降序`
    `sort升序`
    `updateTime更新时间降序`
- `classify` 字段为用户自定义标签列表数组或[]

- 返回数组或[]，具体字段看上一个接口字段说明

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "9e232a68-d0db-45bd-8ba7-e29cc1b70921",
      "name": "连续载体1",
      "introduce": "连续载体简介1",
      "classify": [
        {
          "id": "d2ce20ca-98e5-4833-afa6-8c636d3f1973",
          "label": "美术",
          "sort": 1,
          "type": null,
          "createTime": "2021-08-18 03:12:22",
          "updateTime": "2021-08-18 03:12:22",
          "terminal": "管理端",
          "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
          "createUserName": "超级管理员"
        }
      ],
      "type": "601",
      "typeLabel": "灵幻",
      "author": "张三",
      "isTop": "0",
      "isSecret": "1",
      "isDraft": "0",
      "sort": 1,
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createUserName": "超级管理员",
      "createTime": "2022-02-18 09:45:08",
      "updateTime": "2022-02-18 09:50:46",
      "terminal": "管理端",
      "remarks": "备注",
      "isLike": "0",
      "likeCount": 0,
      "chapterLikeCount": 2,
      "isCollection": "0",
      "collectionCount": 0,
      "chapterCollectionCount": 1,
      "chapterCount": 6,
      "isSelf": "1",
      "commentCount": 0,
      "chaptercommentCount": 2
    }
  ],
  "total": 3
}
```

## ---------------- 获取所有用户的非草稿且公开连载列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取所有用户的非草稿且公开连载列表
- 只有超级管理员可置顶

#### 请求

- `get | post`
- `novel/get/list`
- 公开

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| highlight | string | 否 | 是否高亮显示搜索关键字 '0' 否 '1' 高亮（需要用v-html渲染） 默认不高亮 |
| type | string | 否 | 连载类型，取系统标签300范围 |
| showUserInfo | string | 否 | 是否增加创建者姓名与头像 '1' 是 其他否 默认 '0' |

#### 返回字段说明

- 返回数组或[]
- 排序规则
    `搜索相似度(连载名称 作者全等 简介 createUserName全等搜索)降序`
    `isTop是否置顶`
    `点赞总数（包括所有章节的点赞总数）降序`
    `收藏总数（包括所有章节的收藏总数）降序`
    `updateTime更新时间降序`
- `classify` 字段为用户自定义标签列表数组或[]

- 返回数组或[]，具体字段看上一个接口字段说明

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "9e232a68-d0db-45bd-8ba7-e29cc1b70921",
      "name": "连续载体1",
      "introduce": "连续载体简介1",
      "classify": [
        {
          "id": "d2ce20ca-98e5-4833-afa6-8c636d3f1973",
          "label": "美术",
          "sort": 1,
          "type": null,
          "createTime": "2021-08-18 03:12:22",
          "updateTime": "2021-08-18 03:12:22",
          "terminal": "管理端",
          "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
          "createUserName": "超级管理员"
        }
      ],
      "type": "601",
      "typeLabel": "灵幻",
      "author": "张三",
      "isTop": "0",
      "isSecret": "1",
      "isDraft": "0",
      "sort": 1,
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createUserName": "超级管理员",
      "createTime": "2022-02-18 09:45:08",
      "updateTime": "2022-02-18 09:50:46",
      "terminal": "管理端",
      "remarks": "备注",
      "isLike": "0",
      "likeCount": 0,
      "chapterLikeCount": 2,
      "isCollection": "0",
      "collectionCount": 0,
      "chapterCollectionCount": 1,
      "chapterCount": 6,
      "isSelf": "1",
      "commentCount": 0,
      "chaptercommentCount": 2
    }
  ],
  "total": 3
}
```
