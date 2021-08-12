
## ---------------- 新增角色 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增角色

#### 请求

- `get | post` 
- `role/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| code | string | 是 | 角色code，不能重复 |
| label | string | 是 | 角色说明 |
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

## ---------------- 修改角色 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 修改角色

#### 请求

- `get | post` 
- `role/update`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 角色id |
| code | string | 是 | 角色code，不能重复 |
| label | string | 是 | 角色说明 |
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

## ---------------- 删除角色 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除角色

#### 请求

- `get | post` 
- `role/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 角色id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```


## ---------------- 获取指定的某个角色 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的某个角色
  返回对象或null

#### 请求

- `get | post` 
- `role/get/one`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 角色 id 或 code |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "d6bb3323-b581-4b46-b7e4-4da9a899ea6c",
    "code": "super",
    "label": "超级管理员",
    "sort": 1,
    "createTime": "2021-08-12 16:00:37",
    "updateTime": "2021-08-12 16:00:37",
    "terminal": "管理端",
    "remarks": null
  },
  "total": 0
}
```

## ---------------- 获取角色列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取角色列表
  返回数组或[]

#### 请求

- `get | post` 
- `role/get/list`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "b7ca5db8-9daf-4791-98ac-14006742d7c1",
      "code": "testers",
      "label": "测试人员",
      "sort": 2,
      "createTime": "2021-08-12 16:05:23",
      "updateTime": "2021-08-12 16:12:22",
      "terminal": "管理端",
      "remarks": null
    }
  ],
  "total": 3
}
```