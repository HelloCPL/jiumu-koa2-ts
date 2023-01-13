
## ---------------- 新增评论 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增评论，如果评论来源是评论，`type` 传501，`targetId` 则为该条评论的id

#### 请求

- `get | post`
- `comment/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| targetId | string | 是 | 要评论的目标id |
| content | string | 是 | 评论内容 |
| type | string | 是 | 评论来源，使用系统标签500范围，如果是对评论的回复，type必须为501 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": "68b69520-cf27-4ca6-a511-d9ba3e79b61f",
  "total": 0
}
```

## ---------------- 删除自己的某条评论 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除自己的某条评论，仅自己的评论可删除

#### 请求

- `get | post`
- `comment/delete/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 评论id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 删除指定某条评论 ---------------------

#### 简要描述

- `pc` 端
- 删除指定某条评论，不管谁的评论均可删除，只有超级管理员角色可操作（且只对PC管理端生效）

#### 请求

- `get | post`
- `comment/delete/byid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 评论id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取指定的某条评论信息 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 注意：一级评论 `children` 字段不包含二级评论，需要根据 `commentCount` 子级评论总数另外请求获取
- 一级评论 `replyUser` `replyUserName` 回复字段永远为 `null`，同时二级评论的 `commentCount` `children` 子级字段永远为 `0` 和 `[]`

#### 请求

- `get | post`
- `comment/get/one`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 评论id |
| showUserInfo | string | 否 | 是否增加评论者或回复者姓名与头像 '1' 是 其他否 默认 '1' |

#### 返回字段说明

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 评论id |
| targetId | string | 评论目标id（1 2级评论均指向顶级评论的目标） |
| targetType | string | 评论目标类型（1 2级评论均指向顶级评论的目标类型） |
| targetTypeLabel | string | 评论目标类型描述 |
| commentFirstId | string | 评论的一级评论id（只有二级评论有这个字段） |
| content | string | 内容 |
| createUser | string | 评论者id |
| createUserName | string | 评论者姓名 |
| createUserAvatar | object/null | 评论者头像 |
| createTime | string | 创建时间 |
| terminal | string | 操作终端 |
| isTop | string | 是否置顶，'1' 是 '0' 否 |
| isLike | string | 是否点赞，'1' 是 '0' 否 |
| likeCount | number | 点赞总数 |
| commentCount | number | 收藏总数 |
| replyUser | string | 回复的人id |
| replyUserName | string | 回复的人姓名 |
| createUserAvatar | object/null | 回复者头像 |
| isSelf | string | 是否本人的评论，'1' 是 '0' 否 |
| isTargetUser | string | 是否为评论目标的作者，'1' 是 '0' 否 |
| flag | number | 评论级别 1 一级评论 2 二级评论|
| children | array/[] | 子级，需另外获取 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "68b69520-cf27-4ca6-a511-d9ba3e79b61f",
    "targetId": "05d03d0e-ac9f-4ffa-9874-0e8508c68e8c",
    "targetType": "505",
    "content": "这是评论2",
    "createUser": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f",
    "createUserName": "陈一支",
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
    "createTime": "2021-08-17 15:51:52",
    "terminal": "管理端",
    "isTop": "0",
    "isLike": "1",
    "likeCount": 1,
    "commentCount": 2,
    "replyUser": null,
    "isSelf": "1",
    "isTargetUser": "1",
    "children": []
  },
  "total": 0
}
```

## ---------------- 获取评论列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取评论列表
- 注意：一级评论 `children` 字段不包含二级评论，需要根据 `commentCount` 子级评论总数另外请求获取
- 一级评论 `replyUser` `replyUserName` 回复字段永远为 `null`，同时二级评论的 `commentCount` `children` 子级字段永远为 `0` 和 `[]`
- 如果获取的是二级评论列表，`type` 传501，`targetId` 则为该条评论的id
- 一二级评论作者均可置顶

#### 请求

- `get | post`
- `comment/get/list`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| targetId | string | 是 | 资源id/评论id |
| type | string | 是 | 评论来源，使用系统标签500范围，如果获取二级评论 type 必须为501 |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| showUserInfo | string | 否 | 是否增加评论者或回复者姓名与头像 '1' 是 其他否 默认 '1' |

#### 返回字段说明

- 返回数组或[]
- 排序规则
  一级评论列表 `是否置顶、commentCount评论总数降序、likeCount点赞总数降序、createTime评论时间升序`
  二级评论 `是否置顶、createTime评论时间升序`

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 评论id |
| targetId | string | 评论目标id（1 2级评论均指向顶级评论的目标） |
| targetType | string | 评论目标类型（1 2级评论均指向顶级评论的目标类型） |
| targetTypeLabel | string | 评论目标类型描述 |
| commentFirstId | string | 评论的一级评论id（只有二级评论有这个字段） |
| content | string | 内容 |
| createUser | string | 评论者id |
| createUserName | string | 评论者姓名 |
| createUserAvatar | object/null | 评论者头像 |
| createTime | string | 创建时间 |
| terminal | string | 操作终端 |
| isTop | string | 是否置顶，'1' 是 '0' 否 |
| isLike | string | 是否点赞，'1' 是 '0' 否 |
| likeCount | number | 点赞总数 |
| commentCount | number | 收藏总数 |
| replyUser | string | 回复的人id |
| replyUserName | string | 回复的人姓名 |
| createUserAvatar | object/null | 回复者头像 |
| isSelf | string | 是否本人的评论，'1' 是 '0' 否 |
| isTargetUser | string | 是否为评论目标的作者，'1' 是 '0' 否 |
| flag | number | 评论级别 1 一级评论 2 二级评论|
| children | array/[] | 子级，需另外获取 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "68b69520-cf27-4ca6-a511-d9ba3e79b61f",
      "targetId": "05d03d0e-ac9f-4ffa-9874-0e8508c68e8c",
      "targetType": "505",
      "content": "这是评论2",
      "createUser": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f",
      "createUserName": "陈一支",
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
      "createTime": "2021-08-17 15:51:52",
      "terminal": "管理端",
      "isTop": "0",
      "isLike": "1",
      "likeCount": 1,
      "commentCount": 2,
      "replyUser": null,
      "isSelf": "1",
      "isTargetUser": "1",
      "children": []
    }
  ],
  "total": 1
}
```
