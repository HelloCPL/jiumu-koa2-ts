
## ---------------- 新增标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增标签

#### 请求

- `get | post`
- `tag/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| code | string | 是 | 标签code，不能重复 |
| label | string | 是 | 标签说明 |
| parentCode | string | 否 | 父级标签code |
| sort | mediumint | 否 | 排序，值越小越前，默认1 |
| remarks | string | 否 | 备注 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": "2906d294-a11d-4f82-a601-988013e6dd01",
  "total": 0
}
```

## ---------------- 修改标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 修改标签

#### 请求

- `get | post`
- `tag/update`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 标签id |
| code | string | 否 | 标签code，不能重复 |
| label | string | 否 | 标签说明 |
| parentCode | string | 否 | 父级标签code |
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

## ---------------- 删除标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除标签
- 注意：当标签有子级标签、用户-标签关联时是不能删除的，只有解除关联后才可删除

#### 请求

- `get | post`
- `tag/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 标签id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取指定的某个标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的某个标签

#### 请求

- `get | post`
- `tag/get/bycode`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| code | string | 是 | 标签 code 或 id |

#### 返回字段说明

- 返回对象或null

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 标签id |
| parentCode | string | 父级标签code |
| parentLabel | string | 父级标签描述 |
| code | string | 标签code |
| label | string | 标签描述 |
| sort | number | 排序，值越小越前 |
| configurable | string | 是否可修改 0 可修改 1 超级管理员可修改 -1 不可修改 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "2906d294-a11d-4f82-a601-988013e6dd01",
    "parentCode": "8888",
    "parentLabel": "特殊标签",
    "label": "大咖",
    "sort": 1,
    "configurable": "0",
    "createTime": "2021-08-13 15:51:34",
    "updateTime": "2021-08-13 15:51:34",
    "terminal": "管理端",
    "remarks": null
  },
  "total": 0
}
```

## ---------------- 获取我的所有标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取我的所有标签 拥有的特殊标签

#### 请求

- `get | post`
- `tag/get/all/self`

#### 参数
无

#### 返回字段说明

- 返回数组或[]

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 标签id |
| parentCode | string | 父级标签code |
| parentLabel | string | 父级标签描述 |
| code | string | 标签code |
| label | string | 标签描述 |
| sort | number | 排序，值越小越前 |
| configurable | string | 是否可修改 0 可修改 1 超级管理员可修改 -1 不可修改 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "6be39cf2-1e7a-48f9-bd3d-8a0bd8f67ae4",
      "parentCode": "8888",
      "parentLabel": "特殊标签",
      "code": "8003",
      "label": "名人",
      "sort": 1,
      "configurable": "0",
      "createTime": "2021-08-13 15:51:19",
      "updateTime": "2021-08-13 15:51:19",
      "terminal": "管理端",
      "remarks": null
    }
  ],
  "total": 0
}
```

## ---------------- 获取某类标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的获取某类标签，不包含父级标签
- 若传了`userId`，增加`checkedUserId` 字段，表示是否与该用户关联，仅`parentCode=8888`时有效

#### 请求

- `get | post`
- `tag/get/byparentcode`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| parentCode | string | 否 | 父级标签code，不传获取全部标签 |
| userId | string | 否 | 用户id，会增加`checkedUserId` 字段，表示是否与该用户关联，仅`parentCode=8888`时有效 1 关联 0 不关联 |

#### 返回字段说明

- 返回数组或[]，数组有子级

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 标签id |
| parentCode | string | 父级标签code |
| parentLabel | string | 父级标签描述 |
| code | string | 标签code |
| label | string | 标签描述 |
| sort | number | 排序，值越小越前 |
| configurable | string | 是否可修改 0 可修改 1 超级管理员可修改 -1 不可修改 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |
| children | array/[] | 子级 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "368bf7d4-ea43-42e1-98ff-847b932655d3",
      "parentCode": "200",
      "parentLabel": "性别",
      "code": "201",
      "label": "男",
      "sort": 1,
      "configurable": "0",
      "createTime": "2021-08-11 16:30:46",
      "updateTime": "2021-08-11 16:40:12",
      "terminal": "管理端",
      "remarks": null,
      "children": []
    },
    {
      "id": "413558d0-306c-4106-8d6f-6de32ccf45a9",
      "parentCode": "200",
      "parentLabel": "性别",
      "code": "202",
      "label": "女",
      "sort": 2,
      "configurable": "0",
      "createTime": "2021-08-11 16:30:54",
      "updateTime": "2021-08-11 16:41:07",
      "terminal": "管理端",
      "remarks": null,
      "children": []
    }
  ],
  "total": 0
}
```

