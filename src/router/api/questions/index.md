
## ---------------- 新增问答 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增问答

#### 请求

- `get | post`
- `question/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| title | string | 是 | 问答标题 |
| content | string | 是 | 内容 |
| isDraft | string | 是 | 是否草稿，1 是 0 否，默认0 |
| classify | string | 否 | 自定义分类，用户自定义标签id集合，最多3个，分类类型建议用questionClassify |
| isSecret | string | 否 | 是否为私密问答，1 是 0 否，默认0 |
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

## ---------------- 修改问答 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 修改问答，仅可修改自己发布的问答

#### 请求

- `get | post`
- `question/update`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 问答id |
| title | string | 否 | 问答标题 |
| content | string | 否 | 内容 |
| isDraft | string | 否 | 是否草稿，1 是 0 否 |
| classify | string | 否 | 自定义分类，用户自定义标签id集合，最多3个，分类类型建议用questionClassify |
| isSecret | string | 否 | 是否为私密问答，1 是 0 否 |
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

## ---------------- 删除问答 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除问答，仅可删除自己发布的问答

#### 请求

- `get | post`
- `question/update`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 问答id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取指定的问答 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的问答，如果为私密或草稿仅创建者本人可获取

#### 请求

- `get | post`
- `question/get/one`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 问答id |

#### 返回字段说明

- 返回对象或null

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 问答id |
| title | string | 标题 |
| content | string | 内容 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| isDraft | string | 是否草稿，1 是 0 否 |
| isSecret | string | 是否为私密问答，1 是 0 否 |
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
| isSelf | string | 是否本人的问答，1 是 0 否 |
| commentCount | number | 收藏总数 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "25598ae2-83c4-4cde-972e-fc0574f83d1e",
    "title": "问答标题11",
    "content": "内容11",
    "classify": [
      {
        "id": "493f5144-45fb-477a-9b48-1f6a92f057e4",
        "label": "js",
        "sort": 1,
        "type": 'questionClassify',
        "createTime": "2021-08-18 03:11:26",
        "updateTime": "2021-08-18 03:11:26",
        "terminal": "管理端"
      }
    ],
    "isDraft": "0",
    "isSecret": "1",
    "isTop": "1",
    "sort": 1,
    "createUser": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f",
    "createUserName": "陈一支",
    "createTime": "2021-08-20 10:11:18",
    "updateTime": "2021-08-20 10:11:18",
    "terminal": "管理端",
    "remarks": "备注",
    "isLike": "0",
    "likeCount": 1,
    "isCollection": "1",
    "collectionCount": 2,
    "isSelf": "1",
    "commentCount": 1
  },
  "total": 0
}
```

## ---------------- 获取自己的问答列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取自己的问答列表


#### 请求

- `get | post`
- `question/get/list/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| highlight | string | 否 | 是否高亮显示搜索关键字 '0' 否 '1' 高亮（需要用v-html渲染） 默认不高亮 |
| isDraft | string | 否 | 是否草稿，1 是 0 否 |
| isSecret | string | 否 | 是否为私密问答，1 是 0 否 |
| classify | string | 否 | 自定义文章类型，分类类型建议用questionClassify，单选 |

#### 返回字段说明

- 返回数组或[]
- 排序规则
    `搜索相似度(createUserName全等搜索 title)降序`
    `sort升序`
    `updateTime更新时间降序`

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 问答id |
| title | string | 标题 |
| content | string | 内容 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| isDraft | string | 是否草稿，1 是 0 否 |
| isSecret | string | 是否为私密问答，1 是 0 否 |
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
| isSelf | string | 是否本人的问答，1 是 0 否 |
| commentCount | number | 收藏总数 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "8409b841-053c-44c1-84b4-bb6bf2f100a3",
      "createUserName": "超级管理员",
      "title": "问答标题2",
      "content": "内容2",
      "classify": [
        {
          "id": "b2888c02-ffec-4039-8ec3-91ec4a8716d4",
          "label": "前端",
          "sort": 1,
          "type": "classify",
          "createTime": "2021-08-18 03:10:58",
          "updateTime": "2021-08-18 03:10:58",
          "terminal": "管理端",
          "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
          "createUserName": "超级管理员"
        }
      ],
      "isDraft": "0",
      "isSecret": "1",
      "isTop": "1",
      "sort": 1,
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createTime": "2021-08-20 10:10:14",
      "updateTime": "2021-08-20 10:10:14",
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

## ---------------- 获取指定用户非草稿且公开的问答列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定用户非草稿且公开的问答列表


#### 请求

- `get | post`
- `question/get/list/byuserid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| userId | string | 是 | 指定用户id |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| highlight | string | 否 | 是否高亮显示搜索关键字 '0' 否 '1' 高亮（需要用v-html渲染） 默认不高亮 |
| classify | string | 否 | 自定义文章类型，分类类型建议用questionClassify，单选 |

#### 返回字段说明

- 返回数组或[]
- 排序规则
    `搜索相似度(createUserName全等搜索 title)降序`
    `sort升序`
    `updateTime更新时间降序`

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 问答id |
| title | string | 标题 |
| content | string | 内容 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| isDraft | string | 是否草稿，1 是 0 否 |
| isSecret | string | 是否为私密问答，1 是 0 否 |
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
| isSelf | string | 是否本人的问答，1 是 0 否 |
| commentCount | number | 收藏总数 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "8409b841-053c-44c1-84b4-bb6bf2f100a3",
      "createUserName": "超级管理员",
      "title": "问答标题2",
      "content": "内容2",
      "classify": [
        {
          "id": "b2888c02-ffec-4039-8ec3-91ec4a8716d4",
          "label": "前端",
          "sort": 1,
          "type": "classify",
          "createTime": "2021-08-18 03:10:58",
          "updateTime": "2021-08-18 03:10:58",
          "terminal": "管理端",
          "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
          "createUserName": "超级管理员"
        }
      ],
      "isDraft": "0",
      "isSecret": "1",
      "isTop": "1",
      "sort": 1,
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createTime": "2021-08-20 10:10:14",
      "updateTime": "2021-08-20 10:10:14",
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


## ---------------- 获取所有非草稿且公开问答列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取所有非草稿且公开问答列表

#### 请求

- `get | post`
- `question/get/list`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| highlight | string | 否 | 是否高亮显示搜索关键字 '0' 否 '1' 高亮（需要用v-html渲染） 默认不高亮 |

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
| id | string | 问答id |
| title | string | 标题 |
| content | string | 内容 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| isDraft | string | 是否草稿，1 是 0 否 |
| isSecret | string | 是否为私密问答，1 是 0 否 |
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
| isSelf | string | 是否本人的问答，1 是 0 否 |
| commentCount | number | 收藏总数 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "8409b841-053c-44c1-84b4-bb6bf2f100a3",
      "createUserName": "超级管理员",
      "title": "问答标题2",
      "content": "内容2",
      "classify": [
        {
          "id": "b2888c02-ffec-4039-8ec3-91ec4a8716d4",
          "label": "前端",
          "sort": 1,
          "type": "classify",
          "createTime": "2021-08-18 03:10:58",
          "updateTime": "2021-08-18 03:10:58",
          "terminal": "管理端",
          "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
          "createUserName": "超级管理员"
        }
      ],
      "isDraft": "0",
      "isSecret": "1",
      "isTop": "1",
      "sort": 1,
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createTime": "2021-08-20 10:10:14",
      "updateTime": "2021-08-20 10:10:14",
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
