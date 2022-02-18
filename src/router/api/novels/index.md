
## ---------------- 新增小说 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增小说

#### 请求

- `get | post`
- `novel/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| name | string | 是 | 小说名称 |
| introduce | string | 是 | 简介 |
| author | string | 是 | 作者名称 |
| isDraft | string | 是 | 是否为草稿，1 是 0 否，默认0 |
| classify | string | 否 | 自定义分类，用户自定义标签id集合，最多3个，分类类型建议用novelClassify |
| type | string | 否 | 小说分类，使用系统标签600范围 |
| isSecret | string | 否 | 是否为私密小说，1 是 0 否，默认0 |
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

## ---------------- 编辑小说 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 编辑小说，仅本人可编辑

#### 请求

- `get | post`
- `novel/update`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 小说id |
| name | string | 否 | 小说名称 |
| introduce | string | 否 | 简介 |
| author | string | 否 | 作者名称 |
| isDraft | string | 否 | 是否为草稿，1 是 0 否，默认0 |
| classify | string | 否 | 自定义分类，用户自定义标签id集合，最多3个，分类类型建议用novelClassify |
| type | string | 否 | 小说分类，使用系统标签600范围 |
| isSecret | string | 否 | 是否为私密小说，1 是 0 否，默认0 |
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

## ---------------- 删除小说 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除小说，仅本人且没有小说章节时可删除

#### 请求

- `get | post`
- `novel/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 小说id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取指定的小说 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的小说，如果为私密小说只有本人可获取

#### 请求

- `get | post`
- `novel/get/one`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 小说id |

#### 返回字段说明

- 返回对象或null

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 小说id |
| name | string | 小说名称 |
| introduce | string | 简介 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| type | string | 小说类型标签code |
| typeLabel | string | 小说类型标签说明 |
| author | string | 作者名称 |
| isSecret | string | 是否为私密小说，1 是 0 否 |
| isDraft | string | 是否草稿，1 是 0 否 |
| createUser | string | 创建者id |
| createUserName | string | 创建者名字 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |
| isLike | string | 是否点赞，1 是 0 否 |
| likeCount | number | 点赞总数 |
| isCollection | string | 是否收藏，1 是 0 否 |
| collectionCount | string | 收藏总数 |
| isSelf | string | 是否本人的小说，1 是 0 否 |
| commentCount | number | 评论总数 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "0a5ee84e-7d7c-4ca5-ae1d-2567ec8ab8f0",
    "name": "连续载体2",
    "introduce": "连续载体简介2",
    "classify": [
      {
        "id": "c3221e5e-bb1a-4220-b178-26d37fa1ade0",
        "label": "java",
        "sort": 1,
        "type": null,
        "createTime": "2021-08-18 03:12:05",
        "updateTime": "2021-08-18 03:12:05",
        "terminal": "管理端",
        "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
        "createUserName": "超级管理员"
      }
    ],
    "type": "602",
    "typeLabel": "科技",
    "author": "张三",
    "isTop": "0",
    "isSecret": "0",
    "isDraft": "0",
    "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
    "createUserName": "超级管理员",
    "createTime": "2022-02-18 09:46:00",
    "updateTime": "2022-02-18 09:46:00",
    "terminal": "管理端",
    "remarks": "备注",
    "isLike": "1",
    "likeCount": 1,
    "isCollection": "1",
    "collectionCount": 1,
    "isSelf": "1",
    "commentCount": 2
  },
  "total": 0
}
```

## ---------------- 获取自己的小说列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取自己的小说列表

#### 请求

- `get | post`
- `novel/get/list/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| type | string | 否 | 小说类型，取系统标签300范围 |
| isDraft | string | 否 | 是否草稿，1 是 0 否 |
| isSecret | string | 否 | 是否为私密小说，1 是 0 否 |

#### 返回字段说明

- 返回数组或[]
- 排序规则
   `搜索相似度(连载名称 作者 简介 createUserName全等搜索)降序`
   `isTop是否置顶`
   `likeCount点赞总数降序`
   `collectionCount收藏总数降序`
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
      "author": "张三",
      "createUserName": "超级管理员",
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
      "isTop": "0",
      "isSecret": "0",
      "isDraft": "0",
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createTime": "2022-02-18 09:45:08",
      "updateTime": "2022-02-18 09:50:46",
      "terminal": "管理端",
      "remarks": "备注",
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

## ---------------- 获取指定用户的非草稿小说列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定用户的非草稿小说列表，如果为私密小说只可获取本人发布的小说
- 只有超级管理员可置顶

#### 请求

- `get | post`
- `novel/get/list/byuserid`
#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| userId | string | 是 | 用户ID |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| type | string | 否 | 小说类型，取系统标签300范围 |
| isSecret | string | 否 | 是否为私密小说，1 是 0 否 |

#### 返回字段说明

- 返回数组或[]
- 排序规则
   `搜索相似度(连载名称 作者 简介 createUserName全等搜索)降序`
   `isTop是否置顶`
   `likeCount点赞总数降序`
   `collectionCount收藏总数降序`
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
      "author": "张三",
      "createUserName": "超级管理员",
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
      "isTop": "0",
      "isSecret": "0",
      "isDraft": "0",
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createTime": "2022-02-18 09:45:08",
      "updateTime": "2022-02-18 09:50:46",
      "terminal": "管理端",
      "remarks": "备注",
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

## ---------------- 获取所有用户的非草稿小说列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取所有用户的非草稿小说列表，如果为私密小说只可获取本人发布的小说
- 只有超级管理员可置顶

#### 请求

- `get | post`
- `novel/get/list/byuserid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| type | string | 否 | 小说类型，取系统标签300范围 |
| isSecret | string | 否 | 是否为私密小说，1 是 0 否 |

#### 返回字段说明

- 返回数组或[]
- 排序规则
   `isTop是否置顶`
   `likeCount点赞总数降序`
   `搜索相似度(连载名称 作者 简介 createUserName全等搜索)降序`
   `collectionCount收藏总数降序`
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
      "author": "张三",
      "createUserName": "超级管理员",
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
      "isTop": "0",
      "isSecret": "0",
      "isDraft": "0",
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createTime": "2022-02-18 09:45:08",
      "updateTime": "2022-02-18 09:50:46",
      "terminal": "管理端",
      "remarks": "备注",
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
