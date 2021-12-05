
## ---------------- 新增用户自定义标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增用户自定义标签，可自定义 `type` 值，在获取自定义标签列表时传入对应的 `type` 以区分不同的用户自定义标签类型，一般由前端自定义传，不需要用户输入

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
  "data": null,
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

#### 返回字段说明

- 返回数组或[]
- 排序规则
  `搜索相似度(label)降序`
  `sort升序、updateTime更新时间降序`

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 自定义标签id |
| label | string | 自定义标签描述 |
| type | string | 自定义类型 |
| sort | number | 排序，值越小越前 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "c3221e5e-bb1a-4220-b178-26d37fa1ade0",
      "label": "java",
      "type": "classify",
      "sort": 1,
      "createTime": "2021-08-18 03:12:05",
      "updateTime": "2021-08-18 03:12:05",
      "terminal": "管理端"
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
| type | string | 否 | 自定义类型，若传只会获取对应 `type` 类型的自定义标签列表 |

#### 返回字段说明

- 返回数组或[]
- 排序规则
  `搜索相似度(label)降序`
  `sort升序、updateTime更新时间降序`

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 用户自定义标签id |
| label | string | 用户自定义标签描述 |
| type | string | 用户自定义类型 |
| sort | number | 排序，值越小越前 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
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
| type | string | 否 | 自定义类型，若传只会获取对应 `type` 类型的自定义标签列表 |

#### 返回字段说明

- 返回数组或[]

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 用户自定义标签id |
| label | string | 用户自定义标签描述 |
| type | string | 用户自定义类型 |
| sort | number | 排序，值越小越前 |
| isSelf | string | 是否我的标签 1 是 0 否 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
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
```
