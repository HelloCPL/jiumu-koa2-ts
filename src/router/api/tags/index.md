
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
| parent_code | string | 否 | 父级标签code |
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

## ---------------- 修改标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 修改标签

#### 请求

- `get | post` 
- `tag/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 标签id |
| code | string | 是 | 标签code，不能重复 |
| label | string | 是 | 标签说明 |
| parent_code | string | 否 | 父级标签code |
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
- 返回对象或null

#### 请求

- `get | post` 
- `tag/get/bycode`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| code | string | 是 | 标签 code 或 id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "7d92e778-a01b-495e-a226-85838de20bd4",
    "parentCode": "300",
    "code": "3001",
    "label": "富文本编辑器",
    "sort": 1,
    "createTime": "2021-08-11 16:33:32",
    "updateTime": "2021-08-11 16:44:13",
    "terminal": "管理端",
    "remarks": null
  },
  "total": 0
}
```

## ---------------- 获取某类标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的获取某类标签
- 若传了`userId`，增加`checked` 字段，表示是否与该用户关联，仅`parentCode=8888`时有效
- 返回数组或[]，数组有子级

#### 请求

- `get | post` 
- `tag/get/byparentcode`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| parentCode | string | 否 | 父级标签code，不传获取全部标签 |
| userId | string | 否 | 用户id，会增加`checked` 字段，表示是否与该用户关联，仅`parentCode=8888`时有效 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "1fae1396-6d86-4c11-b009-8ee8d8fe2e93",
      "parentCode": "100",
      "code": "1",
      "label": "启用",
      "sort": 1,
      "createTime": "2021-08-12 21:54:24",
      "updateTime": "2021-08-12 21:54:24",
      "terminal": "管理端",
      "remarks": "用于系统状态，不要修改",
      "children": []
    },
  ],
  "total": 0
}
```

