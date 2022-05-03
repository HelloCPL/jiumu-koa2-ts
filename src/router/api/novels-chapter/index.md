
## ---------------- 新增小说章节 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增小说

#### 请求

- `get | post`
- `novel-chapter/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| novelId | string | 是 | 小说id |
| title | string | 是 | 章节标题 |
| content | string | 是 | 章节内容 |
| sort | mediumint | 是 | 章节排序，不可重复，从小到大 |
| isDraft | string | 是 | 是否为草稿，1 是 0 否 |
| isSecret | string | 否 | 是否为私密，1 是 0 否，默认0 |
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


## ---------------- 编辑小说章节 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 编辑小说章节，仅本人可编辑

#### 请求

- `get | post`
- `novel-chapter/update`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 章节id |
| title | string | 否 | 章节标题 |
| content | string | 否 | 章节内容 |
| sort | mediumint | 否 | 章节排序，不可重复，从小到大 |
| isDraft | string | 否 | 是否为草稿，1 是 0 否 |
| isSecret | string | 否 | 是否为私密，1 是 0 否，默认0 |
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

## ---------------- 删除小说章节 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除小说章节，仅本人且没有小说章节章节时可删除

#### 请求

- `get | post`
- `novel-chapter/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 小说章节id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取指定的小说章节 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的小说章节，如果小说章节私密或草稿只有本人可获取

#### 请求

- `get | post`
- `novel-chapter/get/one`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 小说章节id |

#### 返回字段说明

- 返回对象或null

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 小说章节id |
| novelId | string | 小说id |
| novelName | string | 小说名称 |
| title | string | 标题 |
| content | string | 内容 |
| sort | string | 章节排序 |
| isSecret | string | 是否为私密，1 是 0 否 |
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
| collectionCount | number | 收藏总数 |
| isSelf | string | 是否本人的章节，1 是 0 否 |
| commentCount | number | 评论总数 |

#### 返回示例

```
{
    "code": 200,
    "message": "操作成功",
    "data": {
        "id": "6eef5149-5753-4003-9ed0-8502a96a0e7a",
        "novelId": "9e232a68-d0db-45bd-8ba7-e29cc1b70921",
        "novelName": "连续载体1",
        "title": "章节7",
        "content": "内容123123",
        "sort": 7,
        "isSecret": "0",
        "isDraft": "1",
        "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
        "createUserName": "超级管理员",
        "createTime": "2022-02-18 16:45:29",
        "updateTime": "2022-03-18 14:57:34",
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


## ---------------- 获取指定小说所有的章节列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定小说所有的章节列表，如果小说或小说章节 为私密或草稿 只有本人可获取

#### 请求

- `get | post`
- `novel-chapter/get/list`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| novelId | string | 是 | 小说id |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| isDraft | string | 否 | 是否草稿，1 是 0 否 |
| isSecret | string | 否 | 是否为私密小说，1 是 0 否 |

#### 返回字段说明

- 返回数组或[]
- 排序规则
   `sort升序`

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 小说章节id |
| novelId | string | 小说id |
| novelName | string | 小说名称 |
| title | string | 标题 |
| sort | string | 章节排序 |
| isSecret | string | 是否为私密，1 是 0 否 |
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
| collectionCount | number | 收藏总数 |
| isSelf | string | 是否本人的章节，1 是 0 否 |
| commentCount | number | 评论总数 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "e4d3f904-cacf-4a08-86dd-8a51aa71b609",
      "novelId": "9e232a68-d0db-45bd-8ba7-e29cc1b70921",
      "novelName": "连续载体1",
      "title": "章节1",
      "sort": 1,
      "isSecret": "0",
      "isDraft": "0",
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createUserName": "超级管理员",
      "createTime": "2022-02-18 16:29:12",
      "updateTime": "2022-02-18 16:29:12",
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
  "total": 7
}
```
