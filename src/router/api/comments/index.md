
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
| targetId | string | 是 | 要评论的目标id（如果是问答targetId传answer） |
| content | string | 是 | 评论内容 |
| type | string | 是 | 评论来源，使用系统标签500范围，如果是对评论的回复，type必须为501 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
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
- 删除指定某条评论，不管谁的评论均可删除

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
| targetId | string | 是 | 评论id |
| type | string | 是 | 评论来源，使用系统标签500范围，如果获取二级评论 type 必须为501 |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |

#### 返回字段说明

- 返回数组或[]
- 排序规则
  一级评论列表 `是否置顶、likeCount点赞总数降序、commentCount评论总数降序、createTime评论时间升序` 
  二级评论 `是否置顶、createTime评论时间升序` 

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 评论id |
| targetId | string | 评论目标id |
| content | string | 内容 |
| createUser | string | 评论者id |
| createUserName | string | 评论者姓名 |
| createTime | string | 创建时间 |
| terminal | string | 操作终端 |
| isTop | string | 是否置顶，1 是 0 否 |
| isLike | string | 是否点赞，1 是 0 否 |
| likeCount | number | 点赞总数 |
| commentCount | number | 收藏总数 |
| replyUser | string | 回复的人id |
| replyUserName | string | 回复的人姓名 |
| isSelf | string | 是否本人的评论，1 是 0 否 |
| children | array/[] | 子级，需另外获取 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "68b69520-cf27-4ca6-a511-d9ba3e79b61f",
      "targetId": "13",
      "content": "这是评论2",
      "createUser": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f",
      "createUserName": "陈一支",
      "createTime": "2021-08-17 15:51:52",
      "terminal": "管理端",
      "isTop": "0",
      "isLike": "1",
      "likeCount": 1,
      "commentCount": 2,
      "replyUser": null,
      "replyUserName": null,
      "isSelf": "1",
      "children": []
    }
  ],
  "total": 1
}
```

## ---------------- 获取我的问答列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取我的问答列表
- 如果获取的是回复列表使用上面评论接口
- 只有超级管理员可置顶 

#### 请求

- `get | post` 
- `comment/get/answer/list/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |

#### 返回字段说明

- 返回数组或[]
- 排序规则
  `是否置顶、likeCount点赞总数降序、commentCount评论总数降序、createTime评论时间升序` 

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 评论id |
| targetId | string | 评论目标id |
| content | string | 内容 |
| createUser | string | 评论者id |
| createUserName | string | 评论者姓名 |
| createTime | string | 创建时间 |
| terminal | string | 操作终端 |
| isTop | string | 是否置顶，1 是 0 否 |
| isLike | string | 是否点赞，1 是 0 否 |
| likeCount | number | 点赞总数 |
| commentCount | number | 收藏总数 |
| replyUser | string | 回复的人id |
| replyUserName | string | 回复的人姓名 |
| isSelf | string | 是否本人的评论，1 是 0 否 |
| children | array/[] | 子级，需另外获取 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "68b69520-cf27-4ca6-a511-d9ba3e79b61f",
      "targetId": "13",
      "content": "这是评论2",
      "createUser": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f",
      "createUserName": "陈一支",
      "createTime": "2021-08-17 15:51:52",
      "terminal": "管理端",
      "isTop": "0",
      "isLike": "1",
      "likeCount": 1,
      "commentCount": 2,
      "replyUser": null,
      "replyUserName": null,
      "isSelf": "1",
      "children": []
    }
  ],
  "total": 1
}
```


## ---------------- 获取所有问答列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取所有问答列表
- 如果获取的是回复列表使用上面评论接口
- 只有超级管理员可置顶 

#### 请求

- `get | post` 
- `comment/get/answer/list`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |

#### 返回字段说明

- 返回数组或[]
- 排序规则
  `是否置顶、likeCount点赞总数降序、commentCount评论总数降序、createTime评论时间升序` 

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 评论id |
| targetId | string | 评论目标id |
| content | string | 内容 |
| createUser | string | 评论者id |
| createUserName | string | 评论者姓名 |
| createTime | string | 创建时间 |
| terminal | string | 操作终端 |
| isTop | string | 是否置顶，1 是 0 否 |
| isLike | string | 是否点赞，1 是 0 否 |
| likeCount | number | 点赞总数 |
| commentCount | number | 收藏总数 |
| replyUser | string | 回复的人id |
| replyUserName | string | 回复的人姓名 |
| isSelf | string | 是否本人的评论，1 是 0 否 |
| children | array/[] | 子级，需另外获取 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "68b69520-cf27-4ca6-a511-d9ba3e79b61f",
      "targetId": "13",
      "content": "这是评论2",
      "createUser": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f",
      "createUserName": "陈一支",
      "createTime": "2021-08-17 15:51:52",
      "terminal": "管理端",
      "isTop": "0",
      "isLike": "1",
      "likeCount": 1,
      "commentCount": 2,
      "replyUser": null,
      "replyUserName": null,
      "isSelf": "1",
      "children": []
    }
  ],
  "total": 1
}
```