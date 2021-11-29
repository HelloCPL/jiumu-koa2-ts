
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
- 删除小说，仅本人且没有小说章节、没有小说笔记时可删除

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
    "id": "57a4146f-cb43-424b-bd6d-d1c7e6d1e1a5",
    "name": "小说5",
    "introduce": "这个一条凡人通仙的路5",
    "classify": [
      {
        "id": "d2ce20ca-98e5-4833-afa6-8c636d3f1973",
        "label": "美术",
        "sort": 1,
        "type": null,
        "createTime": "2021-08-18 03:12:22",
        "updateTime": "2021-08-18 03:12:22",
        "terminal": "管理端"
      }
    ],
    "type": "504",
    "typeLabel": "小说来源",
    "author": "一支4",
    "isSecret": "0",
    "isDraft": "0",
    "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
    "createUserName": "超级管理员",
    "createTime": "2021-09-03 17:48:38",
    "updateTime": "2021-09-03 17:48:38",
    "terminal": "管理端",
    "remarks": null,
    "isLike": "1",
    "likeCount": 2,
    "isCollection": "0",
    "collectionCount": 0,
    "isSelf": "1",
    "commentCount": 1
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

- 返回数组或[]，具体字段看上一个接口字段说明

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "57a4146f-cb43-424b-bd6d-d1c7e6d1e1a5",
      "name": "小说5",
      "introduce": "这个一条凡人通仙的路5",
      "classify": [],
      "type": "504",
      "typeLabel": "小说来源",
      "author": "一支4",
      "isSecret": "0",
      "isDraft": "0",
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createUserName": "超级管理员",
      "createTime": "2021-09-03 17:48:38",
      "updateTime": "2021-09-03 17:48:38",
      "terminal": "管理端",
      "remarks": null,
      "isLike": "1",
      "likeCount": 2,
      "isCollection": "0",
      "collectionCount": 0,
      "isSelf": "1",
      "commentCount": 1
    }
  ],
  "total": 3
}
```