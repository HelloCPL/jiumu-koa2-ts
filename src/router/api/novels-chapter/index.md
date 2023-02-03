
## ---------------- 新增连载章节 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增连载

#### 请求

- `get | post`
- `novel-chapter/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| novelId | string | 是 | 连载id |
| title | string | 是 | 章节标题 |
| content | string | 是 | 章节内容 |
| sort | mediumint | 是 | 章节排序，不可重复，从小到大 |
| isDraft | string | 是 | 是否为草稿，'1' 是 '0' 否 |
| isSecret | string | 否 | 是否为私密，'1' 是 '0' 否，默认 '0' |
| remarks | string | 否 | 备注 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": "6eef5149-5753-4003-9ed0-8502a96a0e7a",
  "total": 0
}
```


## ---------------- 编辑连载章节 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 编辑连载章节，仅本人可编辑

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
| isDraft | string | 否 | 是否为草稿，'1' 是 '0' 否 |
| isSecret | string | 否 | 是否为私密，'1' 是 '0' 否，默认 '0' |
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

## ---------------- 删除连载章节 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除连载章节，仅本人且没有连载章节章节时可删除

#### 请求

- `get | post`
- `novel-chapter/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 连载章节id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取指定的连载章节 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的连载章节，如果连载为私密或草稿、连载章节私密或草稿只有本人可获取
- 连载为私密或连载章节为私密则该章节为私密状态

#### 请求

- `get | post`
- `novel-chapter/get/one`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 连载章节id |
| showUserInfo | string | 否 | 是否增加创建者姓名与头像 '1' 是 其他否 默认 '0' |

#### 返回字段说明

- 返回对象或null

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 连载章节id |
| novelId | string | 连载id |
| novelName | string | 连载名称 |
| novelAuthor | string | 连载作者名称 |
| title | string | 标题 |
| content | string | 内容 |
| sort | string | 章节排序 |
| isSecret | string | 是否为私密，'1' 是 '0' 否 |
| isDraft | string | 是否草稿，'1' 是 '0' 否 |
| createUser | string | 创建者id |
| createUserName | string | 创建者名字 |
| createUserAvatar | object/null | 创建者头像 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |
| isLike | string | 是否点赞，'1' 是 '0' 否 |
| likeCount | number | 点赞总数 |
| isCollection | string | 是否收藏，'1' 是 '0' 否 |
| collectionCount | number | 收藏总数 |
| isSelf | string | 是否本人的章节，'1' 是 '0' 否 |
| commentCount | number | 评论总数 |
| wordCount | number | 本章节总字数 |

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


## ---------------- 获取指定连载所有的章节列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定连载所有的章节列表，如果连载或连载章节 为私密或草稿 只有本人可获取
- 连载为私密或连载章节为私密则该章节为私密状态
shai
#### 请求

- `get | post`
- `novel-chapter/get/list`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| novelId | string | 是 | 连载id |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| isDraft | string | 否 | 是否草稿，'1' 是 '0' 否 |
| isSecret | string | 否 | 是否为私密连载，'1' 是 '0' 否 |
| isConcise | string | 否 | 是否为简洁模式，'1' 是 '0' 否 默认 '0' |
| showUserInfo | string | 否 | 是否增加创建者姓名与头像 '1' 是 其他否 默认 '0' |

#### 返回字段说明

- 返回数组或[]
- 排序规则
   `sort升序`

- 简洁模式下 `showUserInfo` 参数无效，返回字段如下

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 连载章节id |
| title | string | 标题 |
| sort | string | 章节排序 |
| isSecret | string | 是否为私密，'1' 是 '0' 否 |
| isDraft | string | 是否草稿，'1' 是 '0' 否 |
| createUser | string | 创建者id |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |
| isSelf | string | 是否本人的章节，'1' 是 '0' 否 |

- 普通模式返回字段如下

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 连载章节id |
| novelId | string | 连载id |
| novelName | string | 连载名称 |
| novelAuthor | string | 连载作者名称 |
| title | string | 标题 |
| sort | string | 章节排序 |
| isSecret | string | 是否为私密，'1' 是 '0' 否 |
| isDraft | string | 是否草稿，'1' 是 '0' 否 |
| createUser | string | 创建者id |
| createUserName | string | 创建者名字 |
| createUserAvatar | object/null | 创建者头像 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |
| isLike | string | 是否点赞，'1' 是 '0' 否 |
| likeCount | number | 点赞总数 |
| isCollection | string | 是否收藏，'1' 是 '0' 否 |
| collectionCount | number | 收藏总数 |
| isSelf | string | 是否本人的章节，'1' 是 '0' 否 |
| commentCount | number | 评论总数 |
| wordCount | number | 本章节总字数 |

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
