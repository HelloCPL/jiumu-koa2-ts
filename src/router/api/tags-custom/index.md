
## ---------------- 新增用户自定义标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增用户自定义标签
- 可自定义 `type` 值，建议填写、在获取自定义标签列表时传入对应的 `type` 以区分不同的用户自定义标签类型，一般由前端自定义传，不需要用户输入

#### 请求

- `get | post`
- `tag/custom/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| label | string | 是 | 用户自定义标签说明 |
| sort | mediumint | 否 | 排序，值越小越前，默认1 |
| type | string | 否 | 自定义类型，用户可通过自定义type，获取时传type以区分不同的用户自定义标签，一般由前端定义 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": "2c395423-4d47-4ec5-9ae1-4c8211a4b289",
  "total": 0
}
```

## ---------------- 修改用户自定义标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 修改用户自定义标签，仅可修改自己创建的自定义标签

#### 请求

- `get | post`
- `tag/custom/update`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 用户自定义标签id |
| label | string | 否 | 用户自定义标签说明 |
| sort | mediumint | 否 | 排序，值越小越前，默认1 |
| type | string | 否 | 自定义类型，用户可通过自定义type，获取时传type以区分不同的用户自定义标签，一般由前端定义 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 删除用户自定义标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除用户自定义标签，仅可删除自己创建的自定义标签

#### 请求

- `get | post`
- `tag/custom/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 用户自定义标签id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## -------------- 获取我的指定一个或多个自定义标签 ------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取我的指定一个或多个自定义标签

#### 请求

- `get | post`
- `tag/custom/get/byids/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| ids | string | 是 | 我的自定义标签 id 集合，多个用逗号隔开 |
| showUserInfo | string | 否 | 是否增加创建者姓名与头像 '1' 是 其他否 默认 '1' |

#### 返回字段说明

- 返回数组或[]
- 排序规则
  `搜索相似度(label)降序`
  `sort升序、updateTime更新时间降序`

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 自定义标签id |
| label | string | 自定义标签描述 |
| type | string | 自定义类型 |
| sort | number | 排序，值越小越前 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| createUser | string | 创建用户id |
| createUserName | string | 创建用户名称 |
| createUserAvatar | object/null | 创建者头像 |
| terminal | string | 操作终端 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "493f5144-45fb-477a-9b48-1f6a92f057e4",
      "label": "js",
      "sort": 1,
      "type": "myclassify",
      "createTime": "2021-08-18 03:11:26",
      "updateTime": "2021-08-18 03:11:26",
      "terminal": "管理端",
      "createUserName": "陈一支",
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
      "createUser": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f"
    }
  ],
  "total": 0
}
```

## ---------------- 获取我的自定义标签类型列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 仅获取自定义标签类型列表

#### 请求

- `get | post`
- `tag/custom/get/list/type/self`

#### 参数

- 无

#### 返回字段说明

- 返回数组或[]

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| type | string | 用户自定义类型 |
| total | number | 每个类型的标签总数 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "type": "classify",
      "total": 3
    },
    {
      "type": "classifyXX",
      "total": 1
    }
  ],
  "total": 0
}
```

## ---------------- 获取我的自定义标签列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定用户的自定义标签列表，仅可获取自己创建的自定义标签
- 若传 `type` 只会获取对应 `type` 类型的自定义标签列表， `type` 值由前端新增编辑时自定义

#### 请求

- `get | post`
- `tag/custom/get/list/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| highlight | string | 否 | 是否高亮显示搜索关键字 '0' 否 '1' 高亮（需要用v-html渲染） 默认不高亮 |
| type | string | 否 | 自定义类型，若传只会获取对应 `type` 类型的自定义标签列表 |
| showUserInfo | string | 否 | 是否增加创建者姓名与头像 '1' 是 其他否 默认 '0' |

#### 返回字段说明

- 返回数组或[]
- 排序规则
  `搜索相似度(label)降序`
  `sort升序、updateTime更新时间降序`

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 用户自定义标签id |
| label | string | 用户自定义标签描述 |
| type | string | 用户自定义类型 |
| sort | number | 排序，值越小越前 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| createUser | string | 创建用户id |
| createUserName | string | 创建用户名称 |
| createUserAvatar | object/null | 创建者头像 |
| terminal | string | 操作终端 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "329573a2-fd89-4fbf-aef6-3a0b7bc5abc3",
      "label": "vue",
      "type": "classify",
      "sort": 1,
      "createTime": "2021-08-18 03:11:20",
      "updateTime": "2021-08-18 03:11:20",
      "terminal": "管理端"
    }
  ],
  "total": 4
}
```


## ---------------- 获取指定用户自定义标签类型列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 仅获取自定义标签类型列表

#### 请求

- `get | post`
- `tag/custom/get/list/type/byuserid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| userId | string | 是 | 用户id |

#### 返回字段说明

- 返回数组或[]

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| type | string | 用户自定义类型 |
| total | number | 每个类型的标签总数 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "type": "classify",
      "total": 3
    }
  ],
  "total": 0
}
```


## ---------------- 获取指定用户自定义标签列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定用户的自定义标签列表，仅可获取自己创建的自定义标签
- 若传 `type` 只会获取对应 `type` 类型的自定义标签列表， `type` 值由前端新增编辑时自定义

#### 请求

- `get | post`
- `tag/custom/get/list/byuserid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| userId | number | 是 | 用户id  |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| highlight | string | 否 | 是否高亮显示搜索关键字 '0' 否 '1' 高亮（需要用v-html渲染） 默认不高亮 |
| type | string | 否 | 自定义类型，若传只会获取对应 `type` 类型的自定义标签列表 |
| showUserInfo | string | 否 | 是否增加创建者姓名与头像 '1' 是 其他否 默认 '0' |

#### 返回字段说明

- 返回数组或[]
- 排序规则
  `搜索相似度(label)降序`
  `sort升序、updateTime更新时间降序`

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 用户自定义标签id |
| label | string | 用户自定义标签描述 |
| type | string | 用户自定义类型 |
| sort | number | 排序，值越小越前 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| createUser | string | 创建用户id |
| createUserName | string | 创建用户名称 |
| createUserAvatar | object/null | 创建者头像 |
| terminal | string | 操作终端 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "329573a2-fd89-4fbf-aef6-3a0b7bc5abc3",
      "label": "vue",
      "type": "classify",
      "sort": 1,
      "createTime": "2021-08-18 03:11:20",
      "updateTime": "2021-08-18 03:11:20",
      "terminal": "管理端"
    }
  ],
  "total": 4
}
```

<!-- 考虑到保密性，已废除
## ---------------- 获取所有用户自定义标签类型列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 仅获取自定义标签类型列表

#### 请求

- `get | post`
- `tag/custom/get/list/type`

#### 参数

- 无

#### 返回字段说明

- 返回数组或[]

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| type | string | 用户自定义类型 |
| total | number | 每个类型的标签总数 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "type": "classify",
      "total": 3
    }
  ],
  "total": 0
}
``` -->

<!-- 考虑到保密性，已废除
## ---------------- 获取所有自定义标签列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定用户的自定义标签列表，仅可获取自己创建的自定义标签
- 若传 `type` 只会获取对应 `type` 类型的自定义标签列表， `type` 值由前端新增编辑时自定义

#### 请求

- `get | post`
- `tag/custom/get/list`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| highlight | string | 否 | 是否高亮显示搜索关键字 '0' 否 '1' 高亮（需要用v-html渲染） 默认不高亮 |
| showUserInfo | string | 否 | 是否增加创建者姓名与头像 '1' 是 其他否 默认 '0' |

#### 返回字段说明

- 返回数组或[]
- 排序规则
  `搜索相似度(label)降序`
  `sort升序、updateTime更新时间降序`

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 用户自定义标签id |
| label | string | 用户自定义标签描述 |
| type | string | 用户自定义类型 |
| sort | number | 排序，值越小越前 |
| isSelf | string | 是否我的标签 1 是 0 否 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| createUser | string | 创建用户id |
| createUserName | string | 创建用户名称 |
| createUserAvatar | object/null | 创建者头像 |
| terminal | string | 操作终端 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "329573a2-fd89-4fbf-aef6-3a0b7bc5abc3",
      "label": "vue",
      "type": "classify",
      "sort": 1,
      "isSelf": 1,
      "createTime": "2021-08-18 03:11:20",
      "updateTime": "2021-08-18 03:11:20",
      "terminal": "管理端"
    }
  ],
  "total": 7
}
``` -->
